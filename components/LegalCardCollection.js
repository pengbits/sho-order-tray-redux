import React, { Component, cloneElement, isValidElement } from 'react';
import cn from 'classnames';
import TransitionGroup from 'react-transition-group/TransitionGroup'; 
import $ from 'jquery'
import LegalCard from '../components/LegalCard'


class LegalCardCollection extends Component {
  
  //componentWillUpdate(nextProps, nextState) {
  //}
  
  render(){
    const {
      isMobile,
      legal,
      animate
    } = this.props;
    
    // check for animate={false} option
    const disableAnimation = (animate !== undefined && !animate)
    return this.renderLegal()
    // if(isMobile) {
    // } else if (disableAnimation){
    //   return this.renderLegal()
    // } else {
    //   return this.renderLegalWithMotion()
    // }
  }
  
  // renderLegalWithMotion(){ 
    // return (<div className='order-tray__legal-card-collection'>
      // {this.props.legal.map((card,i) => {
        // return this.renderCard(card,i)
      // })}
    // </div>)  
  // }
  
  renderLegal(){ 
    return (<div className='order-tray__legal-card-collection'>
      {this.props.legal.map((card,i) => {
        return this.renderCard(card,i)
      })}
    </div>)  
  }
  
  renderCard(card,idx,style={}){
    return <LegalCard key={idx} {...card} />
  }  
}

export default LegalCardCollection