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


class ShareDetails extends React.Component {
    componentDidMount() {
        console.log("didmount called");
    }

    render() {
        const {
            charityDetails,
            isAUthenticated,
        } = this.props;
        debugger;
        return (
            <Grid.Column mobile={16} tablet={6} computer={6}>
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
                                <input value="https://charitableimpact.com/share-this-awe…"/>
                            </Form.Field>
                            <Button className="transparent-btn-round small">Copy link</Button>
                        </Form>
                    </div>
                </div>
            </Grid.Column>
        );
    };
}

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(ShareDetails);
