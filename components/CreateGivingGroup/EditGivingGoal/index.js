import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';

import ModalContent from '../../Give/Tools/modalContent';
import ChimpDatePicker from '../../shared/DatePicker';
const EditGivingGoal = ({
    formatMessage,
    fundraisingCreated,
    fundraisingDate,
    fundraisingGoal,
    handleInputChange,
    handleInputOnBlurGivingGoal,
    handleOnDateChange,
    validity
}) => {
    debugger
    return (
        <Fragment>
        <p>Making changes to your giving goal will not affect the money raised so far.</p>
        <div className='givingGoalForm'>
            <div className="field">
                <label>{formatMessage('createGivingGroupGivingGoal.givingGoalAmount')}</label>
                <ModalContent
                    showDollarIcon={true}
                    showLabel={false}
                    handleInputChange={handleInputChange}
                    handleInputOnBlurGivingGoal={handleInputOnBlurGivingGoal}
                    givingGoal={fundraisingGoal}
                    validity={validity}
                    currentYear={''}
                    placeholder={formatMessage('createGivingGroupGivingGoal.modalContentGivingGoalPlaceholder')}
                />
            </div>
            <div className='field'>
                <label>{formatMessage('createGivingGroupGivingGoal.goalStartDate')}</label>
                <p className='label-info'>
                    {formatMessage('createGivingGroupGivingGoal.goalStartDateDescription')}
                </p>
                <ChimpDatePicker
                    dateValue={fundraisingCreated ? new Date(fundraisingCreated) : null}
                    handleonDateChange={handleOnDateChange}
                    name="fundraisingCreated"
                />
            </div>
            <div className='field'>
                <label>{formatMessage('createGivingGroupGivingGoal.goalEndDate')}</label>
                <ChimpDatePicker
                    dateValue={fundraisingDate ? new Date(fundraisingDate) : null}
                    handleonDateChange={handleOnDateChange}
                    name="fundraisingDate"
                />
                {
                    !validity.isEndDateGreaterThanStartDate &&
                    <p className="error-message">
                        <Icon name="exclamation circle" />
                        End date should be greater than start date
                    </p>
                }
            </div>
        </div>
        </Fragment>
    );
}

EditGivingGoal.defaultProps = {
    formatMessage: () => { },
    fundraisingCreated: '',
    fundraisingDate: '',
    fundraisingGoal: '0',
    handleInputChange: () => { },
    handleInputOnBlurGivingGoal: () => { },
    handleOnDateChange: () => { },
    validity: {}
};

export default React.memo(EditGivingGoal);
