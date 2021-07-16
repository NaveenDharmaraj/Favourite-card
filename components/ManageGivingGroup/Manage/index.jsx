import React, {
    Fragment, useState, useEffect,
} from 'react';
import {
    useDispatch, useSelector,
} from 'react-redux';
import {
    Header,
    Icon,
    Table,
    Input,
    Grid,
    Button,
    Image,
    Responsive,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import {
    Link,
    Router,
} from '../../../routes';
import {
    getGroupMembers,
    getPendingInvites,
    searchMember,
} from '../../../actions/createGivingGroup';
import noDataImg from '../../../static/images/img_findfriends.svg';
import Pagination from '../../shared/Pagination';
import PlaceholderGrid from '../../shared/PlaceHolder';

import MemberListCard from './MemberListCard';

const Manage = () => {
    const [
        searchText,
        setsearchText,
    ] = useState('');
    const groupDetails = useSelector((state) => state.group.groupDetails);
    const memberCount = useSelector((state) => state.createGivingGroup.groupMemberCount);
    const membersData = useSelector((state) => state.createGivingGroup.groupMemberRoles);
    const invitesCount = useSelector((state) => state.createGivingGroup.groupPendingInvitesCount);
    const invitesPageCount = useSelector((state) => state.createGivingGroup.groupPendingInvitesPageCount);
    const pendingPlaceholderStatus = useSelector((state) => state.createGivingGroup.pendingPlaceholderStatus);
    const groupMemberPlaceholderStatus = useSelector((state) => state.createGivingGroup.groupMemberPlaceholderStatus);
    const groupPendingInvites = useSelector((state) => state.createGivingGroup.groupPendingInvites);
    const memberPageCount = useSelector((state) => state.createGivingGroup.groupMemberPageCount);
    const currentUser = useSelector((state) => state.user.info);
    const isSingleAdminMember = useSelector((state) => state.createGivingGroup.groupMemberNoData);
    const dispatch = useDispatch();
    const [
        currentActivePage,
        setcurrentActivePage,
    ] = useState(1);
    const [
        memberList,
        setmemberList,
    ] = useState([]);
    const [
        pendingList,
        setpendingList,
    ] = useState([]);
    const [
        currentInviteActivePage,
        setcurrentInviteActivePage,
    ] = useState(1);
    let isSingleAdmin = (memberCount === 1);
    let adminCount = 0;

    useEffect(() => {
        if (groupDetails) {
            dispatch(getGroupMembers(groupDetails.id, 1, true));
            dispatch(getPendingInvites(groupDetails.id));
        }
    }, [
        groupDetails,
    ]);

    useEffect(() => {
        const tempArr = [];
        if (!_isEmpty(membersData) && !isSingleAdmin) {
            membersData.map((member) => {
                if (member.attributes.isGroupAdmin) {
                    adminCount += 1;
                }
            });
            if (adminCount === 1) {
                isSingleAdmin = true;
            }
        }
        if (!_isEmpty(membersData)) {
            membersData.map((member) => (
                tempArr.push(
                    <MemberListCard
                        memberData={member}
                        groupId={groupDetails.id}
                        isInvite={false}
                        isSingleAdmin={isSingleAdmin}
                        isCurrentUser={member.id === currentUser.id}
                        groupSlug={groupDetails.attributes.slug}
                    />,
                )
            ));
        }
        setmemberList(tempArr);
    }, [
        membersData,
    ]);

    useEffect(() => {
        const tempArr = [];
        if (!_isEmpty(groupPendingInvites)) {
            groupPendingInvites.map((invite) => (
                tempArr.push(
                    <MemberListCard
                        memberData={invite}
                        groupId={groupDetails.id}
                        isInvite
                        groupSlug={groupDetails.attributes.slug}
                    />,
                )
            ));
        }
        setpendingList(tempArr);
    }, [
        groupPendingInvites,
    ]);

    const onPageChanged = (event, data) => {
        setcurrentActivePage(data.activePage);
        if (!_isEmpty(searchText)) {
            dispatch(searchMember(groupDetails.id, searchText, data.activePage));
        } else {
            dispatch(getGroupMembers(groupDetails.id, data.activePage));
        }
    };

    const onInvitePageChanged = (event, data) => {
        setcurrentInviteActivePage(data.activePage);
        dispatch(getPendingInvites(groupDetails.id, data.activePage));
    };

    const updateSearch = (event) => {
        setsearchText(event.target.value);
    };

    const handleSearch = () => {
        dispatch(searchMember(groupDetails.id, searchText));
    };

    const handleClearSearch = () => {
        setsearchText('');
        dispatch(getGroupMembers(groupDetails.id));
    };

    const updateMenu = (index, menu) => {
        dispatch({
            payload: {
                menuDetails: {
                    index,
                    menu,
                },
            },
            type: 'UPDATE_MANAGE_GROUP_MENU_ITEM',
        });
    };

    const resetPageViewStatus = () => {
        dispatch({
            payload: {
                pageStatus: {
                    menuView: true,
                    pageView: false,
                },
            },
            type: 'SET_MANAGE_PAGE_STATUS',
        });
    };

    return (
        <div className="basicsettings">
            <Header className="titleHeader">
                <Responsive minWidth={320} maxWidth={767}>
                    <span>
                        <i
                            aria-hidden="true"
                            className="back_to_menu icon"
                            onClick={resetPageViewStatus}
                        />
                    </span>
                </Responsive>
                        Manage
            </Header>
            {!isSingleAdminMember
            && (
                <div className=" campaignSearchBanner ManageSearch">
                    <div className="searchbox">
                        <Input
                            fluid
                            className="searchInput"
                            placeholder="Find a group member"
                            onChange={updateSearch}
                            value={searchText}
                        />
                        <div className="search-btn campaignSearch">
                            {(!_isEmpty(searchText) && searchText.length >= 1)
                                && <Icon name="close_icons_campaignSearch" onClick={handleClearSearch} />
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
            )}
            <Fragment>
                {(!_isEmpty(pendingList) || pendingPlaceholderStatus)
                    && (
                        <div className="invite-heading">
                            <h3>
                                Invites sent
                            </h3>
                        </div>
                    )}
                {pendingPlaceholderStatus
                    ? (
                        <Grid className="no-margin">
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <PlaceholderGrid row={4} column={1} placeholderType="activityList" />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                    : (
                        <Fragment>
                            {!_isEmpty(pendingList)
                            && (
                                <Fragment>
                                    <Table basic="very" unstackable className="ManageTable Topborder Bottomborder ABC">
                                        <Table.Body>
                                            {pendingList}
                                        </Table.Body>
                                    </Table>
                                    <div className="paginationWraper group_pagination">
                                        <div className="db-pagination">
                                            {
                                                !_isEmpty(groupPendingInvites) && invitesPageCount > 1 && (
                                                    <Pagination
                                                        activePage={currentInviteActivePage}
                                                        totalPages={invitesPageCount}
                                                        onPageChanged={onInvitePageChanged}
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                </Fragment>
                            )}
                        </Fragment>
                    )}
            </Fragment>
            <Fragment>
                {isSingleAdminMember
                    ? (
                        <div className="GetDonation">
                            <div className="Step1">
                                <p className="stepSubHeader">This Giving Group doesn't have any members yet.</p>
                                <div className="ManageNoData">
                                    <div className="ManageNoDataLeftImg">
                                        <Image className="Connect_img" src={noDataImg} />
                                    </div>
                                    <div className="ManageNoDataRightText">
                                        <Header as="h4">Invite friends to join your group</Header>
                                        <Button
                                            className="success-btn-rounded-def"
                                            onClick={() => updateMenu(3, 'invites')}
                                        >
                                            Invite friends
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Fragment>
                            {(!_isEmpty(memberList) || (groupMemberPlaceholderStatus))
                                ? (
                                    <Fragment>
                                        <div className="invite-heading">
                                            <h3>
                                            Members
                                            </h3>
                                        </div>
                                        <div className="memberswapper">
                                            {(memberCount >= 1)
                                                && (
                                                    <div className="membersadmin">
                                                        <p>
                                                            <span>
                                                                <i aria-hidden="true" className="users icon" />
                                                            </span>
                                                            {`${memberCount} ${(memberCount === 1) ? 'member' : 'members'}`}
                                                        </p>
                                                    </div>
                                                )}
                                            <div className="Emailmembers" onClick={() => updateMenu(4, 'email_members')}>
                                                <p>
                                                    <span>
                                                        <i
                                                            aria-hidden="true"
                                                            className="icon icon-mail"
                                                        />
                                                    </span>
                                                    Email members
                                                </p>
                                            </div>
                                        </div>
                                        {groupMemberPlaceholderStatus
                                            ? (
                                                <Grid className="no-margin">
                                                    <Grid.Row>
                                                        <Grid.Column width={16}>
                                                            <PlaceholderGrid row={4} column={1} placeholderType="activityList" />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            )
                                            : (
                                                <Fragment>
                                                    <Table basic="very" unstackable className="ManageTable Topborder Bottomborder">
                                                        <Table.Body>
                                                            {!_isEmpty(memberList) && memberList}
                                                        </Table.Body>
                                                    </Table>
                                                    <div className="paginationWraper group_pagination">
                                                        <div className="db-pagination">
                                                            {
                                                                !_isEmpty(memberList) && memberPageCount > 1 && (
                                                                    <Pagination
                                                                        activePage={currentActivePage}
                                                                        totalPages={memberPageCount}
                                                                        onPageChanged={onPageChanged}
                                                                    />
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            )}
                                    </Fragment>
                                ) : (
                                    <p> No Members Found</p>
                                )}
                        </Fragment>
                    )}
            </Fragment>
        </div>
    );
};

Manage.defaultProps = {
    groupDetails: {
        attributes: {
            slug: '',
        },
        id: '',
    },
};
export default Manage;
