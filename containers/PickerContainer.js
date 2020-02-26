import { connect } from 'react-redux'
import { range } from 'lodash'
import { WithVariations } from './VariationContainer'
import { activateVariation } from '../redux/variations'
import { 
  toggleAllProvidersSelected, 
  toggleProviderGroupSelected, 
  setSelectedProviderGroups, 
  lockSelection 
} from '../redux/providers'
import { destroy } from '../redux/app'
import Picker from '../components/Picker'
import * as DISPLAY from '../redux/display'


const mapStateToProps = (state, ownProps) => {
  const {
    selected,
    providers,
    grouped,
    selectAllToggleText,
    useColumns
  } = state.providers;
  
  const isOverlay = state.display && state.display == DISPLAY.MODES.OVERLAY
  
  const {
    isMobile,
    isDesktop
  } = state.environment;
  
  return {
    selected,
    providers,
    grouped,
    groupedInColumns: inColumns(grouped),
    selectAllToggleText,
    isOverlay,
    isMobile,
    isDesktop,
    useColumns,
    variations: state.variations || {}
  }
}

const inColumns = (providers) => {
  const numCols     = 2;         
  const itemsInList = Math.ceil(providers.length / numCols)
  
  return range(numCols).map(function(i){
    return providers.slice(i * itemsInList, (i+1) * itemsInList)
  })
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleProviderGroupSelected: (id) => {
      dispatch(toggleProviderGroupSelected({
        'id': id
      }))
      dispatch(lockSelection())
    },
    
    setSelectedProviderGroups: (selected) => {
      dispatch(setSelectedProviderGroups(selected))
      dispatch(lockSelection())
    },

    toggleAllProvidersSelected: () => {
      dispatch(toggleAllProvidersSelected())
      dispatch(lockSelection())
    },
    
    destroy:() => {
      dispatch(destroy())
    }
    
  }
}

export default connect(
  WithVariations.mapStateToProps(mapStateToProps),
  WithVariations.mapDispatchToProps(mapDispatchToProps)
)(Picker)

