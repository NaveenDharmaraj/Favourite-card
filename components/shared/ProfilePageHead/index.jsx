import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
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

const displayBlockButton = (blockButtonType, profileType, slug) => {
    let buttonLink = null;
    switch (blockButtonType) {
        case 'give':
            buttonLink = (
                <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/${profileType}/${slug}`)}>
                    <Button primary className="blue-btn-rounded-def">Give</Button>
                </a>
            )
            break;
        case 'create':
            buttonLink = (
                <a href={`${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/step/one`}>
                    <Button className="success-btn-rounded-def medium btnboxWidth">Create Group</Button>
                </a>
            )
            break;
        default: 
            return null;
    }
    return buttonLink;  
}

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
        blockButtonType,
    } = props;
    let buttonLink = null;
    let profileType = '';
    let linkAddress;
    if (type === 'beneficiaries') {
        profileType = 'charity';
    } else if (type === 'groups') {
        profileType = 'group';
        linkAddress = `${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit`;
    } else if (type === 'campaigns') {
        profileType = 'group';
        linkAddress = `${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/manage-basics`;
    }
    if (pageDetails.attributes) {
        if (isAuthenticated) {
            if ((type === 'groups' || type === 'campaigns') && isAdmin) {
                buttonLink = (
                    <Fragment>
                        <a href={(linkAddress)}>
                            <Button className="blue-bordr-btn-round-def CampaignBtn">
                                <span>
                                    <i aria-hidden="true" className="edit icon" />
                                </span>
                                Edit
                                {type === 'campaigns' ? 'Campaign' : 'Group'}
                            </Button>
                        </a>
                        {balance > 0
                            ? (
                                <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                                    {/* TODO need to add  functionality for givefromgroup and givefromcampaign */}
                                    <Button className="blue-bordr-btn-round-def CampaignBtn">
                                        <span>
                                            <i aria-hidden="true" className="bell icon" />
                                        </span>
                                    Give from
                                        {type === 'campaigns' ? 'Campaign' : 'Group'}
                                    </Button>
                                </Link>
                            ) : (
                                <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                                    <Popup disabled={false} content={`The current campaign balance is ${balance}`}
                                        trigger={
                                            (
                                                <Button className="blue-bordr-btn-round-def CampaignBtn" disabled >
                                                    <span>
                                                        <i aria-hidden="true" className="bell icon" />
                                                    </span>
                                                    Give from
                                                    {type === 'campaigns' ? 'Campaign' : 'Group'}
                                                </Button>
                                            )
                                        }
                                    />
                                </Link>
                            )
                        }
                    </Fragment>
                );
            }
            if (blockButtonType === 'give') {
                buttonLink = (
                    <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                        <Button primary className="blue-btn-rounded-def">Give</Button>
                    </Link>
                )
            }
            if (blockButtonType === 'create') {
                buttonLink = (
                    <a href={`${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/step/one`}>
                        <Button className="success-btn-rounded-def medium btnboxWidth">Create Group</Button>
                    </a>
                )
            }
        }
        else {
            buttonLink = displayBlockButton(blockButtonType, profileType, slug);
        }
    }

    return (
        <Fragment>
            {buttonLink}
        </Fragment>
    );
}

ProfilePageHead.defaultProps = {
    pageDetails: {
        attributes: {
            isAdmin: false,
            balance: '',
            slug: '',
        },
        type: ''
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
}

export default connect(mapStateToProps)(ProfilePageHead);
