import { connect } from 'react-redux';
import Headline from '../components/Headline';

const mapStateToProps = (state) => {
  const {
    variations,
    environment
  } = state
  
  if(variations && variations['featured-provider']){
    return {'headline' : variations['featured-provider'].headline}
  }
  
  return state.headline
}

export default connect(mapStateToProps)(Headline);