import React from 'react';
import {
    shallow,
} from 'enzyme';
import mockAxios from 'axios';

import ClaimP2P from '../../pages/claimP2P';
import ClaimP2PSignUp from '../../components/ClaimP2PSignUp';

const initializeComponent = (props = {}) => {
    return shallow(<ClaimP2P {...props} />);
};

describe('Testing ClaimP2P component when userInfo is not empty', () => {
    const props = {
        claimToken: '1234',
        userInfo: {
            avatar: 'image',
            giftAmount: '5',
            invitedUserEmail: 'chimp@gmail.com',
            senderDisplayName: 'chimp',
        },
    };
    const component = initializeComponent(props);
    it('populates the userinfo value from initial load using api', async () => {
        const userInfo = mockAxios.get.mockImplementationOnce(() => Promise.resolve(
            {
                avatar: 'image',
                giftAmount: '5',
                invitedUserEmail: 'chimp@gmail.com',
                senderDisplayName: 'chimp',
            },
        ));
        // Inject anything you want to test
        const props = await ClaimP2P.getInitialProps({
            query: {
                claimToken: '1234',
                userInfo,
            },
        });
        expect(props).toEqual({
            claimToken: '1234',
            userInfo: {
                avatar: 'image',
                giftAmount: '5',
                invitedUserEmail: 'chimp@gmail.com',
                senderDisplayName: 'chimp',
            },
        });
    });
    describe('Testing Claim P2P Header', () => {
        it('Should render the user image in header', () => {
            expect(component.find({ 'data-test': 'claimp2p_header_image' }).prop('src')).toEqual(props.userInfo.avatar);
        });
        it('Should render the description with username and amount in header', () => {
            expect(component.find({ 'data-test': 'claimp2p_header_description' }).exists()).toBe(true);
        });
        it('Should render the users thank note', () => {
            expect(component.find({ 'data-test': 'claimp2p_header_thanknote' }).text()).toBe(`“Thank you for helping with the bake sale the other day!”`);
        });
    });
    describe('Testing Claim P2P Sign up contents', () => {
        it('Should render the sub title 1 in sign up section', () => {
            expect(component.find({ 'className': 'subTtle_1' }).text()).toBe('It’s like an online bank account for charitable giving.');
        });
        it('Should render the sub title 2 in sign up section', () => {
            expect(component.find({ 'className': 'subTtle_2' }).text()).toBe('You can add money and give to your favourite charities, all from one place. It’s free to open and we don’t charge sign-up or transaction fees for Impact Accounts.');
        });
        it('Should render the ClaimP2PSignUp component', () => {
            expect(component.find(ClaimP2PSignUp)).toHaveLength(1);
        });
    });
    describe('Testing Claim P2P "How it works" contents', () => {
        it('Should render the how it works section', () => {
            expect(component.find({ className: 'claimp2pHwItWrks' }).exists()).toBe(true);
        });
        it('Should display how it works header text', () => {
            expect(component.find({ 'data-test': 'claimp2p_howItWorks_header'}).exists()).toBe(true);
        });
        describe('Testing Claim P2P "How it works" Find Charity contents', () => {
            it('Should render the how it works find charity image', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_findCharityImage' }).prop('src')).toBe('./static/images/Bitmap.png');
            });
            it('Should display how it works find charity header', () => {
                expect(component.find({ 'data-test': 'claimp2p_findCharity_header' }).exists()).toBe(true);
            });
            it('Should display how it works find charity description', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_findCharity_desc' }).text()).toBe('Find charities that match your interests. With our powerful search tool, you can choose from thousands of registered Canadian charities.');
            });
        });
        describe('Testing Claim P2P "How it works" Add Money contents', () => {

            it('Should render the how it works add money image', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_addMoney_image' }).prop('src')).toBe('./static/images/dollerGroup.png');
            });
            it('Should display how it works find charity header', () => {
                expect(component.find({ 'data-test': 'claimp2p_addMoney_header' }).exists()).toBe(true);
            });
            it('Should display how it works find charity description', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_addMoney_desc' }).text()).toBe('Add to your account, then take as much time and space as you need to decide which charities to support.');
            });
        });
        describe('Testing Claim P2P "How it works" Give contents', () => {

            it('Should render the how it works add money image', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_give_image' }).prop('src')).toBe('./static/images/handFlower.png');
            });
            it('Should display how it works find charity description', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_give_desc' }).text()).toBe('Give to your favourite charities from your account now, or save some of your charitable dollars and build your impact over time.');
            });
        });
        describe('Testing Claim P2P "Who we are" Contents', () => {
            it('Should the text of Who we are', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_whoWeAre' }).exists()).toBe(true);
            });
            it('Should render the first description of Who we are ', () => {
                expect(component.find({ 'data-test': 'claimp2p_whoWeAre_desc1' }).text()).toBe('Charitable Impact was created to help you create the change you want to see in the world. We’re a public foundation that operates as a donor-advised fund. This means you can manage your charitable giving from a single account, which we call the Impact Account.');
            });
            it('Should render the second description of Who we are', () => {
                expect(component.find({ 'data-test': 'claimp2p_whoWeAre_desc2' }).text()).toBe('Our Impact Account comes with tools that help you plan the impact you want to make. We’re here for you no matter what causes you choose to support, how much you give, or how experienced you are with your charitable giving.');
            });
        });
        describe('Testing Claim P2P "Join Section" Contents', () => {
            it('Should render the header of Join section ', () => {
                expect(component.find({ 'data-test': 'claimp2p_header_joinCharity' }).exists()).toBe(true);
            });
            it('Should render the first description of Join section ', () => {
                expect(component.find({ 'data-test': 'claimp2p_joinSection_desc1' }).text()).toBe('donated by the Charitable Impact community');
            });
            it('Should render the first description of Join section ', () => {
                expect(component.find({ 'data-test': 'claimp2p_joinSection_desc2' }).text()).toBe('have benefited from gifts sent by donors on Charitable Impact');
            });
            it('Should render the first description of Join section ', () => {
                expect(component.find({ 'data-test': 'claimp2p_joinSection_desc3' }).text()).toBe('people have given to the causes they care about using Charitable Impact');
            });
        });
    });
});
