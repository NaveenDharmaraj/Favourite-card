import mockAxios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
    claimp2pCreateNewUser,
} from '../../actions/onBoarding';

describe('onBoarding action test', () => {
    let store;
    beforeEach(() => {
        const middlewares = [
            thunk,
        ];
        const mockStore = configureMockStore(middlewares);
        store = mockStore();
    });
    it('Should call claimp2pcreateNewUser function once', async () => {
        const data = {
            data: {
                attributes: {
                    avatar: 'https://lab-monkey.herokuapp.com/assets/avatars/chimp-icon-individual-6d2a6f44ac40c214255806622b808ce56f41b5bd841ae9738a1d64cba8e5098d.png',
                    balance: '5.00',
                    createdAt: '2020-07-02T07:08:32.000-07:00',
                    displayName: 'chimp',
                    email: 'cb@gmail.com',
                    firstName: 'chimp',
                    language: 'en',
                    lastName: '12',
                },
                id: '999187',
                type: 'users',

            },
        };
        mockAxios.post.mockImplementationOnce(() => Promise.resolve(
            data,
        ));
        expect(await store.dispatch(claimp2pCreateNewUser('chimp', 'test', 'a_one@gmail.com', '12aA@abcdef', '1234567890'))).toEqual(data);
    });
});