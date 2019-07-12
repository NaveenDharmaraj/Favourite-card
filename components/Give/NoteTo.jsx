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
import TextAreaWithInfo from '../shared/TextAreaWithInfo';

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
        formatMessage,
    } = props;
    return (
        <Fragment>
            <Form.Field>
                <Header as="h3">
                    {formatMessage('noteTo:includeMessageLabel')}
                </Header>
            </Form.Field>
            <Form.Field>
                <label htmlFor="noteToCharity">
                    {formatMessage('noteTo:fortheCharityLabel')}
                </label>
                <Popup
                    content={formatMessage('noteTo:allocationsForthCharityPopup')}
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
                    placeholder={formatMessage('noteTo:generalInputPlaceHolder')}
                    value=""// {noteToCharity}
                />
            </Form.Field>
            <FormValidationErrorMessage
                // condition={!validity.isNoteToCharityInLimit}
                errorMessage={formatMessage('noteTo:invalidLengthError')}
            />
            <FormValidationErrorMessage
                // condition={!validity.isValidNoteToCharityText}
                errorMessage={formatMessage('noteTo:invalidNoteTextError')}
            />
            <Form.Field>
                <label htmlFor="noteToSelf" id="noteToSelfLabel">
                        "labelTextIds"
                    {/* {formatMessage(fields[labelTextIds[giveFromType]])} */}
                </label>
                <Popup
                    content={formatMessage('noteTo:givingNoteToSelfPopup')}
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
                    placeholder={formatMessage('noteTo:noteToSelfPlaceHolder')}
                    value=""// {noteToSelf}
                />
            </Form.Field>
            <FormValidationErrorMessage
                // condition={!validity.isNoteToSelfInLimit}
                errorMessage={formatMessage('noteTo:invalidLengthError')}
            />
            <FormValidationErrorMessage
                // condition={!validity.isValidNoteSelfText}
                errorMessage={formatMessage('noteTo:invalidNoteTextError')}
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
