import * as p   from './redux/providers'
import * as app from './redux/app'
import {ACTIVATE_VARIATION} from './redux/variations'
import $ from 'jquery'

// create a store enhancer that will give us the ability to observe actions from a new context
// http://blog.reactandbethankful.com/posts/2016/09/27/redux-analytics-without-middleware/
const actionListenersStoreEnhancer = (createStore) => {
  return (reducer, initialState, enhancer) => {
    const actionListeners = {};
    const store = createStore(reducer, initialState, enhancer);
    const dispatch = store.dispatch;

    store.dispatch = (action) => {
      const result = dispatch(action)
      const observable = typeof action === 'object' ? action : result

      if (typeof observable === 'object' && observable.type && actionListeners[observable.type]) {
        actionListeners[observable.type].forEach((listener) => listener(observable))
      }

      return result
    }

    store.addActionListener = (actionType, listener) => {
      actionListeners[actionType] = (actionListeners[actionType] || []).concat(listener);

      return () => {
        actionListeners[actionType] = actionListeners[actionType].filter((l) => l !== listener);
      }
    }

  return store

  }
}


// attach action listeners for the following events
// INITIALIZE_ORDER_TRAY           => { type: 'orderTrayOpen' }
// TOGGLE_PROVIDER_GROUP_SELECTED  => { type: 'orderProviderSelect/orderProviderUnselect', id:92... }
// TOGGLE_PROVIDER_SELECTED        => { type: 'orderProviderSelect/orderProviderUnselect', id:92... }
// SET_SELECTED_PROVIDER_GROUPS    => { type: 'orderProviderClick', orderProviderId:129, selected:bool}
// TOGGLE_ALL_PROVIDERS_SELECTED   => { type: 'orderProviderSelectAll/orderProviderSelectNone', id:92... }
// TOGGLE_PROVIDER_EXPANDED        => { type: 'orderProviderLearnMore', id:92}
// DESTROY_ORDER_TRAY              => { type: 'orderTrayClose' }


// helpers/selectors
const providers = (store) => {
  return store.getState().providers.providers
}

const expanded = (store, isChild) => {
  const storeKey = isChild ? 'expandedChildren' : 'expanded'
  return store.getState().providers[storeKey]
}

const isExpanded = (id, store, isChild) => {
  return expanded(store, isChild).indexOf(id) > -1
}

const selected = (store) => {
  return store.getState().providers.selected
}

const isSelected = (id, store) => {
  return selected(store).indexOf(id) > -1
}

const isSelectAll = (store) => {
  return selected(store).length
}


export const addActionListeners = (store) => {
  store.addActionListener(ACTIVATE_VARIATION, () => {
    emit({
      type: 'orderVariationActivated'
    })
  })
  // this is not currently in use - analytics/event-tracking is listening to the
  // `order:opened` event thrown by hashchange, as is the Factory that creates the order tray instance
  // store.addActionListener(app.INITIALIZE_ORDER_TRAY, () => {
  //   emit({
  //     type: 'orderTrayOpen'
  //   })
  // })

  // TODO
  // consolidate onToggleProviderOrGroup with onSetSelectedProviderGroups
  // by ammending the regex and adding a conditional around where to pull the list of providers for `members`
  const onToggleProviderOrGroup = (action) => {
    const isGroup     = /GROUP_SELECTED/.test(action.type)
    const {id}        = action.payload
    const members     = !isGroup ? [id] : p.groupMembers(id, providers(store)).map(p => p.id)

    // if one or more of the relevant ids is in the selected slice, then this a toggle to set state to selected ...
    // we can't rely on normal truthy checks because of zero id for tv provider, so explicitly check for !undefined
    const isSelect    = members.find(id => selected(store).find(p => p == id) !== undefined) !== undefined

    // fire an event for the click or tap that triggered the action (intent)
    emit({
      type: 'orderProviderClick',
      selected: isSelect,
      id
    })

    // fire an event for each card that opens or closes (result)
    members.map(id => {
      const type = 'orderProvider' + (isSelect ? 'Open' : 'Close')
      emit({
        id,
        type
      })
    })
  }

  const onSetSelectedProviderGroups = (action) => {
    const members   = action.payload.selected
    const {groupId} = action.payload
    const isSelect  = members.find(id => selected(store).find(p => p == id) !== undefined) !== undefined

    // fire an event for the click or tap that triggered the action (intent)
    emit({
      type: 'orderProviderClick',
      selected: isSelect,
      id: groupId
    })

    // fire an event for each card that opens or closes (result)
    members.map(id => {
      const type = 'orderProvider' + (isSelect ? 'Open' : 'Close')
      emit({
        id,
        type
      })
    })
  }

  store.addActionListener(p.TOGGLE_PROVIDER_GROUP_SELECTED, onToggleProviderOrGroup)
  store.addActionListener(p.TOGGLE_PROVIDER_SELECTED,       onToggleProviderOrGroup)
  store.addActionListener(p.SET_SELECTED_PROVIDER_GROUPS,   onSetSelectedProviderGroups)
  store.addActionListener(app.DESTROY_ORDER_TRAY, () => {
    emit({
      type: 'orderTrayClose'
    })
  })

  store.addActionListener(p.TOGGLE_ALL_PROVIDERS_SELECTED, (action) => {
    const isSelect = selected(store).length;

    emit({
      type: 'orderProvider' + (isSelect ? 'SelectAll' : 'SelectNone')
    })

    providers(store).map(p => {
      emit({
        id: p.id,
        type: 'orderProvider' + (isSelect ? 'Open' : 'Close')
      })
    })
  })

  store.addActionListener(p.TOGGLE_PROVIDER_EXPANDED, (action) => {
    const {id, isChild} = action.payload
    const type  = 'orderProviderLearnMore'

    emit({
      type,
      id,
      expanded: isExpanded(id, store, isChild)
    })

  })

  return store
}


// proxy event publicly for analytics/event-tracking to observe
const emit = (event) => {
  $.event.trigger(event)
}

export default actionListenersStoreEnhancer
