import {sortBy} from 'lodash'
import {createAction} from 'redux-actions'
import ProviderData from './provider-data'
import LegalContent from './legal-content'
import * as env from './environment'
import * as v from './variations'

// action constants
// -----------------------------------------------------------------------------
export const LOAD_PROVIDERS                 = 'LOAD_PROVIDERS'
export const TOGGLE_PROVIDER_SELECTED       = 'TOGGLE_PROVIDER_SELECTED'
export const TOGGLE_PROVIDER_GROUP_SELECTED = 'TOGGLE_PROVIDER_GROUP_SELECTED'
export const TOGGLE_PROVIDER_EXPANDED       = 'TOGGLE_PROVIDER_EXPANDED'
export const TOGGLE_ALL_PROVIDERS_SELECTED  = 'TOGGLE_ALL_PROVIDERS_SELECTED'
export const UNSELECT_ALL_PROVIDERS         = 'UNSELECT_ALL_PROVIDERS'


// action creators
// -----------------------------------------------------------------------------
export const loadProviders               = createAction(LOAD_PROVIDERS);
export const toggleProviderSelected      = createAction(TOGGLE_PROVIDER_SELECTED)
export const toggleProviderExpanded      = createAction(TOGGLE_PROVIDER_EXPANDED)
export const toggleProviderGroupSelected = createAction(TOGGLE_PROVIDER_GROUP_SELECTED)
export const toggleAllProvidersSelected  = createAction(TOGGLE_ALL_PROVIDERS_SELECTED)
export const unselectAllProviders        = createAction(UNSELECT_ALL_PROVIDERS)

// reducer.selectAllToggle
export const selectAllLabels = {
  'SELECT_ALL'  : 'Select All',
  'SELECT_NONE' : 'Unselect All'
}

// initial state
// -----------------------------------------------------------------------------
export const initialState = {
  providers       : [],
  displayOrder    : {},
  sortedProviders : [],
  selected        : [],
  isUnselectingIndex : 0,
  expanded        : [],
  expanding       : [],
  grouped         : [],
  groupSizes      : {},
  legal           : [],
  selectAllToggleText : selectAllLabels.SELECT_ALL
}

// selectors/helpers
// -----------------------------------------------------------------------------
const toggleInList = (list, id) => {
  return list.includes(id) ? 
    removeFromList(list, id) : addToList(list, id)
}

const removeFromList = (list, id) => {
  return list.filter(i => i !== id)
}

const addToList = (list, id) => {
  return [].concat(list, [id])
}

const providersWithGroupId = (groupId, providers=[]) => {
  return providers.filter(p => p.groupId == groupId)
}

// reducers
// -----------------------------------------------------------------------------

// reducer.selected
// - a simple array of ids of those providers who are currently selected
export const selected = (state=[], action={}, parentState={}) => {
  const {id}   = action.payload || {};
  
  switch(action.type){
    
    case TOGGLE_PROVIDER_GROUP_SELECTED:
      let changed = state.slice(0);
      providersWithGroupId(id, parentState.providers).map(p => {
        changed = state.includes(p.id) ? 
          removeFromList(changed, p.id)
        :  
          addToList(changed, p.id)
      })
      
      return changed;
      break;
    
    case TOGGLE_ALL_PROVIDERS_SELECTED:
      return state.length == parentState.providers.length ? [] : parentState.providers.map(p => p.id)
      break;
      
    case TOGGLE_PROVIDER_SELECTED:
      return toggleInList(state, id)
      break;
      
    case UNSELECT_ALL_PROVIDERS:
      return []
      break;
      
    default:
      return state
  }
}


// reducer.expanded
// - a simple array of ids of those providers who are currently expanded
export const expanded = (state=[], action={}, parentState={}) => {
  const {id}      = action.payload || {};
  const isGroup   = /GROUP/.test(action.type) 
  const isAdding  = !parentState.selected.includes(id)
  
  if(/TOGGLE_PROVIDER_GROUP_SELECTED|TOGGLE_PROVIDER_SELECTED/.test(action.type)){
    // console.log(`reducer.expanded => ${action.type} id=${id} isAdding=${isAdding}`)
    // console.log('reducer.selected was '+parentState.selected.join(',') + "\n" +
    //    'reducer.selected now '+selected(parentState.selected, action, parentState).join(','))
  }
  switch(action.type){
    
    case TOGGLE_PROVIDER_GROUP_SELECTED:
      if(isAdding){
      } else {
        // we are unselecting the provider, it should revert to collapsed state
        const groupIds = providersWithGroupId(id, parentState.providers).map(p => p.id);  
        return state.filter(p => {
          return !groupIds.includes(p)
        })
      }
      
    case TOGGLE_PROVIDER_SELECTED:
      // if we are adding a new provider to selected array, purge others from the expanded array, but don't assume we're expanding this one
      // if we are unselecting the provider, it should revert to collapsed state for next time
      return state.filter(p => {
        return isAdding ? 
          p == id : p !== id
      })

    case TOGGLE_PROVIDER_EXPANDED:
      return toggleInList(state, id)
      
    // collapse all expanded providers on orientation change
    case env.ENVIRONMENT_CHANGED: 
    case UNSELECT_ALL_PROVIDERS:
      return []
      
    default:
      return state
  }
}


// reducer.displayOrder
// - on desktop, this list is used to ensure new cards appear at the top of the stack
export const displayOrder = (state, action={}, parentState={}) => {
  const wasSelected = parentState.selected
  const isSelected  = selected(parentState.selected, action, parentState)
  const incrementBy = isSelected.length - wasSelected.length;
  let   ordered     = {};
  let   idx         = 0;
  
  // set sort optimisically on all new additions
  isSelected.map(id => {
    if(!wasSelected.includes(id)){
      // provider is new addition, set displayOrder to idx
      ordered[id] = idx
      idx++
    }
  })
  
  // set sort for providers that are still selected from last cycle
  wasSelected.map(id => {
    if(isSelected.includes(id)){
      // provider is still selected, apply 'weight' to it's last position, to deprioritize in sort
      // if incrementBy is negative, just ignore it, leaving the old order intact
      // having arbitrarily high values won't harm the providers that persist as we remove others, 
      // although the gaps between indices has to be cleaned up in sortedProviders below, 
      // for example in this sequence: add hulu, add roku, add apple, remove roku
      // {95:0} ... {93:0,95:1} ... {92:0,93:1,95:2} ... {92:0,95:2} // gap between 0 and 2 
      ordered[id] = state[id] + (incrementBy > 0 ? incrementBy : 0) 
    } else {
      // provider is being removed, nothing to do
    }
  })

  return ordered
}

// reducer.isUnselectingIndex // this is used in fadeout animation to know where to put the shim
export const isUnselectingIndex = (state=null, action={}, parentState={}) => {
  let results       = [];
  const isSelected  = selected(parentState.selected, action, parentState)
  const wasSelected = parentState.selected
  const {displayOrder,providers} = parentState
  
  // iterate over previously selected providers..
  wasSelected.map(id => {
    // if the provider is not in current selected state, it's being removed
    if(!isSelected.includes(id)){
      if(displayOrder[id] !== undefined){ 
        
        // deal w/ possibility that it's the member of a group .. 
        // unless this is handled elsewhere?
        const {groupId}    = providers.find(p => p.id == id)
        const groupMembers = providers.filter(p => p.groupId == groupId)

        if(groupMembers.length > 1){
          // console.log(`${id} must be a member of a group display=${displayOrder[id]}`)
          // console.log(`display=${displayOrder[id]} needs to be inflated by length of group ${groupMembers.length}`)
        } 
        else {
          results.push(displayOrder[id])
        }
      } 
    }
  })

  return results.length ? results[0] : 0
}

// reducer.sortedProviders // provider list with above display order applied
export const sortedProviders = (state=null, action={}, parentState={}) => {
  let sorted=[];
  // get a cached copy of the displayOrder ie {92:1,94:0,100:2}
  const d = displayOrder(parentState.displayOrder, action, parentState);
  // build an up array of actual provider objects in desired order
  // ie, if apple's position is 2, store Provider[id=92] in array[2]
  for(var id in d)
  {
    const position  = d[id];
    const provider  = parentState.providers.find(p => p.id == id)
    // add the group size to the provider object - it'll come in handy later..
    const groupSize = groupSizes(parentState.groupSizes, action, parentState)[provider.groupId]
    sorted[position] = Object.assign({groupSize}, provider);
  }
  
  // purge out nulls resulting from gaps in indices in displayOrder above..
  return sorted.filter(p => !!p)
}

// reducer.grouped
// - a subset of all providers
// - limits each group to a single representative provider per grouping (the one with lowest order value) 
// - the reducer name is a bit of a misnomer since each group is only partially represented
export const grouped = (state=[], action={}, parentState={}) => {
  const grouped    = [];
  const unique     = [];
  
  providers(parentState.providers, action, parentState).map(p => {
    const {groupId} = p;
    
    if(!grouped.includes(groupId)){
      grouped.push(groupId);
      unique.push(p);
    } 
  })
  
  return unique
}

// reducer.groupSizes
// a map where keys are groupIds and values are the number of members
export const groupSizes = (state={}, action={}, parentState={}) => {
  let map = {}

  providers(parentState.providers, action, parentState).map(p => {
    const {groupId} = p;
    
    if(map[groupId] == undefined) map[groupId] = 0
    map[groupId] = map[groupId] + 1
  })
  
  return map
}

// reducer.providers
// master list of all providers, with some extra properties that are 
// used for drawing the rounded corner joins in the mobile ui
export const providers = (state=[], action={}, parentState={}) => {
  const selected_ = selected(parentState.selected, action, parentState);
  let providers = state.slice(0)
  
  if(action.type == LOAD_PROVIDERS){
    if((action.payload || []).length){
      providers = action.payload.slice(0)
    } else {
      providers = ProviderData.slice(0)
    }
  } 
  
  let tagged = [],
  provider,
  nextProvider,
  prevProvider,
  len = providers.length
  ;

  for(let i=0; i<len; i++){
    provider=         providers[i]

    // get reference to next provider in list, when we're not the last one
    nextProvider=     (i < len-1) ? providers[i+1] : null;

    // get reference to previous provider in list, when we're not the first one
    prevProvider=     (i > 0) ? providers[i-1] : null;

    provider.isLast=  (nextProvider && selected_.includes(nextProvider.id) || !nextProvider);
    provider.isFirst= (prevProvider && selected_.includes(prevProvider.id) || !prevProvider);

    // add to the stack
    tagged.push(provider);
  }
  
  return tagged;
}

// reducer.legal
export const legal = (state=[], action={}, parentState={} ) => {
  switch(action.type){
    case TOGGLE_PROVIDER_SELECTED:
    case TOGGLE_PROVIDER_GROUP_SELECTED:
    case TOGGLE_ALL_PROVIDERS_SELECTED:
    case UNSELECT_ALL_PROVIDERS:
      const selectedProviders = selected(parentState.selected, action, parentState).map(s => {
        return parentState.providers.find(p => p.id == s)
      });
      
      const legalState = selectedProviders.reduce((legalArray,p) => {
        const type = p.isTVProvider && !p.isSmartTVProvider ? 'TV_PROVIDER' : 'STREAMING_PROVIDER';
        !(legalArray.find(item => item.type == type)) && legalArray.push({
          type,
          content: LegalContent[type]
        });

        return legalArray;
      },[]);
      
      return sortBy(legalState, 'type').reverse();
      
    default:
      return state;
  }
}

export const selectAllToggleText = (state=null, action={}, parentState={}) => {
  switch(action.type){
    case TOGGLE_PROVIDER_SELECTED:
    case TOGGLE_PROVIDER_GROUP_SELECTED:
    case TOGGLE_ALL_PROVIDERS_SELECTED:
    case UNSELECT_ALL_PROVIDERS:
      return selected(parentState.selected, action, parentState).length == parentState.providers.length ? 
        `${selectAllLabels.SELECT_NONE}` : `${selectAllLabels.SELECT_ALL}`
    default:
      return state
  }
}

// reducer.expanding
// this is a list of any provider that is expanding or collapsing
// expandingCollapsing might be a better, more cumbersome name
export const expanding = (state=[], action={}, parentState={}) => {
  switch(action.type){
    // for most cases, we will take the oppurtunity to unset the expanding flag by removing provider from list...
    case TOGGLE_PROVIDER_SELECTED: 
    case TOGGLE_PROVIDER_GROUP_SELECTED:
    case TOGGLE_ALL_PROVIDERS_SELECTED:
    case env.ENVIRONMENT_CHANGED:
    case UNSELECT_ALL_PROVIDERS: 
      return []
      
    // unless of course we are actually tweening the provider, in which case, add it to list...
    case TOGGLE_PROVIDER_EXPANDED:
      return [action.payload.id]
      
    // and for edge cases where the in-between state needs to be preserved, ie, SET_DETAILS_HEIGHT, do nothing
    default:
      return state 
  }
}


// root reducer 
// 1/2 - pull all the above reducers into an object so we can iterate over them
export const reducers = {
  expanded,
  expanding,
  selected,
  isUnselectingIndex,
  displayOrder,
  providers,
  sortedProviders,
  grouped,
  groupSizes,
  legal,
  selectAllToggleText
}

// 2/2 gather sub-reducers up into a single reducer containing the individual state slices,
// but allow each reducer access to the entire state object, for cross-cutting concerns 
// such as calculating sort order or adding the displayFlags based on the current selected state
const combinedProvidersReducer = (state, action) => {      
  return Object.keys(reducers).reduce((root, key) => {
    // root.grouped = reducers.group(state.grouped, action, state)
    root[key] = reducers[key](state[key], action, state)
    return root
  },{})
}

// deal with variations..
// must reload provider state if a variation is being activated 
// that contains provider data...
export const providersReducer = (state=initialState,action={}) => {
  if(action.type == v.ACTIVATE_VARIATION){
    if(action.payload && action.payload.providers){
      console.log('reload providers')
      return combinedProvidersReducer(state, loadProviders(action.payload.providers))
    }
  }
  
  return combinedProvidersReducer(state,action)
}