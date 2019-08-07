import React from 'react';
import { connect } from 'react-redux';
import getConfig from 'next/config';
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

const { publicRuntimeConfig } = getConfig();

const {
    APP_URL_ORIGIN,
} = publicRuntimeConfig;

class ShareDetails extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     color: props
        // }
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(event, data) {
        const{
            dispatch,
            userId,
            charityDetails,
        } = this.props;
        let url = '';
        let title = '';
        let width = 626;
        let height = 436;
        let top = (screen.height/2)-(height/2);
        let left = (screen.width/2)-(width/2);
        let type='';
        let slug='';
        if (charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.type
                && charityDetails.charityDetails.attributes) {
            type = charityDetails.charityDetails.type;
            slug = charityDetails.charityDetails.attributes.slug;
            name = charityDetails.charityDetails.attributes.name;
        }
        switch (data.id) {
            case 'twitter':
                url=encodeURIComponent(`${APP_URL_ORIGIN}/charities/${slug}`);
                title=encodeURIComponent(`Check out ${name} on @wearechimp. It's a Giving Group I'm a member of.`);
                window.open('https://twitter.com/share?url='+url+'&text='+title,'sharer','toolbar=0,location=0,status=0,width='+width+',height='+height+',top='+top+',left='+left);
                break;
            case 'facebook':
                url=encodeURIComponent(`https://24467.org/charities/${slug}`);
                title = encodeURIComponent("Give to any canadian charity");
                window.open('http://www.facebook.com/sharer.php?u='+url+'&t='+title,'sharer','toolbar=0,location=0,status=0,width='+width+',height='+height+',top='+top+',left='+left);
                break;
            default:
                break;
        }
    }

    render() {
        const {
            charityDetails,
            isAUthenticated,
        } = this.props;
        return (
            <Grid.Column mobile={16} tablet={6} computer={6}>
                <div className="profile-social-wraper">
                    <div className="profile-social-links">
                        <List horizontal>
                            <List.Item as="a">
                                <Icon
                                    id="follow"
                                    color={(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes.following) ? "red" : "blue"}
                                    name={(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes.following) ? "heart outline" : "heart"}
                                    onClick={this.handleOnClick}
                                />
                            </List.Item>
                            <List.Item as="a">
                                <Icon
                                    id="twitter"
                                    name="twitter"
                                    onClick={this.handleOnClick}
                                />
                            </List.Item>
                            <List.Item as="a">
                                <Icon
                                    id="facebook"
                                    name="facebook"
                                    onClick={this.handleOnClick}
                                />
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
