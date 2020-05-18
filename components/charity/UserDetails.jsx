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

const { publicRuntimeConfig } = getConfig();
const {
    CLAIM_CHARITY_URL,
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const createUserDetails = (valuesObject) => {
    const data = [];
    if (!_isEmpty(valuesObject.contactName)) {
        data.push({
            Content: `Contact: ${valuesObject.contactName}`,
            name: 'user',
        });
    }
    if (!_isEmpty(valuesObject.phone)) {
        data.push({
            Content: valuesObject.phone,
            name: 'phone',
        });
    }
    if (!_isEmpty(valuesObject.email)) {
        data.push({
            Content: valuesObject.email,
            link: `mailto:${valuesObject.email}`,
            name: 'mail',
        });
    }
    if (!_isEmpty(valuesObject.website)) {
        data.push({
            Content: valuesObject.website,
            link: valuesObject.website,
            name: 'linkify',
        });
    }
    if (!_isEmpty(valuesObject.staffCount) && valuesObject.staffCount > 0) {
        data.push({
            Content: valuesObject.staffCount,
            name: 'users',
        });
    }
    if (!_isEmpty(valuesObject.businessNumber)) {
        data.push({
            Content: valuesObject.businessNumber,
            name: 'briefcase',
        });
    }
    if (!_isEmpty(valuesObject.headQuarterAddress)) {
        data.push({
            Content: valuesObject.headQuarterAddress,
            name: 'marker',
        });
    }
    return data;
};

const detailsView = (valuesObject) => {
    const values = createUserDetails(valuesObject);
    return (
        <Fragment>
            <List>
                {values.map((value) => (
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
};

const UserDetails = (props) => {
    const {
        charityDetails: {
            charityDetails: {
                attributes: {
                    hideGive,
                    isClaimed,
                    slug,
                },
            },
        },
        isAUthenticated,
    } = props;
    let buttonLink = null;
    if (!hideGive) {
        if (isAUthenticated) {
            buttonLink = (
                <Link route={(`/give/to/charity/${slug}/gift/new`)}>
                    <Button className="blue-btn-rounded-def">Give</Button>
                </Link>
            );
        } else {
            buttonLink = (
                <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/charity/${slug}/gift/new`)}>
                    <Button className="blue-btn-rounded-def">Give</Button>
                </a>
            );
        }
    }
    return (
        <div className="charityInfowrap">
            <div className="charityInfo">
                <Header as="h4">
                    Charity information
                </Header>
                {((!_isEmpty(props.charityDetails.charityDetails.attributes))
                                && detailsView(props.charityDetails.charityDetails.attributes))}
                <Responsive minWidth={768}>
                    {buttonLink}
                </Responsive>
            </div>
            {(!isClaimed)
                && (
                    <div className="charityInfoClaim">
                        <p>
                        *Is this your charity? You can claim your free profile page on our platfrom.
                        </p>
                        <a href={CLAIM_CHARITY_URL}>
                            <Button className="blue-bordr-btn-round-def">Claim charity</Button>
                        </a>
                    </div>
                )
            }
        </div>
    );
};

UserDetails.defaultProps = {
    charityDetails: {
        charityDetails: {
            attributes: {
                contactName: '',
                slug: '',
            },
        },
    },
    isAUthenticated: false,
};

UserDetails.propTypes = {
    charityDetails: {
        charityDetails: {
            attributes: PropTypes.shape({
                contactName: string,
                slug: string,
            }),
        },
    },
    isAUthenticated: bool,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        currentUser: state.user.info,
        deepLinkUrl: state.profile.deepLinkUrl,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(UserDetails);
