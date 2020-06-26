import React, {
    Fragment,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Modal,
    List,
    Icon,
    Input,
} from 'semantic-ui-react';
import {
    PropTypes,
    bool,
    func,
    string,
    number,
} from 'prop-types';
import { connect } from 'react-redux';

import {
    followProfile,
    unfollowProfile,
} from '../../../actions/profile';

const actionTypes = {
    DISABLE_COPYLINK_BUTTON: 'DISABLE_COPYLINK_BUTTON',
    DISABLE_FOLLOW_BUTTON: 'DISABLE_FOLLOW_BUTTON',
};

class ShareProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showShareModal: false,
        };
        this.closeShareModal = this.closeShareModal.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleFollow = this.handleFollow.bind(this);
    }

    handleFollow() {
        const {
            currentUser: {
                id: userId,
            },
            dispatch,
            liked,
            profileId,
            type,
        } = this.props;
        dispatch({
            payload: {
                disableFollow: true,
            },
            type: actionTypes.DISABLE_FOLLOW_BUTTON,
        });
        if (liked) {
            unfollowProfile(dispatch, userId, profileId, type);
        } else {
            followProfile(dispatch, userId, profileId, type);
        }
    }

    handleOnClick(event, data) {
        const {
            deepLinkUrl,
            name,
            type,
        } = this.props;
        let title = '';
        const encodedUrl = encodeURIComponent(deepLinkUrl.attributes['short-link']);
        switch (data.id) {
            case 'twitter':
                title = encodeURIComponent(`Check out ${name} on @wearecharitable.`);
                window.open(`https://twitter.com/share?url=${encodedUrl}&text=${title}`, '_blank');
                break;
            case 'facebook':
                title = encodeURIComponent(`Give to any canadian ${type}`);
                window.open(`http://www.facebook.com/sharer.php?u=${encodedUrl}&t=${title}`, '_blank');
                break;
            default:
                break;
        }
        this.closeShareModal();
    }

    closeShareModal() {
        this.setState({ showShareModal: false });
    }

    render() {
        const {
            deepLinkUrl,
            disableFollow,
            liked,
            isAuthenticated,
        } = this.props;
        const {
            showShareModal,
        } = this.state;
        const inputValue = (!_isEmpty(deepLinkUrl)) ? deepLinkUrl.attributes['short-link'] : '';
        return (
            <Fragment>
                <List horizontal className="shareAndLike" data-test="Shared_ShareProfile_shareSection">
                    { isAuthenticated && (
                        <List.Item as="a">
                            <Icon
                                id="follow"
                                color={liked ? 'red' : 'outline'}
                                name="heart"
                                onClick={this.handleFollow}
                                disabled={disableFollow}
                                data-test="Shared_ShareProfile_likeIcon"
                            />
                        </List.Item>
                    )}
                    <Modal
                        className="chimp-modal"
                        onClose={this.closeShareModal}
                        open={showShareModal}
                        closeIcon
                        size="tiny"
                        trigger={
                            (
                                <List.Item as="a">
                                    <Icon data-test="Shared_ShareProfile_share_icon" className="share alternate" onClick={() => this.setState({ showShareModal: true })} />
                                </List.Item>
                            )
                        }
                    >
                        <Modal.Header data-test="Shared_ShareProfile_popup">Share this Group</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <List divided relaxed verticalAlign="middle" className="shareModalList">
                                    <List.Item
                                        id="twitter"
                                        onClick={this.handleOnClick}
                                        data-test="Shared_ShareProfile_twitter"
                                    >
                                        <List.Icon
                                            name="twitter"
                                        />
                                        <List.Content>
                                            <List.Header as="a">Twitter</List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item
                                        id="facebook"
                                        onClick={this.handleOnClick}
                                        data-test="Shared_ShareProfile_facebook"
                                    >
                                        <List.Icon name="facebook" />
                                        <List.Content>
                                            <List.Header as="a">Facebook</List.Header>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item className="shareCopyLink">
                                        <List.Content>
                                            <div className="shareLinkLeft">Or share link</div>
                                            <div className="shareLinkTextBox">
                                                <Input
                                                    data-test="Shared_ShareProfile_deeplink"
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

ShareProfile.defaultProps = {
    currentUser: PropTypes.shape({
        id: null,
    }),
    disableFollow: false,
    dispatch: () => {},
    isAuthenticated: false,
    liked: false,
    name: '',
    profileId: '',
    type: '',
};

ShareProfile.propTypes = {
    currentUser: PropTypes.shape({
        id: number,
    }),
    disableFollow: bool,
    dispatch: func,
    isAuthenticated: bool,
    liked: bool,
    name: string,
    profileId: string,
    type: string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        deepLinkUrl: state.profile.deepLinkUrl,
        disableFollow: state.profile.disableFollow,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

const connectedComponent = connect(mapStateToProps)(ShareProfile);
export {
    connectedComponent as default,
    ShareProfile,
    mapStateToProps,
};
