import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    Header,
} from 'semantic-ui-react';
import {
    arrayOf,
    PropTypes,
    number,
    string,
    func,
    bool,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import {
    getDetails,
} from '../../actions/group';
import PlaceholderGrid from '../shared/PlaceHolder';

import Admins from './Admins';
import AdminsList from './AdminsList';

class GroupAdmins extends React.Component {
    componentDidMount() {
        const {
            dispatch,
            groupDetails: {
                id: groupId,
            },
            groupAdminsDetails: {
                data: adminData,
            },
        } = this.props;
        if (_isEmpty(adminData)) {
            dispatch(getDetails(groupId, 'admins'));
        }
    }

    render() {
        const {
            adminsLoader,
            groupAdminsDetails: {
                data: adminsData,
                totalCount,
            },
        } = this.props;
        let data = '';
        if (!_isEmpty(adminsData)) {
            data = (
                <Fragment>
                    {(totalCount > 3)
                        ? <AdminsList />
                        : <Admins />
                    }
                </Fragment>
            );
        }
        return (
            <Fragment>
                <Header as="h3">Group Admins</Header>
                {!adminsLoader
                    ? data
                    : <PlaceholderGrid row={1} column={3} placeholderType="usersList" />}
            </Fragment>
        );
    }
}

GroupAdmins.defaultProps = {
    adminsLoader: true,
    dispatch: () => {},
    groupAdminsDetails: {
        data: [],
        links: {
            next: '',
        },
    },
    groupDetails: {
        attributes: {
            balance: '',
            fundraisingDaysRemaining: null,
            totalMoneyGiven: '',
            totalMoneyRaised: '',
        },
    },
};

GroupAdmins.propTypes = {
    adminsLoader: bool,
    dispatch: func,
    groupAdminsDetails: {
        data: arrayOf(PropTypes.element),
        links: PropTypes.shape({
            next: string,
        }),
    },
    groupDetails: {
        attributes: {
            balance: string,
            fundraisingDaysRemaining: number,
            totalMoneyGiven: string,
            totalMoneyRaised: string,
        },
    },
};

function mapStateToProps(state) {
    return {
        adminsLoader: state.group.adminsLoader,
        groupAdminsDetails: state.group.groupAdminsDetails,
        groupDetails: state.group.groupDetails,
    };
}

export default connect(mapStateToProps)(GroupAdmins);
