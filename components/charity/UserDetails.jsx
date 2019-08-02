import React from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    List,
    Header,
    Icon,
} from 'semantic-ui-react';

class UserDetails extends React.Component {
    static createUserDetails(valuesObject) {
        const data = [
            {
                Content: valuesObject.contactName, // 'Contact : Red Cross Donor',
                name: 'user',
            },
            {
                Content: valuesObject.contactPhone, // '(613) 740-1900',
                name: 'phone',
            },
            {
                Content: valuesObject.email, // 'wecare@recross.ca',
                link: `mailto:${valuesObject.email}`, // 'mailto:wecare@recross.ca',
                name: 'mail',
            },
            {
                Content: valuesObject.website, // 'http://www.redcross.ca',
                link: valuesObject.website, // 'http://www.redcross.ca',
                name: 'linkify',
            },
            {
                Content: '1404 full-time staff',
                name: 'users',
            },
            {
                Content: valuesObject.businessNumber, // 'Business #11921723487',
                name: 'briefcase',
            },
            {
                Content: '400 Cooper Street, Suite 8000, Ottawa ON, K2P2H8',
                name: 'map marker alternate',
            },

        ];
        return data;
    }

    static detailsView(valuesObject) {
        const values = this.createUserDetails(valuesObject);
        return (
            values.map((value) => (
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
            ))
        );
    }

    render() {
        const {
            charityDetails,
            isAUthenticated,
        } = this.props;
        let favouriteComponent = null;
        if (isAUthenticated) {
            favouriteComponent = (
                <Header as="h5" icon>
                    <a className="hoverable">
                        <Icon name="file text outline" />
                        <Header.Subheader>Favourite</Header.Subheader>
                    </a>
                </Header>
            );
        }
        return (
            <Grid.Column>
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={12} computer={13}>
                            <List>
                                {(charityDetails && charityDetails.charityDetails)
                                    && (UserDetails.detailsView(charityDetails.charityDetails.attributes))
                                }
                            </List>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={4} computer={3}>
                            <div className="share-charity-link">
                                {favouriteComponent}
                                <Header as="h5" icon>
                                    <a className="hoverable">
                                        <Icon name="share alternate" />
                                        <Header.Subheader>Share</Header.Subheader>
                                    </a>
                                </Header>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Grid.Column>
        );
    }
}

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(UserDetails);
