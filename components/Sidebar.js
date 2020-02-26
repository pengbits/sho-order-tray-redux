import React, { Component } from 'react'
import Picker from '../containers/PickerContainer';
import Headline from '../containers/HeadlineContainer'
import {WithVariations} from './VariationComponent'
import FeaturedProvider from '../containers/FeaturedProviderContainer'
import cn from 'classnames'

export class Sidebar extends Component {
  render (){
    return (
      <nav className={cn(
          'order-tray__sidebar',
        { 'order-tray__sidebar--direct-prioritized' : this.isVariationActive('featured-provider-2') }
      )}>
        {this.isVariationActive('featured-provider-2') ? 
          <FeaturedProvider context='sidebar' /> : null
        }
        <h3 className="order-tray__sidebar-headline">
          <Headline />
        </h3>
        <Picker />   
      </nav>
    )
  }
}

export default WithVariations(Sidebar)