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

import imageManage from '../../../static/images/no-data-avatar-user-profile.png';
import {
    toggleAdmin,
    resendInvite,
    cancelInvite,
    removeGroupMember,
} from '../../../actions/createGivingGroup';

const MemberListCard = (props) => {
    const [showAdminmodel, setshowAdminmodel] = useState(false);
    const [showGroupModel, setshowGroupModel] = useState(false);
    const [showMemberModal, setshowMemberModal] = useState(false);
    const [showResendInviteModal,setshowResendInviteModal] = useState(false);
    const [showCancelInviteModal, setshowCancelInviteModal] = useState(false);
    const [showLoader, setshowLoader] = useState(false);
    const dispatch = useDispatch();
    const {
        memberData: {
            id,
            attributes: {
                avatar,
                displayName,
                email,
                isGroupAdmin,
                location : {
                    city,
                    province,
                },
            }
        },
        groupId,
        isInvite,
        isSingleAdmin,
    } = props;

    const handleOnClick = (type) => {
        setshowLoader(true);
        dispatch(toggleAdmin(id, groupId)).then(() => {
            setshowLoader(false);
            if (type === 'make_admin') {
                setshowMemberModal(false);
            }
            if (type === 'remove_admin') {
                setshowAdminmodel(false);
            }
        });
    };

    const handleRemoveMember = () => {
        setshowLoader(true);
        dispatch(removeGroupMember(id, groupId)).then(() => {
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
        dispatch(resendInvite(payload, id)).then(() => {
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
        dispatch(cancelInvite(payload, id)).then(() => {
            setshowCancelInviteModal(false);
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
                                                {`${displayName} ${isGroupAdmin ? '• Admin' : ''}`}
                                                {isGroupAdmin
                                                && (
                                                    <span>
                                                        <i aria-hidden="true" className="icon star outline" />
                                                    </span>
                                                )}
                                            </Fragment>
                                        ) : (
                                            email
                                        )}
                                </List.Header>
                                <List.Description>
                                    <p>
                                        {city
                                        && (
                                            city, province
                                        )}
                                    </p>
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Table.Cell>
                <Table.Cell className="Managebtn">
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
                                            {!isSingleAdmin
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
                </Table.Cell>
            </Table.Row>
            {
                showAdminmodel && (
                    <Modal
                        size="tiny"
                        dimmer="inverted"
                        className="chimp-modal"
                        closeIcon
                        closeOnEscape={false}
                        closeOnDimmerClick={false}
                        open={showAdminmodel}
                        onClose={() => setshowAdminmodel(false)}
                    >
                        {!isSingleAdmin
                            ? (
                                <Fragment>
                                    <Modal.Header>
                                        {`Remove ${displayName} as group admin?`}
                                    </Modal.Header>
                                    <Modal.Content>
                                        <Modal.Description className="font-s-14 ">
                                            {`${displayName} will no longer be able to message group members, send money to charities, and make changes to the group's profile.`}
                                        </Modal.Description>
                                        <div className="btn-wraper pt-3 text-right">
                                            <Button
                                                className="danger-btn-rounded-def w-120"
                                                onClick={() => handleOnClick('remove_admin')}
                                                loading={showLoader}
                                                disabled={showLoader}
                                            >
                                                Remove
                                            </Button>
                                            <Button
                                                className="blue-bordr-btn-round-def w-120"
                                                onClick={() => setshowAdminmodel(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </Modal.Content>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Modal.Header>
                                        Remove yourself as admin?
                                    </Modal.Header>
                                    <Modal.Content>
                                        <Modal.Description className="font-s-14 ">
                                            <p>A Giving Group needs at least one admin.</p>
                                            <p>You are the only admin in this group. Please make another group member as admin first.</p>
                                        </Modal.Description>
                                    </Modal.Content>
                                </Fragment>
                            )}
                    </Modal>
                )
            }
            {
                showGroupModel && (
                    <Modal
                        size="tiny"
                        dimmer="inverted"
                        className="chimp-modal"
                        closeIcon
                        closeOnEscape={false}
                        closeOnDimmerClick={false}
                        open={showGroupModel}
                        onClose={() => setshowGroupModel(false)}
                    >
                        <Modal.Header>
                            {`Remove ${displayName}?`}
                        </Modal.Header>
                        <Modal.Content>
                            <Modal.Description className="font-s-14">
                                {`${displayName} will no longer be a member of this group.`}
                            </Modal.Description>
                            <div className="btn-wraper pt-3 text-right">
                                <Button
                                    className="danger-btn-rounded-def w-120"
                                    onClick={handleRemoveMember}
                                >
                                    Remove
                                </Button>
                                <Button
                                    className="blue-bordr-btn-round-def w-120"
                                    onClick={() => setshowGroupModel(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Modal.Content>
                    </Modal>
                )
            }
            {
                showMemberModal && (
                    <Modal
                        size="tiny"
                        dimmer="inverted"
                        className="chimp-modal"
                        closeIcon
                        closeOnEscape={false}
                        closeOnDimmerClick={false}
                        open={showMemberModal}
                        onClose={() => setshowMemberModal(false)}
                    >
                        <Modal.Header>
                            {`Make ${displayName} a group admin?`}
                        </Modal.Header>
                        <Modal.Content>
                            <Modal.Description className="font-s-14">
                                {`${displayName} will become an admin for the Giving Group.`}
                            </Modal.Description>
                            <div className="btn-wraper pt-3 text-right">
                                <Button
                                    className="blue-btn-rounded-def w-120"
                                    onClick={() => handleOnClick('make_admin')}
                                    loading={showLoader}
                                    disabled={showLoader}
                                >
                                    Make admin
                                </Button>
                                <Button
                                    className="blue-bordr-btn-round-def w-120"
                                    onClick={() => setshowMemberModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Modal.Content>
                    </Modal>
                )
            }
            {
                showResendInviteModal && (
                    <Modal
                        size="tiny"
                        dimmer="inverted"
                        className="chimp-modal"
                        closeIcon
                        closeOnEscape={false}
                        closeOnDimmerClick={false}
                        open={showResendInviteModal}
                        onClose={() => setshowResendInviteModal(false)}
                    >
                        <Modal.Header>
                            {`Resend the invite to ${email}`}
                        </Modal.Header>
                        <Modal.Content>
                            <Modal.Description className="font-s-14 ">
                                {`${email} will receive another invite to the group by email.`}
                            </Modal.Description>
                            <div className="btn-wraper pt-3 text-right">
                                <Button
                                    className="blue-btn-rounded-def w-120"
                                    onClick={handleResendInvite}
                                    loading={showLoader}
                                    disabled={showLoader}
                                >
                                    Resend
                                </Button>
                                <Button
                                    className="blue-bordr-btn-round-def w-120"
                                    onClick={() => setshowResendInviteModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Modal.Content>
                    </Modal>
                )
            }
            {
                showCancelInviteModal && (
                    <Modal
                        size="tiny"
                        dimmer="inverted"
                        className="chimp-modal"
                        closeIcon
                        closeOnEscape={false}
                        closeOnDimmerClick={false}
                        open={showCancelInviteModal}
                        onClose={() => setshowCancelInviteModal(false)}
                    >
                        <Modal.Header>
                            {`Cancel invite to ${email}?`}
                        </Modal.Header>
                        <Modal.Content>
                            <Modal.Description className="font-s-14 ">
                                {`${email}'s group invite will no longer be valid.`}
                            </Modal.Description>
                            <div className="btn-wraper pt-3 text-right">
                                <Button
                                    className="danger-btn-rounded-def w-120"
                                    onClick={handleCancelInvite}
                                    loading={showLoader}
                                    disabled={showLoader}
                                >
                                    Cancel invite
                                </Button>
                                <Button
                                    className="blue-bordr-btn-round-def w-120"
                                    onClick={() => setshowCancelInviteModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Modal.Content>
                    </Modal>
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
