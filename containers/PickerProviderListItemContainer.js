import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import { WithVariations } from './VariationContainer'
import { activateVariation } from '../redux/variations'
import PickerProviderListItem from '../components/PickerProviderListItem';

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => dispatch

export default connect(
  WithVariations.mapStateToProps(mapStateToProps),
  WithVariations.mapDispatchToProps(mapDispatchToProps)
)(PickerProviderListItem)

