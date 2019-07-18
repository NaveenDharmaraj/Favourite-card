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
    campaigns: 'noteToSelfLabelReview',
    companies: 'noteToCompanyLabel',
    groups: 'noteToGroupLabel',
    user: 'noteToSelfLabelReview',
};

const NoteTo = (props) => {
    const {
        formatMessage,
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
    const labelText = labelTextIds[giveFromType];
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
                    error={!validity.isValidNoteToCharity}
                    name="noteToCharity"
                    id="noteToCharity"
                    info={infoNoteToCharity}
                    onChange={(e) => { handleInputChange(e, props); }}
                    onBlur={handleInputOnBlur}
                    placeholder={formatMessage('noteTo:generalInputPlaceHolder')}
                    value={noteToCharity}
                />
            </Form.Field>
            <FormValidationErrorMessage
                condition={!validity.isNoteToCharityInLimit}
                errorMessage={formatMessage('errorMessages.invalidLengthError')}
            />
            <FormValidationErrorMessage
                condition={!validity.isValidNoteToCharityText}
                errorMessage={formatMessage('errorMessages.invalidNoteTextError')}
            />
            <Form.Field>
                <label htmlFor="noteToSelf" id="noteToSelfLabel">
                    {formatMessage(`noteTo:${labelText}`)}
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
                    error={!validity.isValidNoteToSelf}
                    name="noteToSelf"
                    id="noteToSelf"
                    info={infoNoteToSelf}
                    onChange={(e) => { handleInputChange(e, props); }}
                    onBlur={handleInputOnBlur}
                    placeholder={formatMessage('noteTo:noteToSelfPlaceHolder')}
                    value={noteToSelf}
                />
            </Form.Field>
            <FormValidationErrorMessage
                condition={!validity.isNoteToSelfInLimit}
                errorMessage={formatMessage('errorMessages.invalidLengthError')}
            />
            <FormValidationErrorMessage
                condition={!validity.isValidNoteSelfText}
                errorMessage={formatMessage('errorMessages.invalidNoteTextError')}
            />
        </Fragment>
    );
};


NoteTo.defaultProps = {
    handleInputOnBlur: () => { },
};

NoteTo.defaultProps = beneficiaryDefaultProps;
export default NoteTo;