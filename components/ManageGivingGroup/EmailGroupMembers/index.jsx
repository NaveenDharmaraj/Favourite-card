import React, {
    useState,
} from 'react';
import {
    Header,
    Form,
    Button,
    TextArea,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    emailMembers,
} from '../../../actions/createGivingGroup';

const EmailGroupMembers = () => {
    const [emailMessage, setemailMessage] = useState('');
    const [showLoader, setshowLoader] = useState(false);
    const groupDetails = useSelector((state) => state.group.groupDetails);
    const dispatch = useDispatch();
    const updateMessage = (event) => {
        setemailMessage(event.target.value);
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
        dispatch(emailMembers(groupDetails.id, payload)).then(() => {
            setemailMessage('');
            setshowLoader(false);
        });
    };

    return (
        <div className="basicsettings">
            <Header className="titleHeader">Email</Header>
            <Form>
                <div className="GroupMembers">
                    <Header as="h3">Send an email to all group members</Header>
                    <label>Message</label>
                    <TextArea
                        value={emailMessage}
                        onChange={updateMessage}
                    />
                    <Button
                        className="blue-btn-rounded-def emailmessagebtn"
                        disabled={_isEmpty(emailMessage) || showLoader}
                        onClick={sendEmail}
                        floated="right"
                        loading={showLoader}
                    >
                            Send message
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default EmailGroupMembers;
