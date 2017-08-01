// vendor
import $ from 'jquery'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// we are using react-motion library for animating the cards
// https://github.com/chenglou/react-motion

// integrations with other components
import CampaignHelper from '../analytics/campaign-helper';
import HashChange from '../hash-change/index';

// order-tray.react/redux
import storeConfig from './storeConfig';
import OrderTrayContainer from './containers/OrderTrayContainer';
import OrderTrayReducer from './redux/index';
import Factory from './factory'
import {closeOrDestroy} from './redux/app'

class OrderTray {
  
  constructor(cfg={}){
    console.log('hello from refactored Order Tray')
    this.el = this.renderElement(cfg.el)
    this.OrderTrayWithStore = this.getConnectedOrderTray(this.getStoreOptions(cfg)); 
    this.renderComponent();
    this.setHandlers();

    return this.OrderTrayWithStore;
  }
  
  renderElement(el){
    if(el) return el;
    
    // todo - fade in
    $('body').append('<div class="order-tray order-tray--redux order-tray--overlay"></div>');
    return $('.order-tray').get(0);
  }
  
  getStoreOptions(cfg){
    // look for provider id param coming from hash, and if found,
    // pass it along as an entry for the store's `providers.selected` node
    return cfg.provider !== undefined ? {selectedProvider: cfg.provider} : {}
  }
  
  getConnectedOrderTray(opts){
    this.store = storeConfig(OrderTrayReducer, opts)
    return (
      <Provider store={this.store}>
        <OrderTrayContainer onDestroy={this.destroy.bind(this)}/>
      </Provider>
    )    
  }
  
  renderComponent(){
    ReactDOM.render(this.OrderTrayWithStore, this.el)
  }
  
  setHandlers(){
    $(this.el).on('click', this.onBodyClick.bind(this))
  }
  
  // catch-all click event - if we can't find an element associated with a more specific callback,
  // assume we clicked on the shader and close the tray
  onBodyClick(e){
    let el = e.target;
  
    if(el && el.className && /order-tray__(overflow|body|body-content)/.test(el.className)) {
      if(el.className == 'order-tray__body-headline') return; // extra check for mobile
      // we need to remove the `-active` class here since the relevant cleanup method 
      // defined on the order-tray component is not called fron this context
      // $('html').removeClass('order-tray-active');
      // this.destroy();
      this.store.dispatch(closeOrDestroy())
    }
  }


  // remove component from DOM
  // could be called by onBodyClick above, or indirectly called in response to a redux action
  destroy(){
    // wrap in timeout to avoid errors
    // https://github.com/facebook/react/issues/3298
    setTimeout(ReactDOM.unmountComponentAtNode, 0, this.el)
    $(this.el).remove()
    Factory.destroy(this.OrderTrayWithStore)
  }
}

OrderTray.Factory = Factory;
export default OrderTray
