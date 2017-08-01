import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware';
import {loadProviders, toggleProviderGroupSelected} from './redux/providers'

const composeEnhancers = composeWithDevTools({}); 

const getInitialState = (reducer, opts) => {
	const loadedState = reducer({}, loadProviders())
	
	if(opts.selectedProvider !== undefined){
		return reducer(loadedState, toggleProviderGroupSelected({id: opts.selectedProvider}))
	} else {
		return loadedState
	}
}

export default (reducer, opts={}) => {
	return createStore(reducer, getInitialState(reducer, opts), composeEnhancers(
	  applyMiddleware(
	    thunk,
	    promiseMiddleware()
	  )
	))
}