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
    it('Should rendered share section', () => {
        const wrapper = mount(
            <ShareProfile
                {...props}
            />,
        );
        expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_shareSection' }).exists()).toBe(true);
    });
    describe('Testing follow functionality', () => {
        it('Should show unfollow status', () => {
            const wrapper = mount(
                <ShareProfile
                    {...props}
                    liked={false}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_likeIcon' }).at(0).prop('color')).toEqual('outline');
        });
        it('Should show follow status', () => {
            const wrapper = mount(
                <ShareProfile
                    {...props}
                />,
            );
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_likeIcon' }).at(0).prop('color')).toEqual('red');
        });
        it('Should call follow action on click', () => {
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
        it('Should call unfollow action on click', () => {
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
        it('Should render share modal with empty deeplink url', () => {
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
        it('Should have deeplink value', () => {
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
        it('Should close share modal', () => {
            const wrapper = mount(
                <ShareProfile
                    {...props}
                />,
            );
            wrapper.find({ 'data-test': 'Shared_ShareProfile_share_icon' }).at(1).simulate('click');
            wrapper.find('Portal').find('Icon').at(0).simulate('click');
            expect(wrapper.find({ 'data-test': 'Shared_ShareProfile_popup' }).exists()).toBe(false);
        });
        it('Should call window open and close modal on twitter icon click', () => {
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
        it('Should call window open and close modal on facebook icon click', () => {
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
