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
  return (<aside className="order-card__devices">
  <section className="order-card__device-group">
    <h5 className="order-card__device-group__heading">Smart TVs &amp; Game Consoles</h5>
    <ul className="order-card__device-group__list">
      <li>Amazon Fire TV&#8482;</li>
      <li>Android TV&#8482;</li>
      <li>Apple TV&reg;</li>
      <li>Chromecast&#8482;</li>
      <li>LG Smart TVs</li>
      <li>Roku&reg; devices</li>
      <li>Samsung Smart TVs</li>
      <li>Xbox One</li>
    </ul>
  </section>
  <section className="order-card__device-group">
    <h5 className="order-card__device-group__heading">Mobile &amp; Tablet</h5>
    <ul className="order-card__device-group__list">
      <li>Android&#8482; devices</li>
      <li>Amazon Fire Tablet&#8482;</li>
      <li>iPad&reg;</li>
      <li>iPhone&reg;</li>
    </ul>
  </section>
  <section className="order-card__device-group">    
    <h5 className="order-card__device-group__heading">Computers</h5>
    <ul className="order-card__device-group__list">
      <li>Showtime.com</li>
    </ul>
  </section>
</aside>)
}

export default Devices