import React, { Fragment } from 'react';
import _ from 'lodash';
import {
    Grid,
    Container,
    Button,
    Popup,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import { Link } from '../../../routes';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

function ProfilePageHead(props) {
    const {
        pageDetails: {
            type,
            attributes: {
                isAdmin,
                slug,
                balance,
            }
        },
        pageDetails,
        isAuthenticated,
    } = props;
    let buttonLink = null;
    let profileType = type;
    if (type === 'beneficiaries') {
        profileType = 'charity';
    } else if (type === 'campaigns' || type === 'group') {
        profileType = 'group';
    };
    if (pageDetails.attributes) {
        if (isAuthenticated) {
            if (profileType === 'group' && isAdmin === true) {
                buttonLink = (
                    <Fragment>
                        <a href={(`${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/manage-basics`)}>
                            <Button className="blue-bordr-btn-round-def CampaignBtn"><span><i aria-hidden="true" class="edit icon"></i></span>Edit Campaign</Button>
                        </a>
                        {balance > 0 ?
                            (
                                <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                                    <Button className="blue-bordr-btn-round-def CampaignBtn"><span><i aria-hidden="true" class="bell icon"></i></span>Give from Campaign</Button>
                                </Link>
                            )
                            :
                            (
                                <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                                    <Popup disabled={false} content={`The current campaign balance is ${balance}`}
                                        trigger={
                                            <Button className="blue-bordr-btn-round-def CampaignBtn" disabled >
                                                <span><i aria-hidden="true" class="bell icon"></i></span>Give from Campaign
                                            </Button>
                                        } />
                                </Link>
                            )
                        }
                    </Fragment>
                );
            }

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
