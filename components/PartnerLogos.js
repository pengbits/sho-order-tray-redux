import React, { Component } from 'react'
export const PARTNER_LOGOS_IMAGE_PATH = 'https://downloads.sho.com/images/order/tray/cable-logos-2x/'

const PartnerLogos = ({providers}) => {
  if(!providers || !providers.length) return null
  
  return (
    <ul className="order-card__partner-logos">{providers.map((p) => (<li 
        key={p.id} 
        className={`order-card__partner-logo order-card__partner-logo--${p.id}`} 
        data-provider-id={p.id}>
        {p.providerLeadUrl ? (
          <a 
            target="_blank"
            data-track data-label="provider lead" 
            data-provider-id={p.id} 
            className="order-card__provider-lead" 
            href={p.providerLeadUrl}
            rel="noopener noreferrer"
            style={getBackgroundPath(p)}
          >
          {getLabel(p)}
          </a>
        ) : (
          <span data-label="provider lead"
            style={getBackgroundPath(p)}
          >
          {getLabel(p)}
          </span>
        )
      }
    </li>))}
    </ul>
  )
}

const getBackgroundPath = ({id}) => {
  return {backgroundImage : `url(${PARTNER_LOGOS_IMAGE_PATH}${id}.png)`}
}

const getLabel = (p) => {
  return p.providerLeadText || p.name || p.id
}

export default PartnerLogos;
