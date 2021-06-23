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
    const pendingPlaceholderStatus = useSelector((state) => state.createGivingGroup.pendingPlaceholderStatus);
    const groupMemberPlaceholderStatus = useSelector((state) => state.createGivingGroup.groupMemberPlaceholderStatus);
    const groupPendingInvites = useSelector((state) => state.createGivingGroup.groupPendingInvites);
    const memberPageCount = useSelector((state) => state.createGivingGroup.groupMemberPageCount);
    const currentUser = useSelector((state) => state.user.info);
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
    let isSingleAdmin = (memberCount === 1);
    let adminCount = 0;

    useEffect(() => {
        if (groupDetails) {
            dispatch(getGroupMembers(groupDetails.id));
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

    const updateSearch = (event) => {
        setsearchText(event.target.value);
    };

    const handleSearch = () => {
        dispatch(searchMember(groupDetails.id, searchText));
    };

    const handleEmailClick = () => {
        Router.pushRoute(`/groups/${groupDetails.attributes.slug}/email_members`);
    };

    const handleClearSearch = () => {
        setsearchText('');
        dispatch(getGroupMembers(groupDetails.id));
    }
    return (
        <div className="basicsettings">
            <Header className="titleHeader">
                Manage
            </Header>
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
                            && <Icon name="close" onClick={handleClearSearch} />
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
                    <Table basic="very" unstackable className="ManageTable Topborder Bottomborder">
                        <Table.Body>
                            {pendingList}
                        </Table.Body>
                    </Table>
                )}
            {!_isEmpty(pendingList)
            && (
                <div className="invite-heading">
                    <h3>
            Members
                    </h3>
                </div>
            )}
            <div className="memberswapper">
                {(memberCount > 1)
                && (
                    <div className="membersadmin">
                        <p>
                            <span>
                                <i aria-hidden="true" className="users icon" />
                            </span>
                            {`${memberCount} members`}
                        </p>
                    </div>
                )}
                <div className="Emailmembers">
                    {/* <Link route={`/groups/${groupDetails.attributes.slug}/email_members`}> */}
                    <p>
                        <span>
                            <i
                                aria-hidden="true"
                                className="icon icon-mail"
                                onClick={handleEmailClick}
                            />
                        </span>
                        Email members
                    </p>
                    {/* </Link> */}
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
                                {!_isEmpty(memberList)
                                    ? memberList
                                    : (
                                        <p> No Members Found</p>
                                    )}
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
