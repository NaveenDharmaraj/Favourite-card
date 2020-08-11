import React from 'react';
import {
    shallow,
} from 'enzyme';
import { Success, mapStateToProps } from '../../../components/ClaimCharity/Success';

const initializeComponent = (props = {}) => shallow(<Success {...props} />);

const customProps = {
    currentUser: {
        attributes: {
            firstName: 'Johne'
        }
    },
    otherAccounts: [
        {
            accountType: "charity",
            avatar: "https://lab-monkey.herokuapp.com/assets/avatars/chimp-icon-charity-5cb23cd9db92545f979ab9eac3103fd01cfe9929140874d4829ed32d82768f96.png",
            balance: null,
            created_at: "2020-07-03T06:49:23.000-07:00",
            location: "/contexts/3250",
            name: "Abundant Life Pentecostal Tabernacle",
            slug: "abundant-life-pentecostal-tabernacle",
        }
    ],
    slug: 'abundant-life-pentecostal-tabernacle'
};

describe('Test the existance and rendering of component elements', () => {
    it('Should give true if component exists', () => {
        const props = {
            ...customProps,
        };
        const component = initializeComponent(props);
        expect(component.exists()).toBe(true);
    });

    it('Should display charity name when slug is found in otherAccounts props', () => {
        const props = {
            ...customProps,
        };
        const component = initializeComponent(props);
        expect(component.find({ 'data-test': 'ClaimCharity_Success_charityname_text' }).text()).toEqual('Now you have access to your charity Abundant Life Pentecostal Tabernacle’s account.');
    });
})

describe('Test mapStateToProps', () => {
    it('Should give initialState accountType equal to expected value', () => {
        const initialState = {
            user: {
                info: {
                    id: 248,
                },
            },
            user: {
                otherAccounts: [
                    {
                        accountType: "charity",
                        avatar: "https://lab-monkey.herokuapp.com/assets/avatars/chimp-icon-charity-5cb23cd9db92545f979ab9eac3103fd01cfe9929140874d4829ed32d82768f96.png",
                        balance: null,
                        created_at: "2020-07-03T06:49:23.000-07:00",
                        location: "/contexts/3250",
                        name: "Abundant Life Pentecostal Tabernacle",
                        slug: "abundant-life-pentecostal-tabernacle",
                    }
                ]
            },
        };
        expect(mapStateToProps(initialState).otherAccounts[0].accountType).toEqual('charity');
    });
})
