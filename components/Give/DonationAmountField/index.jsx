import React, {
} from 'react';
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
                onChange={handleInputChange}
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
                <Button className="btn-basic-outline btntext invisionwidth" type="button" size="small" value="25" onClick={handlePresetAmountClick} >$25</Button>
                <Button className="btn-basic-outline btntext invisionwidth" type="button" size="small" value="50" onClick={handlePresetAmountClick} >$50</Button>
                <Button className="btn-basic-outline btntext invisionwidth" type="button" size="small" value="100" onClick={handlePresetAmountClick} >$100</Button>
                <Button className="btn-basic-outline btntext invisionwidth" type="button" size="small" value="500" onClick={handlePresetAmountClick} >$500</Button>
            </div>
        </Form.Field>
    );
}
export default DonationAmountField;
