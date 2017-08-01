// import React, { Component } from 'react'
import React, { Component, cloneElement, isValidElement } from 'react';
import cn from 'classnames';
import TransitionGroup from 'react-transition-group/TransitionGroup'; 
import $ from 'jquery'
import Card from '../containers/CardContainer'
import * as Shim from '../components/AnimationShim'

const WRAPPER_CLASS = 'order-tray__order-card-collection' 

class CardCollection extends Component {
  constructor(props){
    super(props)
    this.state={
      isTweening : false
    }
  }
  
  static get className(){ 
    return WRAPPER_CLASS 
  }
  
  render(){
    const {
      isMobile,
      providers,
      sortedProviders,
      selected,
      animate
    } = this.props;
    
    // check for animate={false} option
    const disableAnimation = (animate !== undefined && !animate)
    
    if(isMobile) {
      return this.renderCards(providers)
    } else if (disableAnimation){
      return this.renderCards(sortedProviders)
    } else {
      return this.renderCardsWithMotion()
    }
  }
  
  renderCardsWithMotion(){
    const {
      providers,
      sortedProviders,
      selected,
      isUnselectingIndex,
      displayOrder
    } = this.props;
    
    // iterate over sorted providers and render card components for each
    // do this inside a transition group so we get mount/unmount hooks for animation
    return (<TransitionGroup component='div' className={CardCollection.className}>
      {sortedProviders.map((provider,idx) => {
        return this.renderCard(provider,idx)
      })}
    </TransitionGroup>)
  }
  
  // mobile doesn't use transitions or sorting,
  // so it's just a matter of iterating over providers
  renderCards(providers){  
    return (<div className={CardCollection.className}>
      {providers.map((p,i) => this.renderCard(p,i))}
    </div>)
  }
  
  // we are resorting to passing a reference to the parent component with `parent={this}`,
  // since it seems obvious that shim handling needs to stay here and outside the card itself

  // we also need a way to tag one of the providers in a group as unique,
  // to convey that it and only it should fire onEnter/onLeave callbacks on the shim..
  // we can achieve this by comparing the provider id with the contents of the grouped providers,
  // since the grouped contains only a single representative provider per group
  renderCard(provider,idx){
    const isRepresentativeGroupMember = (provider.groupSize < 2) || 
      (this.props.grouped.find(p => p.id == provider.id) !== undefined)

    return (<Card 
      key={`p-${provider.id}`}
      id={provider.id}
      position={idx} 
      parent={this}
      display={this.props.display}
      fireEvents={isRepresentativeGroupMember}
      {...provider} 
    />)
  }  
  
  // ...and here's the callback
  shim(mode, groupSize){
    const splice = this.props.isUnselectingIndex
    const offset = (groupSize-1)
    const el = $('.order-card').eq(splice + offset)
    Shim.render(el)

    if(this.state.isTweening) {
      console.log('attempting to tween shim before it\'s finished')
      return false
    }
    
    this.setState({isTweening : true})
    Shim.tween(mode, (mode => this.setState({isTweening : false})))
  
  }
}

export default CardCollection