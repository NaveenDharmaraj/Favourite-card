import React, {
    Fragment,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';
import {
    Button,
    List,
    Image,
    Table,
    Dropdown,
    Modal,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import imageManage from '../../../static/images/no-data-avatar-user-profile.png';
import {
    toggleAdmin,
    resendInvite,
    cancelInvite,
    removeGroupMember,
    sendEmailInvite,
} from '../../../actions/createGivingGroup';
import { adminActionType } from '../../../helpers/constants';
import { getLocation } from '../../../helpers/profiles/utils';

import ManageModal from './ManageModal';

const MemberListCard = (props) => {
    const {
        memberData: {
            id,
            attributes: {
                avatar,
                city,
                displayName,
                email,
                isGroupAdmin,
                location,
                province,
                isGroupInviteSent,
            }
        },
        groupId,
        isInvite,
        isSingleAdmin,
        isFriendList,
        isCurrentUser,
        groupSlug,
    } = props;
    const formatedLocation = getLocation(city, province);
    const userTextHeader = isCurrentUser ? 'yourself' : displayName;
    const userText = isCurrentUser ? 'You' : displayName;
    const name = !_isEmpty(displayName) ? displayName : email;
    const [
        showAdminmodel,
        setshowAdminmodel,
    ] = useState(false);
    const [
        showGroupModel,
        setshowGroupModel,
    ] = useState(false);
    const [
        showMemberModal,
        setshowMemberModal,
    ] = useState(false);
    const [
        showResendInviteModal,
        setshowResendInviteModal,
    ] = useState(false);
    const [
        showCancelInviteModal,
        setshowCancelInviteModal,
    ] = useState(false);
    const [
        showLoader,
        setshowLoader,
    ] = useState(false);
    const [
        isInviteSent,
        setisInviteSent,
    ] = useState(isGroupInviteSent);
    const dispatch = useDispatch();

    const handleOnClick = (type) => {
        setshowLoader(true);
        dispatch(toggleAdmin(id, groupId, type, displayName, isCurrentUser, groupSlug)).then(() => {
            setshowLoader(false);
            if (type === adminActionType.make_admin) {
                setshowMemberModal(false);
            }
            if (type === adminActionType.remove_admin) {
                setshowAdminmodel(false);
            }
        });
    };

    const handleRemoveMember = () => {
        setshowLoader(true);
        dispatch(removeGroupMember(id, groupId, displayName)).finally(() => {
            setshowLoader(false);
            setshowGroupModel(false);
        });
    };

    const handleResendInvite = () => {
        const payload = {
            data: {
                attributes: {
                    group_id: groupId,
                },
                type: 'groups',
            },
        };
        setshowLoader(true);
        dispatch(resendInvite(payload, id)).finally(() => {
            setshowResendInviteModal(false);
            setshowLoader(false);
        });
    };

    const handleCancelInvite = () => {
        const payload = {
            data: {
                attributes: {
                    group_id: groupId,
                },
                type: 'groups',
            },
        };
        setshowLoader(true);
        dispatch(cancelInvite(payload, id)).finally(() => {
            setshowCancelInviteModal(false);
            setshowLoader(false);
        });
    };

    const handleInvite = () => {
        const payload = {
            data: {
                attributes: {
                    group_id: groupId,
                    invites: email,
                    notes: '',
                },
                type: 'groups',
            },
        };
        setshowLoader(true);
        dispatch(sendEmailInvite(payload)).finally(() => {
            setisInviteSent(true);
            setshowLoader(false);
        });
    };
    return (
        <Fragment>
            <Table.Row className="ManageWappeer">
                <Table.Cell className="ManageGroup">
                    <List verticalAlign="middle">
                        <List.Item>
                            <Image src={!isInvite ? avatar : imageManage} className="imgManage" />
                            <List.Content>
                                <List.Header className="ManageAdmin">
                                    {!isInvite
                                        ? (
                                            <Fragment>
                                                {`${displayName} ${isCurrentUser ? '(you)' : ''} ${isGroupAdmin ? '• Admin' : ''}`}
                                                {isGroupAdmin
                                                && (
                                                    <span>
                                                        <i aria-hidden="true" className="icon star outline" />
                                                    </span>
                                                )}
                                            </Fragment>
                                        ) : (
                                            name
                                        )}
                                </List.Header>
                                {!_isEmpty(formatedLocation)
                                && (
                                    <List.Description>
                                        <p>
                                            {formatedLocation}
                                        </p>
                                    </List.Description>
                                )}
                            </List.Content>
                        </List.Item>
                    </List>
                </Table.Cell>
                <Table.Cell className="Managebtn">
                    {!isFriendList
                        ? (
                            <a role="listitem" className="item">
                                <Dropdown
                                    icon="ellipsis horizontal"
                                    className="dropdown_ellipsisnew"
                                    closeOnBlur
                                >
                                    <Dropdown.Menu className="left">
                                        {!isInvite
                                            ? (
                                                <Fragment>
                                                    {isGroupAdmin
                                                        ? (
                                                            <Dropdown.Item text="Remove as admin " onClick={() => setshowAdminmodel(true)} />
                                                        ) : (
                                                            <Dropdown.Item text="Make admin " onClick={() => setshowMemberModal(true)} />
                                                        )}
                                                    {!isCurrentUser
                                                    && (
                                                        <Dropdown.Item text="Remove from group " onClick={() => setshowGroupModel(true)} />
                                                    )}
                                                </Fragment>
                                            )
                                            : (
                                                <Fragment>
                                                    <Dropdown.Item text="Resend invite" onClick={() => setshowResendInviteModal(true)} />
                                                    <Dropdown.Item text="Cancel invite" onClick={() => setshowCancelInviteModal(true)} />
                                                </Fragment>
                                            )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </a>
                        )
                        : (
                            <Button
                                className={` ${isInviteSent ? 'blue-btn-rounded-def' : 'blue-bordr-btn-round-def'} c-small`}
                                onClick={handleInvite}
                                disabled={isInviteSent}
                                loading={showLoader}
                            >
                                {isInviteSent ? 'Sent' : 'Invite'}
                            </Button>
                        )}
                </Table.Cell>
            </Table.Row>
            {showAdminmodel
            && (
                !isSingleAdmin
                    ? (
                        <ManageModal
                            showModal={showAdminmodel}
                            closeModal={() => setshowAdminmodel(false)}
                            modalHeader={`Remove ${userTextHeader} as group admin?`}
                            modalDescription={`${userText} will no longer be able to message group members, send money to charities, and make changes to the group's profile.`}
                            onButtonClick={() => handleOnClick('remove_admin')}
                            loader={showLoader}
                            isSingleAdmin={false}
                            buttonText="Remove"
                            isRemove
                        />
                    ) : (
                        <ManageModal
                            showModal={showAdminmodel}
                            closeModal={() => setshowAdminmodel(false)}
                            modalHeader="Remove yourself as admin?"
                            // modalDescription={`${displayName} will no longer be able to message group members, send money to charities, and make changes to the group's profile.`}
                            // onButtonClick={() => handleOnClick('remove_admin')}
                            // loader={showLoader}
                            isSingleAdmin
                        />
                    )
            )
            }
            {showGroupModel
                && (
                    <ManageModal
                        showModal={showGroupModel}
                        closeModal={() => setshowGroupModel(false)}
                        modalHeader={`Remove ${displayName}?`}
                        modalDescription={`${displayName} will no longer be a member of this group.`}
                        onButtonClick={handleRemoveMember}
                        loader={showLoader}
                        isSingleAdmin={false}
                        buttonText="Remove"
                        isRemove
                    />
                )
            }
            {showMemberModal
                && (
                    <ManageModal
                        showModal={showMemberModal}
                        closeModal={() => setshowMemberModal(false)}
                        modalHeader={`Make ${displayName} a group admin?`}
                        modalDescription={`${displayName} will become an admin for the Giving Group.`}
                        onButtonClick={() => handleOnClick('make_admin')}
                        loader={showLoader}
                        isSingleAdmin={false}
                        buttonText="Make admin"
                        isRemove={false}
                    />
                )
            }
            {showResendInviteModal
            && (
                <ManageModal
                    showModal={showResendInviteModal}
                    closeModal={() => setshowResendInviteModal(false)}
                    modalHeader={`Resend the invite to ${email}`}
                    modalDescription={`${email} will receive another invite to the group by email.`}
                    onButtonClick={handleResendInvite}
                    loader={showLoader}
                    isSingleAdmin={false}
                    buttonText="Resend"
                    isRemove={false}
                />
            )
            }
            {showCancelInviteModal
            && (
                <ManageModal
                    showModal={showCancelInviteModal}
                    closeModal={() => setshowCancelInviteModal(false)}
                    modalHeader={`Cancel invite to ${email}?`}
                    modalDescription={`${email}'s group invite will no longer be valid.`}
                    onButtonClick={handleCancelInvite}
                    loader={showLoader}
                    isSingleAdmin={false}
                    buttonText="Cancel invite"
                    isRemove
                />
            )
            }
        </Fragment>
    );
};

MemberListCard.defaultProps = {
    groupId: '',
    memberData: {
        attributes: {
            displayName: '',
            isGroupAdmin: false,
            location: {
                city: '',
                province: '',
            },
        },
        id: '',
    },
};

export default MemberListCard;
