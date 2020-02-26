import React, { Component } from 'react'
import cn from 'classnames';
import $ from 'jquery';
import {reduce} from 'lodash';
import {findDOMNode} from 'react-dom';
import {fromTo,set} from 'gsap';
import EasePack from  'gsap';
import {WithVariations} from './VariationComponent'
import Logo from './Logo';
import CardHeadline from './CardHeadline';
import FreeTrialCallout from './FreeTrialCallout';
import CardBody from '../containers/CardBodyContainer';
import ProviderSet from './ProviderSet';
import PartnerLogos from './PartnerLogos';
import Details from '../containers/DetailsContainer';
import DetailsToggle from './DetailsToggle';
import Price from './Price';
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
    if(this.props.isDesktop) {
      // capture top offset, w/ slight delay so body-content has accurate padding-top
      setTimeout(this.setTop.bind(this), 0)
    }
  }

  componentWillAppear(callback){
    // just need this so componentWillLeave fires consistently...
    callback()
  }

  componentWillUpdate(nextProps, nextState) {
    // top may not be undefined, but it can still be wrong if other
    // providers have been added to stack .. or if we have scrolled down?
    // console.log(`card#cwu ${Object.keys(nextProps).join(',')}`)
    // if(this.state.top == undefined && nextProps.top == undefined) {
    //   console.log('willUpdate:refresh state.top')
    //   this.setTop()
    // }
  }

  componentWillEnter(callback){
    const {fireEvents,parent} = this.props;
    // set opacity to 0, position:absolute to mask the card until we're ready to animate,
    // since tween is delayed w/ setTimeout below...
    this.el.css({'opacity':0,'position':'absolute'}).addClass('order-card--is-fading');

    if(fireEvents) parent.resetBodyContent()
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
      this.fade(mode, callback)
      if(fireEvents) parent.tweenShim(mode, groupSize)
    },0)
  }

  render(){
    const {
      id,
      groupId,
      position,
      isSelected,
      isFirst,
      isLast,
      isTVProvider,
      children,
      providerLeadUrl
    } = this.props;

    const {isFading}  = this.state
    const hasChildren = (children || []).length
    
    return (
      <figure className={cn(
        'order-card',
       {'order-card--selected' : isSelected },
       {'order-card--first'    : isFirst    },
       {'order-card--last'     : isLast     },
       {'order-card--is-fading': isFading   },
       {'order-card--with-provider-set' : hasChildren },
       {'order-card--no-provider-lead' : !providerLeadUrl }
      )}
        data-provider-id={id}
        data-provider-group-id={groupId}
        data-context="provider card"
        data-position={position}
      >
        <figcaption className="order-card__inner">
          {this.renderCardHeader()}
          {hasChildren && !isTVProvider ? this.renderChildren() : this.renderCardContent()}
        </figcaption>
      </figure>
    )
  }

  renderCardHeader(){
    const {
      id,
      name,
      isSelected,
      isMobile,
      freeTrial,
      headline
    } = this.props

    return (
    <div>
      <Logo
        path={`https://downloads.sho.com/images/order/tray/provider-logos/${id}.png`}
        name={name}
        isSelected={isSelected}
        onClick={this.toggleProviderProperty.bind(this, 'toggleProviderSelected')}
        isMobile={isMobile}
      />

      <FreeTrialCallout
        text={freeTrial}
      />

      <CardHeadline
        text={headline}>
      </CardHeadline>
    </div>
    )
  }

  renderChildren(){
    return <ProviderSet providers={this.props.children} />
  }

  renderCardContent(){
    const {
      id,
      name,
      children,
      providerLeadUrl,
      providerLeadText,
      description,
      isTVProvider,
      isSmartTVProvider,
      tvProvidersAlpha,
      tvProvidersFeatured,
      isExpanding,
      isExpanded,
      isSelected,
      freeTrial,
      priceCallout,
      devicesBlurbHeadline,
      devicesBlurb,
      priceBlurbHeadline,
      priceBlurb,
      isMobile,
      hasDeviceIcons,
      hasDevicesList
    } = this.props;

    // const renderDetails = !isTVProvider || isSmartTVProvider
    // const renderBody    = 
    // if not tv provider, draw card body + details
    // if not tv provider, with children, this is not executed at all
    // if tv provider, 
    return (<div>

      <CardBody
        providerLeadUrl={providerLeadUrl}
        providerLeadText={providerLeadText}
        id={id}
        description={description}
        isTVProvider={isTVProvider}
        isSmartTVProvider={isSmartTVProvider}
        hasDeviceIcons={hasDeviceIcons}
        freeTrial={freeTrial}
        priceCallout={priceCallout}
        priceBlurb={priceBlurb}
        priceBlurbHeadline={priceBlurbHeadline}
      />
      
      {isTVProvider? 
        <PartnerLogos providers={tvProvidersFeatured} /> : null}

      <div>
        <DetailsToggle
          id={id}
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
          priceBlurbHeadline={priceBlurbHeadline}
          priceBlurb={priceBlurb}
          hasDevicesList={hasDevicesList}
          isMobile={isMobile}
          collection={this.props.parent}
          tvProvidersAlpha={tvProvidersAlpha}>
        </Details>
      </div>
    </div>)
  }

  // Card#fade
  // Animate the fade up or fade down in response to the mount/unmount events provided by transition-group in CardCollection
  fade(mode, callback){
    const isEnter = mode == 'enter'

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
        opacity : (isEnter ? 0 : 1), // keep translucent while debugging shim
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
    const {position,id} = this.props;

    // since the card is absolutely positioned while fading in and out,
    // it'll need it's top adjusted by the height of any cards above it in the stack,
    // and by the height of any preceding gtoup members, if it's part of a group.
    let top = Number($('.order-tray__body-content').css('padding-top').replace('px',''))

    const precedingCards = this.el.prevAll('.order-card');

    // build up the offset by capturing height of each preceding card..
    top += reduce(precedingCards, (totalHeight, el) => {
      return totalHeight + $(el).outerHeight(true)
    }, 0);

    this.setState({top})
    return top
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
