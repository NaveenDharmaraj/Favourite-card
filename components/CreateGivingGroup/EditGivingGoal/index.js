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
    validity,
    fromCreate
}) => {
    return (
        <Fragment>
        <div className={`givingGoalForm ${!fromCreate && 'edit_goal_modal'}`}>
            <div className="field">
                <label>{formatMessage('createGivingGroupGivingGoal.givingGoalAmount')}</label>
                {!fromCreate
                    && (
                        <p className='label-info'>
                            Editing changes to your giving goal will not affect the total money raised so far.
                        </p>
                    )}
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
                    minDate={new Date(fundraisingCreated)}
                />
                {(!validity.isEndDateGreaterThanStartDate || !validity.isNotSameStartEndData)
                    &&
                    <p className="error-message">
                        <Icon name="exclamation circle" />
                        The goal end date must be after the start date of the giving goal.
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
    validity: {},
};

export default React.memo(EditGivingGoal);
