import React from 'react';
import {
    Menu,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import { dismissAllUxCritialErrors } from '../../../actions/error';
import { Link } from '../../../routes';

// eslint-disable-next-line react/prefer-stateless-function
class SearchButtonWrapper extends React.Component {
    handlecurrentTab() {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
                filterData: [],
            },
            type: 'DISPATCH_FILTER_DATA',
        });
        dispatch({
            payload: {
                filterValuesShowed: [],
            },
            type: 'DISPATCH_FILTER_VALUE_SHOWED',
        });
        dismissAllUxCritialErrors(dispatch);
    }

    render() {
        const {
            currentTab, 
            isAuthenticated, 
            searchWord 
        } = this.props;
        let searchQueryParam = '';
        if (!_isEmpty(searchWord)) {
            searchQueryParam = `search=${encodeURIComponent(decodeURI(searchWord))}&`;
        }
        // if (!_isEmpty(searchWord) && currentTab === 'All') {
        //     searchQueryParam = `?search=${searchWord}`;
        // }
        return (
            <div className="btn-wraper">
                {(_isEmpty(searchWord) && isAuthenticated === false) ? null : (
                    <Menu secondary position="center" onClick={(e) => { this.handlecurrentTab(e); }}>
                        <Link route={`/search?${searchQueryParam}result_type=All`}>
                            <Menu.Item name="All" active={currentTab === 'All'} />
                        </Link>
                        <Link route={`/search?${searchQueryParam}result_type=Beneficiary`}>
                            <Menu.Item
                                name="Charities"
                                active={currentTab === 'Beneficiary'}
                            />
                        </Link>
                        <Link route={`/search?${searchQueryParam}result_type=Group`}>
                            <Menu.Item
                                name="Giving Groups"
                                active={currentTab === 'Group'}
                            />
                        </Link>
                    </Menu>
                )}
            </div>
        );
    }
}

export default SearchButtonWrapper;
