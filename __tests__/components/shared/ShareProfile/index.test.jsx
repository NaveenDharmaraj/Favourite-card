import React from 'react';
import {
    mount,
} from 'enzyme';

import {
    deepLinkUrl,
} from '../../charity/Data';
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

describe('Testing ShareProfile section', () => {
    const props = getProps();
    it('Should show share section using api data', () => {
        const wrapper = mount(
            <ShareProfile
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_shareSection' }).exists()).toBe(true);
    });
    describe('Testing follow functionality', () => {
        it('Should show unfollow status if liked value is false in api data', () => {
            const wrapper = mount(
                <ShareProfile
                    {...props}
                    liked={false}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_likeIcon' }).at(0).prop('color')).toEqual('outline');
        });
        it('Should show follow status if liked value is true in api data', () => {
            const wrapper = mount(
                <ShareProfile
                    {...props}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_likeIcon' }).at(0).prop('color')).toEqual('red');
        });
        it('Should call function which in-turn call follow api on click of follow icon', () => {
            const spyFunc = jest.spyOn(actions, 'followProfile');
            const wrapper = mount(
                <ShareProfile
                    {...props}
                    liked={false}
                />,
            );
            wrapper.find({ 'data-test': 'Shared_ShareProfile_likeIcon' }).at(1).simulate('click');
            expect(spyFunc).toHaveBeenCalledTimes(1);
        });
        it('Should call function which in-turn call unfollow api on click of follow icon', () => {
            const spyFunc = jest.spyOn(actions, 'unfollowProfile');
            const wrapper = mount(
                <ShareProfile
                    {...props}
                />,
            );
            wrapper.find({ 'data-test': 'Shared_ShareProfile_likeIcon' }).at(1).simulate('click');
            expect(spyFunc).toHaveBeenCalledTimes(1);
        });
    });

    describe('Testing share modal', () => {
        it('Should show share popup with empty deeplink url field for empty api data', () => {
            const wrapper = mount(
                <ShareProfile
                    {...props}
                    deepLinkUrl={{}}
                />,
            );
            wrapper.find({ 'data-test': 'Shared_ShareProfile_share_icon' }).at(1).simulate('click');
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_popup' }).exists()).toBe(true);
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_deeplink' }).at(0).instance().props.value).toEqual('');
        });
        it('Should show share popup with deeplink url field using api data', () => {
            const wrapper = mount(
                <ShareProfile
                    {...props}
                    deepLinkUrl={{
                        attributes: {
                            'short-link': 'www.charitableimpact.com',
                        },
                    }}
                />,
            );
            wrapper.find({ 'data-test': 'Shared_ShareProfile_share_icon' }).at(1).simulate('click');
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_deeplink' }).at(0).instance().props.value).toEqual('www.charitableimpact.com');
        });
        it('Should close share popup on click of close icon', () => {
            const wrapper = mount(
                <ShareProfile
                    {...props}
                />,
            );
            wrapper.find({ 'data-test': 'Shared_ShareProfile_share_icon' }).at(1).simulate('click');
            wrapper.find('Portal').find('Icon').at(0).simulate('click');
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_popup' }).exists()).toBe(false);
        });
        it('Should call window open and close popup on click of twitter icon', () => {
            window.open = jest.fn();
            const wrapper = mount(
                <ShareProfile
                    {...props}
                />,
            );
            wrapper.find({ 'data-test': 'Shared_ShareProfile_share_icon' }).at(1).simulate('click');
            wrapper.find({ 'data-test': 'Shared_ShareProfile_twitter' }).at(1).simulate('click');
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_popup' }).exists()).toBe(false);
            expect(window.open).toHaveBeenCalledTimes(1);
        });
        it('Should call window open and close popup on click of facebook icon', () => {
            window.open = jest.fn();
            const wrapper = mount(
                <ShareProfile
                    {...props}
                />,
            );
            wrapper.find({ 'data-test': 'Shared_ShareProfile_share_icon' }).at(1).simulate('click');
            wrapper.find({ 'data-test': 'Shared_ShareProfile_facebook' }).at(1).simulate('click');
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_popup' }).exists()).toBe(false);
            expect(window.open).toHaveBeenCalledTimes(1);
        });
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
