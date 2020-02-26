import React, { Component } from 'react'
import ReactDOM from 'react-dom'
var injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin();
import cn from 'classnames'
import $ from 'jquery'
import {WithVariations} from './VariationComponent'
import Sidebar from '../containers/SidebarContainer'
import CardCollection from './CardCollection'
import LegalCardCollection from '../containers/LegalCardCollectionContainer'
import OverflowShim from './OverflowShim'
import * as App from '../redux/app'
import order_tray_data from '../mocks/window-order-tray-data'
import WithChameleonSupport from './OrderTrayWithChameleon'
import * as DISPLAY from '../redux/display'
import ScrollbarDimensions from '../../measure-scrollbars'
import Factory from '../factory'
import Headline from '../containers/HeadlineContainer'
import FeaturedProvider from '../containers/FeaturedProviderContainer'
class OrderTre extends Component {

  componentWillMount(){
    const {
      display,
      setEnvironmentListeners,
      activateVariation,
      setDocumentAttributes,
      useColumns
    } = this.props;
    
    setEnvironmentListeners();
    
    // simulate variations:ready event with mock data    
    // setTimeout(() => activateVariation({
    //   'name'      : 'provider-refresh',
    //   'providers' : order_tray_data
    // }), 0)

    // set listeners
    this.setHandlers();
    // still need this modifier for two-col version for now..
    this.setModifierClass('order-tray--two-col', useColumns);
    // save original padding value because our fix to prevent page pop overwrite it
    this.saveDocumentPadding();  
  }
  
  setHandlers() {
    $(this.props.el).on('click', this.onBodyClick.bind(this));
  }
    
  onVariationDetected(variation){
    const {activateVariation} = this.props
    if(variation.order_tray && variation.order_tray.name){
      console.log(`|order-tray| found optly variation: '${variation.order_tray.name}'`)
      activateVariation(variation.order_tray)
      
      // this should only affect overlay version, not chameleon
      if(variation.order_tray.name == 'featured-provider-2'){
        this.setModifierClass('order-tray--with-featured-provider', true)
      }
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const {appStatus,useColumns,loading} = nextProps;
    
    if(appStatus == App.statuses.DESTROYED) {
      this.toggleTrayIsActiveClass(false);
      this.onDestroy();   // not to be confused with this.props.destroy() 
    }                     // which dispatches redux destroy that triggers this call.
    
    if(useColumns !== this.props.useColumns){
      this.setModifierClass('order-tray--two-col', useColumns);
    }
    
    if(loading !== this.props.loading){
      this.setModifierClass('order-tray--loading', loading)
    }
  }

  onDisplayReady(display){
    if (display === DISPLAY.MODES.OVERLAY) { // we don't want to set padding on /order
      this.setDocumentPaddingToScrollbarsWidth(); 
    }
  }
  
  setModifierClass(className, mode){
    $('html, .order-tray').toggleClass(className, mode)
  }

  setDocumentPaddingToScrollbarsWidth(){
    const width = this.getDocumentPaddingNumber() + ScrollbarDimensions.instance().width();
    this.setDocumentPadding(width);
  }

  getDocumentPaddingNumber(){
    return Number($('html').css('padding-right').replace('px', ''));
  }

  setDocumentPadding(width){
    $('html').css('padding-right', width);
  }

  saveDocumentPadding(){
    // capture the original padding-right on html element since it will be overriden with width of scrollbars
    // if this is ever set to anything other than 0 it'll break the tray's handling, but playing safe regardless
    const prop  = 'paddingRight'
    const attrs = {}; attrs[prop] = $('html').css(prop);
    this.setState(attrs)
  }

  restoreDocumentPadding(){
    this.setDocumentPadding((this.state.paddingRight || 0));
  }

  onBodyClick(e){
    let el = e.target;
    const { display, collapse, destroy } = this.props;
    
    if(el && el.className && /order-tray__(overflow|body|body-content)/.test(el.className)) {
      if(el.className == 'order-tray__body-headline') {
        return; // extra check for mobile
      } else if (display == DISPLAY.MODES.CHAMELEON) {
        collapse();
      } else {
        destroy();
      }
    }
  }

  // remove component from DOM
  // called in response to a redux action destroy in componentWillReceiveProps above
  onDestroy(){
    // wrap in timeout to avoid errors
    // https://github.com/facebook/react/issues/3298
    setTimeout(ReactDOM.unmountComponentAtNode, 0, this.props.el);
    $(this.props.el).remove();
    Factory.destroy(this);
    // restore document padding to 0 to prevent page pop, overlay version only
    if (this.props.display === DISPLAY.MODES.OVERLAY) {
      this.restoreDocumentPadding();
    }
  }
  
  render() {    
    const {
      headlineText,
      providers      
    } = this.props;
    
    return providers.length ? (
      <div>
        <main className="order-tray__body">
          {this.isVariationActive('featured-provider-2') ? 
            <FeaturedProvider context='body' /> : null
          }
          <h3 className="order-tray__body-headline">
            <Headline />
          </h3>
          <div className="order-tray__body-content">
            <div className="order-tray__masthead">
              <a href="/" className="order-tray__masthead__logo">Showtime</a>
            </div>
            <CardCollection {...this.props} />
            <LegalCardCollection />
            <OverflowShim />
          </div>
        </main>
        <Sidebar />
        <b className="order-tray__closer" onClick={this.props.destroy}></b>
      </div>
    ) : null
  }
}

export default WithChameleonSupport(WithVariations(OrderTre));
