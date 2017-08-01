import $ from 'jquery'; 
import {fromTo,set} from 'gsap';
import EasePack from  'gsap';
import Settings from '../settings'

export const render = (card=null) => {
  //const el = $('<div class="animation-shim" style="background-color:purple" />')
  const el = $('<div class="animation-shim" />')
  if(card) el.insertAfter(card)
  return el
}

// AnimationShim#tweenShim
// Animate the shim to an appropriate height
// todo note that there could be more than 1 card tweening ie amazon, 
// but there is only one shim el in dom
// we don't want to double the effect in that case!
export const tween = (mode, onComplete) => {
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
}

// not sure relying on classnames to distinguish the newly selected cards
// from the rest of stack still makes sense here, isn't this information available in reducer?
export const getCardsCombinedHeight = () => {
  return $('.order-card--is-fading').toArray()
    .reduce((height, el) => {
      return height + $(el).outerHeight(true)
    },
    0
  )
}
