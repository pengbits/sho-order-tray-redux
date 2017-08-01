import * as p from './providers';
const reducers 		= p.reducers;
const reducer  		= p.providersReducer;
import rootReducer from './index';
import {environmentChanged} from './environment'; 
import LegalContent from './legal-content';

describe('Order Tray Redux', () => {
	
	const expectEmpty = (list) => { return expect(list).toHaveLength(0) }
	
	describe('Redux', () => {
    const loadedState = reducer(p.initialState, p.loadProviders());
		
		describe('Providers.LOAD_PROVIDERS', () => {
			
			test('test INITIAL STATE', () => {
        expect(reducer()).toEqual(p.initialState)
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
			
			test('auto-selected provider can still be toggled off', () => {
				const preloaded	  = reducer(Object.assign({}, loadedState, {selected:[92]}));
				expect(reducer(preloaded).selected).toHaveLength(1)
	
				const action 			= p.toggleProviderGroupSelected({id: 92});
				const unselected  = reducer(preloaded, action)
				expect(reducer(unselected).selected).toHaveLength(0)
				
			})
      
			const partialState = reducer(Object.assign({}, p.initialState, {
				providers: [{
					"id" : 100,
					"groupId" : 999999,
					"name" : "Amazon Prime"
				},{
					"id" : 98,
					"groupId" : 999999,
					"name" : "Amazon Devices"
				}]
			}));
			
			test('only one provider per group id appears in grouped list', () => {
        expect(partialState.providers).toHaveLength(2)
        expect(partialState.grouped).toHaveLength(1)
      })
			
			test('groupSize returns a map where keys are groupId and value is # of members in group', () => {
				expect(partialState.groupSizes[999999]).toEqual(partialState.providers.length)
			})
    })
    
    
    describe('Providers.TOGGLE_PROVIDER_SELECTED', () => {
			// use amazon streaming provider for these tests
			const providers = loadedState.providers;
			const {id} = 		providers[0];
			const action =  p.toggleProviderSelected({id: id})

			test("provider's id is added to selected array", () => {
        expect(reducer(loadedState, action).selected).toEqual([id])
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
				expect(reducer(loadedState, p.toggleProviderSelected({id: 0})).legal).toEqual([{
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
				const apple = 92
				const hulu  = 95
				const roku  = 93
					
				// select apple
				const state1 = reducer(loadedState, p.toggleProviderGroupSelected({'id': apple}))
				expect(state1.sortedProviders).toHaveLength(1)
								 
				// select hulu
				const state2 = reducer(state1, p.toggleProviderGroupSelected({'id': hulu}))
				expect(state2.selected).toHaveLength(2)
				expect(state2.displayOrder).toEqual({
					'92':1,'95':0
				})
				
				// select roku
				const state3 = reducer(state2, p.toggleProviderGroupSelected({'id': roku}))
				expect(state3.selected).toHaveLength(3)
				expect(state3.displayOrder).toEqual({
					'92':2,'93':0,'95':1
				})

				// unselect hulu
				const state4= reducer(state3, p.toggleProviderGroupSelected({'id': hulu}))
				expect(state4.displayOrder).toEqual({
					'92':2,'93':0
				})
				
				// ensure there are no nulls caused by gaps between indices in sortedProviders
				expect(state4.sortedProviders).toHaveLength(2)
			})
			
			test("after unselecting a provider, isUnselectingIndex is set to provider's last position", () => {
				const apple  = 92
				const hulu   = 95
				const roku   = 93
				
				const state1  = reducer(loadedState, p.toggleProviderGroupSelected({'id': apple}))
				const state2  = reducer(state1, 		 p.toggleProviderGroupSelected({'id': hulu}))
				const state3  = reducer(state2, 		 p.toggleProviderGroupSelected({'id': roku}))

				// we would expect that the isUnselectingIndex is equal to the sort/order prop of the provider being unselected..
				expect(state3.isUnselectingIndex).toEqual(0)
				expect(state3.displayOrder[hulu]).toEqual(1)
				const state4 = reducer(state3, 			 p.toggleProviderGroupSelected({'id': hulu}))
				expect(state4.isUnselectingIndex).toEqual(state3.displayOrder[hulu])
				
				// great, now make sure providers in groups work the same way
				const amazon = loadedState.providers.filter(p => /Amazon/.test(p.name))
				const amazonGroup = amazon[0].groupId
				const amazonFirst = amazon[0].id
				const amazonLast  = amazon[1].id
				
				const state5 = reducer(loadedState, p.toggleProviderGroupSelected({'id': apple}))
				const state6 = reducer(state5, 			p.toggleProviderGroupSelected({'id': amazonGroup}))


				expect(state6.displayOrder[amazonFirst]).toEqual(0)
				expect(state6.displayOrder[amazonLast]).toEqual(1)
				// expect(state6.displayOrder[apple]).toEqual(2)
				
				const state7 = reducer(state6, 			p.toggleProviderGroupSelected({'id': amazonGroup}))
				
				// console.log(state6.displayOrder[amazonFirst])
				// expect(state7.displayOrder[amazonSortBy]).toEqual(1)
			})
			
			test('items in sortedProviders reducer can retrieve the number of group members', () => {
				const amazon = loadedState.providers.filter(p => /Amazon/.test(p.name))
				const amazonGroup = amazon[0].groupId
				const amazonFirst = amazon[0].id
				const amazonLast  = amazon[1].id
				
				const state = reducer(loadedState, 	p.toggleProviderGroupSelected({'id': amazonGroup}))
				expect(state.sortedProviders[0].groupSize).toEqual(state.groupSizes[amazonGroup])
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
				const action1 = environmentChanged({isMobile: true})
				// no expanded providers at startup
				const state1  = reducer(loadedState, action1);
				expect(state1.expanded).toHaveLength(0)

				// one expanded provider after applying toggleProviderExpanded actiong generated above
				const state2  = reducer(state1, action)
				expect(state2.expanded).toHaveLength(1)

				// no expanded provide after setting env to mobile, 
				const action3 = environmentChanged({isMobile:true})
				const state3 = rootReducer({providers: state2}, action3)

				expect(state3.environment.isMobile).toBe(true)
				expect(state3.providers.expanded).toHaveLength(0)
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
    })
		
		describe('Providers.animating', () => {
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
	})
})









