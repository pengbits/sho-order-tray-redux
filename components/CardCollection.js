import React, { Component, cloneElement, isValidElement } from 'react';
import cn from 'classnames';
import TransitionGroup from 'react-transition-group/TransitionGroup'; 
import $ from 'jquery'
import Card from '../containers/CardContainer'
import * as Shim from '../components/AnimationShim'
import * as DISPLAY from '../redux/display'


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
  
  // block renders if multiple tweens are in danger of colliding,
  // the call to onCompleteShim below will trigger a render w/ the new selection
  shouldComponentUpdate(nextProps, nextState){
    if(this.state.isTweening && nextState.isTweening){
      // console.log(`|collection| shouldComponentUpdate=false`);
      return false
    } else {
      // console.log(`|collection| shouldComponentUpdate=true`);
      return true
    }
  }
  
  render(){
    const {
      isMobile,
      providers,
      sortedProviders,
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
  //
  // we also need a way to tag one of the providers in a group as unique,
  // to convey that it, and only it, should fire onEnter/onLeave callbacks on the shim..
  // 
  // we can achieve this by comparing the provider id with the contents of the grouped providers,
  // since the grouped array contains only a single representative provider per group..
  // if the provider meets that criteria, we pass fireEvents={true} to the card
  // 
  renderCard(provider,idx){
    const isRepresentativeGroupMember = (provider.groupSize < 2) || 
      (this.props.grouped.find(p => p.id == provider.id) !== undefined)

    const key = `p-${provider.id}`; // preserve syntax highlighting in other contexts...

    return (<Card 
      key={key}
      id={provider.id}
      position={idx} 
      parent={this}
      display={this.props.display}
      fireEvents={isRepresentativeGroupMember}
      {...provider} 
    />)
  }  
  
  // ...and here's the callback that'll be called from card#willLeaveOrEnter if fireEvents={true}:
  tweenShim(mode, groupSize){
    const splice = this.props.isUnselectingIndex
    const offset = (groupSize-1)
    const el = $('.order-card').eq(splice + offset)
    
    if(!this.state.isTweening) {
      Shim.render(el)
      Shim.tween(mode, this.onCompleteShim.bind(this))
      this.setState({isTweening : true})
    } 
    else {
      // should never be excecuted... except w/ select all?
      // console.log(`|collection| tweenShim called While state.isTweening=true`)
    }
  }
  
  onCompleteShim(mode){
    // console.log(`|collection| onCompleteShim`)
    this.setState({isTweening : false})
  }
  
  resetBodyContent(){
    this.getBodyContent().scrollTop(0)
  }
  
  scrollToProvider(el){
    const card   = el.parents('.order-card')
    const {top}  = this.isOverlay() ? card.position() : card.offset()
    const offset = this.isOverlay() ? top : top - 10
    this.scrollContentTo(offset)
  }
  
  // scroll order-tray__body-content (desktop) or body element (mobile) to desired offset
  scrollContentTo(scrollTop){
    this.getScrollElement().animate({'scrollTop': scrollTop}, 250);
  }
  
  getScrollElement(){
    // return the correct element to scroll provider-content, based on display mode
    // note that this is only ever called in mobile context)
    return this.isOverlay() ? this.getBodyContent() : $('body')
  }
  
  getBodyContent(){
    return $('.order-tray__body-content')
  }
  
  isOverlay(){
    return this.props.display == DISPLAY.MODES.OVERLAY
  }
}

export default CardCollection