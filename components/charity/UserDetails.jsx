import React from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    List,
    Header,
    Icon,
    Container,
    Form,
    Button,
} from 'semantic-ui-react';
import ShareDetails from '../charity/ShareDetails';

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
                Content: valuesObject.staffCount,// '1404 full-time staff',
                name: 'users',
            },
            {
                Content: valuesObject.businessNumber, // 'Business #11921723487',
                name: 'briefcase',
            },
            {
                Content:valuesObject.businessNumber, // '400 Cooper Street, Suite 8000, Ottawa ON, K2P2H8',
                name: 'map marker alternate',
            },

        ];
        return data;
    }

    static detailsView(valuesObject) {
        const values = this.createUserDetails(valuesObject);
        debugger;
        return (
            <Grid.Row>
            <Grid.Column>
            <List>
            {values.map((value,index) => (
            (value.Content && index <= 3
                && <List.Item>
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
            ))}
            </List>
            </Grid.Column>
            <Grid.Column>
              <List>
              {values.map((value,index) => (
            (value.Content && index >=4
                && <List.Item>
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
            ))}
            </List>  
            </Grid.Column>
            </Grid.Row>
        );
    }

    render() {
        const {
            charityDetails,
            isAUthenticated,
        } = this.props;
        // let favouriteComponent = null;
        // if (isAUthenticated) {
        //     favouriteComponent = (
        //         <Header as="h5" icon>
        //             <a className="hoverable">
        //                 <Icon name="file text outline" />
        //                 <Header.Subheader>Favourite</Header.Subheader>
        //             </a>
        //         </Header>
        //     );
        // }
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
                                            {(charityDetails && charityDetails.charityDetails)
                                    && (UserDetails.detailsView(charityDetails.charityDetails.attributes))
                                            }
                                    </Grid>
                                    </Grid.Column>
                                    {(isAUthenticated
                                    && <ShareDetails />)}

                                </Grid.Row>
                            </Grid>
                            <p className="mt-1">
                            Is this your chariy? You can claim your free profile page on your platform <a href="#">by following these steps</a>
                            </p>
                        </div>
                    </Container>
                </div>
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
