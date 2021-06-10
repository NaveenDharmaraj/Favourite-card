import React, {
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
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import Pagination from '../../shared/Pagination';
import {
    sendEmailInvite,
    getMyfriendsList,
    searchFriendList,
} from '../../../actions/createGivingGroup';
import MemberListCard from '../Manage/MemberListCard';

const Invite = () => {
    const groupDetails = useSelector((state) => state.group.groupDetails);
    const friendsList = useSelector((state) => state.createGivingGroup.friendsList);
    const friendsListPageCount = useSelector((state) => state.createGivingGroup.friendsListPageCount);
    const dispatch = useDispatch();
    const [emails, setemails] = useState('');
    const [message, setmessage] = useState('');
    const [showLoader, setshowLoader] = useState(false);
    const [inviteData, setinviteData] = useState([]);
    const [searchStr, setsearchStr] = useState('');
    const [
        currentActivePage,
        setcurrentActivePage,
    ] = useState(1);

    useEffect(() => {
        dispatch(getMyfriendsList(groupDetails.id));
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
                    />,
                );
            });
            setinviteData(tempArr);
        }

    }, [
        friendsList,
    ]);

    const handleEmail = (event) => {
        setemails(event.target.value);
    };
    const handleMessage = (event) => {
        setmessage(event.target.value);
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
                            <a>
                                <Icon
                                    name="search"
                                    onClick={handleSearch}
                                />
                            </a>
                        </div>
                    </div>
                </div>
                <Table basic="very" unstackable className="ManageTable Topborder Bottomborder">
                    <Table.Body>
                        {inviteData}
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
            </div>
            <div className="Invitepeople">
                <Header as="h3" className="message_bottom">Invite people with a personal message</Header>
                <p className="InvitepeopleText">Send an invitation to friends, family, or anyone who might be interested in joining your Giving Group. You can also include a personal note with your invitation.</p>
                <label>Enter as many email addresses as you like, separated by comma</label>
                <Form>
                    <Input
                        className="fulllWidth"
                        placeholder="Email address"
                        onChange={handleEmail}
                        value={emails}
                    />
                    <label>Message</label>
                    <TextArea
                        placeholder="Include a personal message in your invitation."
                        onChange={handleMessage}
                        value={message}
                    />
                    <div className="email-group-members">
                        <Button
                            className="blue-btn-rounded-def Invitagebtn"
                            onClick={sendInvite}
                            disabled={_isEmpty(emails) || _isEmpty(message) || showLoader}
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
                    <Input type="text" value="https://charitableimpact.com/share-this-awesome-link" />
                </div>
                <div className="Shared_ShareProfile">
                    <i aria-hidden="true" class="twitter icon"></i>
                </div>
                <div className="Shared_ShareProfile">
                    <i aria-hidden="true" class="facebook icon"></i>
                </div>
            </div>
        </div>

    );
};

export default Invite;
