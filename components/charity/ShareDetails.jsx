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
import {
    saveFollowStatus,
    deleteFollowStatus,
} from '../../actions/charity';


class ShareDetails extends React.Component {
    constructor(props) {
        super(props);
        debugger;
        // this.state = {
        //     color: props
        // }
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const{
            dispatch,
            userId,
            charityDetails,
        } = this.props;
        debugger;
        console.log('clicked');
        if (charityDetails.charityDetails.attributes.following) {
            deleteFollowStatus(dispatch, userId, charityDetails.charityDetails.id);
        } else {
            saveFollowStatus(dispatch, userId, charityDetails.charityDetails.id);
        }
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
                                <Icon
                                    color={(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes.following) ? "red" : ""}
                                    name="heart outline"
                                    onClick={this.handleOnClick}
                                />
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
    }
}

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
        isAUthenticated: state.auth.isAuthenticated,
        userId: state.user.info.id,
    };
}

export default connect(mapStateToProps)(ShareDetails);
