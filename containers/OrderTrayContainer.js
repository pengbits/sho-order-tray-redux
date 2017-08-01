import { connect } from 'react-redux'
import enquire from 'enquire.js'
import { IS_MOBILE_MEDIA_QUERY, environmentChanged } from '../redux/environment' 
import { WithVariations } from './VariationContainer'
import { loadProviders } from '../redux/providers'
import { destroy} from '../redux/app'
import WithChameleonSupport from './OrderTrayWithChameleonContainer'
import OrderTre from '../components/OrderTray'

const mapStateToProps = (state, ownProps) => {
  const {environment,app,display} = state;
  const {
    providers,
    selected,
    isUnselectingIndex,
    fading,
    expanded,
    expanding,
    grouped,
    groupSizes,
    displayOrder,
    sortedProviders,
    legal
  } = state.providers
  const headlineText = 'How do you want to get Showtime?'
  
  return {
    appStatus: app.status,
    isMobile: environment.isMobile,
    isDesktop: environment.isDesktop,
    headlineText,
    providers,
    selected,
    isUnselectingIndex,
    fading,
    expanded,
    expanding,
    grouped,
    displayOrder,
    sortedProviders,
    legal,
    display
  }  
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const mobileDetected  = environmentChanged.bind(this, {isMobile: true})
  const desktopDetected = environmentChanged.bind(this, {isMobile: false})
  return {
    setEnvironmentListeners: () => {
      enquire.register(IS_MOBILE_MEDIA_QUERY, {
        match:   () => {
          dispatch(mobileDetected())
        },
        unmatch: () => {
          dispatch(desktopDetected())
        },
        setup: () => {
          dispatch(desktopDetected())
        }
      })
    },
    
    setVariationListeners(){
      
    },
    
    setDocumentAttributes(attrs){
      console.log(`setDocumentAttributes ${JSON.stringify(attrs)}`)
    },
    
    loadProviders: (data) => {
      dispatch(loadProviders(data))
    },
    
    destroy: () => {
      dispatch(destroy())
    }
    
  }
}

const OrderTreContainer = connect(
  WithChameleonSupport.mapStateToProps(
    WithVariations.mapStateToProps(
      mapStateToProps
    )
  )
,
  WithChameleonSupport.mapDispatchToProps(
    WithVariations.mapDispatchToProps(
      mapDispatchToProps
    )
  )
)(OrderTre)

export default OrderTreContainer
