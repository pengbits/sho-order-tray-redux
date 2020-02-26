import {sortBy} from 'lodash'
import LegalContent from '../legal-content'
import * as env     from '../environment'
import * as v       from '../variations'
import {
  MAX_ITEMS_FOR_SINGLE_COLUMN
} from './utils'

// constants
import {
  SET_PROVIDERS,
  FETCH_PROVIDERS,
  TOGGLE_PROVIDER_SELECTED,
  TOGGLE_PROVIDER_GROUP_SELECTED,
  SET_SELECTED_PROVIDER_GROUPS,
  TOGGLE_PROVIDER_EXPANDED,
  TOGGLE_ALL_PROVIDERS_SELECTED,
  UNSELECT_ALL_PROVIDERS,
  LOCK_SELECTION,
  UNLOCK_SELECTION,
  SELECT_ALL_PROVIDERS
} from './actions'

// selectors
import {
  sanitizeProviders,
  providerWasSelected,
  groupMembers,
  groupMemberIds,
  groupMemberWasSelected,
  addToList,
  removeFromList,
  toggleInList
} from './selectors'

// for selectAllToggletext
export const selectAllLabels = {
  'SELECT_ALL'  : 'Select All',
  'SELECT_NONE' : 'Unselect All'
}

// initial state
// -----------------------------------------------------------------------------
export const initialState = {
  providers           : [],
  displayOrder        : {},
  sortedProviders     : [],
  selected            : [],
  selectedChildren    : [],
  locked              : false,
  loading             : false,
  isUnselectingIndex  : 0,
  expanded            : [],
  expandedChildren    : [],
  expanding           : [],
  expandingChildren   : [],
  grouped             : [],
  groupSizes          : {},
  legal               : [],
  tvProvidersAlpha    : {},
  tvProvidersFeatured : [],
  tvProvidersSmartTVs : [],
  selectAllToggleText : selectAllLabels.SELECT_ALL,
  useColumns          : false
}


// reducers
// -----------------------------------------------------------------------------
// reducer.locked
// set a flag for avoiding collisions while selecting/unselecting rapidly in quick succession
export const locked = (state=false, action={}, parentState={}) => {
   switch(action.type) {
     case LOCK_SELECTION:   
      return true
     case UNLOCK_SELECTION: 
      return false
     default: 
      return state
   }
}

// reducer.loading
// set a flag (ie to draw a spinner) when perorming a fetch of provider data
export const loading = (state=false, action={}, parentState={}) => {
  switch(action.type){
    case `${FETCH_PROVIDERS}_PENDING`: 
      return true
    case `${FETCH_PROVIDERS}_FULFILLED`:
      return false
    default:
      return state
  }
}

// reducer.selected
// - a simple array of ids of those providers who are currently selected
export const selected = (state=[], action={}, parentState={}) => {
  if(parentState.locked) return state;
  
  const {id} = action.payload || {};
  switch(action.type){
    
    case SET_SELECTED_PROVIDER_GROUPS: 
      return action.payload.selected || []
      
    case TOGGLE_PROVIDER_GROUP_SELECTED:
      let changed = state.slice(0);
      groupMembers(id, parentState.providers).map(p => {
        changed = state.includes(p.id) ? 
          removeFromList(changed, p.id)
        :  
          addToList(changed, p.id)
      })
      
      return changed;
      break;
    
    case env.ENVIRONMENT_CHANGED:
      const {isMobile} = action.payload || {};
      const flatten    = ((arr) => Array.prototype.concat(...arr))
      return !isMobile ? flatten(state.map((id,idx) => {
        const provider = parentState.providers.find(p => p.id == id)  
        return groupMembers(provider.groupId, parentState.providers).map(p => p.id)
      })) : state
      break;
      
    case TOGGLE_ALL_PROVIDERS_SELECTED:
      return state.length == parentState.providers.length ? [] : parentState.providers.map(p => p.id)
      break;
      
    case TOGGLE_PROVIDER_SELECTED:
      return toggleInList(state, id)
      break;
  
    case SELECT_ALL_PROVIDERS:
      return parentState.providers.map(p => p.id)
      break;
      
    case UNSELECT_ALL_PROVIDERS:
      return []
      break;
      
      
    default:
      return state
  }
}

// reducer.selectedChildren
// selected state for child providers in the additional card
export const selectedChildren = (state=[], action={}, parentState={}) => {
  switch(action.type){
    case TOGGLE_ALL_PROVIDERS_SELECTED:
    case SELECT_ALL_PROVIDERS:
    case UNSELECT_ALL_PROVIDERS:
      return []
      
    case TOGGLE_PROVIDER_GROUP_SELECTED:   
      const {id,isChild} = action.payload || {}
      return isChild ? toggleInList(state, id) : state  
      
    default:
      return state
  }
}


// reducer.expanded
// - a simple array of ids of those providers who are currently expanded
export const expanded = (state=[], action={}, parentState={}) => {
  if(parentState.locked) return state;
  
  const {id,isChild} = action.payload || {};
  const isGroup      = /GROUP/.test(action.type) ;
  const groupIds     = isGroup ? groupMemberIds(id, parentState) : [];
  
  const isAdding = isGroup ? 
    !groupMemberWasSelected(groupIds, parentState) : 
    !providerWasSelected(id, parentState)
  ;
  
  switch(action.type){
    
    // if setting provider to selected, preserve state 
    // if we are unselecting, and on desktop, collapse any providers in the group being toggled
    // note that this is only called from desktop ui, so platform check is not really needed
    case TOGGLE_PROVIDER_GROUP_SELECTED:
      // if(!isMobile){
      if(!isAdding){
        return state.filter(p => {
          return !groupIds.includes(p)
        })
      } else {
        return state
      }
      // } else { return state }
      
    // if on mobile, and unselecting, we want to collapse the provider being toggled off,
    // any others need their state preserved.
    // note that is only called from mobile ui, so platform check is not really needed
    case TOGGLE_PROVIDER_SELECTED:
      // if(isMobile){
      return state.filter(p => (p == id && !isAdding) ? false : true)
      // } else { return state }
      
    // handle case where user is actually expanding or collapsing the provider, filtering out child providers
    case TOGGLE_PROVIDER_EXPANDED:
      return isChild ? state : toggleInList(state, id)
      
    // collapse all expanded providers on orientation change
    case env.ENVIRONMENT_CHANGED: 
    case UNSELECT_ALL_PROVIDERS:
    
    // for a/b test SITE_17441
    case SET_SELECTED_PROVIDER_GROUPS:
      return []
      
    default:
      return state
  }
}


// reducer.expandedChildren
// expanded state for child providers in the additional card
export const expandedChildren = (state=[], action={}, parentState={}) => {
  const {id,isChild} = action.payload || {}

  switch(action.type){
    case TOGGLE_PROVIDER_EXPANDED:
      return isChild ? toggleInList(state, id) : state  
      
    case TOGGLE_PROVIDER_GROUP_SELECTED:  
      const groupIds   = groupMemberIds(id, parentState)
      const isAdding   = !groupMemberWasSelected(groupIds, parentState) 
      const parent     = parentState.providers.find(p => p.groupId == id)
      const {children} = (parent || {})

      // if we are unselecting, (and on desktop), collapse any child providers associated with the parent
      if(!isAdding && children){
        return state.filter(p => {
          return children.includes(p)
        })
      } else {
        return state
      }
      
    case env.ENVIRONMENT_CHANGED:
    case TOGGLE_ALL_PROVIDERS_SELECTED: 
    case SELECT_ALL_PROVIDERS:
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

// reducer.isUnselectingIndex 
// this is used in fadeout animation to know where to put the shim
export const isUnselectingIndex = (state=null, action={}, parentState={}) => {
  let results        = [];
  const isSelected   = selected(parentState.selected, action, parentState)
  const wasSelected  = parentState.selected
  const {providers,displayOrder,sortedProviders}  = parentState
  
  // iterate over previously selected providers..
  wasSelected.map(id => {
    // if the provider is not in current selected state, it's being removed
    if(!isSelected.includes(id)){
      // if it's found in the displayOrder...
      if(displayOrder[id] !== undefined){ 
        
        let position;
        sortedProviders.forEach((p,i) => {
          if(p.id == id){
            position = i; 
          }
        })

        results.push(position)
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
    const groupSize = !!provider ? groupSizes(parentState.groupSizes, action, parentState)[provider.groupId] : 0
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
  if(action.type == SET_PROVIDERS){
    if((action.payload || []).length){
      providers = sanitizeProviders(action.payload)
    } else {
      throw new Error('SET_PROVIDERS contained an empty payload')
    }
  } 
  
  let tagged = [],
  provider,
  nextProvider,
  prevProvider,
  len = providers.length
  ;

  for(let i=0; i < len; i++){
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



// flatten
// recursive helper function to reduce tv providers across multi-level hierarchies to simple array
// used by allProvidersSelector() below
var flatten = function(node, flat){
  if(Array.isArray(node)) {
    node.map(item => flatten(item, flat))
  } else {
    if(node.children && node.children.length){  
      flat.push(node)
      node.children.map(item => flatten(item, flat))
    } else {
      flat.push(node)
    }
  }
  return flat
}

// reducer.allProvidersSelector
// the flattened list of all providers, used for retrieving tv providers and smart tv providers
export const allProvidersSelector = (state) => {
  return flatten(state.providers, [])
}
export const TV_PROVIDERS_PARENT_ID = 126
export const tvProvidersSelector = (parentState={}) => {
  return allProvidersSelector(parentState).filter(p => p.isTVProvider && !p.isSmartTVProvider && p.id !== TV_PROVIDERS_PARENT_ID)
}

// reducer.tvProvidersFeatured
// a slice to hold the grid of logos for featured tv providers aka partners
// [{id: 25, name:'cox'...},{...},{...}]
const tvProvidersFeaturedSelector = (parentState) => {
  return tvProvidersSelector(parentState).filter(p => p.featured)
}
export const tvProvidersFeatured  = (state=[], action={}, parentState={}) => {  
  return state.length ? state : tvProvidersFeaturedSelector(parentState)
}

// reducer.tvProvidersSmartTVs
// a slice to hold the grid of logos for featured smart tvs
// [{id: 132, name:'lg'...},{...},{...}]
export const SMART_TV_PROVIDERS_PARENT_ID = 130
const tvProvidersSmartTVsSelector = (parentState) => {
  return allProvidersSelector(parentState).filter(p => p.isSmartTVProvider && p.id !== SMART_TV_PROVIDERS_PARENT_ID) 
}
export const tvProvidersSmartTVs  = (state=[], action={}, parentState={}) => { 
  return state.length ? state : tvProvidersSmartTVsSelector(parentState)
}
    
// reducer.tvProvidersAlpha
// a slice to hold the non-featured a-z list of tv providers aka partners
// {  
//    b: [{id:136, name: 'BEK Communications'},{id:10 name:'BendBroadband'}],
//    c: [{id:17, name: 'Cable One'},{...}] 
// }
const tvProvidersAlphaSelector = (parentState) => {
  return tvProvidersSelector(parentState).reduce((store, partner) => {
    const k = (partner.name || 'z')[0].toLowerCase()
    return {
      ...store, 
      [k] : (store[k] || []).concat([partner])
    }
  },{})
}

export const tvProvidersAlphaMap = (state={}, action={}, parentState={}) => { 
  return (Object.keys(state).length) ? state : tvProvidersAlphaSelector(parentState)  
}

const compareNamesOfProviders = ((a,b) => (a.name || '').toLowerCase() < (b.name || '').toLowerCase() ? -1 : 1)
const compareCharacter        = ((a,b) => (a < b) ? -1 : 1)

export const tvProvidersAlpha = (state,action,parentState) => {
  const map        = tvProvidersAlphaMap(state,action,parentState)
  // sort alpha headings themselves since they might be in arbitrary order
  const sortedKeys = Object.keys(map).sort(compareCharacter)
  let sortedMap    = {}
  // sort by provider name within each char entry
  sortedKeys.map(k => { 
    sortedMap[k] = map[k].sort(compareNamesOfProviders) 
  })
  return sortedMap
}

// reducer.legal
export const legal = (state=[], action={}, parentState={} ) => {

  switch(action.type){
    case SET_SELECTED_PROVIDER_GROUPS:
    case TOGGLE_PROVIDER_SELECTED:
    case TOGGLE_PROVIDER_GROUP_SELECTED:
    case TOGGLE_ALL_PROVIDERS_SELECTED:
    case SELECT_ALL_PROVIDERS:
    case UNSELECT_ALL_PROVIDERS:
    case SET_PROVIDERS:

      let activeProviders, activeProviderIds
      // support for featured provider experiment (prioritize direct SITE-18141)
      // force display of legal for featured provider if mobile env
      if(
        action.type == SET_PROVIDERS && 
        action.meta && action.meta.name == 'featured-provider-2' &&
        action.meta.featuredProvider && action.meta.featuredProvider.id !== undefined
      ) {
        if(action.meta.isMobile) {
          const {featuredProvider} = action.meta
          activeProviderIds  = [featuredProvider.id, ...parentState.selected] 
          activeProviders    = selected(activeProviderIds, action, parentState).map(s => {
            return  [featuredProvider].concat(parentState.providers).find(p => p.id == s)
          })
        }
        if(!action.meta.isMobile) {
          activeProviderIds = parentState.selected.slice(0)
          activeProviders   = selected(activeProviderIds, action, parentState).map(s => {
            return action.payload.find(p => p.id == s)
          })
        }
      }
      else {
        activeProviderIds = parentState.selected.slice(0)
        activeProviders   = selected(activeProviderIds, action, parentState).map(s => {
          return parentState.providers.find(p => p.id == s)
        })
      }

      return legalContent(activeProviders)
      
    default:
      return state;
  }
}

const legalContent = (set) => {
  const state = set.reduce((legalArray,p) => {
    // if(p == undefined) throw new Error('bad provider found in legalContent')
    const type = p !== undefined ? p.isTVProvider && !p.isSmartTVProvider ? 'TV_PROVIDER' : 'STREAMING_PROVIDER' : null;
    type !== null && !(legalArray.find(item => item.type == type)) && legalArray.push({
      type,
      content: LegalContent[type]
    });

    return legalArray;
  },[]);
  
  return sortBy(state, 'type').reverse();
}

export const selectAllToggleText = (state=null, action={}, parentState={}) => {
  switch(action.type){
    case TOGGLE_PROVIDER_SELECTED:
    case TOGGLE_PROVIDER_GROUP_SELECTED:
    case TOGGLE_ALL_PROVIDERS_SELECTED:
    case SELECT_ALL_PROVIDERS:
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
    case SELECT_ALL_PROVIDERS:
    case UNSELECT_ALL_PROVIDERS: 
    case SET_SELECTED_PROVIDER_GROUPS:
      return []
      
    // unless of course we are actually tweening the provider (and it's not a child), in which case, add it to list...
    case TOGGLE_PROVIDER_EXPANDED:
      const {id,isChild} = action.payload
      return isChild ? [] : [id]
      
    // and for edge cases where the in-between state needs to be preserved, ie, SET_DETAILS_HEIGHT, do nothing
    default:
      return state 
  }
}

// reducer.expandingChildren
// list of any child provider that is expanding or collapsing
export const expandingChildren = (state=[], action={}, parentState={}) => {
  switch(action.type){
    // for most cases, we will take the oppurtunity to unset the expanding flag by removing provider from list...
    case TOGGLE_PROVIDER_SELECTED: 
    case TOGGLE_PROVIDER_GROUP_SELECTED:
    case TOGGLE_ALL_PROVIDERS_SELECTED:
    case env.ENVIRONMENT_CHANGED:
    case SELECT_ALL_PROVIDERS:
    case UNSELECT_ALL_PROVIDERS: 
      return []

    // unless of course we are actually tweening the provider 
    case TOGGLE_PROVIDER_EXPANDED:
      const {id,isChild} = action.payload || {}
      return isChild ? [id] : []
    
    // and for edge cases where the in-between state needs to be preserved, ie, SET_DETAILS_HEIGHT, do nothing     
    default:
      return state
  }
}

// reducer.useColumns
// should we use columns in the picker?
export const useColumns = (state=false, action={}, parentState={}) => {
  if(action.type == SET_PROVIDERS){
    return (grouped(providers.grouped, action, parentState).length > MAX_ITEMS_FOR_SINGLE_COLUMN)
  } else {
    return state
  }
}


// root reducer 
// 1/2 - pull all the above reducers into an object so we can iterate over them
export const reducers = {
  providers,
  displayOrder,
  sortedProviders,
  selected,
  selectedChildren,
  locked,
  loading,
  isUnselectingIndex,
  expanded,
  expandedChildren,
  expanding,
  expandingChildren,
  grouped,
  groupSizes,
  legal,
  tvProvidersAlpha,
  tvProvidersFeatured,
  tvProvidersSmartTVs,
  selectAllToggleText,
  useColumns
}

// 2/2 gather sub-reducers up into a single reducer containing the individual state slices,
// but allow each reducer access to the entire state object, for cross-cutting concerns 
// such as calculating sort order or adding the displayFlags based on the current selected state

// TODO determine if this is the cause of the 'No reducer provided for key "providers"' error, 
// which can only be seen when running tests, unless patched with the workaround in ./index.js
// https://stackoverflow.com/questions/43375079/redux-warning-only-appearing-in-tests

const combinedProvidersReducer = (state, action) => {      
  return Object.keys(reducers).reduce((root, key) => {
    // root.grouped = reducers.group(state.grouped, action, state)
    root[key] = reducers[key](state[key], action, state)
    return root
  },{})
}

export const providersReducer = (state=initialState,action={}) => combinedProvidersReducer(state,action)

// not really used, but also doesn't seem to be the 
// cause of the 'No reducer provided for key "providers"' error
export default providersReducer