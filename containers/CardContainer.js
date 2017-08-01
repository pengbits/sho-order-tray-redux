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
    isSelected  : inList(state.providers.selected,  ownProps.id),
    isExpanded  : inList(state.providers.expanded,  ownProps.id),
    isExpanding : inList(state.providers.expanding, ownProps.id),
    isMobile    : state.environment.isMobile
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

