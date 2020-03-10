import React from 'react';
import { shallow } from 'enzyme';
import _isEmpty from 'lodash/isEmpty';

import { AddMoneySuccess } from '../../../../../components/Give/Success/AddMoneySuccess';


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
    donationMatchData: [],
    i18n: {
        language: 'en',
    },
    successData: {
        currency: 'USD',
        giveData: {
            donationAmount: '',
            donationMatch: {
                id: null,
                value: null,
            },
            giftType: {
                value: null,
            },
            giveTo: {
                name: '',
                slug: '',
                type: '',
            },
        },
        type: null,
    },
    t,
};
const setUp = (prop) => {
    const props = {
        ...defaultProps,
        ...prop,
    };
    const component = shallow(<AddMoneySuccess {...props} />);
    return component;
};
describe('AddMoneySuccess screen Component', () => {
    let component;

    beforeEach(() => {
        component = setUp();
    });
    it('It should have key addMoneySecondText in secondparagraph for giveTo type user', () => {
        const props = {
            successData: {
                currency: 'USD',
                giveData: {
                    donationAmount: '10',
                    giveTo: {
                        name: 'charitable impact',
                        type: 'user',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('p').render().text();
        expect(wrapper).toEqual('addMoneySecondText $10.00');
    });
    it('It should have key addMoneySecondTextCompany in secondparagraph for giveTo type company', () => {
        const props = {
            successData: {
                currency: 'USD',
                giveData: {
                    donationAmount: '10',
                    giveTo: {
                        name: 'chimp',
                        type: 'companies',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('p').render().text();
        expect(wrapper).toEqual('addMoneySecondTextCompany $10.00 chimp');
    });
    it('It should have key addMoneyThirdText in thirdParagraph if it is non recurring', () => {
        const props = {
            successData: {
                currency: 'USD',
                giveData: {
                    donationAmount: '10',
                    giftType: {
                        value: 0,
                    },
                    giveTo: {
                        name: 'chimp',
                        type: 'companies',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('p').at(1).render().text();
        expect(wrapper).toEqual('addMoneyThirdText');
    });
    it('It should not have thirdParagraph if it is recurring', () => {
        const props = {
            successData: {
                currency: 'USD',
                giveData: {
                    donationAmount: '10',
                    giftType: {
                        value: 1,
                    },
                    giveTo: {
                        name: 'chimp',
                        type: 'companies',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('p').at(1);
        expect(wrapper).toHaveLength(0);
    });
    it('It should have key addMoneyTaxButtonText as text for tax button if it is non recurring', () => {
        const props = {
            successData: {
                currency: 'USD',
                giveData: {
                    donationAmount: '10',
                    giftType: {
                        value: 0,
                    },
                    giveTo: {
                        name: 'chimp',
                        type: 'companies',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('.blue-bordr-btn-round-def').render().text();
        expect(wrapper).toEqual('addMoneyTaxButtonText');
    });
    it('It should not have div for tax button if it is recurring', () => {
        const props = {
            successData: {
                currency: 'USD',
                giveData: {
                    donationAmount: '10',
                    giftType: {
                        value: 1,
                    },
                    giveTo: {
                        name: 'chimp',
                        type: 'companies',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('.blue-bordr-btn-round-def');
        expect(wrapper).toHaveLength(0);
    });
    it('It should have key goToYourDashboard as dashboard button', () => {
        const props = {
            successData: {
                currency: 'USD',
                giveData: {
                    donationAmount: '10',
                    giftType: {
                        value: 0,
                    },
                    giveTo: {
                        name: 'chimp',
                        type: 'user',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('.blue-btn-rounded-def').render().text();
        expect(wrapper).toEqual('goToYourDashboard');
    });
    it('It should have key goToCompanyDashboard and company name as dashboard button if the giveto type is company', () => {
        const props = {
            successData: {
                currency: 'USD',
                giveData: {
                    donationAmount: '10',
                    giftType: {
                        value: 0,
                    },
                    giveTo: {
                        name: 'chimp',
                        type: 'companies',
                    },
                },
            },
        };
        component = setUp(props);
        const wrapper = component.find('.blue-btn-rounded-def').render().text();
        expect(wrapper).toEqual('goToCompanyDashboard chimp');
    });
});
