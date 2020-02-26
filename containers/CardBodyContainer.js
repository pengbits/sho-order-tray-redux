import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { WithVariations } from './VariationContainer'
import { activateVariation } from '../redux/variations'
import CardBody from '../components/CardBody'

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => dispatch

export default connect(
  WithVariations.mapStateToProps(mapStateToProps),
  WithVariations.mapDispatchToProps(mapDispatchToProps)
)(CardBody)

