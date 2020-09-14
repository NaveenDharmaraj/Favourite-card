import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    bool,
    PropTypes,
    string,
    number,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import {
    List,
    Header,
    Responsive,
    Button,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import { Link } from '../../routes';
import { withTranslation } from '../../i18n';
import { resetFlowObject } from '../../actions/give';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const UserDetails = (props) => {
    const {
        charityDetails: {
            attributes: {
                hideGive,
                isClaimed,
                slug,
                businessNumber,
                contactName,
                phone,
                email,
                website,
                staffCount,
                headQuarterAddress,
            },
        },
        dispatch,
        isAuthenticated,
        t: formatMessage,
    } = props;
    let buttonLink = null;
    const charityDetails = [];
    let viewData = '';
    if (!_isEmpty(contactName)) {
        charityDetails.push({
            Content: contactName,
            name: 'user',
        });
    }
    if (!_isEmpty(phone)) {
        charityDetails.push({
            Content: phone,
            name: 'phone',
        });
    }
    if (!_isEmpty(email)) {
        charityDetails.push({
            Content: email,
            link: `mailto:${email}`,
            name: 'mail',
        });
    }
    if (!_isEmpty(website)) {
        charityDetails.push({
            Content: website,
            link: website,
            name: 'linkify',
        });
    }
    if (staffCount && staffCount > 0) {
        charityDetails.push({
            Content: staffCount,
            name: 'users',
        });
    }
    if (!_isEmpty(businessNumber)) {
        charityDetails.push({
            Content: businessNumber,
            name: 'briefcase',
        });
    }
    if (!_isEmpty(headQuarterAddress)) {
        charityDetails.push({
            Content: headQuarterAddress,
            name: 'marker',
        });
    }

    if (!_isEmpty(charityDetails)) {
        viewData = (
            <Fragment>
                <List>
                    {charityDetails.map((value) => (
                        <List.Item>
                            <List.Icon name={value.name} />
                            {value.link && (
                                <List.Content data-test={`Charity_UserDetails_charityInformation_${value.name}`}>
                                    <a href={value.link} target={value.name === 'linkify' ? '_blank' : '_self'}>
                                        {value.Content}
                                    </a>
                                </List.Content>
                            )}
                            {!value.link
                            && (
                                <List.Content data-test={`Charity_UserDetails_charityInformation_${value.name}`}>
                                    {value.Content}
                                </List.Content>
                            )}
                        </List.Item>
                    ))}
                </List>
            </Fragment>
        );
    }

    if (!hideGive) {
        if (isAuthenticated) {
            buttonLink = (
                <Link route={(`/give/to/charity/${slug}/gift/new`)} data-test="Charity_UserDetails_giveButton_loggedInUser">
                    <Button data-test="Charity_UserDetails_giveButton" className="blue-btn-rounded-def" onClick={() => { resetFlowObject('charity', dispatch); }}>{formatMessage('charityProfile:give')}</Button>
                </Link>
            );
        } else {
            buttonLink = (
                <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/charity/${slug}/gift/new`)} data-test="Charity_UserDetails_giveButton_publicUser">
                    <Button data-test="Charity_UserDetails_giveButton" className="blue-btn-rounded-def">{formatMessage('charityProfile:give')}</Button>
                </a>
            );
        }
    }
    return (
        <div className="charityInfowrap" data-test="Charity_UserDetails_charityInfoWrapper">
            <div className="charityInfo">
                <Header as="h4">
                    {formatMessage('charityProfile:charityInformation')}
                </Header>
                {viewData}
                <Responsive minWidth={768}>
                    {buttonLink}
                </Responsive>
            </div>
            {(!isClaimed)
                && (
                    <div className="charityInfoClaim" data-test="Charity_UserDetails_claimCharitybutton">
                        <p>
                            {`* ${formatMessage('charityProfile:claimCharityInfo')}`}
                        </p>
                        <Link route="/claim-charity">
                            <Button data-test="profile_charity_claim_charity_button" className="blue-bordr-btn-round-def">{formatMessage('charityProfile:claimCharityButtonText')}</Button>
                        </Link>
                    </div>
                )
            }
        </div>
    );
};

UserDetails.defaultProps = {
    charityDetails: {
        attributes: {
            businessNumber: '',
            contactName: '',
            email: '',
            headQuarterAddress: '',
            hideGive: false,
            isClaimed: false,
            phone: '',
            slug: '',
            staffCount: null,
            website: '',
        },
    },
    isAuthenticated: false,
    t: () => {},
};

UserDetails.propTypes = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            businessNumber: string,
            contactName: string,
            email: string,
            headQuarterAddress: string,
            hideGive: bool,
            isClaimed: bool,
            phone: string,
            slug: string,
            staffCount: number,
            website: string,
        }),
    }),
    isAuthenticated: bool,
    t: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

const connectedComponent = withTranslation('charityProfile')(connect(mapStateToProps)(UserDetails));
export {
    connectedComponent as default,
    UserDetails,
    mapStateToProps,
};
