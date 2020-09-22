import React from 'react';
import { shallow } from 'enzyme';

import { Success } from '../../../../components/Give/Success/index';
import AddMoneySuccess from '../../../../components/Give/Success/AddMoneySuccess';
import CharitySuccess from '../../../../components/Give/Success/CharitySuccess';

const t = jest.fn().mockImplementation((key) => key);
const defaultProps = {
    flowObject: {
        type: 'donations',
    },
    t,
};
const setUp = (prop) => {
    const props = {
        ...defaultProps,
        ...prop,
    };
    const component = shallow(<Success {...props} />);
    return component;
};
describe('Success screen Component', () => {
    let component;
    beforeEach(() => {
        component = setUp();
    });
    it('It should render success images div', () => {
        component = setUp();
        expect(component.find('.flowSuccessImg')).toHaveLength(1);
    });
    it('It should have key addMoneyFirstText in firstParagraph for type donations', () => {
        const props = {
            successData: {
                type: 'donations',
            },
        };
        component = setUp(props);
        const wrapper = component.find('Header').render().text();
        expect(wrapper).toEqual('addMoneyFirstText');
    });
    it('It should have key allocationFirstText in firstParagraph for type other than donations', () => {
        const props = {
            successData: {
                type: 'give/to/charity',
            },
        };
        component = setUp(props);
        const wrapper = component.find('Header').render().text();
        expect(wrapper).toEqual('allocationFirstText');
    });
    it('It should render AddMoneyComponent for type donations', () => {
        component = setUp();
        expect(component.find(AddMoneySuccess)).toHaveLength(1);
    });
    it('It should render CharitySuccess for type give/to/charity', () => {
        const props = {
            flowObject: {
                type: 'give/to/charity',
            },
        };
        component = setUp(props);
        expect(component.find(CharitySuccess)).toHaveLength(1);
    });
});
