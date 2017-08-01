import React, { Component } from 'react'
import {findDOMNode} from 'react-dom';
import {fromTo,set} from 'gsap';
import EasePack from  'gsap';
import Settings from '../settings'

class LegalCard extends Component {
  
  componentDidMount() {
    this.el = $(findDOMNode(this))
    this.tween('enter')
  }
  
  componentDidUpdate(prevProps, prevState) {
    this.tween('enter')
  }
  
  render(){
    const {type,content} = this.props;
    const style = {opacity:0}
    
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
    const duration = mode == 'enter' ? Settings.legal_fade_up_duration : Settings.legal_fade_down_duration;

    fromTo(
      this.el,
      duration,
      {
        opacity : (isEnter ? 0 : 1)
      },{
        opacity : (isEnter ? 1 : 0), 
        delay   : Settings.legal_delay, 
        ease    : Settings.ease, 
        onComplete: () => {
          if(!!callback) callback()
        }
      }
    )
  }
}

export default LegalCard