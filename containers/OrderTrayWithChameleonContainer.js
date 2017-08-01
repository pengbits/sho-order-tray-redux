import { connect } from 'react-redux'
import * as DISPLAY from '../redux/display'

const WithChameleonSupport = {
  mapStateToProps : (mapper) => {
    return (state, ownProps) => {
      const {display,environment} = state
      const {isDesktop,hasTouchEvents} = environment
      const attrs = mapper(state, ownProps)
            
      return Object.assign({}, attrs, {
        isOverlay   : (isDesktop && display == DISPLAY.MODES.OVERLAY),
        isChameleon : (isDesktop && display == DISPLAY.MODES.CHAMELEON),
        hasTouchEvents
      })
    }
  },
  
  mapDispatchToProps : (mapper) => {
    return (dispatch, ownProps) => {
      const map = mapper(dispatch, ownProps)
      return Object.assign({}, map, {
        setDisplayMode : (display) => {
          dispatch(DISPLAY.setDisplayMode(display))
        }
      })
    }
  }
}

export default WithChameleonSupport 