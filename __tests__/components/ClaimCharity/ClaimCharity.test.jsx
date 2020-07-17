import React from 'react';
import {
    shallow,
} from 'enzyme';
import { ClaimCharity, mapStateToProps } from '../../../components/ClaimCharity/ClaimCharity';

const initializeComponent = (props = {}) => shallow(<ClaimCharity {...props} />);

describe('Test the existance and rendering of component elements', () => {
    it('Should give true if component exists', () => {
        const component = initializeComponent();
        expect(component.exists()).toBe(true);
    });
})

describe('Test for claim token fields', () => {

    describe('Test input field', () => {
        it('Should give accessCode equal to value when there is a change in claim token input field', () => {
            const event = {};
            const data = {
                value: 'ASDF-1323-dDlK',
            };
            const component = initializeComponent();
            component.find({ 'data-test': 'ClaimCharity_ClaimCharity_accesscode_input' }).simulate('change', event, data);
            expect(component.state('accessCode')).toEqual('ASDF-1323-dDlK');
        });
    })

    describe('Test button field functionality', () => {
        it('Should ', () => {
            const props = {
                dispatch: jest.fn().mockImplementationOnce(() => Promise.resolve()),
                currentUser: {
                    id: '242424'
                },
                isAuthenticated: null,
            };
            const component = initializeComponent(props);
            component.setState({ accessCode: 'ASDF-1323-dDlK' });
            component.find({ 'data-test': 'ClaimCharity_ClaimCharity_claimbutton' }).simulate('click');
            expect(component.state('buttonClicked')).toEqual(true);
        });
    })
})

describe('Test mapStateToProps', () => {
    it('Should give initialState isAuthenticated attribute be equal to true', () => {
        const initialState = {
            user: {
                info: {
                    id: 248,
                },
            },
            user: {
                claimCharityErrorMessage: ''
            },
            auth: {
                isAuthenticated: true
            }
        };
        expect(mapStateToProps(initialState).isAuthenticated).toBe(true);
    });
})
