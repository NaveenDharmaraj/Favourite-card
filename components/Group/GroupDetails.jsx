import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    bool,
    string,
} from 'prop-types';
import {
    Button,
    Container,
    Header,
    Icon,
    Image,
    Form,
    Grid,
    List,
} from 'semantic-ui-react';

const GroupDetails = (props) => {
    const {
        groupDetails: {
            attributes: {
                avatar,
                causes,
                name,
                location,
            },
        },
        isAUthenticated,
    } = props;
    let getCauses = null;

    // TODO add ellipses if it exceeds some(get confirmation) limit
    if (!_isEmpty(causes)) {
        getCauses = causes.map((cause, index) => (
            index <= 2
                ? (
                    <span className="badge">
                        {cause.display_name}
                    </span>
                ) : (
                    <span className="badge">
                        {cause.display_name}
                    </span>
                )
        ));
    }
    return (
        <div className="profile-header">
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={3} computer={2}>
                            <div className="profile-img-rounded">
                                <div className="pro-pic-wraper">
                                    <Image src={avatar} circular />
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={9} computer={10}>
                            <Grid stackable columns={3}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <div className="ProfileHeaderWraper">
                                            <Header as="h3">
                                                {name}
                                                <Header.Subheader>
                                                    {location}
                                                </Header.Subheader>
                                            </Header>
                                            
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div className="buttonWraper">
                                            <Button primary fluid className="blue-btn-rounded">Give</Button>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div className="buttonWraper">
                                            <Button fluid className="blue-bordr-btn-round">Join</Button>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <div className=" badge-group mt-1">
                                {getCauses}
                            </div>
                        </Grid.Column>
                        {isAUthenticated && (
                            <Grid.Column mobile={16} tablet={4} computer={4}>
                                <div className="profile-social-wraper">
                                    <div className="profile-social-links">
                                        <List horizontal>
                                            <List.Item as="a">
                                                <Icon name="heart outline" />
                                            </List.Item>
                                            <List.Item as="a">
                                                <Icon name="twitter" />
                                            </List.Item>
                                            <List.Item as="a">
                                                <Icon name="facebook" />
                                            </List.Item>
                                        </List>
                                    </div>
                                    <div className="share-link">
                                        <Form>
                                            <Form.Field>
                                                <label>Or share link</label>
                                                <input value="https://charitableimpact.com/share-this-awe…" />
                                            </Form.Field>
                                            <Button className="transparent-btn-round small">Copy link</Button>
                                        </Form>
                                    </div>
                                </div>
                            </Grid.Column>
                        )}
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
    );
};

GroupDetails.defaultProps = {
    groupDetails: {
        attributes: {
            avatar: '',
            groupType: '',
            location: '',
            name: '',
            slug: '',
        },
    },
    isAUthenticated: false,
};

GroupDetails.propTypes = {
    groupDetails: {
        attributes: {
            avatar: string,
            groupType: string,
            location: string,
            name: string,
            slug: string,
        },
    },
    isAUthenticated: bool,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(GroupDetails);
