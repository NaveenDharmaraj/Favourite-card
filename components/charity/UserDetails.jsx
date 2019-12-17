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
            name: 'map marker alternate',
        });
    }
    return data;
};

const detailsView = (valuesObject) => {
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
        let deepLinkApiUrl = `deeplink?profileType=charityprofile&profileId=${charityId}`;
        if (isAUthenticated) {
            deepLinkApiUrl += `&sourceId=${userId}`;
        }
        generateDeepLink(deepLinkApiUrl, dispatch);

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

                                <ShareDetails
                                    deepLinkUrl={deepLinkUrl}
                                    isAuthenticated={isAUthenticated}
                                    profileDetails={this.props.charityDetails.charityDetails}
                                    userId={userId}
                                />

                            </Grid.Row>
                        </Grid>
                        {(!_isEmpty(charityDetails.charityDetails.attributes) && !charityDetails.charityDetails.attributes.isClaimed)
                            && (
                                <p className="mt-1">
                                Is this your charity? Claim your charity page on Charitable Impact.
                                    <a href={CLAIM_CHARITY_URL}>
                                        <Button className="ml-1 blue-bordr-btn-round-def c-small">Claim charity</Button>
                                    </a>
                                </p>
                            )
                        }
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
