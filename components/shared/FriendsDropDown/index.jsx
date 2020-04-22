import React from 'react';
import { connect } from 'react-redux';
import {
    Dropdown,
} from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';
import _filter from 'lodash/filter';
import {
    arrayOf,
    PropTypes,
} from 'prop-types';

import { getFriendsList } from '../../../actions/user';
import { populateFriendsList } from '../../../helpers/give/utils';

class FriendsDropDown extends React.Component {
    constructor(props) {
        super(props);
        const {
            friendsListData,
        } = this.props;
        this.state = {
            dropDownOptions: {
                friendsDropdownOptions: populateFriendsList(friendsListData),
            },
            searchQuery: null,
        };
        this.onSearchChange = this.onSearchChange.bind(this);
        this.modifySearch = this.modifySearch.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                attributes: {
                    email: userEmailId,
                },
            },
            dispatch,
        } = this.props;
        dispatch(getFriendsList(userEmailId));
    }

    componentDidUpdate(prevProps) {
        const {
            friendsListData,
        } = this.props;
        if (!_isEqual(friendsListData, prevProps.friendsListData)) {
            const preparedFriendsDropdown = populateFriendsList(friendsListData);
            this.setState({
                dropDownOptions: {
                    friendsDropdownOptions: preparedFriendsDropdown,
                },
            });
        }
    }

    onSearchChange(event, { searchQuery }) {
        this.setState({
            searchQuery,
        });
    }

    modifySearch() {
        const {
            searchQuery,
            dropDownOptions: {
                friendsDropdownOptions,
            },
        } = this.state;
        let filteredOptions = [];
        filteredOptions = _filter(friendsDropdownOptions, (option) => {
            return option.displayName.toLowerCase().includes(searchQuery.toLowerCase());
        });
        return filteredOptions;
    }

    render() {
        const {
            handleOnInputChange,
            handleOnInputBlur,
            values,
        } = this.props;
        const {
            dropDownOptions: {
                friendsDropdownOptions,
            },
        } = this.state;
        return (
            <div className="multyDropDownFilter">
                <Dropdown
                    onChange={handleOnInputChange}
                    onBlur={handleOnInputBlur}
                    onSearchChange={this.onSearchChange}
                    placeholder="Select friends on Charitable Impact"
                    fluid
                    multiple
                    selection
                    options={friendsDropdownOptions}
                    name="friendsList"
                    value={values}
                    search={this.modifySearch}
                />
            </div>
        );
    }
}

FriendsDropDown.defaultProps = {
    currentUser: {
        attributes: {
            email: '',
        },
    },
    dispatch: () => {},
    friendsListData: [],
    handleOnInputBlur: () => {},
    handleOnInputChange: () => {},
    values: [],
};

FriendsDropDown.propTypes = {
    currentUser: PropTypes.shape({
        attributes: PropTypes.shape({
            email: PropTypes.string,
        }),
    }),
    dispatch: PropTypes.func,
    friendsListData: arrayOf(PropTypes.element),
    handleOnInputBlur: PropTypes.func,
    handleOnInputChange: PropTypes.func,
    values: arrayOf(PropTypes.element),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        friendsListData: state.user.friendsList,
    };
}

export default connect(mapStateToProps)(FriendsDropDown);
