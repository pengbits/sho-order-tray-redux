import {createAction} from 'redux-actions'
import thunk from 'redux-thunk'
import {unselectAllProviders} from './providers'
import * as DISPLAY from './display'

// action constants
export const DESTROY_ORDER_TRAY  = 'DESTROY_ORDER_TRAY'

// action creators

export const destroy = createAction(DESTROY_ORDER_TRAY)
export const closeOrDestroy = () => {
  return (dispatch,getState) => {
    if(getState().display == DISPLAY.MODES.CHAMELEON){
      dispatch(unselectAllProviders())
    } else {
      dispatch(destroy())
    }    
  }
}

// reducer
export const statuses = {
  INITIALIZED : 'INITIALIZED',
  OPEN        : 'OPEN',
  CLOSED      : 'CLOSED',
  DESTROYED   : 'DESTROYED'
}

export const app = (state={status: statuses.INITIALIZED}, action={}) => {

  switch (action.type) {
    case DESTROY_ORDER_TRAY:
      return {
        status: statuses.DESTROYED
      }
      break;
      
    default:
      return state
  }
}