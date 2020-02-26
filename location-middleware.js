import {push} from 'react-router-redux'
import {
  ROUTE_REGEX,
  sortedProvidersPath,
  getSelectedProvidersFromParams,
  setSelectedProviderGroups,
  selectAllProviders,
  unselectAllProviders,
  TOGGLE_PROVIDER_GROUP_SELECTED,
  TOGGLE_PROVIDER_SELECTED,
  TOGGLE_ALL_PROVIDERS_SELECTED,
  UNSELECT_ALL_PROVIDERS,
} from './redux/providers'

const ALL_PROVIDERS_PATH = '/providers/all'
const  NO_PROVIDERS_PATH = '/providers'

const LocationMiddleware = store => next => action => {
  // dispatch the action after a tiny delay, ie on next render
  const deferredDispatch = (action, delay=0) => {
    return setTimeout(() => store.dispatch(action), delay)
  }
  
  // ignore the LOCK/UNLOCK actions which are functions, not objects
  if(typeof action == 'object'){
    let {
      providers,
      display
    } = store.getState()
    
    switch (action.type){  
      case TOGGLE_ALL_PROVIDERS_SELECTED:
        const allSelected = providers.selected.length == providers.providers.length
        deferredDispatch(push(!allSelected ? ALL_PROVIDERS_PATH : NO_PROVIDERS_PATH))
        break
        
      
      case TOGGLE_PROVIDER_GROUP_SELECTED:
      case TOGGLE_PROVIDER_SELECTED:
        const path = sortedProvidersPath(action, store.getState().providers);
        deferredDispatch(push(path))
        break
        
      case UNSELECT_ALL_PROVIDERS:
        // store.dispatch(push('/'))
        break
    
      case '@@router/LOCATION_CHANGE':
        // this is the handling for when the browser reloads w/ one or more selected providers,
        // or when a user enters via a provider endpoint
        const actionPath  = (action.payload || {}).pathname.replace(/\/$/,'')
        const inertAction = {}
        const statePath   = sortedProvidersPath(inertAction, providers)
        
        if(actionPath !== statePath){
          if(actionPath == ALL_PROVIDERS_PATH){
            deferredDispatch(selectAllProviders())
          } 
          
          else if(ROUTE_REGEX.test(actionPath)){
            const selected = getSelectedProvidersFromParams(actionPath)
            const isReady  = display !== null
            deferredDispatch(setSelectedProviderGroups({selected}), (isReady? 0 : 125))
          } 
          
          else {
            console.log(`path '${actionPath}' doesnt contain providers so unselect all: `)
            deferredDispatch(unselectAllProviders())
          }
        }
        
        break
    }
  }
  return next(action)
}

export default LocationMiddleware