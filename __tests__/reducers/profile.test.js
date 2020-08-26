
import profile from '../../reducers/profile';

import { campaignDetails, campaignSubGroupDetails, deepLink, campaignImageGallery } from './Data/profile_Data';

describe('Testing campaign profile Reducer', () => {
    it('Should match state with payload for campaign data', () => {
        const type = 'GET_CAMPAIGN_FROM_SLUG';
        const payload = {
            campaignDetails,
        };
        const newState = profile(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });

    it('Should reset campaign subgroup data', () => {
        const type = 'CLEAR_DATA_FOR_CAMPAIGNS';
        const payload = {
            campaignSubGroupDetails,
            campaignSubGroupsShowMoreUrl: null,
        };
        const newState = profile(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });

    it('Should match state with expected for campaign subgroup data', () => {
        const type = 'GET_SUB_GROUPS_FOR_CAMPAIGN';
        const payload = {
            campaignSubGroupDetails,
        };
        const expected = {
            campaignSubGroupDetails: campaignSubGroupDetails.data,
            campaignSubGroupsShowMoreUrl: campaignSubGroupDetails.links.next,
        }
        const newState = profile({}, {
            payload,
            type,
        });
        expect(newState).toEqual(expected);
    });

    it('Should match state with payload for campaign subgroup loader', () => {
        const type = 'SUB_GROUP_LIST_LOADER';
        const payload = {
            subGroupListLoader: true,
        };
        const newState = profile(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });

    it('Should match state with expected data for deeplink url', () => {
        const type = 'DEEP_LINK_URL';
        const payload = {
            deepLink,
        };
        const expected = {
            deepLinkUrl: {
                ...deepLink,
            },
        }
        const newState = profile(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(expected);
    });

    it('Should match state with payload for disable follow button', () => {
        const type = 'DISABLE_FOLLOW_BUTTON';
        const payload = {
            disableFollow: false,
        };
        const newState = profile(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });

    it('Should match state with payload for see more loader', () => {
        const type = 'SEE_MORE_LOADER';
        const payload = {
            seeMoreLoaderStatus: true,
        };
        const newState = profile(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });

    it('Should match state with payload for getting images for campaign', () => {
        const type = 'GET_IMAGES_FOR_CAMPAIGN';
        const payload = {
            campaignImageGallery,
        };
        const newState = profile(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });

    it('Should match state with expected data for save follow campaign status', () => {
        const type = 'SAVE_FOLLOW_STATUS_CAMPAIGN';
        const payload = {
            followStatus: true,
        };
        const expected = {
            campaignDetails: {
                ...campaignDetails,
                attributes: {
                    ...campaignDetails.attributes,
                    liked: payload.followStatus,
                },
            },
        }
        const newState = profile({ campaignDetails }, {
            payload,
            type,
        });
        expect(newState).toEqual(expected);
    });

    it('Should match state with payload for api error status', () => {
        const type = 'SLUG_API_ERROR_STATUS';
        const payload = {
            slugApiErrorStats: false,
        };
        const newState = profile(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });

    it('Should match state with payload for storing search key data', () => {
        const type = 'STORE_SEARCH_KEY_FOR_CAMPAIGN';
        const payload = {
            searchData: 'abc',
        };
        const newState = profile(undefined, {
            payload,
            type,
        });
        expect(newState).toEqual(payload);
    });

})
