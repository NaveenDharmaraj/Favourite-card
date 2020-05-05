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
    getUserAdminGroup,
} from '../../../actions/userProfile';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import LeftImageCard from '../../shared/LeftImageCard';

class UserAdminGroupList extends React.Component {
    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            friendUserId,
        } = this.props;
        getUserAdminGroup(dispatch, friendUserId, id);
    }

    componentWillUnmount() {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
            },
            type: 'USER_PROFILE_ADMIN_GROUP',
        });
    }

    userAdminGroupList() {
        const {
            userProfileAdminGroupData,
        } = this.props;
        let adminGroupList = 'Nothing to show here yet.';
        if (userProfileAdminGroupData
            && userProfileAdminGroupData.data
            && _.size(userProfileAdminGroupData.data) > 0) {
            adminGroupList = userProfileAdminGroupData.data.map((data) => {
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
                const url = `/groups/${data.attributes.slug}`;
                const groupImage = (!_.isEmpty(data.attributes.avatar)) ? data.attributes.avatar : placeholderGroup;
                return (
                    <LeftImageCard
                        entityName={entityName}
                        location={locationDetails}
                        placeholder={groupImage}
                        typeClass="chimp-lbl group"
                        type="giving group"
                        url={url}
                    />
                );
            });
        }
        return (
            <Grid columns="equal" stackable doubling columns={3}>
                <Grid.Row>
                    {
                        !_.isEmpty(userProfileAdminGroupData) && (_.size(userProfileAdminGroupData.data) > 0) && (
                            <React.Fragment>
                                {adminGroupList}
                            </React.Fragment>
                        )
                    }
                    {
                        !_.isEmpty(userProfileAdminGroupData) && (_.size(userProfileAdminGroupData.data) === 0) && (
                            <Grid.Column>
                                {adminGroupList}
                            </Grid.Column>
                        )
                    }
                </Grid.Row>
            </Grid>
        );
    }

    render() {
        const {
            friendFirstName,
            userProfileAdminGroupData,
            userProfileAdminGroupsLoadStatus,
        } = this.props;
        return (
            <div className="pb-3">
                <Container>
                    <Header as="h4" className="underline">
                        {friendFirstName}
                        's Giving Groups
                    </Header>
                    { (_.isEmpty(userProfileAdminGroupData) && userProfileAdminGroupsLoadStatus) ? <PlaceholderGrid row={1} column={3} /> : (
                        this.userAdminGroupList()
                    )}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileAdminGroupData: state.userProfile.userProfileAdminGroupData,
        userProfileAdminGroupsLoadStatus: state.userProfile.userProfileAdminGroupsLoadStatus,
    };
}

export default (connect(mapStateToProps)(UserAdminGroupList));
