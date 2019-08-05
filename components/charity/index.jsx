import React from 'react';
import {
    Container,
    Breadcrumb,
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
                <div className="top-breadcrumb">
                    <Container>
                        <Breadcrumb className="c-breadcrumb">
                            <Breadcrumb.Section link>Explore</Breadcrumb.Section>
                            <Breadcrumb.Divider icon="caret right"/>
                            <Breadcrumb.Section link>Charities</Breadcrumb.Section>
                            <Breadcrumb.Divider icon="caret right"/>
                            <Breadcrumb.Section active>The Canadian Red Cross Society / Le Societe Canadienne de la Croix-Rouge </Breadcrumb.Section>
                        </Breadcrumb>
                    </Container>
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
