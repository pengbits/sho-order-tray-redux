import {
  ACTIVATE_VARIATION, 
  variations,
  findVariationWithProviders
} from './redux/variations'

import {
  ENVIRONMENT_CHANGED, 
  environment
} from './redux/environment'

import {
  setProviders,
  unselectAllProviders,
  displayLegalForFeaturedProvider,
  hideLegalForFeaturedProvider,
  FETCH_PROVIDERS
} from './redux/providers'

const ProviderVariationMiddleware = store => next => action => {
  if(typeof action == 'object'){
    
    const {
      type,
      payload
    } = action
    
    switch(type){
      // apply variation providers to store
      case ACTIVATE_VARIATION:
        payload && dispatchSetProviders(store, payload.providers)
        break;
        
      // retrieve stringified provider data and cast to json before sending to store 
      case `${FETCH_PROVIDERS}_FULFILLED`:
        const {data} = payload || {}
        const {page} = data || {}
        
        // if there is custom provider data in variation state, 
        // don't overwrite it with the results of the fetch ...
        if(!findVariationWithProviders(store.getState().variations)) {
          if(dispatchSetProviders(store, eval(page.providerWwwViewListJsonString || "[]"))) {}
          else throw new Error('provider-data endpoint did not contain valid data in global.providerWwwViewListJsonString')
        }
        break;
    }
  }

  return next(action)
}

// dispatchSetProvider
// convenience function for checking providers and dispatching if not empty
const dispatchSetProviders = (store, providers) => {
  if(!providers || !providers.length){
    return false
  }
  
  store.dispatch(setProviders({providers})); return true
}

export default ProviderVariationMiddleware