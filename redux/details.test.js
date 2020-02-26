import * as d from './details';
const reducer = d.details;

describe('Order Tray Redux', () => {
	describe('Redux', () => {
    describe('details.SET_DETAILS_HEIGHT', () => {
      test('setting details height should result in new entry in store', () => {
				const action = d.setDetailsHeight({
					id: 94, height: 395
				})
				const state = reducer({}, action)
				expect(state).toEqual({94:395})
			})
    })
    
		describe('details.GET_DETAILS_HEIGHT', () => {
      test('should be able to read height back out after storing', () => {
				const action = d.setDetailsHeight({
					'id': 92,
					'height': 435
				})
				const state1 = reducer({}, action);
				const state2 = reducer(state1, {type:'ANY_OTHER_ACTION'});
				expect(state2).toEqual({92:435})
			})
    })
    
	})
})