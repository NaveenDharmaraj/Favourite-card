import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    Grid,
    Container,
    Button,
    Popup,
} from 'semantic-ui-react';
import {
    bool,
    PropTypes,
    string,
} from 'prop-types';
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
    let linkAddress;
    if (type === 'beneficiaries') {
        profileType = 'charity';
    } else if (type === 'groups') {
        profileType = 'groups';
        linkAddress = `${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit`;
    } else if(type === 'campaigns') {
        profileType = 'campaigns';
        linkAddress = `${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/manage-basics`;
    };
    if (pageDetails.attributes) {
        if (isAuthenticated) {
            if (profileType === 'groups' || profileType === 'campaigns' && isAdmin) {
                buttonLink = (
                    <Fragment>
                        <a href={(linkAddress)}>
                            <Button className="blue-bordr-btn-round-def CampaignBtn"><span><i aria-hidden="true" class="edit icon"></i></span>Edit {profileType === 'campaigns' ?'Campaign': 'Group'}</Button>
                        </a>
                        {balance > 0 ?
                            (
                                <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                                {/* TODO need to add  functionality for givefromgroup and givefromcampaign */}
                                    <Button className="blue-bordr-btn-round-def CampaignBtn"><span><i aria-hidden="true" class="bell icon"></i></span>Give from {profileType === 'campaigns' ?'Campaign': 'Group'}</Button>
                                </Link>
                            )
                            :
                            (
                                <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                                    <Popup disabled={false} content={`The current campaign balance is ${balance}`}
                                        trigger={
                                            <Button className="blue-bordr-btn-round-def CampaignBtn" disabled >
                                                <span><i aria-hidden="true" class="bell icon"></i></span>Give from {profileType === 'campaigns' ?'Campaign': 'Group'}
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

ProfilePageHead.defaultProps = {
    pageDetails: {
        attributes: {
            isAdmin: false,
            balance: '',
            slug: '',
        },
        type:''
    },
};

ProfilePageHead.propTypes = {
    campaignDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            isAdmin: bool,
            balance: string,
            slug: string,
        }),
        type: string
    }),
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
};

export default connect(mapStateToProps)(ProfilePageHead);

