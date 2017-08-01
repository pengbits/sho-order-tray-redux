import React, { Component } from 'react'
import cn from 'classnames';

export default ({top}) => {
  return (
    <span className={cn(
      'order-card__divider',
     {'order-card__divider--top' : top }
    )}>
    </span>
  ) 
}