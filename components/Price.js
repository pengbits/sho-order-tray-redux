import React, { Component } from 'react'
import cn from 'classnames'
// single-price
// <div class="order-card__price-description">
//  <div class="order-card__price-callout-container">
//    <span class="order-card__price-callout">
//      $10.99<em>per month</em><br>
//      <b>after free trial</b>
//    </span>
//  </div>
//  <span class="order-card__divider"></span>
// </div>

// multiple-price
// <div class="order-card__price-description">
//  <div class="order-card__price-callout-container order-card__price-callout-container--multiple">
//    <span class="order-card__price-callout">
//      $10.99<em>per month</em><br>
//      <b>after free trial</b>
//      <span class="order-card__price-callout__this-or-that">OR</span>
//    </span>
//    <span class="order-card__price-callout">
//      $8.99<em>per month</em><br>
//      <b>for PlayStation®Plus members</b>
//    </span>
//  </div>
//  <span class="order-card__divider"></span>
// </div>
 
const CalloutContainer = ({children,modifier}) => {
   return (<div className={cn('order-card__price-callout-container', (modifier ? modifier : ''))}>
     {children}
   </div>)
} 
  
const Callout = ({children}) => {
  return (<span className="order-card__price-callout" 
    dangerouslySetInnerHTML={{ __html: children}}>
  </span>);
}

const Blurb = ({children}) => {
  return (
  <div className="order-card__blurb order-card__blurb--price">
    <h4>Get full access to SHOWTIME whenever you want –<br />all commercial-free</h4>
    <h5>Stream award-winning series like Homeland, Billions, Ray Donovan, Shameless and The Affair the moment they air. PLUS, you'll be able to watch exclusive movies, documentaries, sports, comedy specials and much more. Whether you watch LIVE TV or ON DEMAND you never have to miss a single thing.</h5>
  </div>
  )
}
  
const CalloutSeperatorHTML = `<span class="order-card__price-callout__this-or-that">OR</span>`;

const PriceWithMultipleCallouts = ({callouts}) => {
  return (<div className="order-card__price-description">
    <CalloutContainer modifier='order-card__price-callout-container--multiple'>
      {callouts.map((calloutHTML,i) => {
        return <Callout key={i}>
          {`${calloutHTML}` + (i < callouts.length-1 ? CalloutSeperatorHTML : '')}
        </Callout>
      })}
    </CalloutContainer>
    <Blurb />
  </div>)
}

const Price = ({calloutHTML}) => {
  if(typeof calloutHTML !== 'string' && calloutHTML.length > 1) {
    return PriceWithMultipleCallouts({callouts: calloutHTML})
  }
  
  return (<div className="order-card__price-description">
    <CalloutContainer>
      <Callout>
        {calloutHTML}
      </Callout>
    </CalloutContainer>
    <Blurb />
  
  </div>)
}


Object.assign(Price, {
  CalloutSeperatorHTML,
  Callout,
  Blurb
})

export default Price