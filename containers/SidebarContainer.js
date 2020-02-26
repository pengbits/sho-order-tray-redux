import { connect } from 'react-redux'
import { WithVariations } from './VariationContainer'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(
  WithVariations.mapStateToProps(mapStateToProps),
  WithVariations.mapDispatchToProps(mapDispatchToProps)
)(Sidebar)

