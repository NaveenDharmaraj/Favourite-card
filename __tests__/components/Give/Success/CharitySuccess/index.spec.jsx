import React from 'react';
import { shallow } from 'enzyme';
import _isEmpty from 'lodash/isEmpty';

import { CharitySuccess } from '../../../../../components/Give/Success/CharitySuccess';


const t = jest.fn().mockImplementation((key, params) => {
    const formatMessage = [];
    if (key) {
        formatMessage.push(key);
    }
    if (!_isEmpty(params)) {
        Object.values(params).forEach((value) => {
            formatMessage.push(value);
        });
    }
    const values = formatMessage.join().replace(/,/g, ' ');
    return `${values}`;
});

const defaultProps = {
    currency: 'USD',
    i18n: {
        language: 'en',
    },
    successData: {
        currency: 'USD',
        giveData: {
            giftType: {
                value: 0,
            },
            giveTo: {
                eftEnabled: false,
                name: 'chimp',
            },
        },
    },
    t,
};
const setUp = (prop) => {
    const props = {
        ...defaultProps,
        ...prop,
    };
    const component = shallow(<CharitySuccess {...props} />);
    return component;
};
describe('CharitySuccess screen Component', () => {
    let component;

    beforeEach(() => {
        component = setUp();
    });
    // it('It should have key charityTimeForSending in secondparagraph', () => {
    //     const props = {
    //         successData: {
    //             currency: 'USD',
    //             giveData: {
    //                 giveTo: {
    //                     eftEnabled: false,
    //                     name: 'the-canadian-red-cross-society-la-societe-canadienne-de-la-croix-rouge'
    //                 },
    //             },
    //         },
    //     };
    //     component = setUp(props);
    //     const wrapper = component;
    //     console.log(wrapper.debug());
    //     //expect(wrapper).toEqual('charityTimeForSending $10.00');
    // });
    // it('It should have key addMoneySecondTextCompany in firstParagraph for giveTo type company', () => {
    //     const props = {
    //         successData: {
    //             currency: 'USD',
    //             giveData: {
    //                 donationAmount: '10',
    //                 giveTo: {
    //                     name: 'chimp',
    //                     type: 'companies',
    //                 },
    //             },
    //         },
    //     };
    //     component = setUp(props);
    //     const wrapper = component.find('p').render().text();
    //     expect(wrapper).toEqual('addMoneySecondTextCompany $10.00 chimp');
    // });
    it('It should have key charityRecurringThirdText in thirdParagraph if it is recurring', () => {
        const props = {
            successData: {
                currency: 'USD',
                giveData: {
                    giftType: {
                        value: 1,
                    },
                    giveTo: {
                        eftEnabled: false,
                        name: 'chimp',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('p').at(1).render().text();
        expect(wrapper).toEqual('charityRecurringThirdText');
    });
    it('It should not have thirdParagraph if it is non recurring', () => {
        component = setUp();
        const wrapper = component.find('p').at(1);
        expect(wrapper).toHaveLength(0);
    });

    it('It should have key charityMonthlyDepositButtonText as text for monthly tax button if it is recurring', () => {
        const props = {
            successData: {
                giveData: {
                    giftType: {
                        value: 1,
                    },
                    giveTo: {
                        eftEnabled: false,
                        name: 'chimp',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('.blue-bordr-btn-round-def').render().text();
        expect(wrapper).toEqual('charityMonthlyDepositButtonText');
    });
    it('It should not have div for monthly tax button if it is non recurring', () => {
        component = setUp();
        const wrapper = component.find('.blue-bordr-btn-round-def');
        expect(wrapper).toHaveLength(0);
    });
    it('It should have key doneText as done button', () => {
        component = setUp();
        const wrapper = component.find('.blue-btn-rounded-def').render().text();
        expect(wrapper).toEqual('doneText');
    });
});
