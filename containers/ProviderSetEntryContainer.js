import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { toggleProviderExpanded } from '../redux/providers'
import { setDetailsHeight } from '../redux/details'
import ProviderSetEntry from '../components/ProviderSetEntry'

const mapStateToProps = (state, ownProps) => {
  const { 
    isMobile,
    isDesktop 
  } = state.environment
  
  const { 
    expandedChildren,
    expandingChildren,
    tvProvidersAlpha,
    tvProvidersFeatured,
    tvProvidersSmartTVs
  } = state.providers
  
  const inList = ((list, id) => list.indexOf(id) > -1);
  
  return {
    isExpanded     : inList(expandedChildren, ownProps.id),
    isExpanding    : inList(expandingChildren, ownProps.id),
    expandedHeight : state.details[ownProps.id],
    isMobile,
    isDesktop,
    tvProvidersAlpha    : ownProps.isTVProvider      ? tvProvidersAlpha    : undefined,
    tvProvidersFeatured : ownProps.isTVProvider      ? tvProvidersFeatured : undefined,
    tvProvidersSmartTVs : ownProps.isSmartTVProvider ? tvProvidersSmartTVs : undefined 
  } // smart tvs are the only tv providers that are drawn into a provider set today, 
    // but we're still wiring up the ..Alpha and ..Featured reducers in case that changes....
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setDetailsHeight: (id, height) => {
      dispatch(setDetailsHeight({
        id,
        height,
        isChild: true
      }))
    },
    
    toggleProviderExpanded: (id) => {
      dispatch(toggleProviderExpanded({
        id,
        isChild: true
      }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProviderSetEntry)

