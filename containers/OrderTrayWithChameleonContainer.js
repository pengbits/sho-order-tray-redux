import { connect } from 'react-redux'
import * as DISPLAY from '../redux/display'

const WithChameleonSupport = {
  mapStateToProps : (mapper) => {
    return (state, ownProps) => {
      // previously we injected some custom flags that were meant to 
      // convey both a display state and an environment state, for example:
      // {'isChameleon':(state.environment.isDesktop && state.display == CHAMELEON)}
      // but they weren't useable in all cases, and it was confusing
      // having two different ways to store this information...
      const {hasTouchEvents} = state.environment
      const attrs = mapper(state, ownProps)
      return {...attrs, hasTouchEvents}
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