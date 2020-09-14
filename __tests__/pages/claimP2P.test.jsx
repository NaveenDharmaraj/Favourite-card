import React from 'react';
import {
    shallow,
} from 'enzyme';
import mockAxios from 'axios';

import { ClaimP2P } from '../../pages/claimP2P';
import ClaimP2PSignUp from '../../components/ClaimP2PSignUp';

const initializeComponent = (props = {}) => {
    return shallow(<ClaimP2P {...props} />);
};

const t = jest.fn().mockImplementation((key) => key);
describe('Testing ClaimP2P component when userInfo is not empty', () => {
    const props = {
        claimToken: '1234',
        userInfo: {
            avatar: 'image',
            giftAmount: '5',
            giftMessage: 'thank you',
            invitedUserEmail: 'chimp@gmail.com',
            senderDisplayName: 'chimp',
        },
        i18n: {
            language: 'en',
        },
        t,
    };
    const component = initializeComponent(props);
    it('populates the userinfo value from initial load using api', async () => {
        const userInfo = mockAxios.get.mockImplementationOnce(() => Promise.resolve(
            {
                avatar: 'image',
                giftAmount: '5',
                giftMessage: 'thank you',
                invitedUserEmail: 'chimp@gmail.com',
                senderDisplayName: 'chimp',
            },
        ));
        // Inject anything you want to test
        const props = await ClaimP2P.getInitialProps({
            query: {
                claimToken: '1234',
                namespacesRequired: [
                    'claimP2P',
                    'error',
                ],
                userInfo,
            },
        });
        expect(props).toEqual({
            claimToken: '1234',
            namespacesRequired: ['claimP2P'],
            userInfo: {
                avatar: 'image',
                giftAmount: '5',
                giftMessage: 'thank you',
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
            expect(component.find({ 'data-test': 'claimp2p_header_thanknote' }).text()).toBe('"thank you"');
        });
    });
    describe('Testing Claim P2P Sign up contents', () => {
        it('Should render the sub title 1 in sign up section', () => {
            expect(component.find({ 'className': 'subTtle_1' }).text()).toBe('impAccountPara1');
        });
        it('Should render the sub title 2 in sign up section', () => {
            expect(component.find({ 'className': 'subTtle_2' }).text()).toBe('impAccountPara2');
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
            expect(component.find({ 'data-test': 'claimp2p_howItWorks_header' }).exists()).toBe(true);
        });
        describe('Testing Claim P2P "How it works" Find Charity contents', () => {
            it('Should render the how it works find charity image', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_findCharityImage' }).prop('src')).toBe('/static/images/Bitmap.png');
            });
            it('Should display how it works find charity header', () => {
                expect(component.find({ 'data-test': 'claimp2p_findCharity_header' }).render().text()).toBe('howItWorks.findCharity');
            });
            it('Should display how it works find charity description', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_findCharity_desc' }).text()).toBe('howItWorks.findCharityDesc');
            });
        });
        describe('Testing Claim P2P "How it works" Add Money contents', () => {

            it('Should render the how it works add money image', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_addMoney_image' }).prop('src')).toBe('/static/images/dollerGroup.png');
            });
            it('Should display how it works find charity header', () => {
                expect(component.find({ 'data-test': 'claimp2p_addMoney_header' }).render().text()).toBe('howItWorks.addMoney');
            });
            it('Should display how it works find charity description', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_addMoney_desc' }).text()).toBe('howItWorks.addMoneyDesc');
            });
        });
        describe('Testing Claim P2P "How it works" Give contents', () => {

            it('Should render the how it works add money image', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_give_image' }).prop('src')).toBe('/static/images/handFlower.png');
            });
            it('Should display how it works find charity description', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_give_desc' }).text()).toBe('howItWorks.giveDesc');
            });
        });
        describe('Testing Claim P2P "Who we are" Contents', () => {
            it('Should the text of Who we are', () => {
                expect(component.find({ 'data-test': 'claimp2p_howItWorks_whoWeAre' }).render().text()).toBe('whoWeAre.whoWeAreHeader');
            });
            it('Should render the first description of Who we are ', () => {
                expect(component.find({ 'data-test': 'claimp2p_whoWeAre_desc1' }).text()).toBe('whoWeAre.whoWeAreDesc1');
            });
            it('Should render the second description of Who we are', () => {
                expect(component.find({ 'data-test': 'claimp2p_whoWeAre_desc2' }).text()).toBe('whoWeAre.whoWeAreDesc2');
            });
        });
        describe('Testing Claim P2P "Join Section" Contents', () => {
            it('Should render the header of Join section ', () => {
                expect(component.find({ 'data-test': 'claimp2p_header_joinCharity' }).render().text()).toBe('join.joinHeader');
            });
            it('Should render the first description of Join section ', () => {
                expect(component.find({ 'data-test': 'claimp2p_joinSection_desc1' }).text()).toBe('join.joindesc1Desc');
            });
            it('Should render the first description of Join section ', () => {
                expect(component.find({ 'data-test': 'claimp2p_joinSection_desc2' }).text()).toBe('join.joindesc2Desc');
            });
            it('Should render the first description of Join section ', () => {
                expect(component.find({ 'data-test': 'claimp2p_joinSection_desc3' }).text()).toBe('join.joindesc3Desc');
            });
        });
    });
});
