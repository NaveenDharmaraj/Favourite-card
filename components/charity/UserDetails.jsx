import React from 'react';
import { connect } from 'react-redux';
import {
    bool,
    PropTypes,
    string,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import {
    Grid,
    List,
    Header,
    Container,
} from 'semantic-ui-react';

import ShareDetails from './ShareDetails';

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
            Content: valuesObject.staffCount,
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
            <Grid.Column>
                <List>
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
            <Grid.Column>
                <List>
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

const UserDetails = (props) => {
    const {
        charityDetails,
        isAUthenticated,
    } = props;

    return (
        <div className="profile-info-wraper pb-3">
            <Container>
                <div className="profile-info-card charity">
                    <Header as="h3">
                        Charity information
                    </Header>
                    <Grid divided stackable>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={10} computer={10}>
                                <Grid columns={2}>
                                    {((!_isEmpty(charityDetails.charityDetails.attributes))
                                    && detailsView(charityDetails.charityDetails.attributes))}
                                </Grid>
                            </Grid.Column>
                            {(isAUthenticated
                            && <ShareDetails />)}

                        </Grid.Row>
                    </Grid>
                    <p className="mt-1">
                    *Is this your chariy? You can claim your free profile page on your platform
                        <a href="https://help.chimp.net/article/83-claiming-and-accessing-your-chimp-charity-account"> by following these steps</a>
                    </p>
                </div>
            </Container>
        </div>
    );
};

UserDetails.defaultProps = {
    charityDetails: {
        charityDetails: {
            attributes: {
                contactName: '',
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
            }),
        },
    },
    isAUthenticated: bool,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(UserDetails);
