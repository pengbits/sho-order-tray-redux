import cn from 'classnames';
import React, { Component } from 'react'
import PickerProviderList from './PickerProviderList'
import {WithVariations} from './VariationComponent'
import PickerProviderGroupedList from './PickerProviderGroupedList'
import PickerProviderGroupButton from './PickerProviderGroupButton'

class Picker extends Component {
  
  onPickProvider(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const {providerGroupId} = el.dataset;
    const {toggleProviderGroupSelected} = this.props;
    toggleProviderGroupSelected(Number(providerGroupId))
  }
  
  
  onSelectAllUnselectAll(e) {
    e.preventDefault();
    this.props.toggleAllProvidersSelected();
  }
  
  render() {
    const {
      isDesktop,
      useColumns
    } = this.props;
    
    return (
      <div className={cn(
          'order-picker', 
         {'order-picker--two-col' : isDesktop && useColumns}
      )}>
        {this.pickerBody()}
      </div>
    )
  }
  
  pickerBody(){
    return <span>
      {this.pickerProviderList()}
      {this.pickerControls()}
    </span>
  }
  
  pickerProviderList(){
    const {
      isMobile,
      providers,
      grouped,
      groupedInColumns,
      selected,
      useColumns
    } = this.props;
    
    let items;

    if(isMobile){
      items = [providers] 
    } else if(useColumns){
      items = groupedInColumns
    } else { // for featured-provider variation SITE-18141
      items = [grouped.filter(p => p.isFeatured !== true)]
    }    
    
    return items.map((column,i) => <PickerProviderList
      key={i} 
      displayProviders={column} 
      selected={selected} 
      onClick={this.onPickProvider.bind(this)}
    />)
  }
  
  pickerControls(){
    const {
      selectAllToggleText,
      isOverlay
    } = this.props;
    
    return (<div className="order-picker__control-group">
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
    )
  }
  
  pickerProviderButtons(){
    const {
      providers,
      grouped,
      selected,
      setSelectedProviderGroups,
      variations
    } = this.props
    
    const subCopy = variations['provider-groups'] ? variations['provider-groups'].groups_subcopy : {}
    
    return <PickerProviderGroupedList 
      selected={selected}
      providers={providers}
      setSelectedProviderGroups={setSelectedProviderGroups}
      grouped={grouped} 
      subCopy={subCopy}
    />
  }
  
  destroy(e){
    e.preventDefault()
    this.props.destroy()
  }
}

export default WithVariations(Picker)