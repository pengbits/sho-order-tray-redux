import React, { Component } from 'react';
import $ from 'jquery';
import {findDOMNode} from 'react-dom';
import {fromTo,set} from 'gsap';
import EasePack from  'gsap';
import Settings from '../settings';

export const WithExpandCollapse = (Target) =>  {
  return class extends Target {
    
    componentWillUpdate(nextProps, nextState) {
      // if incoming state change introduces isExpanded=true, 
      // and container el has been cached by componentDidUpdate below, 
      // it's time to tween..
      if(nextProps.isExpanding){
        // impose a slight delay so expandedHeight and other props can be applied
        setTimeout(this.tween.bind(this), 0)
      }
      
      // if we were previously expanding and now wer're not, 
      // we need to call the same helper function we call in advance of a tween,
      // as there are some modifier classes that need to be removed outside of the render() implementation  
      if(this.props.isExpanding && !nextProps.isExpanding && this.props.isExpanded){
        if(super.onWillCollapse){
          super.onWillCollapse(this.el());
        }
      }
      
      // pass control back to super class
      if(super.componentWillUpdate){
        super.componentWillUpdate(nextProps,nextState)
      }
    }
  
    componentDidUpdate(prevProps, prevState){
      const {isExpanding,isExpanded,expandedHeight} = this.props;

      if(isExpanding && expandedHeight == undefined){
        this.setHeight(this.el());
      }
    }
    
    setHeight(el){
      el.css({'height':'auto'});
      const height = el.height();
      el.height(0);
      super.onSetHeight(height)  
    }
    
    render(){  
      const {
        isExpanding,
        isExpanded,
        expandedHeight,
        id
      } = this.props
      
      const style = {
        height : (isExpanding 
          ? 
          undefined
          : 
          (isExpanded ? expandedHeight : 0)
        )
      }
      // console.log(`exp#render ${id} ${JSON.stringify({isExpanding, isExpanded, ...style})}`)
      return super.render(style)
    }
    
    tween(){
      const {isExpanded,expandedHeight} = this.props
      // console.log(`tween ${isExpanded ? 'expanded':'collapsed'} ${expandedHeight}`)

      !isExpanded && !!super.onWillCollapse && super.onWillCollapse(this.el());
      
      fromTo(
        this.el(),
        Settings.expand_collapse_duration, 
        {height : (isExpanded ? 0 : expandedHeight)}, 
        {height : (isExpanded ? expandedHeight : 0), ease: Settings.ease, 
          onComplete: this.onMotionComplete.bind(this, isExpanded)
        }
      )
    }
    
    el(){
      if(this.__el == undefined)
      {
        this.__el = $(findDOMNode(this))
        // console.log(`saving this.__el=${this.__el.get(0).className}`)
      }  
      
      return this.__el
    }
    
    onMotionComplete(isExpanded){
      isExpanded && this.el().css({'height':'auto'});
      !!super.onMotionComplete && super.onMotionComplete(this.el(), isExpanded)
    }
    
  }
}