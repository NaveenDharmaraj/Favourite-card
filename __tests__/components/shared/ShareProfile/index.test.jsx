import React from 'react';
import {
    shallow,
    mount,
} from 'enzyme';

import {
    deepLinkUrl,
} from '../../charity/Data'; // /components/shared/ShareProfile
import {
    ShareProfile,
    mapStateToProps,
} from '../../../../components/shared/ShareProfile';
import * as actions from '../../../../actions/profile';

const getProps = () => ({
    currentUser: {
        id: 888000,
    },
    deepLinkUrl,
    disableFollow: false,
    dispatch: jest.fn(),
    isAuthenticated: true,
    liked: true,
    type: 'beneficiaries',
});

describe('Testing ShareProfile component', () => {
    const props = getProps();
    test('Testing compinent rendered', () => {
        const wrapper = mount(
            <ShareProfile
                {...props}
            />,
        );
        expect(wrapper.find('ShareProfile').exists()).toBe(true);
    });
    test('Testing component rendered', () => {
        const wrapper = mount(
            <ShareProfile
                {...props}
                deepLinkUrl={{}}
            />,
        );
        wrapper.find({ 'data-test': 'profile_shared_share_icon' }).at(1).simulate('click');
        expect(wrapper.find('input').instance().value).toEqual('');
    });
    test('Testing liked status', () => {
        const wrapper = mount(
            <ShareProfile
                {...props}
                liked={false}
            />,
        );
        expect(wrapper.find('Icon').at(0).prop('color')).toEqual('outline');
    });
    test('Testing close share modal', () => {
        const wrapper = mount(
            <ShareProfile
                {...props}
            />,
        );
        wrapper.find({ 'data-test': 'profile_shared_share_icon' }).at(1).simulate('click');
        wrapper.find('Portal').find('Icon').at(0).simulate('click');
        expect(wrapper.state('showShareModal')).toEqual(false);
    });
    test('Testing handle click on twitter of share modal', () => {
        const wrapper = mount(
            <ShareProfile
                {...props}
            />,
        );
        wrapper.find({ 'data-test': 'profile_shared_share_icon' }).at(1).simulate('click');
        wrapper.find('Portal').find('#twitter').find('Icon').simulate('click');
        expect(wrapper.state('showShareModal')).toEqual(false);
    });
    test('Testing handle click on facebook of share modal', () => {
        const wrapper = mount(
            <ShareProfile
                {...props}
            />,
        );
        wrapper.find({ 'data-test': 'profile_shared_share_icon' }).at(1).simulate('click');
        wrapper.find('Portal').find('#facebook').find('Icon').simulate('click');
        expect(wrapper.state('showShareModal')).toEqual(false);
    });
    test('Testing handle click on follow', () => {
        const spyFunc = jest.spyOn(actions, 'unfollowProfile');
        const wrapper = mount(
            <ShareProfile
                {...props}
            />,
        );
        wrapper.find('#follow').find('Icon').simulate('click');
        expect(spyFunc).toHaveBeenCalledTimes(1);
    });
    test('Testing handle click on unfollow', () => {
        const spyFunc = jest.spyOn(actions, 'followProfile');
        const wrapper = mount(
            <ShareProfile
                {...props}
                liked={false}
            />,
        );
        wrapper.find('#follow').find('Icon').simulate('click');
        expect(spyFunc).toHaveBeenCalledTimes(1);
    });
    test('Testing mapStateToProps', () => {
        const initialState = {
            auth: {
                isAuthenticated: true,
            },
            profile: {
                deepLinkUrl: '',
                disableFollow: false,
            },
            user: {
                info: {
                    id: '87',
                },
            },
        };
        expect(mapStateToProps(initialState).disableFollow).toEqual(false);
    });
});
