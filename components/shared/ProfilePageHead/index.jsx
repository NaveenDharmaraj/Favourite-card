import React from 'react';
import _ from 'lodash';
import {
    Grid,
    Container,
    Image,
    Button,
    Header,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import { Link } from '../../../routes';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

function ProfilePageHead(props) {
    const {
        pageDetails,
        isAuthenticated,
    } = props;
    let buttonLink = null;
    let getCauses = null;
    let profileType = pageDetails.type;
    if (pageDetails.type === 'beneficiaries') {
        profileType = 'charity';
    } else if (pageDetails.type === 'campaigns') {
        profileType = 'group';
    }
    if (pageDetails.attributes) {
        if (isAuthenticated) {
            buttonLink = (
                <Link route={(`/give/to/${profileType}/${pageDetails.attributes.slug}/new`)}>
                    <Button primary fluid className="blue-btn-rounded">Give</Button>
                </Link>
            );
        } else {
            buttonLink = (
                <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/${profileType}/${pageDetails.attributes.slug}`)}>
                    <Button primary fluid className="blue-btn-rounded">Give</Button>
                </a>
            );
        }
    }

    if (!_.isEmpty(pageDetails.attributes.causes)) {
        getCauses = pageDetails.attributes.causes.map((cause) => (
            <span className="badge">
                {cause.display_name}
            </span>
        ));
    }

    return (
        <div className="profile-header">
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={3} computer={2}>
                            <div className="profile-img-rounded">
                                <Image
                                    circular
                                    src={pageDetails.attributes.avatar}
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={10} computer={11}>
                            <div className="ProfileHeaderWraper">
                                <Header as="h3">
                                    {pageDetails.attributes.name}
                                    <Header.Subheader>
                                        {pageDetails.attributes.location}
                                    </Header.Subheader>
                                </Header>
                                <div className="badge-group">
                                    {getCauses}
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={3} computer={3}>
                            <div className="buttonWraper">
                                {buttonLink}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
    );
}

export default ProfilePageHead;
