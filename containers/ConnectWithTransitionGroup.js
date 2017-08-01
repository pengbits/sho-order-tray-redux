// patch special lifecycle methods onto connected component
// https://github.com/esayemm/connect-with-transition-group/blob/master/index.js
// github example is conceptually sound but failing due to reliance on this.refs[methodName]?
const connectWithTransitionGroup = (connect) => {
  [ 'componentWillAppear'
   ,'componentDidAppear'
   ,'componentWillLeave'
   ,'componentDidLeave'
   ,'componentWillEnter'
   ,'componentDidEnter'].forEach(methodName => {
    connect.prototype[methodName] = function(cb){
      
      const instance = this.getWrappedInstance();
      if(instance && instance[methodName]){
        instance[methodName](cb)
      }
      
    }
  })
  return connect
}

export default connectWithTransitionGroup