import cn from 'classnames';
import React, { Component } from 'react'

export default ({onClick,groupId,isSelected,groupName}) => {
  return (
    <li className="order-picker__provider order-picker__control">
        <span 
          onClick={onClick} 
          id={`order-picker__provider-${groupId}`}  data-provider-id={`${groupId}`} data-provider-group-id={`${groupId}`} 
          className={cn('input','input--faux-radio', {'input--faux-radio-checked' : isSelected})}
        >
          <img className="input__icon" src={`http://www.sho.com/www/sho/lib/assets/svg/super-radio${isSelected ? '-checked':''}_36x36.svg`} />
          {groupName}
        </span>
    </li>

  )
}