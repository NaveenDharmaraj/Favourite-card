import React from 'react';
import {
    Container,
    Breadcrumb,
} from 'semantic-ui-react';

import UserDetails from '../charity/UserDetails';
import CharityDetails from '../charity/CharityDetails';
import ProfileDetails from '../charity/ProfileDetails';
import BreadcrumbDetails from './BreadcrumbDetails';

class CharityProfileWrapper extends React.Component {
    constructor(props) {
        super(props);
        console.log('Charity Profile Component');
    }

    componentDidMount() {
        const { dispatch } = this.props;
    }

    render() {
        return (
            <React.Fragment>
                <div className="top-breadcrumb">
                  <BreadcrumbDetails />  
                </div>
                <div className="profile-header-image charity"></div>
                <CharityDetails />
                <UserDetails />
                <ProfileDetails />

                {/* <div className="charity-profile-box">
                    <Segment>
                        <Grid columns={2} relaxed="very" divided>
                            <CharityDetails />
                            <UserDetails />
                        </Grid>
                    </Segment>
                </div>
                <ProfileDetails /> */}
            </React.Fragment>
        );
    }
}

export default CharityProfileWrapper;
