import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Modal,
    List,
    Icon,
    Input,
} from 'semantic-ui-react';
import {
    followProfile,
    unfollowProfile,
} from '../../actions/profile';
import { connect } from 'react-redux';

const actionTypes = {
    DISABLE_COPYLINK_BUTTON: 'DISABLE_COPYLINK_BUTTON',
    DISABLE_FOLLOW_BUTTON: 'DISABLE_FOLLOW_BUTTON',
};

class GroupShareDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showShareModal: false,
        }
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleCopyLink = this.handleCopyLink.bind(this);
        this.handleFollow = this.handleFollow.bind(this);
    }

    handleFollow() {
        const{
            currentUser: {
                id: userId,
            },
            dispatch,
            groupDetails:{
                attributes:{
                    liked,
                },
                id: groupId,
                type,
            },
        } = this.props;
        dispatch({
            payload: {
                disableFollow: true,
            },
            type: actionTypes.DISABLE_FOLLOW_BUTTON,
        });
        (liked) ? unfollowProfile(dispatch, userId, groupId, type) : followProfile(dispatch, userId, groupId, type);

    }

    handleOnClick(event, data) {
        const {
            groupDetails:{
                attributes:{
                    slug,
                    name,
                },
                type,
            },
            deepLinkUrl,
        } = this.props;
        let title = '';
        let width = 626;
        let height = 436;
        let top = (screen.height/2)-(height/2);
        let left = (screen.width/2)-(width/2);
        let encodedUrl = encodeURIComponent(deepLinkUrl.attributes["short-link"]);
        switch (data.id) {
            case 'twitter':
                title=encodeURIComponent(`Check out ${name} on @wearecharitable.`);
                window.open('https://twitter.com/share?url='+encodedUrl+'&text='+title,'_blank');
                break;
            case 'facebook':
                title = encodeURIComponent(`Give to any canadian ${type}`);
                window.open('http://www.facebook.com/sharer.php?u='+encodedUrl+'&t='+title,'_blank');
                break;
            default:
                break;
        }
        this.closeShareModal();
    }

    handleCopyLink = (e) => {
        this.textArea.select();
        document.execCommand('copy');
        e.target.focus();
    };

    closeShareModal = () => {
        this.setState({ showShareModal: false })
      }

    render() {
        const {
            groupDetails: {
                attributes: {
                    liked,
                }
            },
            currentUser,
            deepLinkUrl,
            disableFollow,
        } = this.props;
        const {
            showShareModal,
        } = this.state;
        const inputValue = (!_.isEmpty(deepLinkUrl)) ? deepLinkUrl.attributes["short-link"] : '';
        return (    
            <Fragment>
                <List horizontal className="shareAndLike">
                    { currentUser && ( <List.Item as="a">
                        <Icon
                        id="follow"
                        color={liked ? "red" : "outline"}
                        name="heart"
                        onClick={this.handleFollow}
                        disabled={disableFollow}
                    />
                    </List.Item>
                    )}
                    <Modal className="chimp-modal" onClose={this.closeShareModal} open={showShareModal} closeIcon size="tiny" trigger={
                        <List.Item as="a">
                            <Icon className="share alternate" onClick={() => this.setState({ showShareModal: true })}></Icon>
                        </List.Item>
                    }>
                        <Modal.Header>Share this Group</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <List divided relaxed verticalAlign='middle' className="shareModalList">
                                    <List.Item
                                    id="twitter"
                                    onClick={this.handleOnClick}
                                    >
                                        <List.Icon
                                        name='twitter'
                                        />
                                        <List.Content>
                                            <List.Header as='a'>Twitter</List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item
                                    id="facebook"
                                    onClick={this.handleOnClick}
                                    >
                                        <List.Icon name='facebook' />
                                        <List.Content>
                                            <List.Header as='a'>Facebook</List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item className="shareCopyLink">
                                        <List.Content>
                                            <div className='shareLinkLeft'>Or share link</div>
                                            <div className='shareLinkTextBox'>
                                                <Input
                                                value={inputValue}
                                                />
                                            </div>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>
                </List>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        deepLinkUrl: state.profile.deepLinkUrl,
        groupDetails: state.group.groupDetails,
        disableFollow: state.profile.disableFollow,
    }
}


export default connect(mapStateToProps)(GroupShareDetails);
