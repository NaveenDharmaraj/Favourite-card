import React from 'react';
import {
    shallow,
    mount,
} from 'enzyme';

import {
    Review,
    mapStateToProps,
} from '../../../../components/Give/Review/index';
import * as giveActions from '../../../../actions/give';
// import * as Router from '../../../../routes';

import {
    donationFlowobject,
    flowSteps,
    companiesAccountsData,
    donationMatchData,
    groupFlowObject,
    charityFlowObject,
    p2pFlowObject,
    giveFromGroup,
    giveFromCampaign,
} from './Data';

const getProps = () => ({
    companiesAccountsData,
    currentStep: 'review',
    currentUser: {
        id: '888000',
    },
    dispatch: jest.fn(),
    donationMatchData,
    flowObject: {},
    flowSteps,
    i18n: {
        language: 'en',
    },
    t: jest.fn().mockImplementation((key) => key),
});

jest.mock('../../../../routes', () => ({
    Router: {
        pushRoute: jest.fn(),
    },
}));

describe('Testing Review step', () => {
    const props = getProps();
    window.scrollTo = jest.fn();
    it('Should NOT show Review page if steps are completed', () => {
        const modifiedProps = {
            ...donationFlowobject,
            stepsCompleted: true,
        };
        const wrapper = shallow(
            <Review
                {...props}
                flowObject={modifiedProps}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Give_Review_banner' }).exists()).toBe(false);
    }); 
    describe('Testing Review page for different flows', () => {
        it('Should show banner with text heading as "Add Money" for "Add Money" transaction', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={donationFlowobject}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_banner' }).hasClass('flowReviewbanner'))
                .toEqual(true);
            expect(wrapper.find({ 'data-test': 'Give_Review_banner_text' }).props().children)
                .toEqual('donationHeadingText');
        });
        it('Should show banner with text heading as "Give to {group name}" for "Give to Group" transaction', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={groupFlowObject}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_banner' }).hasClass('givinggroupbanner'))
                .toEqual(true);
            expect(wrapper.find({ 'data-test': 'Give_Review_banner_text' }).props().children)
                .toEqual('reviewGiveToText Rescue Rangers');
        });
        it('Should show banner with text heading as "Give from {group name}" for "Give from Group" transaction', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={giveFromGroup}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_banner' }).hasClass('givinggroupbanner'))
                .toEqual(true);
            expect(wrapper.find({ 'data-test': 'Give_Review_banner_text' }).props().children)
                .toEqual('reviewGiveFromText Dwarf Rabbit Disaster Recovery');
        });
        it('Should show banner with text heading as "Give to {charity name} for "Give to Charity" transaction', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={charityFlowObject}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_banner' }).hasClass('charityallocationbanner'))
                .toEqual(true);
            expect(wrapper.find({ 'data-test': 'Give_Review_banner_text' }).props().children)
                .toEqual('reviewGiveToText Amistad Canada');
        });
        it('Should show Review screen for "Give to Friend"', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={p2pFlowObject}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_banner' }).hasClass('flowReviewbanner'))
                .toEqual(true);
            expect(wrapper.find({ 'data-test': 'Give_Review_banner_text' }).props().children)
                .toEqual('reviewP2pText');
        });
    });
    
    // TODO add test for other type
    // it('Should show "Add money" as banner text if type is "donations"', () => {
    //     const wrapper = mount(
    //         <Review
    //             {...props}
    //             flowObject={donationFlowobject}
    //         />,
    //     );
    //     expect(wrapper.find({ 'data-test': 'Give_Review_banner_text' }).at(1).text()).toEqual('donationHeadingText');
    // });
    // TODO add test for other type

    // NOT REQ
    // it('Should show Breadcrumb', () => {
    //     const wrapper = shallow(
    //         <Review
    //             {...props}
    //             flowObject={donationFlowobject}
    //         />,
    //     );
    //     expect(wrapper.find('FlowBreadcrumbs').exists()).toBe(true);
    // });
    describe('Testing "Give to" section for different flows', () => {
        it('Should show "Give to" section with profile image for "Add Money" flow', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={donationFlowobject}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_amount_details' }).exists())
                .toBe(true);
        });
        it('Should show "Give to" section for P2P transaction with multiple recepients list', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={p2pFlowObject}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_P2P_amount_details' }).exists())
                .toBe(true);
        });
        it('Should show "Give to" section for single recepient P2P transaction', () => {
            const modifiedProps = {
                ...p2pFlowObject,
                giveData: {
                    ...p2pFlowObject.giveData,
                    recipients: [
                        'a@b.com',
                    ],
                    selectedFriendsList: [],
                },
            };
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={modifiedProps}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_amount_details' }).exists()).toBe(true);
        });
        it('Should show "Give to" section for give from campaign transaction', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={giveFromCampaign}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_amount_details' }).exists()).toBe(true);
        });

        // TEST LINK URL editUrl
        // it('Should show "Give to" section for give from group transaction', () => {
        //     const wrapper = shallow(
        //         <Review
        //             {...props}
        //             flowObject={giveFromGroup}
        //         />,
        //     );
        //     expect(wrapper.find({ 'data-test': 'Give_Review_amount_details' }).exists())
        //         .toBe(true);
        // });

        // TEST LINK URL editUrl
        // it('Should show "Give to" section for give from campaign transaction', () => {
        //     const wrapper = shallow(
        //         <Review
        //             {...props}
        //             flowObject={giveFromCampaign}
        //         />,
        //     );
        //     expect(wrapper.find({ 'data-test': 'Give_Review_amount_details' }).exists()).toBe(true);
        // });
    });
    it('Should show transaction details section if donation details is not empty', () => {
        const wrapper = shallow(
            <Review
                {...props}
                flowObject={donationFlowobject}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Give_Review_transaction_details' }).exists())
            .toBe(true);
    });
    // it('Should not show transaction details section if donation details is empty', () => {
    //     const modifiedProps = {
    //         ...donationFlowobject,
    //         giveData: {
    //             ...donationFlowobject.giveData,
    //             giveTo: {},
    //         },
    //     };
    //     const wrapper = shallow(
    //         <Review
    //             {...props}
    //             flowObject={modifiedProps}
    //         />,
    //     );
    //     expect(wrapper.find({ 'data-test': 'Give_Review_transaction_details' }).exists()).toBe(true);
    // });
    describe('Testing Refund message section', () => {
        it('Should show refund message for add once transaction', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={donationFlowobject}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_refund_text' }).render().text())
                .toEqual('commonNonrefundable');
        });
        it('Should show refund message for reccuring transaction if transaction is selected as "Add monthly" ', () => {
            const modifiedProps = {
                ...donationFlowobject,
                giveData: {
                    ...donationFlowobject.giveData,
                    giftType: {
                        ...donationFlowobject.giveData.giftType,
                        value: 1,
                    },
                },
            };
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={modifiedProps}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_refund_text' }).render().text()).toEqual('commonRecurringNonrefundable');
        });
    });
    describe('Testing button text in different flows', () => {
        it('Should show "Add money" as button text for donation flow', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={donationFlowobject}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_submit_button' }).render().text())
                .toEqual('reviewAddMoney');
        });
        it('Should show "Send gift" as button text for all flows except add money', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={p2pFlowObject}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Give_Review_submit_button' }).render().text())
                .toEqual('reviewP2pGive');
        });
        it('Should show submitting text as on click of "Add Money" button', () => {
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={donationFlowobject}
                />,
            );
            wrapper.find({ 'data-test': 'Give_Review_submit_button' }).simulate('click');
            expect(wrapper.find({ 'data-test': 'Give_Review_submit_button' }).render().text())
                .toEqual('giveCommon:submittingButton');
        });
        it('Should redirect to next page on click of "Add Money" button', () => {
            const spyFunc = jest.spyOn(giveActions, 'proceed');
            const wrapper = shallow(
                <Review
                    {...props}
                    flowObject={donationFlowobject}
                />,
            );
            wrapper.find({ 'data-test': 'Give_Review_submit_button' }).simulate('click');
            expect(spyFunc).toHaveBeenCalledTimes(1);
        });
    });
    // 
    // it('Should show Edit', () => {
    //     const wrapper = shallow(
    //         <Review
    //             {...props}
    //             flowObject={donationFlowobject}
    //         />,
    //     );
    //     expect(wrapper.find({ 'data-test': 'Give_Review_submit_button' }).render().text()).toEqual('reviewAddMoney');
    // });

    // it('Should show donation amount if type is "donations', () => {
    //     const wrapper = mount(
    //         <Review
    //             {...props}
    //             flowObject={donationFlowobject}
    //         />,
    //     );
    //     expect(wrapper.find({ 'data-test': 'Give_Review_amount_details' }).find('Header').text()).toEqual('$500.00To Impact Account');
    // });
    // it('Should show "Add Once" as frequency if Frequency is Add Once', () => {
    //     const wrapper = mount(
    //         <Review
    //             {...props}
    //             flowObject={donationFlowobject}
    //         />,
    //     );
    //     expect(wrapper.find({ 'data-test': 'Give_Review_transaction_details' }).at(0)
    //         .find('.tabletwo').at(1).text()).toEqual('reviewAddOnce');
    // });
    // it('Should show "Add monthly on 1st" as frequency if "giftType" value is 1', () => {
    //     const modifiedFlowObject = {
    //         ...donationFlowobject,
    //         giveData: {
    //             ...donationFlowobject.giveData,
    //             giftType: {
    //                 ...donationFlowobject.giveData.giftType,
    //                 value: 1,
    //             },
    //         },
    //     };
    //     const wrapper = mount(
    //         <Review
    //             {...props}
    //             flowObject={modifiedFlowObject}
    //         />,
    //     );
    //     expect(wrapper.find({ 'data-test': 'Give_Review_transaction_details' }).at(0)
    //         .find('.tabletwo').at(1).text()).toEqual('reviewAddMonthly  onFirstMessage');
    // });
    // it('Should show "Add monthly on 15th" as frequency if "giftType" value is 15', () => {
    //     const modifiedFlowObject = {
    //         ...donationFlowobject,
    //         giveData: {
    //             ...donationFlowobject.giveData,
    //             giftType: {
    //                 ...donationFlowobject.giveData.giftType,
    //                 value: 15,
    //             },
    //         },
    //     };
    //     const wrapper = mount(
    //         <Review
    //             {...props}
    //             flowObject={modifiedFlowObject}
    //         />,
    //     );
    //     expect(wrapper.find({ 'data-test': 'Give_Review_transaction_details' }).at(0)
    //         .find('.tabletwo').at(1).text()).toEqual('reviewAddMonthly  onFifteenthMessage');
    // });
    // it('Should show "Payment method" section if "creditCard value is more than 0', () => {
    //     const wrapper = mount(
    //         <Review
    //             {...props}
    //             flowObject={donationFlowobject}
    //         />,
    //     );
    //     expect(wrapper.find({ 'data-test': 'Give_Review_transaction_details' }).at(2)
    //         .find('.tableOne').at(1).text()).toEqual('reviewPaymentMethod');
    //     expect(wrapper.find({ 'data-test': 'Give_Review_transaction_details' }).at(2)
    //         .find('.tabletwo').at(1).text()).toEqual('StripeMock Visa ending in 4242');
    // });

    // it('Should not show "Payment method" section if "creditCard value is 0', () => {
    //     const modifiedFlowObject = {
    //         ...donationFlowobject,
    //         giveData: {
    //             ...donationFlowobject.giveData,
    //             creditCard: {
    //                 ...donationFlowobject.giveData.creditCard,
    //                 value: '',
    //             },
    //         },
    //     };
    //     const wrapper = mount(
    //         <Review
    //             {...props}
    //             flowObject={modifiedFlowObject}
    //         />,
    //     );
    //     console.log('Wr-->', wrapper.debug());
    //     expect(wrapper.find({ 'data-test': 'Give_Review_transaction_details' }).at(2)
    //         .find('.tableOne').at(1).text()).toEqual('reviewPaymentMethod');
    // });
    // it('Should show "Payment method" section if "creditCard value is more than 0', () => {
    //     const wrapper = mount(
    //         <Review
    //             {...props}
    //             flowObject={donationFlowobject}
    //         />,
    //     );
    //     // console.log('wr-->', wrapper.debug());
    // });

    test('Testing mapStateToProps', () => {
        const initialState = {
            give: {
                companyData: [],
                groupSlugDetails: {},
            },
            user: {
                companiesAccountsData,
                donationMatchData,
                fund: {},
                info: {
                    id: '888000',
                },
            },
        };
        expect(mapStateToProps(initialState).currentUser.id).toEqual('888000');
    });
});
