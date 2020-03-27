/**
 * A Note component made of
 * - Pop-up icon
 * - Text area
 * - Label
 * - Error message
 * - I18n support
 */
import React, {
    Fragment,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    Form,
    Icon,
    Popup,
} from 'semantic-ui-react';

import {
    isValidNoteData,
} from '../../../helpers/give/giving-form-validation';
import FormValidationErrorMessage from '../FormValidationErrorMessage';
import TextAreaWithInfo from '../TextAreaWithInfo';

const {
    func,
    bool,
    string,
} = PropTypes;

const handleOnInputChangeWrapper = (event, handleOnInputChange) => {
    const {
        name,
        value,
    } = event.target;
    handleOnInputChange(event, {
        name,
        value,
    });
};

const renderInfo = (enableCharacterCount, formatMessage, text) => {
    if (enableCharacterCount) {
        return formatMessage(
            'giveCommon:noteRemainingChars1000',
            {
                currentCount: (!_.isEmpty(text)) ? Math.max(0, (1000 - Number(text.length))) : 1000,
                maximum: 1000,
            },
        );
    }
    return '';
};

const isValidTextCount = (enableCharacterCount, text) => {
    if (!enableCharacterCount) {
        return true;
    }
    return text.length <= 1000;
};

const isValidText = (enableCharacterCount, text) =>
    (isValidTextCount(enableCharacterCount, text) && isValidNoteData(text));

const Note = ({
    enableCharacterCount,
    fieldName,
    formatMessage,
    handleOnInputBlur,
    handleOnInputChange,
    labelText,
    placeholderText,
    popupText,
    text,
}) => (
    <Fragment>
        <Form.Field>
            <label htmlFor={fieldName}>
                {labelText}
            </label>
            <Popup
                content={popupText}
                position="top center"
                trigger={
                    <Icon
                        color="blue"
                        name="question circle"
                        size="large"
                    />
                }
            />
            <Form.Field
                className="with-info"
                control={TextAreaWithInfo}
                error={!isValidText(enableCharacterCount, text)}
                name={fieldName}
                id={fieldName}
                info={
                    renderInfo(
                        enableCharacterCount,
                        formatMessage,
                        text,
                    )
                }
                onChange={(e) => handleOnInputChangeWrapper(e, handleOnInputChange)}
                onBlur={handleOnInputBlur}
                placeholder={placeholderText}
                value={text}
            />
        </Form.Field>
        <FormValidationErrorMessage
            condition={!isValidTextCount(enableCharacterCount, text)}
            errorMessage={formatMessage('giveCommon:errorMessages.invalidLengthError')}
        />
        <FormValidationErrorMessage
            condition={!isValidNoteData(text)}
            errorMessage={formatMessage('giveCommon:errorMessages.invalidNoteTextError')}
        />
    </Fragment>
);

Note.defaultProps = {
    enableCharacterCount: true,
    text: null,
};

Note.propTypes = {
    enableCharacterCount: bool,
    fieldName: string.isRequired,
    handleOnInputBlur: func.isRequired,
    handleOnInputChange: func.isRequired,
    labelText: string.isRequired,
    placeholderText: string.isRequired,
    popupText: string.isRequired,
    text: string,
};

export default Note;