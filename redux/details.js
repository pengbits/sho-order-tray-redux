import {createAction} from 'redux-actions'

// action constants
export const SET_DETAILS_HEIGHT  = 'SET_DETAILS_HEIGHT'

// action creators
export const setDetailsHeight = createAction(SET_DETAILS_HEIGHT)

// reducer

export const details = (state={}, action={}) => {
  if(action.type == SET_DETAILS_HEIGHT){
    const entry = {}
    entry[action.payload.id] = action.payload.height;
    // console.log(`reducer.cards SET_DETAILS_HEIGHT ${JSON.stringify(entry)}`)
    return Object.assign({}, state, entry)
  } else {
    return state
  }
}