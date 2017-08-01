import React, { Component } from 'react'
import $ from 'jquery'

export default ({path,name,onTouchTap,isSelected,isMobile}) => {
  
  const wrapper = (content) => {
    if(isMobile){ 
      return (
        <div onTouchTap={onTouchTap} className="order-card__toggle" data-track="" data-label="open card">
          {content}
        </div>)
    } else { 
      return (
        <div>{content}</div>
      )
    }
  }
  
  return (  
    wrapper(<img className="order-card__logo" alt={name} src={path} />)
  ) 
}