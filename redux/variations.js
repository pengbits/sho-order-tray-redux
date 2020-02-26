import {createAction} from 'redux-actions'
import {keys} from 'lodash'

// action constants
export const ACTIVATE_VARIATION   = 'ACTIVATE_VARIATION'
export const DEACTIVATE_VARIATION = 'DEACTIVATE_VARIATION'


// action creators
export const activateVariation = createAction(ACTIVATE_VARIATION)
export const deactivateVariation = createAction(DEACTIVATE_VARIATION)


// this is what our optly data might look like:
const initialData = {}
// a simple flag
//  'two-col-provider-list' : true,
// some data passed to support variation
//  'name' : 'direct-from-showtime'
//  'providers' : [{name:'roku xreme'},{name:'horizons pulse'}]

// selectors/helpers
export const findVariationWithProviders = (state) => {
  const entries   = Object.values(state || {})
  const variation = (entries || []).find(v => v.providers && v.providers.length)
  return variation
}

const extractEntry = (variation) => {
  const entry = {};
  if(typeof variation === 'string'){
    entry[variation] = true;
    return entry
  }
  else {
    if(keys(variation).length && variation.name){
      entry[variation.name] = Object.assign({}, variation); // was {...variation} 
      return entry
    } 
  }
}

// reducers
export const variations = (state=initialData, action={}) => {
  switch (action.type) {
    case ACTIVATE_VARIATION:
      return Object.assign({}, state, extractEntry(action.payload));
      
    default:
      return state
  }
}