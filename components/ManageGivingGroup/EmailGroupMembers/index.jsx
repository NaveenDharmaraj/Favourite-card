import React, {
    Fragment,
    useState,
    useEffect,
} from 'react';
import {
    Header,
    Form,
    Button,
    TextArea,
    Table,
    List,
    Image,
    Grid,
    Responsive,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
    useDispatch,
    useSelector,
} from 'react-redux';

import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import PlaceholderGrid from '../../shared/PlaceHolder';
import {
    formatDateForGivingTools,
} from '../../../helpers/give/utils';
import {
    emailMembers,
    getMessageHistory,
} from '../../../actions/createGivingGroup';

const EmailGroupMembers = () => {
    const [
        emailMessage,
        setemailMessage,
    ] = useState('');
    const [
        showLoader,
        setshowLoader,
    ] = useState(false);
    const [
        historyList,
        sethistoryList,
    ] = useState([]);
    const [
        limitError,
        setlimitError,
    ] = useState(false);
    const groupDetails = useSelector((state) => state.group.groupDetails);
    const groupMessageHistory = useSelector((state) => state.createGivingGroup.groupMessageHistory || {});
    const showPlaceholder = useSelector((state) => state.createGivingGroup.groupMessageHistoryPlaceholder || false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMessageHistory(groupDetails.id));
    }, [
        groupDetails,
    ]);

    useEffect(() => {
        if (!_isEmpty(groupMessageHistory)) {
            const list = [];
            groupMessageHistory.map((history) => {
                list.push(
                    <Table.Row className="ManageWappeer">
                        <Table.Cell className="ManageGroup">
                            <List>
                                <List.Item>
                                    <Image src={history.attributes.avatar} className="imgManage" />
                                    <List.Content>
                                        <List.Header className="ManageAdmin">
                                            {`${history.attributes.groupAdmin} • Admin`}
                                        </List.Header>
                                        <List.Description className="messageSend">
                                            <p>
                                                {history.attributes.message}
                                            </p>
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Table.Cell>
                        <Table.Cell className="Managebtn emailDate">
                            <p>{formatDateForGivingTools(history.attributes.createdAt)}</p>
                        </Table.Cell>
                    </Table.Row>,
                );
            });
            sethistoryList(list);
        }
    }, [
        groupMessageHistory,
    ]);

    const updateMessage = (event) => {
        setemailMessage(event.target.value);
        if (!_isEmpty(event.target.value) && event.target.value.length >= 3000) {
            setlimitError(true);
        } else {
            setlimitError(false);
        }
    };

    const sendEmail = () => {
        setshowLoader(true);
        const payload = {
            data: {
                attributes: {
                    email_body: emailMessage,
                },
                type: 'groups',
            },
        };
        dispatch(emailMembers(groupDetails.id, payload)).finally(() => {
            setemailMessage('');
            setshowLoader(false);
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
            <Header
                className="titleHeader"
            >
                <Responsive minWidth={320} maxWidth={767}>
                    <span>
                        <i
                            aria-hidden="true"
                            className="back_to_menu icon"
                            onClick={resetPageViewStatus}
                        />
                    </span>
                </Responsive>
                Email
            </Header>
            <Form>
                <div className="GroupMembers">
                    <Header as="h3">Send an email to all group members</Header>
                    <label>Message</label>
                    <TextArea
                        value={emailMessage}
                        onChange={updateMessage}
                    />
                    <FormValidationErrorMessage
                        condition={limitError}
                        errorMessage="Maximum 3000 characters can enter"
                    />
                    <div className="email-group-members">
                        <Button
                            className="blue-btn-rounded-def emailmessagebtn"
                            disabled={_isEmpty(emailMessage) || showLoader || limitError}
                            onClick={sendEmail}
                            loading={showLoader}
                        >
                                Send message
                        </Button>
                    </div>
                </div>
            </Form>
            {!_isEmpty(groupMessageHistory)
            && (
                <Fragment>
                    <div className="memberswapper emailMembersIcon">
                        <div className="Emailmembers emailmembersLeft">
                            <p>
                                <span>
                                    <i aria-hidden="true" className="icon icon-mail" />
                                </span>
                                Message history
                            </p>
                        </div>
                    </div>
                    {!showPlaceholder
                        ? (
                            <div className="Invite">
                                <Table basic="very" className="ManageTable Topborder Bottomborder">
                                    <Table.Body>
                                        {!_isEmpty(historyList) && historyList}
                                    </Table.Body>
                                </Table>
                            </div>
                        )
                        : (
                            <Grid className="no-margin">
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <PlaceholderGrid row={4} column={1} placeholderType="activityList" />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        )}
                </Fragment>
            )}
        </div>
    );
};

export default EmailGroupMembers;
