import cn from 'classnames';
import React, { Component } from 'react'
import PickerProviderListItem from '../containers/PickerProviderListItemContainer'

export default ({displayProviders,onClick,selected}) => {
  return (<ul className="order-picker__provider-list">
    {displayProviders.map((p,idx) => <PickerProviderListItem 
      key={idx} 
      onClick={onClick}
      isSelected={(selected.find(id => id == p.id)) !== undefined}
      {...p} 
    />)}
  </ul>)
}