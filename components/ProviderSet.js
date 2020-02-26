import React, { Component } from 'react'
import ProviderSetEntry from '../containers/ProviderSetEntryContainer'

class ProviderSet extends Component {
  
  render() {  
    const { providers } = this.props;
    const { length } = providers;

    return (
      <div className="order-card__provider-set">
        {providers.map((p,idx) => <ProviderSetEntry 
          key={`entry-${p.id}`}
          includeDivider={idx !== length-1}
          {...p} 
        />)}
      </div>
    )
  }

}

export default ProviderSet