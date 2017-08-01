import Variations from '../../variations/index';
import { activateVariation } from '../redux/variations'

export const WithVariations = {  
  
  mapStateToProps: (mapper) => {
    return (state, ownProps) => {  
      const map = mapper(state, ownProps);
      return Object.assign({}, map, {
        isVariationActive : ((name) => {
          // console.log(`mixin#isVariationActive? ${name}`);
          return !!state.variations[name]
        })
      })
    }
  },
  
  mapDispatchToProps: (mapper) => {
    return (dispatch, ownProps) => {
      const map = mapper(dispatch, ownProps)
      
      return Object.assign({}, map, {  
        setVariationListeners: (callback) => { 
          // set listener 
          Variations.on('variation:detected:sho', callback);
          // look for any variations already present
          Variations.foundShoVariation() && callback({}, Variations.getVariationMap('sho'));
        },
        
        activateVariation: (variationName, data={}) => { 
          // console.log('mixin#activateVariation')
          dispatch(activateVariation(variationName, data))
        }
      })
    }
  }
}