// do it
import { combineReducers }  from 'redux'
import { providersReducer, initialState } from './providers/index'
import { environment }      from './environment'
import { variations }       from './variations'
import { details }          from './details'
import { display }          from './display'
import { app }              from './app'
import { headline }          from './headline'

export const indexReducer = {
  // mapping `providersReducer` => `providers` with a function fixes the 
  // 'No reducer provided for key "providers"' error, only seen when running tests
  // this might have to do with the handwritten reduce() implementation at the bottom of the reducer,
  // used there to provide access to the entire providers slice to each sub-reducer
  // https://stackoverflow.com/questions/43375079/redux-warning-only-appearing-in-tests
  providers: (state=initialState, action={}) => {
    return providersReducer(state, action)
  },
  environment,
  variations,
  display,
  details,  // for storing some heights of dom elements 
  app,      // since saving in component is problematic
  headline
}

export default indexReducer
export const rootReducer = combineReducers({...indexReducer})