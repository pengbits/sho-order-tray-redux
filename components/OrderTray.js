import React, { Component } from 'react'
var injectTapEventPlugin = require("react-tap-event-plugin"); 
injectTapEventPlugin();
import cn from 'classnames'
import $ from 'jquery'
import {WithVariations} from './VariationComponent'
import Sidebar from './Sidebar'
import CardCollection from './CardCollection'
import LegalCardCollection from '../containers/LegalCardCollectionContainer'
import OverflowShim from './OverflowShim'
import * as App from '../redux/app'
import variation from '../redux/provider-data-direct-from-showtime'
import WithChameleonSupport from './OrderTrayWithChameleon'
import * as DISPLAY from '../redux/display'

class OrderTre extends Component {

  componentWillMount(){
    const {
      setEnvironmentListeners,
      activateVariation,
      loadProviders,
      setDocumentAttributes
    } = this.props;
    

    loadProviders();
    setEnvironmentListeners();
    // simulate variations:ready event w/ a little bit of latency...
    // setTimeout(activateVariation, 125, variation.order_tray)
  }
    
  onVariationDetected(variation){
    const {activateVariation} = this.props
    
    // disabled because of conflicts w experiments running in the wild
    // if(variation.order_tray){
    //   activateVariation(variation.order_tray)
    // }
  }
  
  componentWillReceiveProps(nextProps) {
    const {appStatus} = nextProps;
    
    if(appStatus == App.statuses.DESTROYED) {
      this.toggleTrayIsActiveClass(false);
      this.props.onDestroy()
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
          <h3 className="order-tray__body-headline">
            {headlineText}
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
        <Sidebar headlineText={headlineText} />
        <b className="order-tray__closer" onClick={this.props.destroy}></b>
      </div>
    ) : null
  }
  
  setDocumentPadding(width){
    $('html').css('padding-right', width);
  }
  

  // todo... port pageScroll stuff for mobile->desktop changes and in-page/chameleon context
  //  // view#toggleDocumentIsPinned
  //  // make the {position:fixed,width:100%} workaround less jarring by preserving the document scroll while it's applied
  //  toggleDocumentIsPinned(isPinned){
  //    let offset = isPinned ? `-${this.getLastPageScroll()}px` : '';
  //    // console.log(`toggleDocumentIsPinned ${isPinned}`)
  //    $('html').css('top', offset);
  //  }
  //  
  //  // view#setLastScroll
  //  // store the scrollTop of the underlying document
  //  setLastPageScroll(){
  //    let scrollTop = $(document).scrollTop();
  //    // console.log(`setLastPageScroll ${scrollTop}`)
  //    this.state.pageScrollTop = scrollTop
  //  }
  //  
  //  // view#getLastPageScroll
  //  // return the last scroll of the underlying document
  //  getLastPageScroll(selector = 'content'){
  //    return this.state.pageScrollTop || 0;
  //  }
}

export default WithChameleonSupport(WithVariations(OrderTre));