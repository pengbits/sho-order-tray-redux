import cn from 'classnames';
import React, { Component } from 'react'
import PickerProviderGroupButton from './PickerProviderGroupButton'


class PickerProviderGroupedList extends Component   {
  render(){
    const {
      grouped,
      selected,
      subCopy,
    } = this.props
    

    return (<div data-context="order tray">
      {grouped.map(g => <PickerProviderGroupButton 
        key={g.groupId}
        onClick={this.onSelectGroup.bind(this)}
        isSelected={this.isSelected(g.groupId)}
        subCopy={subCopy}
        {...g}
      />)}
    </div>)
  }
  
  isSelected(groupId){
    const {
      grouped,
      selected
    } = this.props
    
    // if any ids in selected match the ids of providers 
    // in the group w/ same group id as mine,
    // then i am selected
     const group =  grouped.filter(p => p.groupId == groupId) 
    return group && group.find(p => selected.indexOf(p.id) > -1) !== undefined
  }
  
  onSelectGroup(e){
    const {
      grouped, 
      providers, 
      setSelectedProviderGroups
    } = this.props
    
    e.preventDefault();
    // for this test, only one group can be shown at a time, so
    // instead of adding/removing the group's cards from the stack,
    // make it work like a toggle that affects the entire group
    // somewhat cumbersome, but we have to coerce the group id 
    // back into the array of individual provider ids to make this work...
    
    const el = e.currentTarget;
    const groupId = Number(el.dataset.providerGroupId);
    const groupIds = providers.filter(p => p.groupId == groupId).map(p => p.id)
    const selected = this.isSelected(groupId) ? [] : groupIds
    setSelectedProviderGroups({selected,groupId})
  }
  
}


export default PickerProviderGroupedList