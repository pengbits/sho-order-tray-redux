import cn from 'classnames';
import React, { Component } from 'react';

class PickerProviderGroupButton extends Component   {

  render () {
    const {
      groupName,
      groupId,
      selected,
      onClick,
      isSelected,
    } = this.props;
    
    return (<div>
      <button
        onClick={onClick}
        id={`order-picker__provider-${groupId}`}
        data-provider-id={`${groupId}`} data-provider-group-id={`${groupId}`}
        className={cn('order-picker__provider-group-button', {'order-picker__provider-group-button--selected' : isSelected})}
      >
        {groupName}
      </button>
      {!!this.getCopy() && 
        <span className='order-picker__provider-group__subcopy'>
          {this.getCopy()}
        </span>
      }
    </div>)
  }
  
  hasCopy(){
    return !!this.getCopy()
  }
  
  getCopy(){
    const {groupId,subCopy} = this.props
    return (subCopy || {})[groupId]
  }
}

export default PickerProviderGroupButton;
