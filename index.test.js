import React from 'react';
import { shallow, mount } from 'enzyme';

import PickerProviderListItem from './components/PickerProviderListItem'
import LegalCard from './components/LegalCard'

describe('Order Tray Redux', () => {
	describe('Components', () => {
		describe('LegalCard', () => {
			test('renders LegalCard', () => {
				expect(shallow(<LegalCard
					type='STREAMING_PROVIDER'
					content={['do','the','right','thing']}
				/>)).toHaveLength(1)
			})
		})
		
		describe('Picker', () => {
			// these shallow render tests were failing 
			// when the variation mixin was still in place -
			// if we we need to restore that functionality,
		 // consider just removing the tests 
			describe('PickerProviderListItem', () => {
				const shallowRenderComponent = ({isSelected}={}) => {
					return shallow(<PickerProviderListItem 
						groupId={92}
						isSelected={!!isSelected}
						groupName='Apple' 
					/>);
				}
				
				test('renders', () => {
					let el = shallowRenderComponent()
					expect(el).toHaveLength(1)
				})
				
				test('matches snapshot', () => {
					let el = shallowRenderComponent()
					expect(el).toMatchSnapshot()
				})
				
				test('icon path and classnames change with selected state', () => {
					
					let el = shallowRenderComponent({isSelected: false});
					expect(el.find('.input--faux-radio').hasClass('input--faux-radio-checked')).toBe(false)
					expect(el.find('.input__icon').props().src).toMatch(/super-radio_36x36.svg$/);
					
					el = shallowRenderComponent({isSelected: true});
					expect(el.find('.input--faux-radio-checked')).toHaveLength(1)
					expect(el.find('.input__icon').props().src).toMatch(/super-radio-checked_36x36.svg$/);
					
				})
			})
		})
	})
})