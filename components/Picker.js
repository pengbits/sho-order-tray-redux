import cn from 'classnames';
import React, { Component } from 'react'
import PickerProvider from './PickerProvider'

class Picker extends Component {
  
  onPickProvider(e) {
    e.preventDefault();
    
    const el = e.currentTarget;
    const {providerGroupId} = el.dataset;
    
    this.props.toggleProviderGroupSelected(Number(providerGroupId))
  }
  
  onSelectAllUnselectAll(e) {
    e.preventDefault()
    
    this.props.toggleAllProvidersSelected();
  }
  
  destroy(e){
    e.preventDefault()
    
    this.props.destroy()
  }

  render() {
    const {
      providers,
      selected,
      grouped,
      isMobile,
      selectAllToggleText,
      isOverlay
    } = this.props;
    
    return (
    <div className="order-picker">
      <ul className="order-picker__provider-list">
        {(isMobile ? providers : grouped).map((p,idx) => <PickerProvider 
          key={idx} 
          onClick={this.onPickProvider.bind(this)}
          isSelected={(selected.find(id => id == p.id)) !== undefined}
          {...p} 
        /> )}
      </ul>
      <div className="order-picker__control-group">
        <a href="#"
          onClick={this.onSelectAllUnselectAll.bind(this)} 
          className="order-picker__control order-picker__control--select-all"
        >
          {selectAllToggleText}
        </a>
        
        {isOverlay &&
        <a href="#"
          onClick={this.destroy.bind(this)} 
          className="order-picker__control order-picker__control--close"
        >
          Close
        </a>}
      </div>
    </div>
    )
  }
}

export default Picker