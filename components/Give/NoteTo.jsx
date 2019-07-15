import React, {
    Fragment,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
// import {
//     defineMessages,
// } from 'react-intl';
import {
    Form,
    Header,
    Icon,
    Popup,
} from 'semantic-ui-react';

import { beneficiaryDefaultProps } from '../../helpers/give/defaultProps';
import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';
import TextAreaWithInfo from '../shared/TextAreaWithInfo';

const handleInputChange = (event, props) => {
    const {
        name,
        value,
    } = event.target;
    props.handleInputChange(event, {
        name,
        value,
    });
};

const labelTextIds = {
    campaigns: 'Note to self',
    companies: 'Note to company',
    groups: 'Note to group',
    user: 'Note to self',
};


const NoteTo = (props) => {
    const {
        // formatMessage,
        giveFrom,
        handleInputOnBlur,
        noteToCharity,
        noteToSelf,
        validity,
    } = props;
    const currentCountNoteToSelf = (!_isEmpty(noteToSelf)) ? Math.max(0, (1000 - Number(noteToSelf.length))) : 1000;
    const infoNoteToSelf = `${currentCountNoteToSelf} of 1000 characters left`;
    const currentCountNoteToCharity = (!_isEmpty(noteToCharity)) ? Math.max(0, (1000 - Number(noteToCharity.length))) : 1000;
    const infoNoteToCharity = `${currentCountNoteToCharity} of 1000 characters left`;
    const giveFromType = (!_isEmpty(giveFrom.type)) ? giveFrom.type : 'user';
    return (
        <Fragment>
            <Form.Field>
                {/* <Header as="h3"> {formatMessage(messageList.includeMessageLabel)}</Header> */}
                <Header as="h3"> Include a message</Header>
            </Form.Field>
            <Form.Field>
                <label htmlFor="noteToCharity">
                    For the recipient
                    {/* {formatMessage(messageList.fortheCharityLabel)} */}
                </label>
                <Popup
                // content={formatMessage(messageList.allocationsForthCharityPopup)}
                    content="You can tell the recipient why you're giving to them, provide recommendations on how you'd prefer your gift is spent, let them know if you're giving in honour of someone, or just tell them to keep up the good work."
                    position="top center"
                    trigger={(
                        <Icon
                            color="blue"
                            name="question circle"
                            size="large"
                        />
                    )}
                />
                <Form.Field
                    className="with-info"
                    control={TextAreaWithInfo}
                    error={!validity.isValidNoteToCharity}
                    name="noteToCharity"
                    id="noteToCharity"
                    info={infoNoteToCharity}
                    onChange={(e) => { handleInputChange(e, props); }}
                    onBlur={handleInputOnBlur}
                    placeholder="What would you like to say to the recipient?"// {formatMessage(fields.generalInputPlaceHolder)}
                    value={noteToCharity}
                />
            </Form.Field>
            <FormValidationErrorMessage
                condition={!validity.isNoteToCharityInLimit}
                // errorMessage={formatMessage(errorMessages.invalidLengthError)}
                errorMessage="is too long (maximum is 1000 characters)"
            />
            <FormValidationErrorMessage
                condition={!validity.isValidNoteToCharityText}
                // errorMessage={formatMessage(errorMessages.invalidNoteTextError)}
                errorMessage="Only standard letters and numbers are allowed here"
            />
            <Form.Field>
                <label htmlFor="noteToSelf" id="noteToSelfLabel">
                    {labelTextIds[giveFromType]}
                    {/* {formatMessage(fields[labelTextIds[giveFromType]])} */}
                </label>
                <Popup
                    content="Write a note to yourself for later—for example, a reminder of why you gave this gift. This will only be visible to you on your Dashboard."
                    // content={formatMessage(fields.givingNoteToSelfPopup)}
                    position="top center"
                    trigger={(
                        <Icon
                            color="blue"
                            name="question circle"
                            size="large"
                        />
                    )}
                />
                <Form.TextArea
                    className="with-info"
                    control={TextAreaWithInfo}
                    error={!validity.isValidNoteToSelf}
                    name="noteToSelf"
                    id="noteToSelf"
                    info={infoNoteToSelf}
                    onChange={(e) => { handleInputChange(e, props); }}
                    onBlur={handleInputOnBlur}
                    placeholder="Why are you giving today?"// {formatMessage(fields.noteToSelfPlaceHolder)}
                    value={noteToSelf}
                />
            </Form.Field>
            <FormValidationErrorMessage
                condition={!validity.isNoteToSelfInLimit}
                // errorMessage={formatMessage(errorMessages.invalidLengthError)}
                errorMessage="is too long (maximum is 1000 characters)"
            />
            <FormValidationErrorMessage
                condition={!validity.isValidNoteSelfText}
                // errorMessage={formatMessage(errorMessages.invalidNoteTextError)}
                errorMessage="Only standard letters and numbers are allowed here"
            />
        </Fragment>
    );
};


NoteTo.defaultProps = {
    handleInputOnBlur: () => { },
};

NoteTo.defaultProps = beneficiaryDefaultProps;
export default NoteTo;
