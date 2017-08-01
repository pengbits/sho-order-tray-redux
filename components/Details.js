import React, { Component } from 'react';
import $ from 'jquery';
import { WithExpandCollapse } from './ExpandableCollapsibleComponent'
import cn from 'classnames';
import DetailsToggle from './DetailsToggle';
import Price from './Price';
import PartnerList from './PartnerList';
import Devices from './Devices';
import Divider from './Divider';
import * as DISPLAY from '../redux/display'

class Details extends Component {
  
  // called by ExpandableCollapsibleComponent hoc
  onSetHeight(height){
    const {id,setDetailsHeight} = this.props
    setDetailsHeight(id, height)
  }
  
  render(style){
    const {
      key, 
      name,
      id,
      isTVProvider,
      isSmartTVProvider,
      isExpanded,
      isExpanding,
      devicesBlurbHeadline,
      devicesBlurb,
      hasDevicesList,
      priceCallout,
      isMobile
    } = this.props;
    
 
    // console.log(`dts#render ${id} ${JSON.stringify({isExpanding,isExpanded})}`)

    return (
      <div className='order-card__details'
        style={{height: style && style.height !== undefined ? `${style.height}px` : 'auto' }}  
      >
        <Divider top={true} />
        
        {priceCallout &&
          <Price calloutHTML={priceCallout} />}
        
        {priceCallout && 
          <Divider />}
            
        {!!devicesBlurb && !!devicesBlurbHeadline && 
          <Devices>
            <Devices.Headline>
              {devicesBlurbHeadline}
            </Devices.Headline>
            <Devices.Blurb>
              {devicesBlurb}
            </Devices.Blurb>
            {!!hasDevicesList && 
              <Devices.List />}
          </Devices>}
        
        {isTVProvider && !isSmartTVProvider && 
          <PartnerList />}
            
        <Divider />
        <DetailsToggle 
          text="Close" 
          modifierClassName="order-card__details-toggle--close"
          onToggle={this.onToggleClick.bind(this)}
          isMobile={isMobile}>
        </DetailsToggle>
      </div>
    )
  }
  
  onToggleClick(e){
    e.preventDefault()
    const {toggleProviderExpanded} = this.props;
    const el = e.currentTarget;
    const id = $(el).parents('.order-card').data('providerId');
    toggleProviderExpanded(id)
  }
  
  onWillCollapse(el){
    el.removeClass('order-card__details--expanded')
  }
  
  onMotionComplete(el){
    const {isExpanded,isMobile} = this.props
    if(isExpanded){
      el.addClass('order-card__details--expanded')
    } else {
      if(isMobile) this.scrollToProvider(el)
    }    
  }
  
  scrollToProvider(el){
    const lastScroll   = this.getScrollElement().scrollTop();
    const headerHeight = this.getHeaderHeight();
    const card         = el.parents('.order-card')
    const offset       = (this.props.display == DISPLAY.MODES.OVERLAY) ?
      (card.position().top - headerHeight + lastScroll)
      :
      (card.offset().top - 10)
      ;    
    this.scrollContentTo(offset)
  }
  
  getHeaderHeight(){
    if(!this.headerHeight){
      let headerHeight = $('.order-tray__body-headline').outerHeight();
      let bodyTop = Number((this.getScrollElement().css('padding-top') || '').replace('px',''));
      this.headerHeight = headerHeight + bodyTop;
    }
    return this.headerHeight;
  }
  
  // scroll order-tray__body-content (desktop) or body element (mobile) to desired offset
  scrollContentTo(scrollTop){
    this.getScrollElement().animate({'scrollTop': scrollTop}, 250);
  }
  
  getScrollElement(){
    // return the correct element to scroll based on display mode
    // note that this is only ever called in mobile context 
    return (this.props.display == DISPLAY.MODES.OVERLAY) ? 
      $('.order-tray__body-content') : 
      $('body')
    ;
  }
}

export default WithExpandCollapse(Details)