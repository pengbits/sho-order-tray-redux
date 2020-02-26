import cn from 'classnames';
import React, { Component } from 'react';

class PickerProviderListItem extends Component   {

  render () {
    const {onClick,groupId,isSelected,groupName} = this.props;
  
    return (
      <li className="order-picker__provider order-picker__control" data-context="order tray">
          <span
            onClick={onClick}
            id={`order-picker__provider-${groupId}`}
            data-provider-id={`${groupId}`} data-provider-group-id={`${groupId}`}
            className={cn('input','input--faux-radio', {'input--faux-radio-checked' : isSelected})}
          >
            <img className="input__icon" src={`https://www.sho.com/www/sho/lib/assets/svg/super-radio${isSelected ? '-checked':''}_36x36.svg`} /> 
            {groupName}
          </span>
      </li>
    )
  }
}
export default PickerProviderListItem;
