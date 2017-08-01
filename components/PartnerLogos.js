import React, { Component } from 'react'

const PartnerLogos = () => {
  return (
    <ul className="order-card__partner-logos">
      <li className="order-card__partner-logo order-card__partner-logo--att">
        <a data-track data-provider-id="6" data-label="provider lead"  href="https://www.att.com/olam/loginAction.olamexecute?pId=U_PassThru_UcomShowtime">AT&amp;T U-Verse</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--brighthouse">
        <a data-track data-provider-id="13" data-label="provider lead" href="http://brighthouse.com/shop/tv/programming/premium-programming.html">BrightHouse</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--charter-spectrum">
        <a data-track data-provider-id="20" data-label="provider lead" href="https://www.charter.com/browse/tv-service/tv?cmp=sho&amp;#Premium-Channels=&amp;channel=showtime">Charter Spectrum</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--cox">
        <a data-track data-provider-id="25" data-label="provider lead" href="https://store.cox.com/residential-shop/shop.cox?pc=addshowtime&custtype=current&sc_id=cr_dl_camp_z_showtime_custom">Cox</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--directv">
        <a data-track data-provider-id="26" data-label="provider lead" href="http://www.directv.com/sho">DirecTV</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--dish">
        <a data-track data-provider-id="28" data-label="provider lead" href="http://www.mydish.com/upgrades/premiums/showtime/">Dish</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--mediacom">
        <a data-track data-provider-id="45" data-label="provider lead" href="http://www.mediacomcable.com/home.html">Mediacom</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--optimum">
        <a data-track data-provider-id="18" data-label="provider lead" href="http://www.optimum.com/digital-cable-tv/movie-channels/showtime.jsp">Optimum</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--suddenlink">
        <a data-track data-provider-id="61" data-label="provider lead" href="https://order.suddenlink.com/Buyflow/Storefront">Suddenlink</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--timewarner">
        <a data-track data-provider-id="64" data-label="provider lead"  href="http://www.timewarnercable.com/en/plans-packages/tv/premiums-plans.html">Time Warner</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--verizon">
        <a data-track data-provider-id="66" data-label="provider lead" href="http://www22.verizon.com/home/fiostv/premiumchannels">Verizon</a>
      </li>
      <li className="order-card__partner-logo order-card__partner-logo--xfinity">
        <a data-track data-provider-id="23" data-label="provider lead" href="http://www.comcast.com/Corporate/Learn/DigitalCable/showtime.html">Xfinity</a>
      </li>
    </ul>
  ) 
}

const SmartTVLogos = () => {
  return (
    <ul className="order-card__partner-logos order-card__partner-logos--smart-tvs">
      <li className="order-card__partner-logo order-card__partner-logo--samsung-smart-tv">
        <span data-label="provider lead">Samsung Smart TV</span>
      </li>
    </ul>
  )
}

PartnerLogos.SmartTV = SmartTVLogos;
export default PartnerLogos;