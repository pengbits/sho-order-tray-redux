import React, { Component } from 'react'
import PartnerData from '../redux/partner-list-data'

const divider = (char) => (<li 
  className="partner-list__divider" key={char}>{char.toUpperCase()}
</li>);

const partner = ({name,id,providerLeadUrl}) => {
  return (<li>
    <a target="_blank"
      className="partner-list__link order-card__provider-lead" 
      href={providerLeadUrl} 
      rel="noopener noreferrer"
      data-provider-id={id}
      data-track 
      data-label="provider lead">{name}
    </a>
  </li>)
};

const partnerList = ({tvProvidersAlpha}) => {
  return Object.keys(tvProvidersAlpha || {}).map((char) => {
    const section = tvProvidersAlpha[char]; // {"A":[{},{},{}]}
    return [divider(char)]
      .concat(section.map(item => partner(item)))
  })
}

export default (props) => {
  return (
    <div>
      <h4 className="partner-list-header">Select a Provider Below:</h4>
      <ul className="partner-list">{partnerList(props)}</ul>
    </div>
    )
  }
