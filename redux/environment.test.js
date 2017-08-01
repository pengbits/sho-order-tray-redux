import * as ENV from './environment';
const {BREAKPOINTS,environmentChanged,environmentReady,environment} = ENV;
const reducer = environment;

describe('Order Tray Redux', () => {
	describe('Redux', () => {
    describe('Environment', () => {
			const isMobile = (width) => {
				return BREAKPOINTS.large > width
			}
			
			test('environment set to mobile with 640px width', () => {
				const action = environmentChanged({
					isMobile: isMobile(640)
				})
				expect(reducer({}, action).isMobile).toBe(true)
			});
			
			test('environment set to desktop with 992px width', () => {
				const action = environmentChanged({
					isMobile: isMobile(992)
				})
				expect(reducer({}, action).isMobile).toBe(false)
			})
			
			// ipads in landscape mode get the desktop view with modified behvaior,
			// in portrait, they're the same as mobile
			test('environment set to desktop at 992px width, but hasTouchEvents flag if Modernizr.touchevents', () => {
				const action = environmentChanged({
					isMobile: isMobile(992),
					hasTouchEvents: true // (Modernizr && Modernizr.touchevents);
				})
				expect(reducer({}, action).isMobile).toBe(false)
				expect(reducer({}, action).hasTouchEvents).toBe(true)
			})
			// isTablet(){
				// return this.isDesktop() && Modernizr && Modernizr.touchevents;
			// }
			// test('any expanded providers are collapsed when changing environment', () => {
			// 	... see providers.test.js	near Provider.TOGGLE_PROVIDER_EXPANDED
			// })
    })
  })
})