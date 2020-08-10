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
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import {
    getDetails,
} from '../../actions/group';

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
            getDetails(dispatch, groupId, 'admins');
        }
    }

    render() {
        const {
            groupAdminsDetails: {
                data: adminsData,
            },
        } = this.props;
        return (
            <Fragment>
                <Header as="h3">Group Admins</Header>
                {(!_isEmpty(adminsData) && adminsData.length > 3)
                    ? <AdminsList />
                    : <Admins />
                }
            </Fragment>
        );
    }
}

GroupAdmins.defaultProps = {
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
        groupAdminsDetails: state.group.groupAdminsDetails,
        groupDetails: state.group.groupDetails,
    };
}

export default connect(mapStateToProps)(GroupAdmins);
