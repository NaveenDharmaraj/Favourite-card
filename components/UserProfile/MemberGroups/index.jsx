/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Grid,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import _isEmpty from 'lodash/isEmpty';
import {
    array,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';

import {
    getUserMemberGroup,
} from '../../../actions/userProfile';
import {
    getLocation,
} from '../../../helpers/profiles/utils';
import ProfileCard from '../../shared/ProfileCard';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import LeftImageCard from '../../shared/LeftImageCard';

class UserMemberGroupList extends React.Component {
    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            friendUserId,
        } = this.props;
        getUserMemberGroup(dispatch, friendUserId, id);
    }

    // componentWillUnmount() {
    //     const {
    //         dispatch,
    //     } = this.props;
    //     dispatch({
    //         payload: {
    //         },
    //         type: 'USER_PROFILE_MEMBER_GROUP',
    //     });
    // }

    showMemberCard() {
        const {
            userProfileMemberGroupData: {
                data: memberData,
            },
        } = this.props;
        const memberArray = [];
        if (!_isEmpty(memberData)) {
            memberData.map((admin) => {
                memberArray.push(
                    <ProfileCard
                        avatar={admin.attributes.avatar}
                        type="Giving Group"
                        name={admin.attributes.name}
                        causes={admin.attributes.groupType}
                        location={getLocation(admin.attributes.city, admin.attributes.province)}
                    />,
                );
            });
        }
        return memberArray;
    }

    render() {
        const {
            userProfileMemberGroupData: {
                data: memberData,
            },
            userProfileMemberGroupsLoadStatus,
        } = this.props;
        return (
            <div className='userPrfl_tabSec'>
                <div className="tabHeader">
                    <Header>Joined Giving Groups</Header>
                </div>
                {!_isEmpty(memberData)
                    ? (
                        <div className="cardwrap">
                            {this.showMemberCard()}
                        </div>
                    )
                    : (
                        <div className="nodata-friendsprfl">
                    Nothing to show here yet
                        </div>
                    )}
            </div>
        );
    }
}

UserMemberGroupList.defaultProps = {
    userProfileMemberGroupData: {
        data: [],
    },
};

UserMemberGroupList.propTypes = {
    userProfileMemberGroupData: PropTypes.shape({
        data: array,
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileMemberGroupData: state.userProfile.userProfileMemberGroupData,
        userProfileMemberGroupsLoadStatus: state.userProfile.userProfileMemberGroupsLoadStatus,
    };
}


export default (connect(mapStateToProps)(UserMemberGroupList));
