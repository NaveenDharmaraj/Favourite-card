import React, {
    Fragment,
} from 'react';
import dynamic from 'next/dynamic';
import _isEmpty from 'lodash/isEmpty';
import _merge from 'lodash/merge';
import {
    Form,
    Input,
    Select,
    Popup,
    Icon,
    Divider,
    Checkbox,
} from 'semantic-ui-react';

import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import { beneficiaryDefaultProps } from '../../../helpers/give/defaultProps';
import NoteTo from '../NoteTo';
import SpecialInstruction from '../SpecialInstruction';
import AccountTopUp from '../AccountTopUp';

const CreditCardWrapper = dynamic(() => import('../../shared/CreditCardWrapper'), {
    ssr: false
});

class Charity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // benificiaryIndex: 0,
            // buttonClicked: false,
            findAnotherRecipientLabel: '', // formatMessage(messageList.findAnotherRecipientMessage),
            flowObject: _merge({}, props.flowObject),
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            showAnotherRecipient: false,
            validity: this.intializeValidations(),

        };
    }

    getStripeCreditCard(data, cardHolderName) {
        this.setState({
            flowObject: {
                ...this.state.flowObject,
                cardHolderName,
                stripeCreditCard: data,
            },
        });
    }

    intializeValidations() {
        this.validity = {
            doesAmountExist: true,
            isAmountCoverGive: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isDonationAmountBlank: true,
            isDonationAmountCoverGive: true,
            isDonationAmountLessThan1Billion: true,
            isDonationAmountMoreThan1Dollor: true,
            isDonationAmountPositive: true,
            isNoteToCharityInLimit: true,
            isNoteToSelfInLimit: true,
            isValidDecimalAmount: true,
            isValidDecimalDonationAmount: true,
            isValidDonationAmount: true,
            isValidGiveAmount: true,
            isValidGiveFrom: true,
            isValidGiveTo: true,
            isValidNoteSelfText: true,
            isValidNoteToCharity: true,
            isValidNoteToCharityText: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
        };
        return this.validity;
    }

    renderGiveFromField(giveFromList, formatMessage, validity, giveFrom) {
        let giveFromField = (
            <Form.Field
                className="field-loader"
                control={Input}
                disabled
                icon={<Icon name="spinner" loading />}
                iconPosition="left"
                id="giveFrom"
                name="giveFrom"
                placeholder="Your list of accounts is loading. This may take a moment" // {formatMessage(fields.preloadedAccountPlaceHolder)}
            />
        );

        if (true) {
            // !_isEmpty(giveFromList)) { // EDITED !! to show give from
            giveFromField = (
                <Form.Field
                    control={Select}
                    error={!validity.isValidGiveFrom}
                    id="giveFrom"
                    name="giveFrom"
                    onBlur={this.handleInputOnBlur}
                    onChange={this.handleInputChange}
                    options="One" // {giveFromList}
                    placeholder="Select a source account" // {formatMessage(fields.accountPlaceHolder)}
                    value="" // {giveFrom.value}
                />
            );
        }

        // if (!this.props.currentUser.userAccountsFetched || !_isEmpty(giveFromList)) {
        if (true) {
            return (
                <Fragment>
                    <Form.Field>
                        <label htmlFor="giveFrom">
                        Give from
                            {/* {formatMessage(fields.giveFromLabel)} */}
                        </label>
                        <Popup
                            content="We’re asking you to select an account because you administer more than one CHIMP Account."// {formatMessage(messageList.allocationsGiveFromPopup)}
                            position="top center"
                            trigger={(
                                <Icon
                                    color="blue"
                                    name="question circle"
                                    size="large"
                                />
                            )}
                        />
                        {giveFromField}
                    </Form.Field>
                    <FormValidationErrorMessage
                        // condition={!validity.isValidGiveFrom}
                        // errorMessage={formatMessage(errorMessages.blankError)}
                        errorMessage="Can't be blank"
                    />
                </Fragment>
            );
        }

        return null;
    }

    renderSpecialInstructionComponent(
        giveFrom, formatMessage, giftType, giftTypeList, infoToShare, 
    ) {
        if (true) { // (!_isEmpty(giveFrom) && giveFrom.value > 0) {
            return (
                <SpecialInstruction
                    formatMessage={formatMessage}
                    giftType={giftType}
                    giftTypeList={giftTypeList}
                    giveFrom={giveFrom}
                    handleInputChange={this.handleInputChange}
                    infoToShare={infoToShare}
                    infoToShareList="" // {infoToShareList}
                />
            );
        }
        return null;
    }

    renderCoverFees(giveFrom, giveAmount, coverFeesData, intl, coverFees, currency) {
        if (true// (giveFrom.value > 0 && Number(giveAmount) > 0 &&
        // !_isEmpty(coverFeesData) && !_isEmpty(coverFeesData.coverFees)
        ) {
            const {
                formatMessage,
                formatNumber,
            } = '';// intl;
            let coverNoteText = null;
            // GIVEB-1912 with recent updates given we don't need 2 versions of text
            
            if (true) { // Number(coverFeesData.coverFees.giveAmountFees) > 0) {
                // const feeAmount = currencyFormatting(
                //     formatAmount(coverFeesData.coverFees.giveAmountFees),
                //     formatNumber,
                //     currency,
                // );
                // const totalAmount = formatAmount(Number(giveAmount) +
                // Number(coverFeesData.coverFees.giveAmountFees));
                // const totalAmount = currencyFormatting(
                //     formatAmount(Number(giveAmount) +
                //     Number(coverFeesData.coverFees.giveAmountFees)),
                //     formatNumber,
                //     currency,
                // );
                coverNoteText = 'Cover {feeAmount} in third-party processing fees on behalf of this charity, for a total amount of {totalAmount}.';
                // formatMessage(messageList.feeAmountCoverageNote, {
                //     feeAmount,
                //     totalAmount,
                // });
            }
            if (!_isEmpty(coverNoteText)) {
                return (
                    <Form.Field className="checkbox-display">
                        <Form.Field
                            checked={coverFees}
                            className="ui checkbox checkbox-text"
                            control={Checkbox}
                            id="coverFees"
                            label={coverNoteText}
                            name="coverFees"
                            onChange={this.handleInputChange}
                        />
                        <Popup
                            content="Banks and credit card companies charge a processing fee to complete online transactions, including online donations. CHIMP does not benefit from these fees, but we do pass them on to gift recipients. You can choose to cover this fee so the recipient receives 100% of your intended gift."
                            // {formatMessage(messageList.feeAmountCoveragePopup)}
                            position="top center"
                            trigger={(
                                <Icon
                                    color="blue"
                                    name="question circle"
                                    size="large"
                                />
                            )}
                        />
                    </Form.Field>
                );
            }
        }
        return null;
    }

    render() {
        // const {
        //     breakpoints: { isMobile },
        //     coverFeesData,
        //     intl,
        // } = this.props;
        const {
            flowObject: {
                currency,
                giveData: {
                    // giveTo,
                    giveAmount,
                    giveFrom,
                    noteToCharity,
                    noteToSelf,
                    coverFees,
                    giftType,
                    infoToShare,
                    creditCard,
                    donationAmount,
                    donationMatch,
                },
                groupFromUrl,
                sourceAccountHolderId,
                stepsCompleted,
                type,
            },
            // dropDownOptions: {
            //     donationMatchList,
            //     giftTypeList,
            //     giveFromList,
            //     // giveToList,
            //     infoToShareList,
            //     paymentInstrumentList,
            // },
            findAnotherRecipientLabel,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            showAnotherRecipient,
            validity,
        } = this.state;

        const {
            formatMessage,
        } = '';// intl;

        // EDITED !! Customised for local setup , Remove the below code block
        const {
            coverFeesData, intl, giveFromList, giftTypeList, infoToShareList,
        } = '';

        // ---------
        let repeatGift = null;

        if (true// (giveFrom.type === 'user' || giveFrom.type === 'companies') &&
        // !!giveTo.recurringEnabled
        ) {
            repeatGift = (
                <Form.Field>
                    <label htmlFor="giftType">
                    Repeat this gift?
                        {/* {formatMessage(messageList.repeatThisGiftLabel)} */}
                    </label>
                    <Form.Field
                        control={Select}
                        id="giftType"
                        name="giftType"
                        //  options={giftTypeList}
                        onChange={this.handleInputChange}
                        //   value={giftType.value}
                    />
                </Form.Field>
            );
        }

        let accountTopUpComponent = null;
        let stripeCardComponent = null;

        // const groupUrlEndpoint = Number(sourceAccountHolderId) > 0 ?
        // `/give/to/group/new?source_account_holder_id=${sourceAccountHolderId}` : null;
        // const frientUrlEndpoint = `/give/to/friend/new`;
        const giveAmountWithCoverFees = (coverFees)
            ? Number(giveAmount) + Number(coverFeesData.coverFees.giveAmountFees)
            : Number(giveAmount);
        if (true// (giveFrom.type === 'user' || giveFrom.type === 'companies')
        // && (giftType.value > 0 || (giftType.value === 0 &&
        // giveAmountWithCoverFees > Number(giveFrom.balance)))
        ) {
            const topupAmount = ''; // formatAmount((formatAmount(giveAmountWithCoverFees) - formatAmount(giveFrom.balance)));
            accountTopUpComponent = (
                <AccountTopUp
                    creditCard={creditCard}
                    donationAmount={donationAmount}
                    donationMatch={donationMatch}
                    // donationMatchList={donationMatchList}
                    formatMessage={formatMessage}
                    getStripeCreditCard={this.getStripeCreditCard}
                    handleInputChange={this.handleInputChange}
                    handleInputOnBlur={this.handleInputOnBlur}
                    isAmountFieldVisible=""// {giftType.value === 0}
                    isDonationMatchFieldVisible=""// {giveFrom.type === 'user'}
                    // paymentInstrumentList={paymentInstrumentList}
                    topupAmount={topupAmount}
                    validity={validity}
                />
            );
        }

        return (
            <Form onSubmit={this.handleSubmit}>
                {true // (Number(giveTo.value) > 0) &&
            && (
                <Fragment>
                    {!groupFromUrl
                && (
                    <div>
                        <Form.Field>
                            <label htmlFor="giveTo">
                Give to
                                {/* {formatMessage(messageList.giveToLabel)} */}
                            </label>
                            <Form.Field
                                control={Input}
                                className="disabled-input"
                                disabled
                                id="giveTo"
                                name="giveTo"
                                size="large"
                                value="Redeemer Christ Assembly" // {giveTo.text}
                            />
                        </Form.Field>
                        {/* {
                                (groupUrlEndpoint) &&
                                this.renderFindAnotherRecipient(
                                    showAnotherRecipient,
                                    frientUrlEndpoint,
                                    groupUrlEndpoint,
                                    formatMessage,
                                    findAnotherRecipientLabel,
                                )
                        } */}
                    </div>
                )
                    }

                    {
                        !!groupFromUrl && (
                            <div>
                                <Form.Field>
                                    <label htmlFor="giveTo">
                                    Give to
                                        {/* {formatMessage(messageList.giveToLabel)} */}
                                    </label>
                                    <Form.Field
                                        control={Select}
                                        error={!validity.isValidGiveTo}
                                        id="giveToList"
                                        name="giveToList"
                                        onChange={this.handleInputChangeGiveTo}
                                        options="One" // {giveToList}
                                        placeholder="Select a Group to Give"
                                        value="" // {giveTo.value}
                                    />
                                </Form.Field>
                                {/* {this.renderFindAnotherRecipient(
                                    showAnotherRecipient,
                                    frientUrlEndpoint,
                                    groupUrlEndpoint,
                                    formatMessage,
                                    findAnotherRecipientLabel,
                                )} */}
                            </div>
                        )
                    }

                    <Form.Field>
                        <label htmlFor="giveAmount">
                        Amount
                            {/* {formatMessage(fields.amountLabel)} */}
                        </label>
                        <Form.Field
                            control={Input}
                            error={!validity.isValidGiveAmount}
                            icon="dollar"
                            iconPosition="left"
                            id="giveAmount"
                            maxLength="20"
                            name="giveAmount"
                            onBlur={this.handleInputOnBlur}
                            onChange={this.handleInputChange}
                            placeholder="Enter amount" // {formatMessage(fields.amountPlaceHolder)}
                            size="large"
                            value="" // {giveAmount}
                        />
                    </Form.Field>
                    <FormValidationErrorMessage
                        // condition={!validity.doesAmountExist || !validity.isAmountMoreThanOneDollor
                        // || !validity.isValidPositiveNumber}
                        // errorMessage={formatMessage(errorMessages.amountLessOrInvalid, {
                        //     minAmount: 5,
                        // })}
                        errorMessage="Please choose an amount of 5 or more"
                    />
                    <FormValidationErrorMessage
                        // condition={!validity.isAmountLessThanOneBillion}
                        // errorMessage={formatMessage(errorMessages.invalidMaxAmountError)}
                        errorMessage="$9,999 is the maximum we can process here. For larger amounts, please get in touch with us: hello@chimp.net or 1-877-531-0580."
                    />
                    <FormValidationErrorMessage
                        // condition={!validity.isAmountCoverGive}
                        // errorMessage={formatMessage(errorMessages.giveAmountGreaterThanBalance)}
                        errorMessage="Sorry, you can't give more money than what is in your account."
                    />

                    { this.renderGiveFromField(giveFromList, formatMessage, validity, giveFrom)}


                    {this.renderCoverFees(
                        giveFrom, giveAmount, coverFeesData, intl, coverFees, currency,
                    )}

                    {this.renderSpecialInstructionComponent(
                        giveFrom, formatMessage,
                        giftType, giftTypeList, infoToShare, infoToShareList,
                    )}

                    {accountTopUpComponent}
                    <Form.Field>
                        <CreditCardWrapper />
                    </Form.Field>
                    <Form.Field>
                        <Divider className="dividerMargin" />
                    </Form.Field>

                    <NoteTo
                        allocationType={type}
                        formatMessage="One"// {formatMessage}
                        giveFrom={giveFrom}
                        noteToCharity={noteToCharity}
                        handleInputChange={this.handleInputChange}
                        handleInputOnBlur={this.handleInputOnBlur}
                        noteToSelf={noteToSelf}
                        validity={validity}
                    />

                    <Divider hidden />

                    { true// !stepsCompleted &&
                      && (
                          <Form.Button
                              className="btnPadding"// {isMobile ? 'mobBtnPadding' : 'btnPadding'}
                              content="Continue"
                              // content={(!this.state.buttonClicked) ?
                              //     formatMessage(fields.continueButton)
                              //     : formatMessage(fields.submitingButton)}
                              // disabled={(this.state.buttonClicked) ||
                              //  !this.props.currentUser.userAccountsFetched}
                              //  fluid={isMobile}
                              type="submit"
                          />
                      )
                    }

                </Fragment>
            )}
            </Form>
        );
    }
}

Charity.defaultProps = beneficiaryDefaultProps;

export default Charity;
