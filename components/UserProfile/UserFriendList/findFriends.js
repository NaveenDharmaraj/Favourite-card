import { useEffect, useRef, useState } from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Header,
    Image,
    Icon,
    Button,
    Modal,
    Form,
} from 'semantic-ui-react';

import { Router } from '../../../routes';
import { inviteFriends, updateUserProfileToastMsg } from '../../../actions/userProfile';
import findFriendImg from '../../../static/images/find-friends.png';
import { useSelector } from 'react-redux';

const FindFriends = ({ dispatch, showFindFriendsLink }) => {
    const [inviteModalStatus, setInviteModalStatus] = useState(false);
    const [userEmailIdsArray, setUserEmailIdsArray] = useState([]);
    const [isValidEmails, setIsValidEmails] = useState(true);
    const [userEmailId, setUserEmailId] = useState('');
    const [inviteButtonClicked, setInviteButtonClicked] = useState(false);
    const [signUpDeeplink, setSignUpDeeplink] = useState('');

    const textArea = useRef(null);

    const userProfileSignUpDeeplink = useSelector(state => state.userProfile.userProfileSignUpDeeplink || {});

    useEffect(() => {
        if (userProfileSignUpDeeplink && userProfileSignUpDeeplink.data && userProfileSignUpDeeplink.data.attributes['short-link']) {
            setSignUpDeeplink(userProfileSignUpDeeplink.data.attributes['short-link']);
        };
    }, [userProfileSignUpDeeplink])
    const toogleInviteModal = (modalStatus) => {
        setInviteModalStatus(modalStatus)
    };
    const handleDelete = item => {
        const filterUserEmailIdsArray = userEmailIdsArray.filter(i => i !== item)
        setUserEmailIdsArray([...filterUserEmailIdsArray])
    };
    const handleKeyDown = (evt) => {
        if (["Enter", "Tab", " ", ","].includes(evt.key)) {
            evt.preventDefault();
            var value = userEmailId.trim();
            let isEmailIdValid = isEmail(userEmailId);
            setIsValidEmails(isEmailIdValid)
            if (value && isEmailIdValid) {
                setUserEmailId("");
                setUserEmailIdsArray([...userEmailIdsArray, userEmailId])
            }
        }
    };
    const isEmail = (email) => {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    };
    const handleInputChange = (event, data) => {
        const {
            value,
        } = !_isEmpty(data) ? data : event.target;
        setUserEmailId(value);
    };
    const validateEmailIds = (emailIds) => {
        let isValidEmail = true;
        if (emailIds.length === 0) {
            return false
        }
        for (let i = 0; i < emailIds.length; i++) {
            isValidEmail = /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(emailIds[i]);
            if (!isValidEmail) {
                return false;
            }
        }
        return true;
    };
    const handleInviteFriendsClick = () => {
        setInviteButtonClicked(true);
        let emailIdsArray = userEmailIdsArray;
        if (!_isEmpty(userEmailId)) {
            var value = userEmailId.trim();
            emailIdsArray = [...userEmailIdsArray, value];
        }
        const emailsValid = validateEmailIds(emailIdsArray);
        setIsValidEmails(emailsValid);
        if (emailIdsArray !== null && emailsValid) {
            let userEmailIdList = emailIdsArray.join();
            inviteFriends(dispatch, userEmailIdList).then(() => {
                setInviteButtonClicked(false)
                setInviteModalStatus(false);
                setUserEmailId('');
                setUserEmailIdsArray([]);
            }).catch((err) => {
                setInviteButtonClicked(false)
                setUserEmailId('');
                setUserEmailIdsArray([]);
            });
        } else {
            setInviteButtonClicked(false)
        }
    };
    const handleCopyLink = (e) => {
        textArea.current.select();
        document.execCommand('copy');
        e.target.focus();
        try {
            const statusMessageProps = {
                message: 'Link copied to clipboard',
                type: 'success',
            };
            dispatch(updateUserProfileToastMsg(statusMessageProps));
        } catch (err) {
            const statusMessageProps = {
                message: 'Failed to copy to clipboard',
                type: 'error',
            };
            dispatch(updateUserProfileToastMsg(statusMessageProps));
        }
    };
    const handleShareClick = (type) => {
        switch (type) {
            case 'twitter':
                window.open(`https://twitter.com/share?url=${signUpDeeplink}`, '_blank');
                break;
            case 'facebook':
                window.open(`http://www.facebook.com/sharer.php?u=${signUpDeeplink}`, '_blank');
                break;
            default:
                break;
        };
        setInviteModalStatus(false);
    };
    const renderFindFriendsRotue = () => {
        if (showFindFriendsLink) {
            Router.pushRoute('/user/profile/friends/findFriends');
            return
        }
    };
    return (
        <div className="findFriendsWrap">
            <Image src={findFriendImg} />
            <Header>Find friends, send them charitable dollars, and give together.</Header>
            <p className='invite_text_1'>You can <span className={showFindFriendsLink && 'user-profile-link-text'} onClick={renderFindFriendsRotue}>find friends</span> by name, and they can search for your personal profile too. You can also invite friends not yet on Charitable Impact.</p>
            <p className='invite_text_2'>Your discoverability can be changed in Account Settings.</p>
            <Button className='blue-btn-rounded-def' onClick={() => toogleInviteModal(true)}>
                Invite friends
                 </Button>
            <Modal
                size="tiny"
                dimmer="inverted"
                closeIcon
                className="chimp-modal inviteModal"
                open={inviteModalStatus}
                onClose={() => toogleInviteModal(false)}
            >
                <Modal.Header>Invite friends to join you on Charitable Impact</Modal.Header>
                <Modal.Content>
                    <div className='inviteField'>
                        <label>
                            Enter as many email addresses as you like, separated by a comma:
                            </label>
                        <div className='fieldWrap'>
                            <div className='label-input-wrap'>
                                <div className="email-labels">
                                    {!_isEmpty(userEmailIdsArray)
                                        && (
                                            userEmailIdsArray.map((email) => (
                                                <label className="label">{email}
                                                    <Icon
                                                        className='delete'
                                                        onClick={() => handleDelete(email)}
                                                    />
                                                </label>
                                            ))
                                        )}
                                </div>
                                <Form.Input
                                    placeholder="Email Address"
                                    error={!isValidEmails}
                                    id="userEmailId"
                                    name="userEmailId"
                                    onKeyDown={handleKeyDown}
                                    onChange={handleInputChange}
                                    //ref={(ip) => this.myInp = ip}
                                    value={userEmailId}
                                />
                            </div>
                            <Button
                                className="blue-btn-rounded-def"
                                onClick={handleInviteFriendsClick}
                                disabled={inviteButtonClicked}
                            >
                                Invite
                                </Button>
                        </div>
                    </div>
                    <div className="inviteField copylink">
                        <label>Or share a link:</label>
                        <div className="fieldWrap">
                            <div className="label-input-wrap">
                                <Form.Field>
                                    <input
                                        value={signUpDeeplink}
                                        ref={textArea}
                                    />
                                </Form.Field>
                            </div>
                            <Button
                                className="blue-bordr-btn-round-def"
                                onClick={handleCopyLink}
                            >
                                Copy link
                                </Button>
                        </div>
                    </div>

                    <div className="socailLinks">
                        <a>
                            <Icon
                                className="twitter"
                                onClick={() => handleShareClick('twitter')}
                            />
                        </a>
                        <a>
                            <Icon
                                className="facebook"
                                onClick={() => handleShareClick('facebook')}
                            />
                        </a>
                    </div>
                </Modal.Content>
            </Modal>
        </div>
    )
};
FindFriends.defaultProps = {
    showFindFriendsLink: false,
    dispatch: () => { },
    userProfileSignUpDeeplink: {
        data: {
            attributes: {
                ['short-link']: '',
            }
        }
    }
}
export default React.memo(FindFriends);
