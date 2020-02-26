import React, { Component } from 'react'
import {findDOMNode} from 'react-dom';
import {fromTo,set} from 'gsap';
import EasePack from  'gsap';
import Settings from '../settings'

class LegalCard extends Component {
  constructor(props){
    super(props)
    const {opacity} = props
    
    this.state = {
      opacity
    }
  }
  
  componentDidMount() {
    this.el = $(findDOMNode(this))
  }
  
  componentDidUpdate(prevProps, prevState) {
    //this.tween('enter')
  }
  
  componentWillAppear(callback){
    // this is for the case where we go from mobile -> desktop
    // with a provider selected... componentWillEnter doesn't fire,
    // but this does, so we can tween the card up from {opacity:0}
    this.tween('enter', callback)
    callback()
  }
  
  componentWillEnter(callback){
    this.tween('enter', callback)
  }
  
  componentWillLeave(callback){
    this.tween('leave', callback)
  }
  
  render(){
    const {type,content} = this.props;
    const style = {opacity: (this.props.opacity || 0)}
    
    return (<figure className="order-tray__legal-card" style={style}>
      <figcaption data-legal-type={type}>
        {content.map(this.renderParagraph)}
      </figcaption>
    </figure>
    )
  }
  
  renderParagraph(text,i) {
    return (<p key={i}>
      {text}
    </p>
    )
  }
  
  // note: we don't currently fade legal cards out,
  // but if we ever want to, passing mode of 'leave' should suffice
  tween(mode,callback){
    const isEnter  = mode == 'enter'
    const duration = isEnter ? Settings.legal_fade_up_duration : Settings.legal_fade_down_duration;
    const delay    = isEnter ? Settings.legal_delay : 0

    fromTo(
      this.el,
      duration,
      {
        opacity : (isEnter ? 0 : 1)
      },{
        opacity : (isEnter ? 1 : 0), 
        delay, 
        ease    : Settings.ease, 
        onComplete: () => {
          if(!!callback) callback()
        }
      }
    )
  }
}

export default LegalCard