import React, {
    Fragment,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Divider,
    Form,
    Header,
    Icon,
    Input,
    Popup,
    Select,
} from 'semantic-ui-react';

import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';


const AccountTopUp = (props) => {
    const {
        creditCard,
        donationAmount,
        donationMatch,
        donationMatchList,
        formatMessage,
        handleInputChange,
        handleInputOnBlur,
        isAmountFieldVisible,
        isDonationMatchFieldVisible,
        paymentInstrumentList,
        topupAmount,
        validity,
    } = props;
    let donationAmountField = null;
    if (isAmountFieldVisible) {
        donationAmountField = (
            <Fragment>
                <Form.Field>
                    <label htmlFor="donationAmount">
                        {formatMessage('giveCommon:amountLabel')}
                    </label>
                    <Form.Field
                        control={Input}
                        id="donationAmount"
                        error={!validity.isValidDonationAmount}
                        icon="dollar"
                        iconPosition="left"
                        name="donationAmount"
                        maxLength="7"
                        onBlur={handleInputOnBlur}
                        onChange={handleInputChange}
                        placeholder={formatMessage('AccountTopUp.amountPlaceHolder')}
                        size="large"
                        value={donationAmount}
                    />
                </Form.Field>
                <FormValidationErrorMessage
                    condition={!validity.isDonationAmountBlank || !validity.isDonationAmountMoreThan1Dollor
                    || !validity.isDonationAmountPositive}
                    errorMessage={formatMessage('giveCommon:errorMessages.amountLessOrInvalid', {
                        minAmount: 5,
                    })}
                  
                />
                <FormValidationErrorMessage
                    condition={!validity.isDonationAmountLessThan1Billion}
                    errorMessage={formatMessage('giveCommon:errorMessages.invalidMaxAmountError')}
                />
                <FormValidationErrorMessage
                    condition={!!validity.isDonationAmountPositive && !validity.isDonationAmountCoverGive}
                    errorMessage={formatMessage('AccountTopUp.donationAmountIsLess', {
                        topupAmount,
                    })}
                />
            </Fragment>
        );
    }

    let donationMatchField = null;
    if (isDonationMatchFieldVisible) {
        donationMatchField = (
            <Form.Field>
                <label htmlFor="donationMatch">
                    {formatMessage('AccountTopUp.donationMatchLabel')}
                </label>
                <Popup
                    content={<div>{formatMessage('AccountTopUp.donationsMatchPopup')}</div>}
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
                    control={Select}
                    id="donationMatch"
                    name="donationMatch"
                    onChange={handleInputChange}
                    options={donationMatchList}
                    value={donationMatch.value}
                />
            </Form.Field>
        );
    }

    let creditCardField = null;
    if (!_isEmpty(paymentInstrumentList)) {
        creditCardField = (
            <Form.Field>
                <label htmlFor="creditCard">
                    {formatMessage('AccountTopUp.creditCardLabel')}
                </label>
                <Form.Field
                    control={Select}
                    id="creditCard"
                    name="creditCard"
                    onChange={handleInputChange}
                    options={paymentInstrumentList}
                    placeholder={formatMessage('AccountTopUp.creditCardPlaceholder')}
                    value={creditCard.value}
                />
            </Form.Field>
        );
    }

    return (
        <Fragment>
            <Form.Field>
                <Divider className="dividerMargin" />
            </Form.Field>
            <Form.Field>
                <Header as="h3"> 
                    {formatMessage('AccountTopUp.accountTopUpHeaderLabel')}
                </Header>
            </Form.Field>
            {donationAmountField}
            {donationMatchField}
            {creditCardField}
        </Fragment>
    );
};

export default AccountTopUp;