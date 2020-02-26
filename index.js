// react/jquery
import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'

// redux
import { combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import { createStore, applyMiddleware, compose} from 'redux'
import analyticsEnhancer, { addActionListeners } from './store-analytics-enhancer'

// routerims
import createHistory from 'history/createBrowserHistory'
import { Route, IndexRoute, Switch } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

// configure dev tools
const k = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
const opts = {'name':'Order Tray','actionsBlacklist' : ['@@router/LOCATION_CHANGE']} // these get noisy
const composeEnhancers = window[k] ? window[k](opts) : compose;

// other component integrations
import CampaignHelper from '../analytics/campaign-helper'
import HashChange from '../hash-change/index'

// begin order-tray
import { setProviders, fetchProviders, toggleProviderGroupSelected } from './redux/providers'
import OrderTrayContainer from './containers/OrderTrayContainer'
import {indexReducer} from './redux/index'
import Factory from './factory'
import { initialize,closeOrDestroy} from './redux/app'
import ProviderVariationMiddleware from './provider-variation-middleware'
import LocationMiddleware from './location-middleware'

export const ROUTER_ROOT = '/styleguide/order-tray-with-better-seo'
const emptyMiddleware = store => next => action => next(action)

class OrderTray {
  constructor(cfg={}){
    console.log(`hello from refactored Order Tray useRoutes=${!!cfg.useRoutes}`)
    this.el = this.renderElement(cfg.el)
    this.bootstrap(cfg)
    this.component = cfg.useRoutes ? 
      this.routedComponent(cfg) :
      this.connectedComponent(cfg)
    ;
    ReactDOM.render(this.component, this.el)
    return this.component
    // return this
}
  

  routedComponent(cfg) {
    // intentionally omitting path attr because
    // 1) it's not needed, we're parsing the params in the middleware when catching the action, not in the router at all
    // 2) attempting to set up multiple routes causes a known issue where LOCATION_CHANGE fires twice 
    // https://github.com/reactjs/react-router-redux/issues/570
    return (
      <Provider store={this.store}>
        <ConnectedRouter history={this.history}>
          <Route component={this.component.bind(this)} />
        </ConnectedRouter>
      </Provider>
    )
  }
  
  connectedComponent(cfg){
    return (
      <Provider store={this.store}>
        <OrderTrayContainer el={this.el} />
      </Provider>
    )
  }
  
  wrapper({children}){
    return <div>{children}</div>
  }
  
  component({location}) {
    return <OrderTrayContainer el={this.el} />
  }
  
  bootstrap({useRoutes,base}) {
    const {
      history,
      reducer
    } = useRoutes ? 
      this.initHistory(base) 
      : 
      { reducer: combineReducers({...indexReducer})}
    ;
      
    // load initial state into store
    const initialState = reducer({})
    const store = this.initStore({
      reducer, 
      initialState, 
      history, 
      useRoutes
    })
    
    // init component
    store.dispatch(initialize())
    // if we're using routes, grab the providers that are already present and apply to store
    // if we're not, (overlay) we'll need to fetch the providers asyncronously
    if(useRoutes) {
      const {providers} = window.order_tray_data || {} 
      store.dispatch(setProviders({providers}))
    } else {
      store.dispatch(fetchProviders())
    }
  
    this.store   = store
    this.history = history
  }
  
  initStore({reducer, initialState, history, useRoutes}){
    return addActionListeners(createStore(reducer, initialState, 
      composeEnhancers(
        analyticsEnhancer, 
        applyMiddleware(
          ProviderVariationMiddleware,
          (useRoutes ? routerMiddleware(history) : emptyMiddleware), 
          (useRoutes ? LocationMiddleware : emptyMiddleware), 
          thunk, 
          promiseMiddleware()
        ) 
      )
    ))
  }
  
  initHistory(basename){
    return {
      history: createHistory({
        basename
      }),
      reducer: combineReducers({
        ...indexReducer,
        'router':routerReducer
      })
    }
  }
  
  renderElement(el){
    if(el) return el  
    // todo - fade in
    $('body').append('<div class="order-tray order-tray--redux order-tray--overlay"></div>')
    $('.peek-a-boo--banner').css("display", "none");
    return $('.order-tray').get(0)
  }
}

OrderTray.Factory = Factory
export default OrderTray
