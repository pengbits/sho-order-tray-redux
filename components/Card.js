import React, { Component } from 'react'
import cn from 'classnames';
import $ from 'jquery';
import {reduce} from 'lodash';
import {findDOMNode} from 'react-dom';
import {fromTo,set} from 'gsap';
import EasePack from  'gsap';
import {WithVariations} from './VariationComponent'
import Logo from './Logo';
import Headline from './Headline';
import FreeTrialCallout from './FreeTrialCallout';
import CardBody from './CardBody';
import ProviderSet from './ProviderSet';
import PartnerLogos from './PartnerLogos';
import Details from '../containers/DetailsContainer';
import DetailsToggle from './DetailsToggle';
import ScrollbarDimensions from '../../measure-scrollbars';
import Settings from '../settings'
import * as DISPLAY from '../redux/display'

class Card extends Component { 
  constructor(props){
    super(props)
    this.state = {}
  }
  
  componentDidMount() {
    this.el = $(findDOMNode(this))
    setTimeout(() => {
      this.setTop()
    }, 0) // slight delay so body-content has accurate padding-top
  }
  
  componentWillAppear(callback){
    // just need this so componentWillLeave fires consistently...
    callback()
  }
  
  componentWillUpdate(nextProps, nextState) {
    // top may not be undefined, but it can still be wrong if other 
    // providers have been added to stack
    // if(this.state.top == undefined && nextProps.top == undefined) {
    //   console.log('willUpdate:refresh state.top')
    //   this.setTop()
    // } 
  }
  
  componentWillEnter(callback){
    // set opacity to 0 to mask the card until we're ready to animate,
    // since tween is delayed w/ setTimeout below...
    this.el.css('opacity',0).addClass('order-card--is-fading');
    this.willLeaveOrEnter('enter', callback)
  }
  
  componentWillLeave(callback){
    this.setTop()// refreshing state.top in this manner is problematic when 
    // we deal with fading down grouped providers..
    this.willLeaveOrEnter('leave', callback)
  }
  
  willLeaveOrEnter(mode, callback){
    const {
      parent,
      fireEvents,
      groupSize,
      id
    } = this.props
    // need a slight delay because
    // - we need to allow setTop to populate before fading,
    // - we need to wait for --is-fading classnames to stick before calculating shim height  
    setTimeout(() => {
      // console.log(`${id} ${mode} top:${this.state.top}`)
      this.fade(mode, callback)
      if(fireEvents) parent.shim(mode, groupSize)
    },0) 
  }
  
  render(){
    const {
      isFirst,
      isLast,
      isSelected,
      isExpanded,
      isExpanding,
      isMobile,
      style,
      position,
    } = this.props;
    
    const {
      id,
      name,
      groupId,
      logo,
      freeTrial,
      headline,
      priceCallout,
      description,
      providerLeadUrl,
      providerLeadText,
      isTVProvider,
      isSmartTVProvider,
      devicesBlurb,
      devicesBlurbHeadline,
      hasDevicesList,
      hasDeviceIcons,
      isVariationActive
    } = this.props;
    
    const {isFading} = this.state
    
    return (
      <figure className={cn(
        'order-card',
       {'order-card--selected' : isSelected },
       {'order-card--first'    : isFirst    },
       {'order-card--last'     : isLast     },
       {'order-card--is-fading': isFading   }
      )}  
        data-provider-id={id} 
        data-provider-group-id={groupId} 
        data-context="provider card" 
        data-position={position}
      >
        <figcaption className="order-card__inner">
          <Logo 
            path={`http://downloads.sho.com/images/order/tray/provider-logos/${logo}`} 
            name={name} 
            onTouchTap={this.toggleProviderProperty.bind(this, 'toggleProviderSelected')} 
            isMobile={isMobile}
          />    
          <FreeTrialCallout 
            text={freeTrial}>
          </FreeTrialCallout>
          
          <Headline
            text={headline}>
          </Headline>
          
          {isTVProvider  ? 
            (isSmartTVProvider ? <PartnerLogos.SmartTV /> : <PartnerLogos />) : null}

          {isVariationActive('direct-from-showtime') && (id == 555555) &&
            <ProviderSet />}
            
          <CardBody 
            providerLeadUrl={providerLeadUrl} 
            providerLeadText={providerLeadText}
            description={description} 
            isTVProvider={isTVProvider} 
            isSmartTVProvider={isSmartTVProvider}
            hasDeviceIcons={hasDeviceIcons}
          >
          </CardBody>

          <DetailsToggle 
            text={!isTVProvider || isSmartTVProvider ? 'Learn More' : 'See all Providers'} 
            modifierClassName="order-card__details-toggle--open" 
            isExpanded={isExpanded} 
            onToggle={this.toggleProviderProperty.bind(this, 'toggleProviderExpanded')}
            isMobile={isMobile}>
          </DetailsToggle>
          
          <Details 
            id={id} 
            name={name}
            isExpanding={isExpanding}
            isExpanded={isExpanded} 
            isSelected={isSelected} 
            priceCallout={priceCallout} 
            isTVProvider={isTVProvider}
            isSmartTVProvider={isSmartTVProvider}
            devicesBlurbHeadline={devicesBlurbHeadline} 
            devicesBlurb={devicesBlurb}
            hasDevicesList={hasDevicesList}
            isMobile={isMobile}>
          </Details>
        
        </figcaption>
      </figure>
    )
  }
  
  // Card#fade
  // Animate the fade up or fade down in response to the mount/unmount events provided by transition-group in CardCollection
  fade(mode, callback){ 
    const isEnter = mode == 'enter'
    // console.log(`${this.props.id} fade top=${this.state.top}`)
    this.el.css({
      'position':'absolute',
      'top': this.state.top,
      'width': this.getCardTargetWidth()
    })
    this.setState({isFading : true })
    
    fromTo(
      this.el,
      isEnter ? Settings.card_fade_up_duration : Settings.card_fade_down_duration,
      {
        opacity : (isEnter ? 0 : 1), 
        scale   : (isEnter ? Settings.card_hidden_scale : 1)
      },{
        opacity : (isEnter ? 1 : 0), 
        scale   : (isEnter ? 1 : Settings.card_hidden_scale), 
        ease    : Back.easeOut.config(1.2), 
        onComplete: () => {
          this.el.css({
            'position':'relative',
            'width':'auto',
            'top':'auto'
          });
        
          this.state.isFading = false
          this.el.removeClass('order-card--is-fading')
          callback()
        }
      }
    )
  }
  
  
  // Card#setTop()
  // capture the offset top of the card's container element, 
  // in case there are other cards in the provider group being animated
  setTop(){
    const {position,id,} = this.props;
    
    // get the offset top for first card in the set, 
    // for groups will iterate over preceding cards and collect their heights as well
    
    let top = Number($('.order-tray__body-content').css('padding-top').replace('px',''))
    const precedingCards = this.el.siblings('.order-card').toArray()
      .filter(el => {
        return $(el).data('position') < position
      })
    ;
    // console.log(`${id} setTop => ${precedingCards.length} preceding cards `)
    top += reduce(precedingCards, (totalHeight, el) => {
      return totalHeight + $(el).outerHeight(true)
    }, 0);    
    
    // console.log(`${id} setTop(${top})`)    
    this.setState({top})
  }
  
  getCardTargetWidth(){
    const card  = {'padding':20,'margin':20};
    const outerWidth = $('.order-tray__body-content').width();
    // not using border-box on the cards so we have to account for inner padding
    // as well as the padding on body-content itself which is used instead of margins on the cards:
    const innerWidth = outerWidth - ((card.padding * 2) + (card.margin * 2))
    const scrollTestElement = $('html');
    
    return this.elementIsScrollable(scrollTestElement.get(0)) ? 
      innerWidth - ScrollbarDimensions.instance().width() : 
      innerWidth
  }
  
  // would the element have scrollbars?
  elementIsScrollable(el){ // must be dom element, not jquery set
    return el.scrollHeight > el.clientHeight;
  }

  toggleProviderProperty(methodName, e){
    e.preventDefault()
    
    const el = e.currentTarget;
    const id = $(el).parents('.order-card').data('providerId');
    this.props[methodName].call(this, id)
  }
  
}

export default WithVariations(Card)