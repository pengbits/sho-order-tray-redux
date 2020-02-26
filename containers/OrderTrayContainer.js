import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import enquire from 'enquire.js'
import { IS_MOBILE_MEDIA_QUERY, environmentChanged } from '../redux/environment' 
import { WithVariations } from './VariationContainer'
import { unselectAllProviders } from '../redux/providers'
import { destroy } from '../redux/app'
import WithChameleonSupport from './OrderTrayWithChameleonContainer'
import OrderTre from '../components/OrderTray'

const mapStateToProps = (state, ownProps) => {
  const {environment,app,display} = state;
  const {isMobile,isDesktop} = environment;

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
    legal,
    useColumns,
    loading
  } = state.providers
  
  return {
    appStatus: app.status,
    isMobile,
    isDesktop,
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
    display,
    useColumns,
    loading
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
    
    setDocumentAttributes(attrs){
      console.log(`setDocumentAttributes ${JSON.stringify(attrs)}`)
    },
    
    destroy: () => {
      dispatch(destroy())
    },

    collapse: () => {
      dispatch(push('')) // this calls unselectAllProviders indirectly
    },

    unselectAllProviders: () => {
      dispatch(unselectAllProviders())
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
