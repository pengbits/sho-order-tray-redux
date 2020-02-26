import React, { Component } from 'react'
import $ from 'jquery'

export default ({path,name,onClick,isSelected,isMobile}) => {
  
  const wrapper = (content) => {
    if(isMobile){ 
      return (
        <div onClick={onClick} className="order-card__toggle">
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