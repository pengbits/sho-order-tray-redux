import { connect } from 'react-redux'
import connectWithTransitionGroup from './ConnectWithTransitionGroup';
import { WithVariations } from './VariationContainer'
import { activateVariation } from '../redux/variations'
import LegalCardCollection from '../components/LegalCardCollection';

const mapStateToProps = (state, ownProps, variationState) => {
  const {legal}    = state.providers
  const {isMobile} = state.environment

  return {
    legal,
    isMobile
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connectWithTransitionGroup(connect(
  WithVariations.mapStateToProps(mapStateToProps),
  mapDispatchToProps,
  null, 
  {withRef: true} // must pass this for react-transition-group to work
)(LegalCardCollection))