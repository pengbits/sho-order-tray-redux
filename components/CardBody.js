import React, { Component } from 'react'

export default ({description,isTVProvider,isSmartTVProvider,providerLeadUrl,providerLeadText,hasDeviceIcons}) => {
  return (
    <div className="order-card__body">
      {!isTVProvider || isSmartTVProvider?
        (<div className="order-card__description">
          {description}
        </div>) 
        :
        <span>
          <div className="order-card__description">
            Get connected with your TV provider: Call <strong className="order-card__description__hotline">1-800-SHOWTIME</strong>
          </div>
          <div className="order-card__blurb order-card__blurb--description">
            <h5>Your SHOWTIME subscription includes access to SHOWTIME ON DEMAND and SHOWTIME ANYTIME at no additional cost – watch wherever and whenever on your TV, tablet, phone or computer at <a href="http://www.showtimeanytime.com">ShowtimeAnytime.com.</a>. PLUS, you can download full episodes and movies to your favorite mobile devices with the Showtime Anytime app to watch offline later.</h5>
        </div>
        </span>
      }
      
      {hasDeviceIcons && 
      <div className="order-card__device-icons">
        <img src="http://downloads.sho.com/images/order/tray/device-icons/icon-sho.svg"    />
        <img src="http://downloads.sho.com/images/order/tray/device-icons/icon-mobile.svg" />
        <img src="http://downloads.sho.com/images/order/tray/device-icons/icon-tablet.svg" />
        <img src="http://downloads.sho.com/images/order/tray/device-icons/icon-desktop.svg"/>
      </div>}
        
      {providerLeadUrl && providerLeadText && 
      <div className="order-card__big-button-container">
        <a className="order-card__big-button button--solid-red order-card__provider-lead" href={providerLeadUrl} data-track="" data-label="provider lead">{providerLeadText}</a>
      </div>}
    </div>
  ) 
}



