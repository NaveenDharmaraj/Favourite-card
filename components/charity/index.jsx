import React from 'react';
import {
    Segment,
    Grid,
} from 'semantic-ui-react';

import UserDetails from '../charity/UserDetails';
import CharityDetails from '../charity/CharityDetails';
import ProfileDetails from '../charity/ProfileDetails';

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
                <div className="charity-profile-box">
                    <Segment>
                        <Grid columns={2} relaxed="very" divided>
                            <CharityDetails />
                            <UserDetails />
                        </Grid>
                    </Segment>
                </div>
                <ProfileDetails />
            </React.Fragment>
        );
    }
}

export default CharityProfileWrapper;
