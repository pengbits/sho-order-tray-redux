// vendor
import $ from 'jquery'
import React from 'react';
import ReactDOM from 'react-dom';

// integrations with other components
import CampaignHelper from '../analytics/campaign-helper';
import HashChange from '../hash-change/index';

// order-tray
import OrderTray from './index'

// Factory handles instantiating the teay on-demand, when a user clicks on a call-to-action
let factory = null;

class Factory {
  constructor() {
    if(!factory){
      factory = this;
    }
    
    this.setListener();
    return factory;
  }
  
  setListener() {
    $(document).on('order:opened', this.onOpenTray.bind(this));
  }
  
  onOpenTray(e){
    return this.instance(e)
  }
  
  instance(cfg){
    if(!this._instance){
      console.log(`|factory| create new instance`)
      this._instance = new OrderTray(cfg);
    } 
    else {
      console.log(`|factory| todo: need to configure existing instance`)
      // this._instance.controller.init(cfg) 
    }
    
    return this._instance;
  }
  
  destroy(instance){
    console.log(`|factory| destroy() called`)
    if(this._instance == instance){
      this._instance = null;

      HashChange.close();
    }
    else{
      throw new Error(`trying to destroy order tray, but there is somehow more than one instance`)
    }
  }
}

export default new Factory();