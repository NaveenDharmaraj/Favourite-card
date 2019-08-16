import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
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
    copyDeepLink,
    saveFollowStatus,
    deleteFollowStatus,
    getBeneficiaryFromSlug,
} from '../../actions/charity';

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

    componentDidMount() {
        const{
            dispatch,
            userId,
            charityDetails,
            deepLink,
        } = this.props;
        getBeneficiaryFromSlug(dispatch, charityDetails.charityDetails.attributes.slug);
        if (_.isEmpty(deepLink)) {
            copyDeepLink(`deeplink?profileType=charityprofile&sourceId=${userId}&profileId=${charityDetails.charityDetails.id}`, dispatch);
        }
    }


    handleFollow() {
        const{
            dispatch,
            userId,
            charityDetails,
        } = this.props;
        dispatch({
            payload: {
            },
            type: actionTypes.DISABLE_FOLLOW_BUTTON,
        });
        if (charityDetails.charityDetails.attributes.following) {
            deleteFollowStatus(dispatch, userId, charityDetails.charityDetails.id);
        } else {
            saveFollowStatus(dispatch, userId, charityDetails.charityDetails.id);
        }
    }

    handleOnClick(event, data) {
        const {
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

    handleCopyLink = (e) => {
        this.textArea.select();
        document.execCommand('copy');
        e.target.focus();
      };

    render() {
        const {
            charityDetails,
            isAUthenticated,
            deepLink,
        } = this.props;
        const inputValue = (!_.isEmpty(deepLink)) ? deepLink.attributes["short-link"] : '';
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
                                    onClick={this.handleFollow}
                                    disabled={this.props.disableFollow}
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
                                <input
                                    value={inputValue}
                                    ref={(textarea) => this.textArea = textarea}
                                />
                            </Form.Field>
                            <Button
                                className="transparent-btn-round small"
                                onClick={this.handleCopyLink}
                            >
                                Copy link
                            </Button>
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
        deepLink: state.charity.charityDeepLink,
        disableFollow: state.give.disableFollow,
        isAUthenticated: state.auth.isAuthenticated,
        userId: state.user.info.id,
    };
}

export default connect(mapStateToProps)(ShareDetails);
