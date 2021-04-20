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
    user: 'noteToSelfLabel',
};

const NoteTo = (props) => {
    const {
        allocationType,
        formatMessage,
        giveFrom,
        handleInputOnBlur,
        noteToCharity,
        noteToSelf,
        validity,
        isEditModal,
    } = props;
    const currentCountNoteToSelf = (!_isEmpty(noteToSelf)) ? Math.max(0, (1000 - Number(noteToSelf.length))) : 1000;
    const infoNoteToSelf = isEditModal? ' ' :`${currentCountNoteToSelf} of 1000 characters left`;
    const currentCountNoteToCharity = (!_isEmpty(noteToCharity)) ? Math.max(0, (1000 - Number(noteToCharity.length))) : 1000;
    const infoNoteToCharity = isEditModal? ' ' :`${currentCountNoteToCharity} of 1000 characters left`;
    const giveFromType = (!_isEmpty(giveFrom.type)) ? giveFrom.type : 'user';
    const labelText = labelTextIds[giveFromType];
    return (
        <Fragment>
            <Form.Field className="give_flow_field recurring_edit_Message">
                <label htmlFor="noteToCharity">
                    {formatMessage(`noteTo:include${allocationType}MessageLabel`)}
                </label>
                <span className="givingInfoText">
                    {formatMessage(`noteTo:forthe${allocationType}Label`)}
                    <Popup
                        content={formatMessage('noteTo:allocationsForthCharityPopup')}
                        position="top center"
                        trigger={(
                            <Icon
                                color="blue"
                                name="question circle"
                                size="large"
                                className="popupMargin-6"
                            />
                        )}
                    />
                </span>

                <Form.Field
                    className="with-info noteToSelf"
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
                errorMessage={formatMessage('giveCommon:errorMessages.invalidLengthError')}
            />
            <FormValidationErrorMessage
                condition={!validity.isValidNoteToCharityText}
                errorMessage={formatMessage('giveCommon:errorMessages.invalidNoteTextError')}
            />
            {/* PM-585 Remove note to self for company and campaigns */}
            {(giveFromType === 'groups' || giveFromType === 'user') && (
                <Fragment>
                    <Form.Field className="give_flow_field recurring_edit_noteToSelf">
                        <label htmlFor="noteToSelf" id="noteToSelfLabel">
                            {formatMessage(`noteTo:${labelText}`)}
                        </label>
                        <Popup
                            content={formatMessage(`noteTo:givingNoteToSelfPopup${giveFromType}`)}
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
                            className="with-info noteToSelf"
                            control={TextAreaWithInfo}
                            error={!validity.isValidNoteToSelf}
                            name="noteToSelf"
                            id="noteToSelf"
                            info={infoNoteToSelf}
                            onChange={(e) => { handleInputChange(e, props); }}
                            onBlur={handleInputOnBlur}
                            placeholder={formatMessage(`noteTo:noteToSelfPlaceHolder${giveFromType}`)}
                            value={noteToSelf}
                        />
                    </Form.Field>
                    <FormValidationErrorMessage
                        condition={!validity.isNoteToSelfInLimit}
                        errorMessage={formatMessage('giveCommon:errorMessages.invalidLengthError')}
                    />
                    <FormValidationErrorMessage
                        condition={!validity.isValidNoteSelfText}
                        errorMessage={formatMessage('giveCommon:errorMessages.invalidNoteTextError')}
                    />
                </Fragment>
            )}

        </Fragment>
    );
};


NoteTo.defaultProps = {
    handleInputOnBlur: () => { },
};

NoteTo.defaultProps = beneficiaryDefaultProps;
export default NoteTo;
