import React, { Component } from 'react'
import cn from 'classnames';

export default ({isExpanded,modifierClassName,onToggle,text,isMobile}) => {
  // supply only tap or click handling to the toggle
  const event = isMobile ? 'TouchTap':'Click'
  const attrs = {}; attrs[`on${event}`] = onToggle
  
  return (
    <div className={cn(
      'order-card__details-toggle',
      modifierClassName,
     {'order-card__details-toggle--active' : isExpanded},
      'order-card__details-summary'
    )} 
      role="button" 
      data-label={text.toLowerCase()}
      {...attrs}
    >
      {text}
    </div>


  ) 
}