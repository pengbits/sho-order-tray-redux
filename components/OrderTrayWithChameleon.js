// a hoc for rolling the support for chameleon mode aka in-page order tray
import React, { Component } from 'react';
import $ from 'jquery';
import {findDOMNode} from 'react-dom';
import {throttle} from 'underscore';
import * as DISPLAY from '../redux/display';
import Settings from '../settings'
import ScrollbarDimensions from '../../measure-scrollbars';
// import {fromTo,set} from 'gsap';
// import EasePack from  'gsap';
// import Settings from '../settings';
const emptyFunction = () => {}

const WithChameleonSupport = (Tray) =>  {
  return class extends Tray {
    constructor(props){
      super(props)
      this.state = this.state || {}
    }
    
    componentWillMount(){
      super.componentWillMount()
      this.setDisplayMode()
      this.saveDocumentPadding()
    }
    
    setDisplayMode(){
      const {setDisplayMode} = this.props
      const el = $('.order-tray'); if(!el) return
      
      for(const k in DISPLAY.MODIFIERS){
        if(el.hasClass(DISPLAY.MODIFIERS[k])){
          const display = DISPLAY.MODES[k]
          setDisplayMode(display)
          break;
        }
      }
    }
    
    
    // generate some events around changes to display and selected providers,
    // since react/redux doesn't really work that way...
    componentWillUpdate(nextProps, prevState) {
      if(!this.props.display && nextProps.display){
        setTimeout(this.onDisplayReady.bind(this), 0,)
      }
      
      if(this.props.selected.length !== nextProps.selected.length){
        this.onSelectionWillChange(nextProps)
      }
      
      (super.componentWillUpdate || emptyFunction).call(this, nextProps, prevState)
    }
    
    componentDidUpdate(prevProps, prevState) {
      if(prevProps.isMobile !== undefined && 
         prevProps.isMobile !== this.props.isMobile)
      {
       this.onEnvironmentChanged()
      }
    }
    
    onDisplayReady(){
      const {display,isOverlay,isChameleon,hasTouchEvents} = this.props
      // console.log(`onDisplayReady ${JSON.stringify({display,isChameleon})}`)
      // note use of isOverlay,isChameleon flags below, rather than this.props.display,
      // this is to enforce the rule where only desktop can be treated as overlay or chameleon
      if(isOverlay){
        this.toggleTrayIsActiveClass(true)
      }
      
      if(isChameleon){
        const scrollHandler = this.onPageScroll.bind(this);
        $(document).on('scroll', scrollHandler);
        $(window).on('resize',   scrollHandler);
        setTimeout(scrollHandler, 0)
        
        const sbHandler = throttle(this.adjustSidebarWidth.bind(this), 125)
        $(window).on('resize', sbHandler)
        setTimeout(sbHandler, 0) 
      }
    }
    
    
    onSelectionWillChange({selected, isChameleon, hasTouchEvents}){
      if(isChameleon){
        this.stageWipe(selected.length)
      }
    }
    
    onEnvironmentChanged(){
      const {isMobile,isDesktop,hasTouchEvents,display} = this.props;
      // console.log(`chameleon.onEnvironmentChanged ${JSON.stringify({isMobile,isDesktop,display})}`)
      
      switch (display) {
        case DISPLAY.MODES.CHAMELEON:
          if(isDesktop){
            // console.log('was mobile, time for a stageWipe' )
            this.stageWipe(this.props.selected.length)
            this.toggleTrayIsActiveClass(false)
          } else {
            // console.log('was desktop, now mobile, remove harmful styles from stage')
            this.removeChameleonStyles()
          }
          break;
          
        case DISPLAY.MODES.OVERLAY:
          if(isDesktop){
            // console.log(`toggleTrayIsActiveClass true`)
            this.toggleTrayIsActiveClass(true)
          } else {
            // console.log(`toggleTrayIsActiveClass true`)
            this.toggleTrayIsActiveClass(false)    
          }
          break;  
      }      

      (super.onEnvironmentChanged || emptyFunction).call(this)
    }  
    
    
    stageWipe(isOpen){
      const attrs = isOpen ? {
        'right'  : 0, 
        'bottom' : 0,
        'isOpen' : true
      } : {
        'right'  : '75%',
        'bottom' : 'auto',
        'isOpen' : false
      };
      
      if(this.props.hasTouchEvents && isOpen){
        this.saveLastPageScroll()
      }
      
      const delay = (isOpen ? Settings.wipe_open_delay : Settings.wipe_closed_delay) * 1000
      setTimeout(this.onStageWipeComplete.bind(this, attrs), delay)
    }
    
    onStageWipeComplete(attrs){
      const {isOpen,right,bottom} = attrs;
      const {hasTouchEvents} = this.props;
      
      $('.order-tray')
        .css({right,bottom})
        .toggleClass('order-tray--stage-open', isOpen)
      
      if(isOpen){
        this.setDocumentPaddingToScrollbarsWidth()
        this.toggleTrayIsActiveClass(true)
        hasTouchEvents && this.toggleDocumentIsPinned(isOpen)
      } else {
        this.restoreDocumentPadding()
        this.toggleTrayIsActiveClass(false)
        hasTouchEvents && this.restorePageScrollTop()
      }
    }
    
    removeChameleonStyles(){
      this.onStageWipeComplete({right:'',bottom:'',isOpen:false})
    }
    
    // 'breakpoints' :   {'large' : 992, 'medium-tall' : 650},
    onPageScroll(){
      const sidebar   = $('.order-tray__sidebar'),
      scroll          = $(document).scrollTop(),
      footer          = $('.footer'),
      winHeight       = $(window).height(),
      isMediumTall    = winHeight < 649,
      topslice        = isMediumTall ? 80 : 100,
      footerMargin    = 100,
      maxScroll       = $(document).height() - (footer.height() + sidebar.height() + topslice + footerMargin)
      ;
      let top, 
      collision
      ;
      
      if(scroll > maxScroll){
        collision = Math.abs(scroll - maxScroll);
        top = 0 - collision;
      } else {
        top = 0;
      }

      sidebar.css({'top':top + topslice});
      $('body').toggleClass('order-tray-footer-collision', !!collision)      
    }
    
    // view#adjustSidebarWidth
    // workaround for the slight shift in sidebar width that accompanies the opening of the stage in chameleon mode
    // this shift stems from a change in the underlying document's visible width, 
    // when `overflow:hidden` is applied to the `html` element via `overlay-is-active`, and scrollbars are removed,
    // the viewable area is interpreted as slightly larger by the browser. 
    // this combined with the sidebar's `position:fixed` and `right:75%` rules, result in a pop as the sidebar widens slightly
    // this is called when the stage is closed, ie, at startup or when no providers are selected,
    // to compress the sidebar by +- 4px (25% * width of scrollbars) to reduce the effect
    adjustSidebarWidth(){
      if(this.props.selected.length) return
        
      let el           = $('.order-tray__sidebar').css('width','auto');   // unset previous writes
      let sidebarWidth = Number((el.css('width')||'').replace('px',''));  // can't use jQuery's el.width() here
      let scrollWidth  = ScrollbarDimensions.instance().width();
      let nudge        = scrollWidth * Settings.sidebar_percent_of_stage;
      let adjusted     = sidebarWidth + nudge;
      
      //console.log(`view#adjustSidebarWidth before ${sidebarWidth} -> ${adjusted}`);
      el.css({'width':adjusted}); 
      // setTimeout((sidebar) => { 
      //   console.log(`view#adjustSidebarWidth after ${sidebar.css('width')}`) 
      // }, 125, el)
    }
    
    toggleTrayIsActiveClass(isActive){
      const {hasTouchEvents} = this.props;
      // console.log(`toggleTrayIsActiveClass(isActive=${isActive}, hasTouchEvents=${hasTouchEvents})`)
      $('html').toggleClass('order-tray-active', isActive);
      hasTouchEvents && $('html').toggleClass('order-tray-active--has-touch-events', isActive);
    }
    
    // view#toggleDocumentIsPinned
    // make the {position:fixed,width:100%} workaround less jarring by preserving the document scroll while it's applied
    toggleDocumentIsPinned(isPinned){
      let offset = isPinned ? `-${this.getLastPageScroll()}px` : '';
      // console.log(`toggleDocumentIsPinned ${isPinned} ${offset}`)
      $('html').css('top', offset);
    }
    
    setDocumentPaddingToScrollbarsWidth(){
      const width = ScrollbarDimensions.instance().width();
      this.setDocumentPadding(width);
    }
    
    setDocumentPadding(width){
      $('html').css('padding-right', width);
    }
    
    saveDocumentPadding(){
      // capture the original padding-right on html element since it will be overriden with width of scrollbars
      // if this is ever set to anything other than 0 it'll break the tray's handling, but playing safe regardless
      const prop  = 'paddingRight'
      const attrs = {}; attrs[prop] = $('html').css(prop);
      this.setState(attrs)
    }
    
    restoreDocumentPadding(){
      this.setDocumentPadding(this.state.paddingRight);
    }
    
    
    // store the scrollTop of the underlying document
    saveLastPageScroll(){
      const scrollTop = $(document).scrollTop()
      this.setState({scrollTop})
    }
    
    getLastPageScroll(){
      return this.state.scrollTop || 0
    }
    
    restorePageScrollTop(offset = 0){
      const scrollTop = this.getLastPageScroll() + offset;
      $(document).scrollTop(scrollTop)
    }
    
    
  }
}

export default WithChameleonSupport