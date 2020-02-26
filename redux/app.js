import {createAction} from 'redux-actions'
import thunk from 'redux-thunk'
import * as DISPLAY from './display'

// action constants
export const DESTROY_ORDER_TRAY    = 'DESTROY_ORDER_TRAY'
export const INITIALIZE_ORDER_TRAY = 'INITIALIZE_ORDER_TRAY'

// action creators
export const initialize = createAction(INITIALIZE_ORDER_TRAY)
export const destroy    = createAction(DESTROY_ORDER_TRAY)

// reducer
export const statuses = {
  INITIALIZED : 'INITIALIZED',
  OPEN        : 'OPEN',
  CLOSED      : 'CLOSED',
  DESTROYED   : 'DESTROYED'
}

export const app = (state={status:null}, action={}) => {

  switch (action.type) {
    case INITIALIZE_ORDER_TRAY:
      return {
        status: statuses.INITIALIZED
      }
      break;
    
    case DESTROY_ORDER_TRAY:
      return {
        status: statuses.DESTROYED
      }
      break;
      
    default:
      return state
  }
}