import React, { useState } from 'react';
import {
    Button,
    Form,
    Input,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import {
    isValidGiftAmount,
} from '../../../helpers/give/utils';

function DonationAmountField(props) {
    const {
        isGiveFlow,
        amount,
        formatMessage,
        handleInputChange,
        handleInputOnBlur,
        handlePresetAmountClick,
        validity,
    } = props;
    const [
        activeIndex,
        setactiveIndex,
    ] = useState(0);
    const handleDonationPresetAmountClick = (event, data) => {
        const { index } = data;
        setactiveIndex(index);
        handlePresetAmountClick(event, data);
    };
    const handleDonationAmountFieldInputChange = (event, data) => {
        setactiveIndex(0);
        handleInputChange(event, data);
    };
    return (
        <Form.Field>
            <label htmlFor="donationAmount">
                {formatMessage('giveCommon:amountLabel')}
            </label>
            <Form.Field
                control={Input}
                id={isGiveFlow ? "giveAmount" : "donationAmount"}
                error={!isValidGiftAmount(validity)}
                icon={(amount)? "dollar": null}
                iconPosition="left"
                name={isGiveFlow ? "giveAmount" : "donationAmount"}
                maxLength="8"
                onBlur={handleInputOnBlur}
                onChange={handleDonationAmountFieldInputChange}
                placeholder={formatMessage('giveCommon:amountPlaceHolder')}
                size="large"
                value={amount}
            />
            <FormValidationErrorMessage
                condition={!validity.doesAmountExist || !validity.isAmountMoreThanOneDollor
                    || !validity.isValidPositiveNumber}
                errorMessage={formatMessage('giveCommon:errorMessages.amountLessOrInvalid', {
                    minAmount: 5,
                })}
            />
            <FormValidationErrorMessage
                condition={!validity.isAmountLessThanOneBillion}
                errorMessage={ReactHtmlParser(formatMessage('giveCommon:errorMessages.invalidMaxAmountError'))}
            />
            {isGiveFlow && (
                <FormValidationErrorMessage
                    condition={!validity.isAmountCoverGive}
                    errorMessage={formatMessage('giveCommon:errorMessages.giveAmountGreaterThanBalance')}
                />
            )}
            <div className="mt-1">
                <Button active={activeIndex === 1} className="btn-basic-outline btntext invisionwidth" index={1} type="button" size="small" value="25" onClick={handleDonationPresetAmountClick}>$25</Button>
                <Button active={activeIndex === 2} className="btn-basic-outline btntext invisionwidth" index={2} type="button" size="small" value="50" onClick={handleDonationPresetAmountClick}>$50</Button>
                <Button active={activeIndex === 3} className="btn-basic-outline btntext invisionwidth" index={3} type="button" size="small" value="100" onClick={handleDonationPresetAmountClick}>$100</Button>
                <Button active={activeIndex === 4} className="btn-basic-outline btntext invisionwidth" index={4} type="button" size="small" value="500" onClick={handleDonationPresetAmountClick}>$500</Button>
            </div>
        </Form.Field>
    );
}
export default DonationAmountField;
