import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import getConfig from 'next/config';
import {
    bool,
    PropTypes,
    string,
    func,
} from 'prop-types';
import {
    Button,
    Popup,
} from 'semantic-ui-react';

import { withTranslation } from '../../../i18n';
import { Link } from '../../../routes';
import GroupJoin from '../../Group/GroupJoin';

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
            },
        },
        pageDetails,
        isAuthenticated,
        t: formatMessage,
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
                                {formatMessage('campaignProfile:editBtn')}
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
                                        {formatMessage('campaignProfile:giveFromBtn')}
                                        {type === 'campaigns' ? 'Campaign' : 'Group'}
                                    </Button>
                                </Link>
                            ) : (
                                <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                                    <Popup
                                        disabled={false}
                                        content={`The current campaign balance is ${balance}`}
                                        trigger={
                                            (
                                                <Button className="blue-bordr-btn-round-def CampaignBtn" disabled>
                                                    <span>
                                                        <i aria-hidden="true" className="bell icon" />
                                                    </span>
                                                    {formatMessage('campaignProfile:giveFromBtn')}
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
        }
    }
    return (
        <Fragment>
            {buttonLink}
            {(type === 'groups' && !isAdmin)
            && (
                <GroupJoin />
            )}
        </Fragment>
    );
}

ProfilePageHead.defaultProps = {
    isAuthenticated: false,
    pageDetails: {
        attributes: {
            balance: '',
            isAdmin: false,
            slug: '',
        },
        type: '',
    },
    t: () => {},
};

ProfilePageHead.propTypes = {
    isAuthenticated: bool,
    pageDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            balance: string,
            isAdmin: bool,
            slug: string,
        }),
        type: string,
    }),
    t: func,
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default withTranslation('campaignProfile')(connect(mapStateToProps)(ProfilePageHead));
