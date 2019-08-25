/* eslint-disable react/prop-types */
import React from 'react';
import {
    Container,
    Header,
    Image,
    Icon,
    Grid,
    Popup,
    List,
} from 'semantic-ui-react';

import UserPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';
// eslint-disable-next-line react/prefer-stateless-function
class UserBasciProfile extends React.Component {
    render() {
        const {
            userData,
        } = this.props;
        const avatar = (typeof userData.avatar === 'undefined') || (userData.avatar === null) ? UserPlaceholder : userData.avatar;
        const friendsVisibility = (typeof userData.friends_visibility === 'undefined') ? 0 : userData.friends_visibility;
        return (
            <div>
                <div className="profile-header-image user"></div>
                <div className="profile-header">
                    <Container>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={3} computer={2}>
                                    <div className="profile-img-rounded">
                                        <div className="pro-pic-wraper">
                                            <Image src={avatar} circular/>
                                        </div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={16} computer={12}>
                                    <Grid stackable>
                                        <Grid.Row>
                                            <Grid.Column mobile={16} tablet={5} computer={5}>
                                                <div className="ProfileHeaderWraper">
                                                    <Header as="h3">
                                                        <span className="font-s-10 type-profile">{userData.profile_type}</span>
                                                        {userData.first_name} 
                                                        {' '}
                                                        {userData.last_name}
                                                        <span className="small m-0">
                                                            &nbsp;
                                                            {userData.location}
                                                        </span>
                                                        {
                                                            friendsVisibility === 0 && (
                                                                <Header.Subheader>
                                                                    <Icon name="users" />
                                                                    {userData.number_of_friends}
                                                                    &nbsp; friends                                                            
                                                                </Header.Subheader>
                                                            )
                                                        }
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
                <div className="pb-3">
                    <Container>
                        <Header as="h4" className="underline">
                            About
                        </Header>
                        <p className="font-s-14">
                            {userData.description}
                        </p>
                    </Container>
                </div>
            </div>
        );
    }
}

export default UserBasciProfile;
