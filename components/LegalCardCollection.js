import React, { Component, cloneElement, isValidElement } from 'react';
import cn from 'classnames';
import TransitionGroup from 'react-transition-group/TransitionGroup'; 
import $ from 'jquery'
import LegalCard from '../components/LegalCard'

const WRAPPER_CLASS = 'order-tray__legal-card-collection'

class LegalCardCollection extends Component {

  static get className(){ 
    return WRAPPER_CLASS 
  }
  
  render(){
    const {
      isMobile,
      legal,
      animate
    } = this.props;
    
    // check for animate={false} option
    const disableAnimation = (animate !== undefined && !animate)

    if(isMobile) {
      return this.renderLegal(legal)
    } else if (disableAnimation){
      return this.renderLegal(legal)
    } else {
      return this.renderLegalWithMotion(legal)
    }
  }
  
  renderLegalWithMotion(legal){ 
    return (<TransitionGroup component='div' className={LegalCardCollection.className}>
      {legal.map((card,i) => {
        return this.renderCard(card,i)
      })}
    </TransitionGroup>)  
  }
  
  renderLegal(legal){ 
    return (<div className={LegalCardCollection.className}>
      {legal.map((card,i) => {
        return this.renderCard(card,i,{opacity:1})
      })}
    </div>)  
  }
  
  renderCard(card,idx,style={}){
    return <LegalCard key={idx} {...card} {...style}/>
  }  
}

export default LegalCardCollection