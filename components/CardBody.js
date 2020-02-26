import React, { Component } from 'react'
import {WithVariations} from './VariationComponent'
import Price from './Price'

class CardBody extends Component {
  render() {
    const {
      description,
      isTVProvider,
      isSmartTVProvider,
      providerLeadUrl,
      providerLeadText,
      id,
      hasDeviceIcons,
      priceCallout,
      priceBlurbHeadline,
      priceBlurb,
      freeTrial
    } = this.props

    // actually make this use real description in all cases,
    // and add it to tv provider json
    // and move it above logos
    return (
      <div className="order-card__body">
        <div className="order-card__description"
          dangerouslySetInnerHTML={{ __html: description }} />

        {hasDeviceIcons &&
        <div className="order-card__device-icons">
          <img src="https://downloads.sho.com/images/order/tray/device-icons/icon-sho.svg"    />
          <img src="https://downloads.sho.com/images/order/tray/device-icons/icon-mobile.svg" />
          <img src="https://downloads.sho.com/images/order/tray/device-icons/icon-tablet.svg" />
          <img src="https://downloads.sho.com/images/order/tray/device-icons/icon-desktop.svg"/>
        </div>}

        {providerLeadUrl && providerLeadText &&
        <div className="order-card__big-button-container">
          <a target="_blank" rel="noopener noreferrer" className="order-card__big-button button--solid-red order-card__provider-lead" data-provider-id={id} href={providerLeadUrl} data-track="" data-label="provider lead">{providerLeadText}</a>
        </div>}
      </div>
    )
  }

  priceCalloutStripped(){
    const {priceCallout} = this.props
    // normalize for possible array in playstation
    return ([].concat(priceCallout || ''))
      .map(token => token.replace(/<\/*em>|<br\s*\/*>|<\/*b>/g,' ')).join('')
  }
}

export default WithVariations(CardBody)
