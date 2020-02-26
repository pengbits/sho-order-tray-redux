import $ from 'jquery'; 
import {fromTo,set} from 'gsap';
import EasePack from  'gsap';
import Settings from '../settings'

export const render = (card=null) => {
  // const el = $('<div class="animation-shim" style="background-color:purple" />')
  const el = $('<div class="animation-shim" />')
  if(card) {
    // console.log(`shim#render->insertAfter ${card ? card.data('provider-id') : 'unknown' }`)
    el.insertAfter(card)
  }
  return el
}

// AnimationShim#tweenShim
// Animate the shim to an appropriate height
export const tween = (mode, onComplete) => {
  // slight delay so getCardsCombinedHeight is accurate for groups..
  setTimeout(() => {

    const isEnter = mode == 'enter'
    const el      = $('.animation-shim');
    const height  = getCardsCombinedHeight()

    fromTo(
      el,
      Settings.shim_animation_duration,
      {height:(isEnter ? 0 : height)},
      {height:(isEnter ? height : 0), ease:Power4.easeOut, onComplete: (()=>{
        el.remove()
        if(onComplete) onComplete(mode)
      })}
    )
  }, 0)
}

// not sure relying on classnames to distinguish the newly selected cards
// from the rest of stack still makes sense here, isn't this information available in reducer?
export const getCardsCombinedHeight = () => {
  const cards = $('.order-card--is-fading').toArray()
  const height =  cards.reduce((height, el) => {
      return height + $(el).outerHeight(true)
    },
    0
  )
  // console.log(`getCardsCombinedHeight: ${cards.length} cards = ${height}px height`)
  return height
}
