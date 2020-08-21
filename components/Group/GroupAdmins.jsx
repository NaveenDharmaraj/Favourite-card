import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    Header,
} from 'semantic-ui-react';
import {
    array,
    PropTypes,
    string,
    func,
    bool,
    number,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../i18n';
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
            t: formatMessage,
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
                <Header as="h3">{formatMessage('groupProfile:groupAdmins')}</Header>
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
        totalCount: null,
    },
    groupDetails: {
        id: '',
    },
    t: () => {},
};

GroupAdmins.propTypes = {
    adminsLoader: bool,
    dispatch: func,
    groupAdminsDetails: PropTypes.shape({
        data: array,
        totalCount: number,
    }),
    groupDetails: PropTypes.shape({
        id: string,
    }),
    t: func,
};

function mapStateToProps(state) {
    return {
        adminsLoader: state.group.adminsLoader,
        groupAdminsDetails: state.group.groupAdminsDetails,
        groupDetails: state.group.groupDetails,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(GroupAdmins));
export {
    connectedComponent as default,
    GroupAdmins,
    mapStateToProps,
};
