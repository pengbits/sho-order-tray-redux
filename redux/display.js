import {createAction} from 'redux-actions'

// action constants
export const SET_DISPLAY  = 'SET_DISPLAY'

// constants to represent the different options for display-mode
export const MODES = {
  OVERLAY   : 'OVERLAY',
  CHAMELEON : 'CHAMELEON'
}
export const MODIFIERS = {
  OVERLAY   : 'order-tray--overlay',
  CHAMELEON : 'order-tray--chameleon'
}

// action creators
export const setDisplayMode   = createAction(SET_DISPLAY)

// reducer
export const display = (state=null, action={}) => {

  switch (action.type) {
    case SET_DISPLAY:
      const display = `${action.payload}`
      
      if(Object.values(MODES).indexOf(display) == -1){
        throw new Error(`${display} is not a valid display mode`)
        return state
      } else {
        return display
      }
      
    default:
      return state
  }
}