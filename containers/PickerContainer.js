import { connect } from 'react-redux'
import { WithVariations } from './VariationContainer'
import { activateVariation } from '../redux/variations'
import { toggleAllProvidersSelected, toggleProviderGroupSelected } from '../redux/providers'
import { destroy } from '../redux/app'
import Picker from '../components/Picker'
import * as DISPLAY from '../redux/display'

const mapStateToProps = (state, ownProps, variationState) => {
  const {
    selected,
    providers,
    grouped,
    selectAllToggleText
  } = state.providers;
  
  const isOverlay = state.display && state.display == DISPLAY.MODES.OVERLAY
  
  return {
    selected,
    providers,
    grouped,
    selectAllToggleText,
    isOverlay
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleProviderGroupSelected: (id) => {
      dispatch(toggleProviderGroupSelected({
        'id': id
      }))
    },

    toggleAllProvidersSelected: () => {
      dispatch(toggleAllProvidersSelected())
    },
    
    destroy:() => {
      dispatch(destroy())
    }
    
  }
}

export default connect(
  WithVariations.mapStateToProps(mapStateToProps),
  mapDispatchToProps
)(Picker)

