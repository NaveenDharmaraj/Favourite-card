import React from 'react';
import { connect } from 'react-redux';
import {
    bool,
    PropTypes,
    string,
    func,
    number,
} from 'prop-types';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    Grid,
    List,
    Header,
    Container,
    Button,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import {
    generateDeepLink,
} from '../../actions/profile';
import {
    getBeneficiaryFromSlug,
} from '../../actions/charity';
import ShareDetails from '../shared/ShareSectionProfilePage';

const { publicRuntimeConfig } = getConfig();
const {
    CLAIM_CHARITY_URL,
} = publicRuntimeConfig;

const createUserDetails = (valuesObject) => {
    const data = [
        {
            Content: valuesObject.contactName,
            name: 'user',
        },
        {
            Content: valuesObject.contactPhone,
            name: 'phone',
        },
        {
            Content: valuesObject.email,
            link: `mailto:${valuesObject.email}`,
            name: 'mail',
        },
        {
            Content: valuesObject.website,
            link: valuesObject.website,
            name: 'linkify',
        },
        {
            Content: (valuesObject.staffCount && valuesObject.staffCount > 0)
                ? valuesObject.staffCount : null,
            name: 'users',
        },
        {
            Content: valuesObject.businessNumber,
            name: 'briefcase',
        },
        {
            Content: valuesObject.address,
            name: 'map marker alternate',
        },

    ];
    return data;
};

const detailsView = (valuesObject) => {
    let address = '';
    if (valuesObject.primaryAddress && valuesObject.primaryAddress.address_one) {
        address = `${valuesObject.primaryAddress.address_one}, ${valuesObject.primaryAddress.city}, ${valuesObject.primaryAddress.province}, ${valuesObject.primaryAddress.country}`;
        valuesObject = {
            ...valuesObject,
            address,
        };
    }
    const values = createUserDetails(valuesObject);
    return (
        <Grid.Row>
            <Grid.Column mobile={16} tablet={8} computer={8}>
                <List className="charityDetailsList">
                    {values.map((value, index) => (
                        (value.Content && index <= 3
                        && (
                            <List.Item>
                                <List.Icon name={value.name} />
                                {value.link && (
                                    <List.Content>
                                        <a href={value.link}>
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
                        )
                        )
                    ))}
                </List>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
                <List className="charityDetailsList mobMarginBtm-2">
                    {values.map((value, index) => (
                        (value.Content && index >= 4
                            && (
                                <List.Item>
                                    <List.Icon name={value.name} />
                                    {value.link && (
                                        <List.Content>
                                            <a href={value.link}>
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
                            )
                        )
                    ))}
                </List>
            </Grid.Column>
        </Grid.Row>
    );
};

class UserDetails extends React.Component {
    componentDidMount() {
        const {
            dispatch,
            deepLinkUrl,
            isAUthenticated,
            currentUser: {
                id: userId,
            },
            charityDetails: {
                charityDetails: {
                    id: charityId,
                    attributes: {
                        slug,
                    },
                },
            },
        } = this.props;
        getBeneficiaryFromSlug(dispatch, slug);
        if (isAUthenticated) {
            generateDeepLink(`deeplink?profileType=charityprofile&sourceId=${userId}&profileId=${charityId}`, dispatch);
        }
    }

    render() {
        const {
            charityDetails,
            isAUthenticated,
            deepLinkUrl,
            currentUser: {
                id: userId,
            },
        } = this.props;
        return (
            <div className="profile-info-wraper pb-3">
                <Container>
                    <div className="profile-info-card charity">
                        <Header as="h3">
                            Charity information
                        </Header>
                        <Grid stackable>
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={10} computer={10}>
                                    <Grid>
                                        {((!_isEmpty(charityDetails.charityDetails.attributes))
                                        && detailsView(charityDetails.charityDetails.attributes))}
                                    </Grid>
                                </Grid.Column>
                                {isAUthenticated
                                && (
                                    <ShareDetails
                                        deepLinkUrl={deepLinkUrl}
                                        profileDetails={this.props.charityDetails.charityDetails}
                                        userId={userId}
                                    />
                                )}

                            </Grid.Row>
                        </Grid>
                        <p className="mt-1">
                        *Is this your charity? You can claim your free profile page on your platform
                            <a href={CLAIM_CHARITY_URL}>
                                <Button className="ml-1 blue-bordr-btn-round-def c-small">Claim charity</Button>
                            </a>
                        </p>
                    </div>
                </Container>
            </div>
        );
    }
}

UserDetails.defaultProps = {
    charityDetails: {
        charityDetails: {
            attributes: {
                contactName: '',
                slug: '',
            },
        },
    },
    currentUser: {
        id: null,
    },
    dispatch: _.noop,
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
    currentUser: {
        id: number,
    },
    dispatch: func,
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
