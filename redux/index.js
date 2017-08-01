// do it
import { combineReducers }  from 'redux'
import { providersReducer } from './providers'
import { environment }      from './environment'
import { variations }       from './variations'
import { details }          from './details'
import { display }          from './display'
import { app }              from './app'

const rootReducer = combineReducers({
  providers: providersReducer,
  environment,
  variations,
  display,
  details,  // for storing some heights of dom elements 
  app       // since saving in component is problematic
})

export default rootReducer