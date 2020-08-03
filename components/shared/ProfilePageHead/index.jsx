import React, { Fragment } from 'react';
import _ from 'lodash';
import {
    Grid,
    Container,
    Button,
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
    let profileType = pageDetails.type;
    if (pageDetails.type === 'beneficiaries') {
        profileType = 'charity';
    } else if (pageDetails.type === 'campaigns') {
        profileType = 'group';
    }
    if (pageDetails.attributes) {
        if (isAuthenticated) {
            buttonLink = (
                <Fragment>
                    <Link route={(`/give/to/${profileType}/${pageDetails.attributes.slug}/new`)}>
                        <Button className="blue-bordr-btn-round-def CampaignBtn"><span><i aria-hidden="true" class="edit icon"></i></span>Edit Campaign</Button>
                    </Link>
                    <Link route={(`/give/to/${profileType}/${pageDetails.attributes.slug}/new`)}>
                        <Button className="blue-bordr-btn-round-def CampaignBtn" disabled><span><i aria-hidden="true" class="bell icon"></i></span>Give from Campaign</Button>
                    </Link>
                </Fragment>
            );
        }
    }

    return (
        <div className="profile-header">
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={16} computer={8} largeScreen={7}>
                            <div className="buttonWraper campaignBtns text-center-sm">
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
