import React, { Component } from 'react';
import $ from 'jquery';
import { WithExpandCollapse } from './ExpandableCollapsibleComponent'
import cn from 'classnames';
import DetailsToggle from './DetailsToggle';
import Price from './Price';
import PartnerList from './PartnerList';
import Devices from './Devices';
import Divider from './Divider';

export class Details extends Component {

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
      tvProvidersAlpha,
      isExpanded,
      isExpanding,
      devicesBlurbHeadline,
      devicesBlurb,
      priceBlurbHeadline,
      priceBlurb,
      hasDevicesList,
      priceCallout,
      isMobile,
      parent
    } = this.props;


    // console.log(`dts#render ${id} ${JSON.stringify({isExpanding,isExpanded})}`)
    // console.log(`|details| priceBlurbHeadline: ${priceBlurbHeadline} priceBlurb: ${priceBlurb}`)
    const height = style && style.height !== undefined ? `${style.height}px` : 'auto';
    return (
      <div className='order-card__details'
        style={{height}}
      >
        <Divider top={true} />

        {priceCallout &&
          <Price
            calloutHTML={priceCallout}
            priceBlurbHeadline={priceBlurbHeadline}
            priceBlurb={priceBlurb}
          />}

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
          <PartnerList tvProvidersAlpha={tvProvidersAlpha} />}

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
    const id = this.getParentElement(el).data('providerId');
    toggleProviderExpanded(id)
  }

  getParentElement(el){
    const parentSelector = this.props.parentSelector || '.order-card'
    return $(el).parents(parentSelector)
  }

  onWillCollapse(el){
    el.removeClass('order-card__details--expanded')
  }

  onMotionComplete(el){
    const {isExpanded,isMobile} = this.props
    if(isExpanded){
      el.addClass('order-card__details--expanded')
    } else if (isMobile) {
      this.props.collection.scrollToProvider(el);
    }
  }
}

export default WithExpandCollapse(Details)
