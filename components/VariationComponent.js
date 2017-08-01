export const WithVariations = (Target) =>  {
  return class extends Target {
    
    componentWillMount(){
      const {setVariationListeners} = this.props;
      if(super.componentWillMount) super.componentWillMount()
      setVariationListeners(this.onVariationDetected.bind(this))
    }
    
    onVariationDetected(e={}, data={}){
      if(super.onVariationDetected) super.onVariationDetected(data)
    }
    
    isVariationActive(variationName){
      return this.props.isVariationActive(variationName);
    }
    
    whenVariationActive(variationName, isActive, notActive){
      if(this.isVariationActive(variationName)){
        return isActive
      } else {
        return notActive || null;
      }
    }
  }
}