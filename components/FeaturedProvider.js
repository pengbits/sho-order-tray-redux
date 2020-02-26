import React, {Component} from 'React';
import {Details} from './Details'; // bypass container and ExpandableCollapsible mix-in
import DetailsToggle from './DetailsToggle';
import cn from 'classnames'
export class FeaturedProvider extends Component {

  render () {
    const {
      context,
      id,
      groupId,
      isExpanding,
      isExpanded,
      isSelected,
      priceCallout,
      isTVProvider,
      isSmartTVProvider,
      devicesBlurbHeadline,
      devicesBlurb,
      priceBlurbHeadline,
      priceBlurb,
      hasDevicesList,
      description,
      subCopy,
      icon,
      providerLeadUrl,
      providerLeadText
    } = this.props

    // in this context, isMobile has less to do with the environment/breakpoint,
    // and more to to do with where the component was mounted, since there are two versions:
    // one is rendered into the sidebar for desktop, and one is added to the order-tray__body container, for mobile
    // however, only one instance is made visible in the css layer
    const isMobile = context !== 'sidebar'

    return <div
      data-provider-id={id}
      data-provider-group-id={groupId}
      data-context="provider card"
      data-position="0"
      className={cn(
        'order-card--selected', // provides some needed styles to details
        'order-tray__provider-callout',
      { 'order-tray__provider-callout--expanded' : isExpanded },
      { 'order-tray__provider-callout--mobile'   : isMobile   },
      { 'order-tray__provider-callout--desktop'  : !isMobile  },
      { 'order-tray__provider-callout--selected' : isSelected }
    )}>

      <h3 className="order-tray__provider-callout__headline">
        {icon && <img className="order-tray__provider-callout__icon" src={icon} />}
        Get Showtime Now
      </h3>
      <p className="order-tray__provider-callout__subcopy"
         dangerouslySetInnerHTML={{ __html: subCopy }}>
      </p>
      <p className="order-tray__provider-callout__description">{description}</p>
      {this.renderBigButton()}
      <br />
      <DetailsToggle
        id={id}
        text={'Learn More'}
        modifierClassName="order-card__details-toggle--open"
        isExpanded={isExpanded}
        onToggle={this.onToggleClick.bind(this)}>
      </DetailsToggle>
      <div className="order-tray__provider-callout__details"
        style={{'height':isExpanded ? 'auto':'0'}}
      >
        <Details
          id={id}
          name={name}
          isExpanding={isExpanding}
          isExpanded={isExpanded}
          isSelected={isSelected}
          priceCallout={priceCallout}
          isTVProvider={isTVProvider}
          isSmartTVProvider={isSmartTVProvider}
          devicesBlurbHeadline={devicesBlurbHeadline}
          devicesBlurb={devicesBlurb}
          priceBlurbHeadline={priceBlurbHeadline}
          priceBlurb={priceBlurb}
          hasDevicesList={hasDevicesList}
          toggleProviderExpanded={this.toggleProviderExpanded.bind(this)}
          parentSelector='.order-tray__provider-callout'
        />
      </div>
    </div>
  }

  renderBigButton(){
    const {
      id,
      providerLeadUrl,
      providerLeadText,
      context
    } = this.props

    // in mobile context, the button is a provider-lead
    // in desktop, the callout is in the sidebar, you are just selecting the provider
    const buttonAttrs = context == 'sidebar' ? {
      onClick   : this.onSelectProvider.bind(this),
    } : {
      'data-track' : '',
      'data-label' : 'provider lead',
      'data-provider-id' : id
    }

    return (<a {...buttonAttrs}
      className="order-tray__provider-callout__provider-lead"
      href={providerLeadUrl}>{providerLeadText}
    </a>)
  }

  onSelectProvider(e){
    e.preventDefault()

    const {
      toggleProviderGroupSelected,
      id
    } = this.props

    toggleProviderGroupSelected(id)
  }

  // called by toggle above
  onToggleClick(e) {
    e.preventDefault()
    this.toggleProviderExpanded(this.props.id)
  }

  // called by nested Details component, which handles its own event bubbling
  toggleProviderExpanded(id){
    this.props.toggleProviderExpanded(id)
  }


}

export default FeaturedProvider
