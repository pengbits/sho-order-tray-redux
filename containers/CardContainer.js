import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import connectWithTransitionGroup from './ConnectWithTransitionGroup';
import { WithVariations } from './VariationContainer'
import { activateVariation } from '../redux/variations'
import { toggleProviderExpanded, toggleProviderSelected } from '../redux/providers'
import Card from '../components/Card'

const mapStateToProps = (state, ownProps, variationState) => {
  const inList = ((list, id) => list.indexOf(id) > -1);
  return {
    isSelected          : inList(state.providers.selected,  ownProps.id),
    isExpanded          : inList(state.providers.expanded,  ownProps.id),
    isExpanding         : inList(state.providers.expanding, ownProps.id),
    isDesktop           : state.environment.isDesktop,
    isMobile            : state.environment.isMobile,
    tvProvidersAlpha    : ownProps.isTVProvider      ? state.providers.tvProvidersAlpha    : undefined,
    tvProvidersFeatured : ownProps.isTVProvider      ? state.providers.tvProvidersFeatured : undefined,
    tvProvidersSmartTVs : ownProps.isSmartTVProvider ? state.providers.tvProvidersSmartTVs : undefined 
    // this last one is not a real use case, smart-tvs are drawn into additional choices w/ ProviderSetEntry...
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {

  return {
    toggleProviderExpanded: (id) => {
      dispatch(toggleProviderExpanded({
        id
      }))
    },
    
    toggleProviderSelected: (id) => {
      dispatch(toggleProviderSelected({
        id
      }))
    }
  }
}

export default connectWithTransitionGroup(connect(
  WithVariations.mapStateToProps(mapStateToProps),
  WithVariations.mapDispatchToProps(mapDispatchToProps),
  null, 
  {withRef: true} // must pass this for react-transition-group to work
)(Card))

