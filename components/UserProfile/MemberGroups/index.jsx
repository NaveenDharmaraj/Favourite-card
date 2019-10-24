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

import {
    getUserMemberGroup,
} from '../../../actions/userProfile';
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

    componentWillUnmount() {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
            },
            type: 'USER_PROFILE_MEMBER_GROUP',
        });
    }

    userMemberGroupList() {
        const {
            userProfileMemberGroupData,
        } = this.props;
        let memberGroupList = 'Nothing to show here yet.';
        if (userProfileMemberGroupData
            && userProfileMemberGroupData.data
            && _.size(userProfileMemberGroupData.data) > 0) {
            memberGroupList = userProfileMemberGroupData.data.map((data) => {
                const entityName = data.attributes.name;
                let locationDetails = '';
                const locationDetailsCity = (!_.isEmpty(data.attributes.city)) ? data.attributes.city : '';
                const locationDetailsProvince = (!_.isEmpty(data.attributes.province)) ? data.attributes.province : '';
                if (locationDetailsCity === '' && locationDetailsProvince !== '') {
                    locationDetails = locationDetailsProvince;
                } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
                    locationDetails = locationDetailsCity;
                } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
                    locationDetails = `${data.attributes.city}, ${data.attributes.province}`;
                }
                const type = 'giving group';
                const typeClass = 'chimp-lbl group';
                const url = `/groups/${data.attributes.slug}`;
                const groupImage = (!_.isEmpty(data.attributes.avatar)) ? data.attributes.avatar : placeholderGroup;
                return (
                    <LeftImageCard
                        entityName={entityName}
                        location={locationDetails}
                        placeholder={groupImage}
                        typeClass={typeClass}
                        type={type}
                        url={url}
                    />
                );
            });
        }
        return (
            <Grid columns="equal" stackable doubling columns={3}>
                <Grid.Row>
                    {
                        !_.isEmpty(userProfileMemberGroupData) && (_.size(userProfileMemberGroupData.data) > 0) && (
                            <React.Fragment>
                                {memberGroupList}
                            </React.Fragment>
                        )
                    }
                    {
                        !_.isEmpty(userProfileMemberGroupData) && (_.size(userProfileMemberGroupData.data) === 0) && (
                            <Grid.Column>
                                {memberGroupList}
                            </Grid.Column>
                        )
                    }
                </Grid.Row>
            </Grid>
        );
    }

    render() {
        const {
            userProfileMemberGroupData,
            userProfileMemberGroupsLoadStatus,
        } = this.props;
        return (
            <div className="pb-3">
                <Container>
                    <Header as="h4" className="underline">
                    Joined Groups
                    </Header>
                    { (_.isEmpty(userProfileMemberGroupData) && userProfileMemberGroupsLoadStatus) ? <PlaceholderGrid row={1} column={3} /> : (
                        this.userMemberGroupList()
                    )}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileMemberGroupData: state.userProfile.userProfileMemberGroupData,
        userProfileMemberGroupsLoadStatus: state.userProfile.userProfileMemberGroupsLoadStatus,
    };
}


export default (connect(mapStateToProps)(UserMemberGroupList));
