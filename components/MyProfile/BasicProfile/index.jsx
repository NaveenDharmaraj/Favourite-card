/* eslint-disable react/prop-types */
import React from 'react';
import {
    Container,
    Header,
    Image,
    Icon,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';

import PrivacySetting from '../../shared/Privacy';
import UserPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';

const UserBasciProfile = (props) => {
    const {
        avatar,
        userData,
    } = props;
    const privacyColumn = 'friends_visibility';
    const userAvatar = (avatar === '') || (avatar === null) ? UserPlaceholder : avatar;
    let locationDetails = '';
    const locationDetailsCity = (!_.isEmpty(userData.city)) && userData.city !== 'null' ? userData.city : '';
    const locationDetailsProvince = (!_.isEmpty(userData.province)) && userData.province !== 'null' ? userData.province : '';
    if (locationDetailsCity === '' && locationDetailsProvince !== '') {
        locationDetails = locationDetailsProvince;
    } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
        locationDetails = locationDetailsCity;
    } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
        locationDetails = `${userData.city}, ${userData.province}`;
    }
    return (
        <div>
            <div className="profile-header-image user" />
            <div className="profile-header">
                <Container>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={3} computer={2}>
                                <div className="profile-img-rounded">
                                    <div className="pro-pic-wraper">
                                        <Image src={userAvatar} circular />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={13} computer={12}>
                                <Grid stackable>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={16}>
                                            <div className="ProfileHeaderWraper">
                                                <Header as="h3">
                                                    <span className="font-s-10 type-profile">MY PROFILE</span>
                                                    {userData.first_name}
                                                    {' '}
                                                    {userData.last_name}
                                                    <span className="small m-0">
                                                        &nbsp;
                                                        {' '}
                                                        {locationDetails}
                                                    </span>
                                                    <Header.Subheader>
                                                        <Icon name="users" />
                                                        &nbsp;
                                                        {userData.number_of_friends}
                                                        &nbsp; friends
                                                        <PrivacySetting columnName={privacyColumn} columnValue={userData.friends_visibility} />
                                                    </Header.Subheader>
                                                </Header>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        </div>
    );
};

export default UserBasciProfile;
