var Modernizr  = require('browsernizr');
import {createAction} from 'redux-actions'

export const BREAKPOINTS = {'large' : 992};
export const IS_MOBILE_MEDIA_QUERY = `screen and (max-width:${(BREAKPOINTS.large -1)}px)`;

// action constants
export const ENVIRONMENT_READY   = 'ENVIRONMENT_READY'
export const ENVIRONMENT_CHANGED = 'ENVIRONMENT_CHANGED'

// action creators

export const environmentReady   = createAction(ENVIRONMENT_READY)
export const environmentChanged = createAction(ENVIRONMENT_CHANGED)

// reducer
export const environment = (state={}, action={}) => {

  switch (action.type) {
    case ENVIRONMENT_CHANGED:
    case ENVIRONMENT_READY:
      const {isMobile,hasTouchEvents} = action.payload
      return Object.assign({}, {
        isDesktop: !isMobile,
        isMobile,
        hasTouchEvents: (hasTouchEvents || (Modernizr && Modernizr.touchevents))
      })
      
    default:
      return state
  }
}