import {combineReducers} from 'redux'
import * as p from './providers';
const reducers 		= p.reducers;
const reducer  		= p.providersReducer;
import indexReducer from './index';
import {environmentChanged} from './environment';
import LegalContent from './legal-content';
import providers from '../mocks/window-order-tray-data'
import {TVProviderWithAlpha, TVProviderWithFeatured} from '../mocks/tv-providers'

describe('Order Tray Redux', () => {

	const expectEmpty = (list) => { return expect(list).toHaveLength(0) }
	const TV_PROVIDER_PARENT_ID = 126

	describe('Redux', () => {
    const loadedState = reducer(p.initialState, p.setProviders({
			providers
		}));

		describe('Providers.SET_PROVIDERS', () => {
				
			test('test INITIAL STATE', () => {
        expect(reducer()).toEqual(p.initialState)
      })
			
			test('window data exists', () => {
				expect(providers.length).toBeGreaterThan(0)  
				expect(loadedState.providers.length).toBeGreaterThan(0)
			})
			
      test('no providers are selected', () => {
        expectEmpty(loadedState.selected)
      })

      test('no providers are expanded', () => {
        expectEmpty(loadedState.expanded)
      })

      test('no display order has been applied to list', () => {
        expectEmpty(Object.keys(loadedState.displayOrder))
      })

			const partialState = reducer(Object.assign({}, p.initialState, {
				providers: [{
					"id" : 100,
					"groupId" : 166,
					"name" : "Amazon Prime"
				},{
					"id" : 98,
					"groupId" : 166,
					"name" : "Amazon Devices"
				}]
			}));

			test('only one provider per group id appears in grouped list', () => {
        expect(partialState.providers).toHaveLength(2)
        expect(partialState.grouped).toHaveLength(1)
      })

			test('groupSize returns a map where keys are groupId and value is # of members in group', () => {
				expect(partialState.groupSizes[166]).toEqual(partialState.providers.length)
			})
    })
		
		describe('Providers#sanitizeProviders()', () => {
			
			
			test('missing `groupId,groupName` properties are populated with `id,Name`', () => {
				const dirty = [{
					"id":95,
					"name":"Hulu"
				}]
				const expected = dirty[0]
				const clean 	 = p.sanitizeProviders(dirty)
				const hulu 	 	 = clean.find(p => p.id == 95)
				
				expect(hulu).toEqual(expect.objectContaining({
					id				: expected.id,
					name			: expected.name,
					groupId 	: expected.id,
					groupName : expected.name
				}))
			})
			
			test('for Amazon, group id is set to 166', () => {
				const dirty = [{
					"id" 	 : 166,
					"name" : "Amazon",
					"children" : [{
						"id"    : 100,
						"name"  : "Amazon Prime",
						"theme" : "GROUP_MEMBER"
					},{
						"id"    : 98,
						"name"  : "Amazon Devices",
						"theme" : "GROUP_MEMBER"
					}]
				}]
				const clean 	 = p.sanitizeProviders(dirty)
				const expected = dirty[0].children.map(p => {
					return {...p, groupId: 166, groupName: 'Amazon'}
				})
				expect(clean).toHaveLength(expected.length)
				expect(clean[0]).toEqual(expect.objectContaining(expected[0]))
				expect(clean[1]).toEqual(expect.objectContaining(expected[1]))
			})
			// 
			test('"Additional Providers" has parent/child relationship', () => {
				const dirty = [
					{ "name":"hulu",	"id":95 },
					{ "name":"apple",	"id":92 },
					{	"name":"Additional Choices",  
						"id" : 128, 
						"children" : [{	
								"name":"DIRECTV NOW",		 	 		"id":118 },
							{	"name":"fuboTV",					 		"id":124 },
							{	"name":"PlayStation Vue",	 		"id":94  },
							{	"name":"Sling",					 	 		"id":112 },
							{	"name":"Smart TVs",				 		"id":130 },
							{	"name":"Xbox One",				 		"id":116 },
							{	"name":"YouTube TV",					"id":110 }
						]
					}
				]
				const clean = p.sanitizeProviders(dirty)
				// nothing to test!
			})
			
			test('child providers without theme are mapped to parent', () => {
	      // if there is a provider with children that don't have the group theme,
	      // they are mapped onto the parent and dont appear in master list
	      const parents = providers.filter(p => {
	        return p.children.length && !p.children.find(c => {
	          return c.theme == 'GROUP_MEMBER'
	        })
	      })
	      // expect(parents).toHaveLength(1)
	      // expect(parents.find(p => p.id == 128 && p.name == 'Additional Choices'))

	      //  '118 DIRECTV Now',
	      //  '124 fuboTV',
	      //  '112 Sling TV',
	      //  '116 Xbox One',
	      //  '110 YouTube TV'
	      const childIds = parents.map(p => p.children.map(c => c.id))
	      expect(loadedState.providers.filter(provider => childIds.includes(provider.id))).toHaveLength(0)
	    })
			
			test('group members are hoisted onto top-level list', () => {
				// if there are child providers with the GROUP_MEMBER theme,
				// they are not actually parent->child and need to be moved to top-level list
				// 1) build up list of amazon, apple and roku group members by reducing raw data...
				const groupMembers = providers.reduce((list,p) => {
					if(p.children.length && p.children.find(c => c.theme == 'GROUP_MEMBER')){
						return list.concat(p.children)
					} else {
						return list
					}
				}, [])
				expect(groupMembers).toHaveLength(6)
				
				// 2) assert that they were moved to top-level list
				const isMemberOfGroup = (p => !!groupMembers.find(m => m.id == p.id))
				expect(loadedState.providers.filter(isMemberOfGroup))
				.toHaveLength(6)
			})
			
			test('TV Providers are cast to TV Provider type', () => {
				const dirty = [{
					"id" : 126,
					"name" : "TV Provider",
					"description" : "meh",
					"theme" : "TV_PROVIDER"
				},{
					"id" : 130,
					"name" : "Smart TVs",
					"theme" : "SMART_TV_PROVIDER"
				}]

				const expectedTV = {
					"id"							: 126,
					"name" 						: "TV Provider",
					"isTVProvider" 	 	: true,
					"description" 	 	: undefined, // must pass description undefined for proper render of tv card
					"hasDeviceIcons" 	: false
				}
				
				const expectedSmartTV = {
					"id"								: 130,
					"name" 							: "Smart TVs",
					"isTVProvider" 	 		: true,
					"isSmartTVProvider" : true,
					"description" 	 		: undefined, 
					"hasDeviceIcons" 		: false
				}
				
				const clean = p.sanitizeProviders(dirty)
				expect(clean[0]).toEqual(expect.objectContaining(expectedTV))
				expect(clean[1]).toEqual(expect.objectContaining(expectedSmartTV))	
			})
			
			test('TV Providers aka Partners are sorted and grouped by alpha', () => {
				
				// if you pull the partners from state immediately after SET_PROVIDERS, they won't have been sorted yet..
				const dirty = reducer(p.initialState, p.setProviders({'providers':[TVProviderWithAlpha]}))
				// only on second try (any action would work), does the tvProviders slice contain updated data w alpha sort
				// it so happens that this is good enough for our uses, as they aren't needed unless selected, but its a strange limitation
				const clean  = reducer(dirty, p.toggleProviderGroupSelected({id: TV_PROVIDER_PARENT_ID}))			
				const {tvProvidersAlpha} = clean
				
				// not all letters will have entries, so can't assume length of 26.. 
				// we could assert a specific number but it'll get out of date
				// expect(Object.keys(tvProvidersAlpha).length).toBeGreaterThan(10) 
	
				// every item in the entry should be a tv provider with a valid id...
				const entries = Object.values(tvProvidersAlpha)
				// const i = Math.floor(Math.random() * entries.length)
				entries.map((entry,i) => {
					expect(entry.filter(p => {
						return p.id !== undefined && 
									 p.isTVProvider == true &&
								 	 p.featured !== true
					  }
					).length).toEqual(entry.length)
					
					// the entry (a list of providers for the character) should itself be alpha sorted
					if(entry.length < 4) return
					
					const alphaEntry = entry.sort((a,b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
					// expect(alphaEntry).toEqual(entry)
					//console.log(alphaEntry.map(a => a.name))

				})
			})
			
			test('Featured TV Providers aka Partners are put into tvProvidersFeatured', () => {
				const state1 = reducer(p.initialState, p.setProviders({'providers':providers}))
				const state2 = reducer(state1, p.toggleProviderGroupSelected({id: TV_PROVIDER_PARENT_ID}))			
				expect(state2.tvProvidersFeatured.length).toBeGreaterThan(0)
			})
			
			test('Provider Hierarchies can be flattened if neccessary', () => {
				const state1 = reducer(p.initialState, p.setProviders({providers}))
				const state2 = reducer(state1, p.toggleProviderGroupSelected({id: TV_PROVIDER_PARENT_ID}))
				expect(state2.tvProvidersSmartTVs.length).toBeGreaterThan(0)
			})		
		})
		
    describe('Providers.TOGGLE_PROVIDER_SELECTED', () => {
			// use showtime direct provider for these tests
			const providers = loadedState.providers;
			const {id} = 		providers[0];
			const action =  p.toggleProviderSelected({id})
			
			test("provider's id is added to selected array", () => {
				const state = reducer(loadedState, action)
				expect(state.selected).toEqual([id])
      })

			test('legal exists if provider is selected', () => {
				expect(reducer(loadedState, action).legal).toHaveLength(1)
      })

			test('streaming legal for streaming provider', () => {
				expect(reducer(loadedState, action).legal).toEqual([{
					type: 'STREAMING_PROVIDER',
					content: LegalContent.STREAMING_PROVIDER
				}])
      })

			test('tv legal for tv provider', () => {
				expect(reducer(loadedState, p.toggleProviderSelected({id: 126})).legal).toEqual([{
					type: 'TV_PROVIDER',
					content: LegalContent.TV_PROVIDER
				}])
      })

			test('only one legal entry per type, tv legal is first', () => {
				expect(reducer(loadedState, p.toggleAllProvidersSelected()).legal).toEqual([{
					type: 'TV_PROVIDER',
					content: LegalContent.TV_PROVIDER
				},{
					type: 'STREAMING_PROVIDER',
					content: LegalContent.STREAMING_PROVIDER
				}])
			})
    })

    describe('Providers.TOGGLE_PROVIDER_GROUP_SELECTED', () => {
      test("all providers ids in group are added to selected array", () => {
				const providers  	 = loadedState.providers;
        const groupMembers = providers.filter(p => /Amazon/.test(p.name));
        const groupId      = groupMembers[0].groupId;
        const memberIds    = groupMembers.map(p => p.id);
        const action       = p.toggleProviderGroupSelected({ 'id': groupId });

			  // make sure assumptions about amazon members having same groupId hold up..
        expect(Object.keys(groupMembers.reduce((hash,provider) => {
          hash[provider.groupId] = true; return hash
        },{}))).toHaveLength(1)

        // test toggling the group's selection state
        expect(reducer(loadedState, action).selected).toEqual(memberIds)
      })

			test("displayOrder holds up after multiple selects/unselects", () => {
				const direct 	= 114
				const hulu  	= 95
				const android = 99
				
				// select apple
				const state1 = reducer(loadedState, p.toggleProviderGroupSelected({'id': direct}))
				expect(state1.sortedProviders).toHaveLength(1)

				// select hulu
				const state2 = reducer(state1, p.toggleProviderGroupSelected({'id': hulu}))
				expect(state2.selected).toHaveLength(2)
				expect(state2.displayOrder).toEqual({
					'114':1,'95':0
				})

				// select android
				const state3 = reducer(state2, p.toggleProviderGroupSelected({'id': android}))
				expect(state3.selected).toHaveLength(3)
				expect(state3.displayOrder).toEqual({
					'114':2,'99':0,'95':1
				})
				// 
				// unselect hulu
				const state4= reducer(state3, p.toggleProviderGroupSelected({'id': hulu}))
				expect(state4.displayOrder).toEqual({
					'114':2,'99':0
				})
				// 
				// ensure there are no nulls caused by gaps between indices in sortedProviders
				expect(state4.sortedProviders).toHaveLength(2)
			})

			test("after unselecting a provider, isUnselectingIndex equals provider's last position in sortedProviders reducer", () => {
				const additional  = 128
				const android  		= 99
				const direct  		= 114
				const hulu 				= 95
				
				// select our 4 providers
				const state1  = reducer(loadedState, p.toggleProviderGroupSelected({'id': additional}))
				const state2  = reducer(state1, 		 p.toggleProviderGroupSelected({'id': hulu}))
				const state3  = reducer(state2, 		 p.toggleProviderGroupSelected({'id': android}))
				const state4  = reducer(state3, 		 p.toggleProviderGroupSelected({'id': direct}))

				// we would expect that the isUnselectingIndex is equal to the sort/order property
				// of the provider being unselected... however we can't naively fetch displayOrder[id]
				// because the values there are not guaranteed to be strictly sequential, and might be unsafe to use as the index
				// (because of how the algorithm works, there can be gaps in the sort values) see reducer implementation for details.
				expect(state4.isUnselectingIndex).toEqual(0)
				expect(state4.displayOrder).toEqual(expect.objectContaining({
					'114':0, '99':1, '95':2, '128':3
				}))
				const sortedShallow = state4.sortedProviders.reduce((store,p,i) => {
					store[p.id] = i; return store
				}, {})
				expect(sortedShallow).toEqual(expect.objectContaining(state4.displayOrder))

				// unselect android
				const state5 = reducer(state4, 			 p.toggleProviderGroupSelected({'id': android}))
				expect(state5.isUnselectingIndex).toEqual(sortedShallow[android])

				// unselect hulu
				const state6 = reducer(state4, 			 p.toggleProviderGroupSelected({'id': hulu}))
				expect(state6.isUnselectingIndex).toEqual(sortedShallow[hulu])


				// great, now make sure providers in groups work the same way
				const amazon = loadedState.providers.filter(p => /Amazon/.test(p.name))
				const amazonGroup = amazon[0].groupId
				const amazonFirst = amazon[0].id
				const amazonLast  = amazon[1].id

				const state7 = reducer(loadedState, p.toggleProviderGroupSelected({'id': additional}))
				const state8 = reducer(state7, 			p.toggleProviderGroupSelected({'id': amazonGroup}))

				expect(state8.displayOrder[amazonFirst]).toEqual(0)
				expect(state8.displayOrder[amazonLast]).toEqual(1)
				expect(state8.displayOrder[additional]).toEqual(2)

				const state9 = reducer(state8, 			p.toggleProviderGroupSelected({'id': amazonGroup}))

				// shim should target the first member of the group
				expect(state9.isUnselectingIndex).toEqual(state8.displayOrder[amazonFirst])
			})

			test("providers are collapsed when unselected", () => {
				const id 			= 95
				const initial = reducer(loadedState, p.toggleProviderGroupSelected({id}))
				const state2  = reducer(initial, 		 p.toggleProviderExpanded({id}))
				const state3 	= reducer(state2, 		 p.toggleProviderGroupSelected({id}))
				expect(state3.expanded).not.toContain(id)
			})

			test('items in sortedProviders reducer can retrieve the number of group members', () => {
				const amazon = loadedState.providers.filter(p => /Amazon/.test(p.name))
				const amazonGroup = amazon[0].groupId
				const amazonFirst = amazon[0].id
				const amazonLast  = amazon[1].id

				const state = reducer(loadedState, 	p.toggleProviderGroupSelected({'id': amazonGroup}))
				expect(state.sortedProviders[0].groupSize).toEqual(state.groupSizes[amazonGroup])
			})

			// https://issues.sho.com/browse/SITE-16756
			test('all group members become selected if a single member is selected, when switching from mobile to desktop', () => {
				const amazon 			= loadedState.providers.filter(p => /Amazon/.test(p.name))
				const amazonGroup = amazon[0].groupId
				const amazonIds 	= amazon.map(p => p.id)
				const apple				= 92

				const state1 = reducer(loadedState, environmentChanged({isMobile: true}))
				const state2 = reducer(state1, p.toggleProviderSelected({'id': apple}))
				const state3 = reducer(state2, p.toggleProviderSelected({'id': amazonIds[0]}))
				const state4 = reducer(state3, environmentChanged({isMobile:false}))
				expect(state4.selected).toEqual(expect.arrayContaining([apple].concat(amazonIds)))
			})
    })


    describe('Providers.TOGGLE_ALL_PROVIDERS_SELECTED:ALL', () => {
			const action = p.toggleAllProvidersSelected();
			const state =  reducer(loadedState, action);

			test("all providers ids are added to selected array", () => {
	      expect(state.providers.map(p => p.id)).toEqual(state.selected)
	    })

			test("selectAllToggle text is updated to correct value", ()=>{
				expect(state.selectAllToggleText).toEqual(p.selectAllLabels.SELECT_NONE)
			})
    })

		describe('Providers.TOGGLE_ALL_PROVIDERS_SELECTED:NONE', () => {
			const providers = loadedState.providers;
			const action 	= p.toggleAllProvidersSelected()
			const initial = Object.assign({}, loadedState, {
				selected: providers.map(provider => provider.id)
			})
			const state 	= reducer(initial, action)

			test("all providers ids are removed from selected array", () => {
	      expect(state.selected).toHaveLength(0)
	    })

			test("selectAllToggle text is updated to correct value", ()=>{
				expect(state.selectAllToggleText).toEqual(p.selectAllLabels.SELECT_ALL)
			})
    })

		describe('Providers.TOGGLE_PROVIDER_EXPANDED', () => {
			const providers = loadedState.providers;
			const i 			= Math.floor(Math.random() * providers.length);
			const {id} 		= providers[i];
			const action 	= p.toggleProviderExpanded({ 'id': id });
			const stateWithExpandedProvider = reducer(loadedState, action);

			test("provider's id is added to expanded array", () => {
				expect(stateWithExpandedProvider.expanded).toEqual([id])
      })

			test("provider's id is removed from expanded array", () => {
        expect(reducer(stateWithExpandedProvider, action).expanded).toEqual([])
      })

			test('any expanded providers are collapsed when changing environment', () => {
				// no expanded providers at startup
				const state1  = reducer(loadedState);
				expect(state1.expanded).toHaveLength(0)

				// one expanded provider after applying toggleProviderExpanded action generated above
				const state2  = reducer(state1, action)
				expect(state2.expanded).toHaveLength(1)

				// no expanded provider after setting env to mobile,
				const action3 = environmentChanged({isMobile:true})
				const state3 = reducer(state2, action3)
				expect(state3.expanded).toHaveLength(0)
			})

			test("expanding a second provider results in multiple ids in expanded array", () => {
				const providers 				= loadedState.providers;
				const ids 							= providers.slice(1,3).map(p => p.id)
				const multipleExpanded 	= ids.reduce((state, id) => {
					const action = p.toggleProviderExpanded({id})
					return Object.assign({}, state, reducer(state, action))
				}, p.initialState)

				expect(multipleExpanded.expanded).toHaveLength(2)
			})

			// this test fails with fix for SITE-16377 - it seems we don't actually want to collapse other providers
	    // when selecting a new provider, if we are in mobile context
			// todo: rewrite as selecitn a providrr should collapse others if on desktop,
			// add support in providers reducer by injecting enviornment state
	    /*
			test('selecting a provider should collapse others', () => {
				const providers   = loadedState.providers
				const amazon      = providers.filter(p => /Amazon/.test(p.name))
				const amazonIds   = amazon.map(p => p.id)
				const apple       = providers.find(p => /Apple/.test(p.name)).id
				const hulu 	      = providers.find(p => /Hulu/.test(p.name)).id

				// select first provider
				const action1 = p.toggleProviderSelected({'id': apple});
				const state1 	= reducer(loadedState, action1);

				// expand first provider
				const action2 = p.toggleProviderExpanded({'id': apple});
				const state2  = reducer(state1, action2);

				// select second provider
				const action3 = p.toggleProviderSelected({'id': hulu});
				const state3  = reducer(state2, action3)

				// is the initial card collapsed?
				expect(state3.expanded).toEqual([])
				expect(state3.selected).toEqual([apple,hulu])

				// ok, what about groups?
				// expand hulu
				const action4 = p.toggleProviderExpanded({'id': hulu})
				const state4  = reducer(state3, action4)
				expect(state4.expanded).toContain(hulu)

				// select all amazon cards in addition to hulu and apple...
				const action5 = p.toggleProviderGroupSelected({'id': amazon[0].groupId})
				const state5	= reducer(state4, action5)
				expect(state5.selected).toEqual(expect.arrayContaining([hulu,apple].concat(amazonIds)))

				// expand the first amazon card
				const action6 = p.toggleProviderExpanded({'id': amazon[0].id})
				const state6  = reducer(state5, action6)

				// // only first amazon card should be expanded...
				expect(state6.expanded).toEqual([amazon[0].id])
			})
			*/
    })

		describe('Providers.TOGGLE_PROVIDER_EXPANDED -> ANIMATING', () => {
			const providers = loadedState.providers;
			const ids 		= providers.slice(1,3).map(p => p.id)
			const action 	= p.toggleProviderExpanded({id: ids[0]})
			const stateWithExpandedProvider = reducer(loadedState, action);

			test("expanded provider's id is added to expanding array", () => {
				expect(stateWithExpandedProvider.expanding).toEqual([ids[0]])
			})

			test("only one provider id in expanding array at a time", () => {
				const multipleExpanded =  ids.reduce((state, id) => {
					const action = p.toggleProviderExpanded({id})
					return Object.assign({}, state, reducer(state, action))
				}, p.initialState)

				expect(multipleExpanded.expanding).toHaveLength(1)
			})
		})


		// test parent/child relationships for the additional providers card:
		describe('Providers.PARENT_CHILD_RELATIONSHIP', () => {
			const providers = loadedState.providers
			const initial 	= reducer(Object.assign({}, loadedState, {providers}))
			const parent  	= providers.find(p => p.children && p.children.length)
			const child   	= parent.children.find(p => /DIRECTV/.test(p.name))
			const {id}			= child

			describe('Child.TOGGLE_PROVIDER_GROUP_SELECTED', () => {
				let action = p.toggleProviderGroupSelected({id, isChild:true})
				test("selected provider's id is added to providers.selectedChildren", () => {
					expect(reducer(initial, action).selectedChildren).toContain(id)
				})
				// we don't have to do anything special here, since providers reducer
				// already rejects the action if there is no provider (at top-level) with the id
				test("selected provider's id is not added to providers.selected", () => {
					expect(reducer(initial, action).selected).not.toContain(id)
				})

				test("expanded child providers are collapsed when parent is unselected", () => {
					const state1 = reducer(initial, p.toggleProviderGroupSelected({id: parent.id}))
					const state2 = reducer(state1, 	p.toggleProviderGroupSelected({id,isChild:true}))
					const state3 = reducer(state2,  p.toggleProviderExpanded({id,isChild:true}))
					expect(state3.expandedChildren).toContain(id)
					const state4 = reducer(state3, p.toggleProviderGroupSelected({id:parent.id}))
					expect(state4.expandedChildren).not.toContain(id)
				})

				test("expanded child providers are not collapsed by unselecting unrelated providers", () => {
					const state1 = reducer(initial, p.toggleProviderGroupSelected({id: parent.id}))
					const state2 = reducer(state1, 	p.toggleProviderGroupSelected({id,isChild:true}))
					const state3 = reducer(state2,  p.toggleProviderExpanded({id,isChild:true}))
					const state4 = reducer(state3, p.toggleProviderGroupSelected({id:94}))
					expect(state4.expandedChildren).toContain(id)
				})
			})

			describe('Child.TOGGLE_PROVIDER_EXPANDED', () => {
				let action = p.toggleProviderExpanded({id, isChild:true})

				test("expanded provider's id added to providers.expandedChildren", () => {
					expect(reducer(initial, action).expandedChildren).toContain(id)
				})

				test("expanded provider's id not added to providers.expanded array", () => {
					expect(reducer(initial, action).expanded).not.toContain(id)
				})

				test("expanded provider's id not added to providers.expanding array", () => {
					expect(reducer(initial, action).expanding).not.toContain(id)
				})

				test("expanded provider's id is added to providers.expandingChildren array", () => {
					expect(reducer(initial, action).expandingChildren).toContain(id)
				})

				test('expanded providers are collapsed when changing environment', () => {
					// no expanded children
					expect(initial.expandedChildren).toHaveLength(0)

					// with one expanded child
					const state2 = reducer(initial, p.toggleProviderExpanded({id, isChild:true}))
					expect(state2.expandedChildren).toHaveLength(1)

					// no expanded providers after setting env to mobile,
					const action3 = environmentChanged({isMobile:true})
					const state3 = reducer(state2, action3)
					expect(state3.expandedChildren).toHaveLength(0)
				})
			})

			describe('Child.TOGGLE_ALL_PROVIDERS_SELECTED:NONE', () => {
				test('all providers are removed from selectedChildren', () => {
					const state1 = reducer(initial, p.toggleProviderGroupSelected({id,isChild:true}))
					expect(state1.selectedChildren).toHaveLength(1)
					const state2 = reducer(state1, 	p.toggleAllProvidersSelected())
					expect(state2.selectedChildren).toHaveLength(0)
				})
			})
		})
	})
})
