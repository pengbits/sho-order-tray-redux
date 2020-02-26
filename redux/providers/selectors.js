import {sortedProviders} from './reducers'
// selectors/helpers
// many of these are not bona-fide selectors in the redux sense,
// but they do return a subset of the provider state slice, 
// often while peforming some transformation ie `toggleInList`

// sanitizeProviders
// iterate over the json and fix any quirks
export const sanitizeProviders = (dirty) => {
  const clean = dirty.map(destringifyId)
                     .map(applyPriceCalloutsToArray)
                     .map(applyIsTVProvider)
                     
  return applyParentChild(clean).sort(sortByWeight)
}

export const destringifyId = (provider) => {
  return {
    ...provider,
    id: Number(provider.id)
  }
}

// priceCalloutsToArray
// convert the text-macro psuedo-jsons into proper price-callouts,
// normalizing any character encoding quirks, and casting to array for multiple callouts case

// in www
//  ["\"$10.99<em>per month</em><br /><b>after free trial</b>\"",
//  "\"$8.99<em>per month</em><br /><b>for PlayStation®Plus members</b>\""]

//  in styleguide
//  ["&quot;$10.99<em>per month</em><br /><b>after free trial</b>&quot;", 
//  "&quot;$8.99<em>per month</em><br /><b>for PlayStation®Plus members</b>&quot;"]

export const MULTI_PRICE_REGEX = /^\[\"(.+)\",\s*\"(.+)\"\]$/ 
export const priceCalloutsToArray = (provider) => {
  if(MULTI_PRICE_REGEX.test(provider.priceCallout)){
    const tokens = MULTI_PRICE_REGEX.exec(provider.priceCallout).slice(1)
    return {
      ...provider,
      'priceCallout' : tokens.map(t => t.replace('&quot;',''))
    }
  } else {
    return provider
  }
}

export const applyPriceCalloutsToArray = (attrs) => {
  // call recursively to apply to children
  const provider = priceCalloutsToArray(attrs)
  return {
    ...provider, children: (provider.children || []).map(priceCalloutsToArray)
  }
}

export const applyParentChild = (list) => {
  // if any children have the theme GROUP_MEMBER, they are not actually parent->child
  // and need to be exported onto the top-level list for group treatment
  return list.reduce((output,p) => {
    if(p.children && p.children.length && (p.children.find(c => c.theme == 'GROUP_MEMBER'))){
      const {children, ...parent} = p
      const tagged = children.map(child => {
        return applyGroup(child, parent)
      })
      return output.concat(tagged)
    } else {
      return output.concat(applyGroup(p,p))
    }
  },[])  
}

export const applyGroup = (provider, group) => {
  return {
    ...provider,
    groupId : group.id,
    groupName : group.name
  }
}

export const applyIsTVProvider = (provider) => {
  let p = {...provider}
  
  p.isSmartTVProvider = p.theme == 'SMART_TV_PROVIDER'
  p.isTVProvider      = p.theme == 'TV_PROVIDER' || p.isSmartTVProvider
  
  if(p.isTVProvider){
    p.description     = p.isSmartTVProvider ? p.description : undefined
    p.hasDeviceIcons  = false  
  }
  // call recursively to apply to children
  return {...p, children: (p.children || []).map(applyIsTVProvider)}
}

const sortByWeight = (a,b) => {
  return (a.weight && b.weight) ? b.weight - a.weight : 0
}

export const toggleInList = (list, id) => {
  return list.includes(id) ? 
    removeFromList(list, id) : addToList(list, id)
}

export const removeFromList = (list, id) => {
  return list.filter(i => i !== id)
}

export const addToList = (list, id) => {
  return [].concat(list, [id])
}

export const groupMembers = (groupId, providers=[]) => {
  return providers.filter(p => p.groupId == groupId)
}

export const groupMemberIds = (id, parentState={}) => {
  return groupMembers(id, (parentState.providers || [])).map(p => p.id)
}

export const truthyId = ((id) => {
  return !!id || id === 0 
})

export const providerWasSelected = (id, parentState={selected:[]}) => {
  return parentState.selected.includes(id)
}

export const groupMemberWasSelected = (groupIds=[], parentState) => {
  return truthyId(groupIds.find(p => providerWasSelected(p, parentState)))
}

// sortedProvidersPath
// generate the path that represents the current provider selection,
// suitable for dispatching to react-router with push()
export const sortedProvidersPath = (action, parentState) => {
  const {providers} = parentState
  const sorted      = sortedProviders(parentState.sortedProviders, action, parentState);
 
  let path = '/providers/';
  if(sorted.length){
    let ids=[], names =[];
    sorted.map(p => {
      ids.push(p.id)
      names.push((p.name || 'unknown').toLowerCase().replace(/\s/g,'-'))
    })
    path += (ids.join(',') +'/' + names.join(','))
  } 
  return path
}
