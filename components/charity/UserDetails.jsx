import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    bool,
    PropTypes,
    string,
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

const { publicRuntimeConfig } = getConfig();
const {
    CLAIM_CHARITY_URL,
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
        isAUthenticated,
        t: formatMessage,
    } = props;
    let buttonLink = null;
    const charityDetails = [];
    let viewData = '';
    if (!_isEmpty(contactName)) {
        charityDetails.push({
            Content: `${formatMessage('charityProfile:contactText')}: ${contactName}`,
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
                                <List.Content>
                                    <a href={value.link} target={value.name === 'linkify' ? '_blank' : '_self'}>
                                        {value.Content}
                                    </a>
                                </List.Content>
                            )}
                            {!value.link
                            && (
                                <List.Content>
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
        if (isAUthenticated) {
            buttonLink = (
                <Link route={(`/give/to/charity/${slug}/gift/new`)}>
                    <Button className="blue-btn-rounded-def">{formatMessage('charityProfile:give')}</Button>
                </Link>
            );
        } else {
            buttonLink = (
                <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/charity/${slug}/gift/new`)}>
                    <Button className="blue-btn-rounded-def">{formatMessage('charityProfile:give')}</Button>
                </a>
            );
        }
    }
    return (
        <div className="charityInfowrap">
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
                    <div className="charityInfoClaim">
                        <p>
                            {`* ${formatMessage('charityProfile:claimCharityInfo')}`}
                        </p>
                        <a href={CLAIM_CHARITY_URL}>
                            <Button className="blue-bordr-btn-round-def">{formatMessage('charityProfile:claimCharityButtonText')}</Button>
                        </a>
                    </div>
                )
            }
        </div>
    );
};

UserDetails.defaultProps = {
    charityDetails: {
        attributes: {
            contactName: '',
            slug: '',
        },
    },
    isAUthenticated: false,
    t: () => {},
};

UserDetails.propTypes = {
    charityDetails: {
        attributes: PropTypes.shape({
            contactName: string,
            slug: string,
        }),
    },
    isAUthenticated: bool,
    t: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

const connectedComponent = withTranslation('charityProfile')(connect(mapStateToProps)(UserDetails));
export {
    connectedComponent as default,
    UserDetails,
    mapStateToProps,
};
