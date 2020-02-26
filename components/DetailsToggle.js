import React, { Component } from 'react'
import cn from 'classnames';

export default ({isExpanded,modifierClassName,onToggle,text,id}) => {

  return (
    <div className={cn(
      'order-card__details-toggle',
      modifierClassName,
     {'order-card__details-toggle--active' : isExpanded},
      'order-card__details-summary'
    )}
      data-provider-id={id}
      data-label={text.toLowerCase()}
      onClick={onToggle}
    >
      {text}
    </div>


  )
}
