import { connect } from 'react-redux'
import { WithVariations } from './VariationContainer'
import { activateVariation } from '../redux/variations'
import { toggleProviderExpanded } from '../redux/providers'
import { setDetailsHeight } from '../redux/details'
import Details from '../components/Details'
import * as DISPLAY from '../redux/display'

const mapStateToProps = (state, ownProps) => {
  const { isMobile,isDesktop } = state.environment
  const { display } = state
  return {
    expandedHeight : state.details[ownProps.id],
    isMobile,
    isDesktop,
    display
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setDetailsHeight: (id, height) => {
      dispatch(setDetailsHeight({
        id,height
      }))
    },
    
    toggleProviderExpanded: (id) => {
      dispatch(toggleProviderExpanded({
        id
      }))
    },
  }
}

export default connect(
  WithVariations.mapStateToProps(mapStateToProps),
  mapDispatchToProps
)(Details)

