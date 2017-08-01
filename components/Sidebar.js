import React, { Component } from 'react'
import Picker from '../containers/PickerContainer';

export default ({headlineText}) => {
  return (
    <nav className="order-tray__sidebar">
      <h3 className="order-tray__sidebar-headline">
        {headlineText}
      </h3>
      <Picker />   
    </nav>
  )
}