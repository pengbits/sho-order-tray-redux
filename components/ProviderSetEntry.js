import React, { Component } from 'react'
import $ from 'jquery'
import { WithExpandCollapse } from './ExpandableCollapsibleComponent'
import cn from 'classnames'
import Logo from './Logo'
import Headline from './CardHeadline'
import CardBody from './CardBody'
import Devices from './Devices'
import Divider from './Divider'
import PartnerLogos from './PartnerLogos'
import Price from './Price'

class ProviderSetEntry extends Component {
  // called by ExpandableCollapsibleComponent hoc
  onSetHeight(height){
    const {id,setDetailsHeight} = this.props
    setDetailsHeight(id, height)
  }

  render(style){
    const {
      id,
      name,
      freeTrial,
      providerLeadUrl,
      providerLeadText,
      isExpanded,
      isExpanding,
      onClick,
      headline,
      description,
      priceCallout,
      priceBlurb,
      priceBlurbHeadline,
      devicesBlurb,
      devicesBlurbHeadline,
      isSmartTVProvider,
      tvProvidersSmartTVs,
      isTVProvider,
      hasDeviceIcons,
      hasDevicesList,
      includeDivider,
    } = this.props;

    const height = style && style.height !== undefined ? `${style.height}px` : 'auto';
    
    return (
      <div>
        <div data-provider-id={id} className={cn(
          'order-card__provider-entry',
         {'order-card__provider-entry--expanded' : isExpanded})}
        >
          <div className="order-card__provider-entry__body">
            <div onClick={this.onToggleClick.bind(this)} data-provider-id={id} className={cn(
               'order-card__provider-entry__logo',
               'order-card__details-toggle',
              {'order-card__details-toggle--active' : isExpanded}
            )}>
              <img alt={name} className="order-card__logo" src={`https://downloads.sho.com/images/order/tray/provider-logos/${id}.png`} />
            </div>
            {providerLeadUrl ?
            <a target="_blank" rel="noopener noreferrer" className="order-card__provider-entry__provider-lead order-card__provider-lead" href={providerLeadUrl} data-provider-id={id} data-track="" data-label="provider lead">
              {providerLeadText}
              </a>
            :
            null
            }
            <span className="order-card__provider-entry__free-trial-callout">
              {freeTrial}
            </span>
          </div>
          <div className="order-card__provider-entry__details"
            style={{height}}
          >
            <Headline
              text={headline}
            />

          {isSmartTVProvider ? <PartnerLogos providers={tvProvidersSmartTVs} /> : null}

            <div className="order-card__body">
              <div className="order-card__description"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            <Divider top={true} />

            {priceCallout &&
              <Price
                calloutHTML={priceCallout}
                priceBlurbHeadline={priceBlurbHeadline}
                priceBlurb={priceBlurb}
              />}

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
          </div>
        </div>
        {includeDivider && <Divider />}
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
    return $(el).parents('.order-card__provider-entry')
  }

  onMotionComplete(el){
    const {isExpanded} = this.props;
    el.toggleClass('order-card__provider-entry__details--expanded', isExpanded);
  }
}

export default WithExpandCollapse(ProviderSetEntry, {
  target : '.order-card__provider-entry__details'
})
