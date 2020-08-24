
import mockAxios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getCampaignSupportGroups, getCampaignFromSlug, getCampaignGalleryImages, campaignSubGroupSeeMore } from '../../actions/profile';
import { campaignSubGroupDetails, campaignDetails, campaignImageGallery } from './Data/profile_Data';

describe('Champaign profile actions test', () => {

    let store;
    beforeEach(() => {
        const middlewares = [
            thunk,
        ];
        const mockStore = configureMockStore(middlewares);
        store = mockStore();
        mockAxios.get.mockReset();
    });

    describe('Testing campaign subgroup data', () => {
        it('Should get campaign sub group details when id is passed as parameter', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    ...campaignSubGroupDetails,
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        campaignSubGroupDetails: [],
                    },
                    type: 'CLEAR_DATA_FOR_CAMPAIGNS',
                },
                {
                    payload: {
                        subGroupListLoader: true,
                    },
                    type: 'SUB_GROUP_LIST_LOADER',
                },
                {
                    payload: {
                        subGroupListLoader: false,
                    },
                    type: 'SUB_GROUP_LIST_LOADER',
                },
                {
                    payload: {
                        campaignSubGroupDetails: {
                            ...campaignSubGroupDetails,
                        }
                    },
                    type: 'GET_SUB_GROUPS_FOR_CAMPAIGN',
                },
                {
                    payload: {
                        searchData: '',
                    },
                    type: 'STORE_SEARCH_KEY_FOR_CAMPAIGN',
                },
            ];
            const id = '21';
            await store.dispatch(getCampaignSupportGroups(id)).then(() => {
                expect.assertions(2);
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockAxios.get).toHaveBeenCalledTimes(1);
            });
        });

        it('Should get filtered campaign sub group details when both id and searchkey is passed as parameter', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    ...campaignSubGroupDetails,
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        campaignSubGroupDetails: [],
                    },
                    type: 'CLEAR_DATA_FOR_CAMPAIGNS',
                },
                {
                    payload: {
                        subGroupListLoader: true,
                    },
                    type: 'SUB_GROUP_LIST_LOADER',
                },
                {
                    payload: {
                        subGroupListLoader: false,
                    },
                    type: 'SUB_GROUP_LIST_LOADER',
                },
                {
                    payload: {
                        campaignSubGroupDetails: {
                            ...campaignSubGroupDetails,
                        }
                    },
                    type: 'GET_SUB_GROUPS_FOR_CAMPAIGN',
                },
                {
                    payload: {
                        searchData: 'gr',
                    },
                    type: 'STORE_SEARCH_KEY_FOR_CAMPAIGN',
                },
            ];
            const id = '21';
            const searchKey = 'gr'
            await store.dispatch(getCampaignSupportGroups(id, searchKey)).then(() => {
                expect.assertions(2);
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockAxios.get).toHaveBeenCalledTimes(1);
            });
        });

        it('Should stop loader on API error', async () => {
            const error = 'Error scenario';
            mockAxios.get.mockImplementationOnce(() => Promise.reject(
                error,
            ));
            const expectedActions = [
                {
                    payload: {
                        campaignSubGroupDetails: [],
                    },
                    type: 'CLEAR_DATA_FOR_CAMPAIGNS',
                },
                {
                    payload: {
                        subGroupListLoader: true,
                    },
                    type: 'SUB_GROUP_LIST_LOADER',
                },
                {
                    payload: {
                        subGroupListLoader: false,
                    },
                    type: 'SUB_GROUP_LIST_LOADER',
                },
            ];

            await store.dispatch(getCampaignSupportGroups()).then(() => {
                expect.assertions(2);
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockAxios.get).toHaveBeenCalledTimes(1);
            });
        });
    })

    describe('Testing  campaign details from slug', () => {
        it('Should get campaign details list when slug is passed', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    data: {
                        ...campaignDetails,
                    }
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        slugApiErrorStats: false,
                    },
                    type: 'SLUG_API_ERROR_STATUS',
                },
                {
                    payload: {
                        campaignSubGroupDetails: [],
                    },
                    type: 'CLEAR_DATA_FOR_CAMPAIGNS',
                },
                {
                    payload: {
                        subGroupListLoader: true,
                    },
                    type: 'SUB_GROUP_LIST_LOADER',
                },
                {
                    payload: {
                        campaignDetails: {
                            ...campaignDetails,
                        }
                    },
                    type: 'GET_CAMPAIGN_FROM_SLUG',
                }
            ];
            const slug = 'birds-squad';
            await store.dispatch(getCampaignFromSlug(slug)).then(() => {
                expect.assertions(2);
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockAxios.get).toHaveBeenCalledTimes(1);
            });
        });

        it('Should set slugApiErrorStats to true on API error', async () => {
            const error = 'Error scenario';
            mockAxios.get.mockImplementationOnce(() => Promise.reject(
                error,
            ));
            const expectedActions = [
                {
                    payload: {
                        slugApiErrorStats: false,
                    },
                    type: 'SLUG_API_ERROR_STATUS',
                },
                {
                    payload: {
                        campaignSubGroupDetails: [],
                    },
                    type: 'CLEAR_DATA_FOR_CAMPAIGNS',
                },
                {
                    payload: {
                        slugApiErrorStats: true,
                    },
                    type: 'SLUG_API_ERROR_STATUS',
                },
            ];
            await store.dispatch(getCampaignFromSlug()).then(() => {
                expect.assertions(2);
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockAxios.get).toHaveBeenCalledTimes(1);
            });
        })
    })

    describe('Testing campaign gallery images', () => {
        it('Should get campaign gallery images', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    data: {
                        ...campaignImageGallery,
                    }
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        campaignImageGallery: {
                            ...campaignImageGallery,
                        }
                    },
                    type: 'GET_IMAGES_FOR_CAMPAIGN',
                }
            ];
            const id = '21';
            const token = '123'
            await store.dispatch(getCampaignGalleryImages(token, id)).then(() => {
                expect.assertions(2);
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockAxios.get).toHaveBeenCalledTimes(1);
            });
        })
    })

    describe('Testing campaign sub group see more details', () => {
        it('Should get more campaign sub group details when api is called', async () => {
            mockAxios.get.mockImplementationOnce(() => Promise.resolve(
                {
                    ...campaignSubGroupDetails,
                },
            ));
            const expectedActions = [
                {
                    payload: {
                        seeMoreLoaderStatus: false,
                    },
                    type: 'SEE_MORE_LOADER',
                },
                {
                    payload: {
                        campaignSubGroupDetails: {
                            ...campaignSubGroupDetails,
                        },
                        isViewMore: true,
                    },
                    type: 'GET_SUB_GROUPS_FOR_CAMPAIGN',
                }
            ];
            const url = 'https://api.dev.charitableimpact.com/core/v2/campaigns/12/subGroups?page%5Bnumber%5D=2&page%5Bsize%5D=6';
            const isViewMore = true;
            await store.dispatch(campaignSubGroupSeeMore(url, isViewMore)).then(() => {
                expect.assertions(2);
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockAxios.get).toHaveBeenCalledTimes(1);
            });
        });
    });

})
