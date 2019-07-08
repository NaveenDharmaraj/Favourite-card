import React, {
    Fragment,
} from 'react';
// import _isEmpty from 'lodash/isEmpty';
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

import TextAreaWithInfo from './TextAreaWithInfo';

const handleInputChange = (event) => {
    const {
        name,
        value,
    } = event.target;
    this.props.handleInputChange(event, {
        name,
        value,
    });
};

// const labelTextIds = {
//     campaigns: 'noteToSelfLabelReview',
//     companies: 'noteToCompanyLabel',
//     groups: 'noteToGroupLabel',
//     user: 'noteToSelfLabelReview',
// };



// const giveFromType = (!_isEmpty(giveFrom.type)) ? giveFrom.type : 'user';

const NoteTo = (props) => {
    const {
        // formatMessage,
        // giveFrom,
        handleInputOnBlur,
        // noteToCharity,
        // noteToSelf,
        // validity,
    } = props;
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
                    error="" // {!validity.isValidNoteToCharity}
                    name="noteToCharity"
                    id="noteToCharity"
                    // info={formatMessage(
                    //     fields.remainingChars,
                    //     {
                    //         currentCount: (!_isEmpty(noteToCharity)) ? Math.max(0, (1000 - Number(noteToCharity.length))) : 1000,
                    //         maximum: 1000,
                    //     },
                    // )}
                    onChange={handleInputChange}
                    onBlur={handleInputOnBlur}
                    placeholder="What would you like to say to the recipient?"// {formatMessage(fields.generalInputPlaceHolder)}
                    value=""// {noteToCharity}
                />
            </Form.Field>
            <FormValidationErrorMessage
                // condition={!validity.isNoteToCharityInLimit}
                // errorMessage={formatMessage(errorMessages.invalidLengthError)}
                errorMessage="is too long (maximum is 1000 characters)"
            />
            <FormValidationErrorMessage
                // condition={!validity.isValidNoteToCharityText}
                // errorMessage={formatMessage(errorMessages.invalidNoteTextError)}
                errorMessage="Only standard letters and numbers are allowed here"
            />
            <Form.Field>
                <label htmlFor="noteToSelf" id="noteToSelfLabel">
                        "labelTextIds"
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
                    error="" // </Form.Field>{!validity.isValidNoteToSelf}
                    name="noteToSelf"
                    id="noteToSelf"
                    // info={formatMessage(
                    //     fields.remainingChars,
                    //     {
                    //         currentCount: (!_isEmpty(noteToSelf)) ? Math.max(0, (1000 - Number(noteToSelf.length))) : 1000,
                    //         maximum: 1000,
                    //     },
                    // )}
                    onChange={handleInputChange}
                    onBlur={handleInputOnBlur}
                    placeholder="Why are you giving today?"// {formatMessage(fields.noteToSelfPlaceHolder)}
                    value=""// {noteToSelf}
                />
            </Form.Field>
            <FormValidationErrorMessage
                // condition={!validity.isNoteToSelfInLimit}
                // errorMessage={formatMessage(errorMessages.invalidLengthError)}
                errorMessage="is too long (maximum is 1000 characters)"
            />
            <FormValidationErrorMessage
                // condition={!validity.isValidNoteSelfText}
                // errorMessage={formatMessage(errorMessages.invalidNoteTextError)}
                errorMessage="Only standard letters and numbers are allowed here"
            />
        </Fragment>
    );
};

NoteTo.propTypes = {
    handleInputOnBlur: () => { },

};

NoteTo.defaultProps = {
    handleInputOnBlur: () => { },
};

NoteTo.defaultProps = beneficiaryDefaultProps;
export default NoteTo;
