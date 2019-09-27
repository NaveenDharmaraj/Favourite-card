import React from 'react';
import _ from 'lodash';
import getConfig from 'next/config';
import {
    Grid,
    List,
    Icon,
    Form,
    Button,
} from 'semantic-ui-react';
import {
    followProfile,
    unfollowProfile,
} from '../../../actions/profile';
import { connect } from 'react-redux';

const actionTypes = {
    DISABLE_COPYLINK_BUTTON: 'DISABLE_COPYLINK_BUTTON',
    DISABLE_FOLLOW_BUTTON: 'DISABLE_FOLLOW_BUTTON',
};
const { publicRuntimeConfig } = getConfig();

const {
    APP_URL_ORIGIN,
} = publicRuntimeConfig;

class ShareDetails extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleCopyLink = this.handleCopyLink.bind(this);
        this.handleFollow = this.handleFollow.bind(this);
    }

    handleFollow() {
        const{
            dispatch,
            userId,
            profileDetails,
        } = this.props;
        dispatch({
            payload: {
                disableFollow: true,
            },
            type: actionTypes.DISABLE_FOLLOW_BUTTON,
        });
        let targetId;
        if(profileDetails.type === 'campaigns') {
            targetId = profileDetails.attributes.groupId;
        } else {
            targetId = profileDetails.id
        }
        const likeFlag = (profileDetails.type === 'beneficiaries') ? profileDetails.attributes.following : profileDetails.attributes.liked;

        (likeFlag) ? unfollowProfile(dispatch, userId, targetId, profileDetails.type) : followProfile(dispatch, userId, targetId, profileDetails.type);

    }

    handleOnClick(event, data) {
        const {
            profileDetails,
            deepLinkUrl,
        } = this.props;
        let url = '';
        let title = '';
        let width = 626;
        let height = 436;
        let top = (screen.height/2)-(height/2);
        let left = (screen.width/2)-(width/2);
        let type='';
        let slug='';
        if (profileDetails && profileDetails.type
                && profileDetails.attributes) {
            type = (profileDetails.type === 'beneficiary') ? 'charities' : profileDetails.type;
            
            slug = profileDetails.attributes.slug;
            name = profileDetails.attributes.name;
        }
        let encodedUrl = encodeURIComponent(deepLinkUrl.attributes["short-link"]);
        switch (data.id) {
            case 'twitter':
                url=encodedUrl;
                title=encodeURIComponent(`Check out ${name} on @wearechimp.`);
                window.open('https://twitter.com/share?url='+url+'&text='+title,'sharer','toolbar=0,location=0,status=0,width='+width+',height='+height+',top='+top+',left='+left);
                break;
            case 'facebook':
                url=encodedUrl;
                title = encodeURIComponent(`Give to any canadian ${type}`);
                window.open('http://www.facebook.com/sharer.php?u='+url+'&t='+title,'sharer','toolbar=0,location=0,status=0,width='+width+',height='+height+',top='+top+',left='+left);
                break;
            default:
                break;
        }
    }

    handleCopyLink = (e) => {
        this.textArea.select();
        document.execCommand('copy');
        e.target.focus();
    };

    render() {
        const {
            profileDetails,
            deepLinkUrl,
        } = this.props;
        const inputValue = (!_.isEmpty(deepLinkUrl)) ? deepLinkUrl.attributes["short-link"] : '';0.

        return (
            <Grid.Column mobile={16} tablet={6} computer={6}>
                <div className="profile-social-wraper">
                    <div className="profile-social-links">
                        <List horizontal>
                            <List.Item as="a">
                                {(profileDetails.type ==='beneficiaries') ? (
                                <Icon
                                    id="follow"
                                    color={(profileDetails && profileDetails && profileDetails.attributes.following) ? "red" : "outline"}
                                    name={(profileDetails && profileDetails && profileDetails.attributes.following) ? "heart" : "heart"}
                                    onClick={this.handleFollow}
                                    disabled={this.props.disableFollow}
                                />
                                ) : (
                                    <Icon
                                    id="follow"
                                    color={(profileDetails && profileDetails && profileDetails.attributes.liked) ? "red" : "outline"}
                                    name={(profileDetails && profileDetails && profileDetails.attributes.liked) ? "heart" : "heart"}
                                    onClick={this.handleFollow}
                                    disabled={this.props.disableFollow}
                                />
                                )}
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
                                <input
                                    value={inputValue}
                                    ref={(textarea) => this.textArea = textarea}
                                />
                            </Form.Field>
                            {/* <Button
                                className="transparent-btn-round small"
                                onClick={this.handleCopyLink}
                            >
                                Copy link
                            </Button> */}
                        </Form>
                    </div>
                </div>
            </Grid.Column>
        );
    }
}

function mapStateToProps(state) {
    return {
        disableFollow: state.profile.disableFollow,
    }
}


export default connect(mapStateToProps)(ShareDetails);
