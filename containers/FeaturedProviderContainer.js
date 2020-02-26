import { connect } from 'react-redux'
import { 
  toggleProviderGroupSelected, 
  toggleProviderExpanded,
  lockSelection 
} from '../redux/providers'
import FeaturedProvider from '../components/FeaturedProvider'
//import * as DISPLAY from '../redux/display'

const mapStateToProps = (state, ownProps) => {
  const variationData = state.variations['featured-provider-2']
  
  if(variationData && variationData.featuredProvider){
    const provider =  variationData.featuredProvider
    const inList = ((list, id) => (list || []).indexOf(id) > -1);
    const {id}   = provider
    
    return {
      ...provider,
      id,
      isSelected : inList(state.providers.selected, id),
      isExpanded : inList(state.providers.expanded, id)
    }
  } else {
    return {}
  }
}



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleProviderGroupSelected: (id) => {
      dispatch(toggleProviderGroupSelected({
        id
      }))
      dispatch(lockSelection())
    },
    
    toggleProviderExpanded: (id) => {
      dispatch(toggleProviderExpanded({
        id
      }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeaturedProvider)

