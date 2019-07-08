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

// import FormValidationErrorMessage from 'client/giving/components/FormValidationErrorMessage';


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
    if (true) { // (isAmountFieldVisible) {
        donationAmountField = (
            <Fragment>
                <Form.Field>
                    <label htmlFor="donationAmount">
                    Amount
                        {/* {formatMessage(fields.amountLabel)} */}
                    </label>
                    <Form.Field
                        control={Input}
                        id="donationAmount"
                        // error={!validity.isValidDonationAmount}
                        icon="dollar"
                        iconPosition="left"
                        name="donationAmount"
                        maxLength="7"
                        onBlur={handleInputOnBlur}
                        onChange={handleInputChange}
                        placeholder="Enter amount"// {formatMessage(fields.amountPlaceHolder)}
                        size="large"
                        value={donationAmount}
                    />
                </Form.Field>
                {/* <FormValidationErrorMessage
                    condition={!validity.isDonationAmountBlank || !validity.isDonationAmountMoreThan1Dollor
                    || !validity.isDonationAmountPositive}
                    errorMessage={formatMessage(errorMessages.amountLessOrInvalid, {
                        minAmount: 5,
                    })}
                />
                    <FormValidationErrorMessage
                        condition={!validity.isDonationAmountLessThan1Billion}
                        errorMessage={formatMessage(errorMessages.invalidMaxAmountError)}
                    />
                    <FormValidationErrorMessage
                        condition={!!validity.isDonationAmountPositive && !validity.isDonationAmountCoverGive}
                        errorMessage={formatMessage(errorMessages.donationAmountIsLess, {
                            topupAmount,
                        })}
                    /> */}
            </Fragment>
        );
    }

    let donationMatchField = null;
    if (true) { // (isDonationMatchFieldVisible) {
        donationMatchField = (
            <Form.Field>
                <label htmlFor="donationMatch">
                Donation match
                    {/* {formatMessage(fields.donationMatchLabel)} */}
                </label>
                <Popup
                    content={<div>"If there’s an opportunity for this money to be matched, it will appear here. A request will go to the matching party (your employer, for example) who can then choose to match it according to their policy."</div>}//{<div>{formatMessage(fields.donationsMatchPopup)}</div>}
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
                    value="" // {donationMatch.value}
                />
            </Form.Field>
        );
    }

    let creditCardField = null;
    if (true) { // (!_isEmpty(paymentInstrumentList)) {
        creditCardField = (
            <Form.Field>
                <label htmlFor="creditCard">
                Credit card
                    {/* {formatMessage(fields.creditCardLabel)} */}
                </label>
                <Form.Field
                    control={Select}
                    id="creditCard"
                    name="creditCard"
                    onChange={handleInputChange}
                    options={paymentInstrumentList}
                    placeholder="Select Credit Card"// {formatMessage(fields.creditCardPlaceholder)}
                    value=""// {creditCard.value}
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
                {/* <Header as="h3">{formatMessage(fields.accountTopUpHeaderLabel)}</Header> */}
                <Header as="h3"> Top up your account balance to give this gift</Header>
            </Form.Field>
            {donationAmountField}
            {donationMatchField}
            {creditCardField}
        </Fragment>
    );
};

export default AccountTopUp;
