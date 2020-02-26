import {createAction} from 'redux-actions'
import Settings from '../../settings'
import axios from 'axios'

// action constants
// -----------------------------------------------------------------------------
export const SET_PROVIDERS                  = 'SET_PROVIDERS'
export const FETCH_PROVIDERS                = 'FETCH_PROVIDERS'
export const TOGGLE_PROVIDER_SELECTED       = 'TOGGLE_PROVIDER_SELECTED'
export const TOGGLE_PROVIDER_GROUP_SELECTED = 'TOGGLE_PROVIDER_GROUP_SELECTED'
export const SET_SELECTED_PROVIDER_GROUPS   = 'SET_SELECTED_PROVIDER_GROUPS'
export const TOGGLE_PROVIDER_EXPANDED       = 'TOGGLE_PROVIDER_EXPANDED'
export const TOGGLE_ALL_PROVIDERS_SELECTED  = 'TOGGLE_ALL_PROVIDERS_SELECTED'
export const UNSELECT_ALL_PROVIDERS         = 'UNSELECT_ALL_PROVIDERS'
export const LOCK_SELECTION                 = 'LOCK_SELECTION'
export const UNLOCK_SELECTION               = 'UNLOCK_SELECTION'
export const SELECT_ALL_PROVIDERS           = 'SELECT_ALL_PROVIDERS'

// action creators
// -----------------------------------------------------------------------------
// fetch provider data syncronously from window data or optimizely and apply to state
export const setProviders = createAction(SET_PROVIDERS, 
  (a => !!a ? a.providers  : undefined), 
  (a => !!a ? a.variations : undefined)
)

// fetch provider data asyncronously
// this is available as stringified json in all pages at the moment,
// but ultimately there will be an endpoint specific for this purpose
export const fetchProviders = (opts={}) => {
  const isStyleguide = window.location.host.indexOf('4000') > -1
  const path         = isStyleguide ? '/styleguide/order-tray/mocks/provider-www-view-list-json.js' : '/order.json'
  return {
    type: FETCH_PROVIDERS,
    payload: axios(path)
  }
}

export const toggleProviderSelected      = createAction(TOGGLE_PROVIDER_SELECTED)
export const toggleProviderGroupSelected = createAction(TOGGLE_PROVIDER_GROUP_SELECTED)
export const toggleProviderExpanded      = createAction(TOGGLE_PROVIDER_EXPANDED)
export const setSelectedProviderGroups   = createAction(SET_SELECTED_PROVIDER_GROUPS)
export const toggleAllProvidersSelected  = createAction(TOGGLE_ALL_PROVIDERS_SELECTED)
export const unselectAllProviders        = createAction(UNSELECT_ALL_PROVIDERS)
export const selectAllProviders          = createAction(SELECT_ALL_PROVIDERS)

// temporarily set a flag for locking selection state while tweening
export const lockSelection = (action) => (dispatch) => {
  dispatch({type: LOCK_SELECTION})
  setTimeout(() => dispatch({type: UNLOCK_SELECTION}), Settings.lock_duration)
}


