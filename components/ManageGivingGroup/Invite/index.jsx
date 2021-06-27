import React, {
    Fragment,
    useState,
    useEffect,
} from 'react';
import {
    useDispatch,
    useSelector,
} from 'react-redux';
import {
    Header,
    Form,
    Button,
    Icon,
    Table,
    Input,
    TextArea,
    Grid,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import Pagination from '../../shared/Pagination';
import PlaceholderGrid from '../../shared/PlaceHolder';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import { isValidEmailList } from '../../../helpers/give/giving-form-validation';
import {
    sendEmailInvite,
    getMyfriendsList,
    searchFriendList,
} from '../../../actions/createGivingGroup';
import { generateDeepLink } from '../../../actions/profile';
import MemberListCard from '../Manage/MemberListCard';

const Invite = () => {
    const currentUser = useSelector((state) => state.user.info);
    const groupDetails = useSelector((state) => state.group.groupDetails);
    const friendsList = useSelector((state) => state.createGivingGroup.friendsList);
    const friendsListPageCount = useSelector((state) => state.createGivingGroup.friendsListPageCount);
    const friendListLoader = useSelector((state) => state.createGivingGroup.groupFriendListLoader || false);
    const deepLinkUrl = useSelector((state) => state.profile.deepLinkUrl);
    const dispatch = useDispatch();
    const [
        emails,
        setemails,
    ] = useState('');
    const [
        message,
        setmessage,
    ] = useState('');
    const [
        showLoader,
        setshowLoader,
    ] = useState(false);
    const [
        inviteData,
        setinviteData,
    ] = useState([]);
    const [
        searchStr,
        setsearchStr,
    ] = useState('');
    const [
        currentActivePage,
        setcurrentActivePage,
    ] = useState(1);
    const [
        isValidEmail,
        setisValidEmail,
    ] = useState(true);
    const [
        validMessage,
        setvalidMessage,
    ] = useState(true);

    useEffect(() => {
        const url = `deeplink?profileType=groupprofile&profileId=${groupDetails.id}&sourceId=${currentUser.id}`;
        dispatch(getMyfriendsList(groupDetails.id));
        generateDeepLink(url, dispatch);
    }, []);

    useEffect(() => {
        const tempArr = [];
        if (!_isEmpty(friendsList)) {
            friendsList.map((data) => {
                tempArr.push(
                    <MemberListCard
                        memberData={data}
                        groupId={groupDetails.id}
                        isInvite={false}
                        isSingleAdmin={false}
                        isFriendList
                        groupSlug={groupDetails.attributes.slug}
                    />,
                );
            });
        }
        setinviteData(tempArr);
    }, [
        friendsList,
    ]);

    const inputValue = (!_isEmpty(deepLinkUrl)) ? deepLinkUrl.attributes['short-link'] : '';

    const handleEmail = (event) => {
        setemails(event.target.value);
    };
    const handleMessage = (event) => {
        setmessage(event.target.value);
        if (event.target.value.length > 300) {
            setvalidMessage(false);
        } else {
            setvalidMessage(true);
        }
    };
    const sendInvite = () => {
        const payload = {
            data: {
                attributes: {
                    group_id: groupDetails.id,
                    invites: emails,
                    notes: message,
                },
                type: 'groups',
            },
        };
        setshowLoader(true);
        dispatch(sendEmailInvite(payload)).finally(() => {
            setemails('');
            setmessage('');
            setshowLoader(false);
        });
    };

    const onPageChanged = (event, data) => {
        setcurrentActivePage(data.activePage);
        // if (!_isEmpty(searchText)) {
        //     dispatch(searchFriendList(groupDetails.id, searchText, data.activePage));
        // } else {
        dispatch(getMyfriendsList(groupDetails.id, data.activePage));
        // }
    };

    const updateSearch = (event) => {
        setsearchStr(event.target.value);
    };

    const handleSearch = () => {
        dispatch(searchFriendList(groupDetails.id, searchStr));
    };

    const handleShareClick = (type) => {
        const encodedUrl = encodeURIComponent(deepLinkUrl.attributes['short-link']);
        let title = '';
        switch (type) {
            case 'twitter':
                title = encodeURIComponent(`Check out ${groupDetails.attributes.name} on @wearecharitable.`);
                window.open(`https://twitter.com/share?url=${encodedUrl}&text=${title}`, '_blank');
                break;
            case 'facebook':
                title = encodeURIComponent(`Give to any canadian group`);
                window.open(`http://www.facebook.com/sharer.php?u=${encodedUrl}&t=${title}`, '_blank');
                break;
            default:
                break;
        }
    };

    const handleClearSearch = () => {
        setsearchStr('');
        dispatch(getMyfriendsList(groupDetails.id));
    };

    const handleOnBlur = () => {
        const isValid = isValidEmailList(emails);
        setisValidEmail(isValid);
    };

    return (
        <div className="basicsettings">
            <Header className="titleHeader">
                Invite
            </Header>
            <div className="Invite">
                <Header as="h3">Invite people you're friends with on Charitable Impact to join your Giving Group.</Header>
                <div className="search-banner campaignSearchBanner InviteSearch">
                    <div className="searchbox">
                        <Input
                            fluid
                            placeholder="Search friends"
                            onChange={updateSearch}
                            value={searchStr}
                        />
                        <div className="search-btn campaignSearch">
                            {(!_isEmpty(searchStr) && searchStr.length >= 1)
                                && <Icon name="close_icons_campaignSearch invite_search" onClick={handleClearSearch} />
                            }
                            <a>
                                <Icon
                                    name="search"
                                    onClick={handleSearch}
                                />
                            </a>
                        </div>
                    </div>
                </div>
                {!friendListLoader
                    ? (
                        <Fragment>
                            <Table basic="very" unstackable className="ManageTable Topborder Bottomborder">
                                <Table.Body>
                                    {!_isEmpty(inviteData)
                                        ? (
                                            inviteData
                                        ) : (
                                            <p> No friends found</p>
                                        )}
                                </Table.Body>
                            </Table>
                            <div className="paginationWraper group_pagination">
                                <div className="db-pagination">
                                    {
                                        !_isEmpty(inviteData) && friendsListPageCount > 1 && (
                                            <Pagination
                                                activePage={currentActivePage}
                                                totalPages={friendsListPageCount}
                                                onPageChanged={onPageChanged}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </Fragment>
                    )
                    : (
                        <Grid className="no-margin">
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <PlaceholderGrid row={8} column={1} placeholderType="activityList" />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )}
            </div>
            <div className="Invitepeople">
                <Header as="h3" className="message_bottom">Invite people with a personal message</Header>
                <p className="InvitepeopleText">Send an invitation to friends, family, or anyone who might be interested in joining your Giving Group. You can also include a personal note with your invitation.</p>
                <label>Enter as many email addresses as you like, separated by comma</label>
                <Form>
                    <div className="group_email_invite">
                        <Input
                            className="fulllWidth"
                            placeholder="Email address"
                            onChange={handleEmail}
                            onBlur={handleOnBlur}
                            value={emails}
                        />
                        <FormValidationErrorMessage
                            condition={!isValidEmail}
                            errorMessage="Enter valid email addresses, separated by commas"
                        />
                    </div>
                    <label>Message</label>
                    <div className="group_invite_message">
                        <TextArea
                            placeholder="Include a personal message in your invitation."
                            onChange={handleMessage}
                            value={message}
                        />
                        <FormValidationErrorMessage
                            condition={!validMessage}
                            errorMessage="Maximum of 300 characters can be entered"
                        />
                    </div>
                    <div className="email-group-members">
                        <Button
                            className="blue-btn-rounded-def Invitagebtn"
                            onClick={sendInvite}
                            disabled={_isEmpty(emails) || _isEmpty(message) || showLoader || !isValidEmail || !validMessage}
                            loading={showLoader}
                        >
                        Send invite
                        </Button>
                    </div>
                </Form>
            </div>
            <div className="Invitepeople">
                <Header as='h3'>Or share link</Header>
                <div className="linkhtp">
                    <Input
                        type="text"
                        value={inputValue}
                    />
                </div>
                <div className="Shared_ShareProfile">
                    <i
                        aria-hidden="true"
                        className="twitter icon"
                        onClick={() => handleShareClick('twitter')}
                    />
                </div>
                <div className="Shared_ShareProfile">
                    <i
                        aria-hidden="true"
                        className="facebook icon"
                        onClick={() => handleShareClick('facebook')}
                    />
                </div>
            </div>
        </div>

    );
};

export default Invite;
