import React, { Component } from 'react'

const Devices = ({children}) => {
  return (
    <div className="order-card__blurb order-card__blurb--devices">
      {children}
    </div>
  ) 
}

Devices.Headline = ({children}) => {
  return (
    <h4>{children}</h4>
  )
}

Devices.Blurb = ({children}) => {
  return (
  <h5>{children}</h5>
  )
}

Devices.List = () => {
  return (<aside className="order-card__device-list">
    <ul>
      <li>Amazon Fire TV™</li>
      <li>Android TV™</li>
      <li>Apple TV®</li>
      <li>Roku® Players</li>
      <li>Roku® TV</li>
      <li>Chromecast™</li>
    </ul>
    <ul>
      <li>Android™</li>
      <li>Fire Tablet™</li>
      <li>iPad®</li>
      <li>iPhone®</li>
      <li>iPod Touch®</li>
      <li>Samsung Smart TVs</li>
      <li>Xbox One</li>
    </ul>
  </aside>)
}

export default Devices