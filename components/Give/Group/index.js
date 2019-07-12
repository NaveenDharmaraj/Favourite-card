import React, {
  Fragment,
} from 'react';
import { withTranslation } from '../../../i18n';
import _find from 'lodash/find';
import _includes from 'lodash/includes';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _every from 'lodash/every';
import _map from 'lodash/map';
import _merge from 'lodash/merge';
import {
  Divider,
  Form,
  Icon,
  Input,
  Popup,
  Select,
} from 'semantic-ui-react';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import NoteTo from '../NoteTo';
import AccountTopUp from '../AccountTopUp';
import PrivacyOptions from '../PrivacyOptions';

import {proceed} from '../../../actions/give';

import { groupDefaultProps } from '../../../helpers/give/defaultProps';

class Group extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      flowObject: props.flowObject
    }
  }
  handleInputChange = () => {
    this.setState({
      flowObject: {
        ...this.state.flowObject,
        giveData: {
          ...this.state.flowObject.giveData,
          donationAmount: '5.00',
        }
      }
    })
  }
  handleSubmit = () => {
    const {dispatch, stepIndex, flowSteps} = this.props
    dispatch(proceed(this.state.flowObject, flowSteps[stepIndex+1]))
  }
  render() {
    console.log(this.props);
    const formatMessage = this.props.t;
        let accountTopUpComponent = null;
        let stripeCardComponent = null;
        let privacyOptionComponent = null;
        if (true//(giveFrom.type === 'user' || giveFrom.type === 'companies')
        // && (giftType.value > 0 || (giftType.value === 0 &&
            // Number(giveAmount) > Number(giveFrom.balance)))
        ) {
            // const topupAmount = formatAmount((formatAmount(giveAmount) -
            //     formatAmount(giveFrom.balance)));
            accountTopUpComponent = (
                <AccountTopUp
                    creditCard='' // {creditCard}
                    donationAmount='' // {donationAmount}
                    donationMatch='' // {donationMatch}
                    donationMatchList='' // {donationMatchList}
                    formatMessage={formatMessage}
                    getStripeCreditCard='' // {this.getStripeCreditCard}
                    handleInputChange={this.handleInputChange}
                    handleInputOnBlur={this.handleInputOnBlur}
                    isAmountFieldVisible='' // {giftType.value === 0}
                    isDonationMatchFieldVisible='' // {giveFrom.type === 'user'}
                    paymentInstrumentList='' // {paymentInstrumentList}
                    topupAmount='' // {topupAmount}
                    validity='' // {validity}
                />
            );
            // if (_isEmpty(paymentInstrumentList) || creditCard.value === 0) {
            //     stripeCardComponent = (
            //         <Form.Field>
            //             <StripeProvider apiKey={stripeKey}>
            //                 <Elements>
            //                     <StripeCreditCard
            //                         creditCardElement={this.getStripeCreditCard}
            //                         creditCardValidate={inValidCardNumber}
            //                         creditCardExpiryValidate={inValidExpirationDate}
            //                         creditCardNameValidte={inValidNameOnCard}
            //                         creditCardNameValueValidate={inValidCardNameValue}
            //                         creditCardCvvValidate={inValidCvv}
            //                         // eslint-disable-next-line no-return-assign
            //                         onRef={(ref) => (this.StripeCreditCard = ref)}
            //                         validateCCNo={this.validateStripeCreditCardNo}
            //                         validateExpiraton={this.validateStripeExpirationDate}
            //                         validateCvv={this.validateCreditCardCvv}
            //                         validateCardName={this.validateCreditCardName}
            //                     />
            //                 </Elements>
            //             </StripeProvider>
            //         </Form.Field>
            //     );
            // }
        }

        if (true){// giveFrom.value > 0) {
          privacyOptionComponent = (
              <PrivacyOptions
                  formatMessage={formatMessage}
                  handleInputChange='' // {this.handleInputChange}
                  giveFrom='' // {giveFrom}
                  giveToType='' // {giveToType}
                  infoToShare='' // {infoToShare}
                  infoToShareList='' // {infoToShareList}
                  privacyShareAddress='' // {privacyShareAddress}
                  privacyShareAmount='' // {privacyShareAmount}
                  privacyShareEmail='' // {privacyShareEmail}
                  privacyShareName='' // {privacyShareName}
              />
          );
      }

    let repeatGift = null;
        if (true// (giveFrom.type === 'user' || giveFrom.type === 'companies') &&
            // !!giveTo.recurringEnabled
        ) {
            repeatGift = (
                <Form.Field>
                    <label htmlFor="giftType">
                        { formatMessage('repeatThisGiftLabel') }
                    </label>
                    <Form.Field
                        control={Select}
                        id="giftType"
                        name="giftType"
                        options='' // {giftTypeList}
                        onChange={this.handleInputChange}
                        value='Abc' // {giftType.value}
                    />
                </Form.Field>
            );
        }
        
    let giveFromField = (
      <Form.Field
          className="field-loader"
          control={Input}
          disabled
          icon={<Icon name="spinner" loading />}
          iconPosition="left"
          id="giveFrom"
          name="giveFrom"
          placeholder={formatMessage('preloadedAccountPlaceHolder')}
      />
  );

  if (true){// !_isEmpty(giveFromList)) {
    giveFromField = (
        <Form.Field
            control={Select}
            // error={!validity.isValidGiveFrom}
            id="giveFrom"
            name="giveFrom"
            onBlur={this.handleInputOnBlur}
            onChange={this.handleInputChange}
            options='One' // {giveFromList}
            placeholder={formatMessage('accountPlaceHolder')}
            value='' // {giveFrom.value}
        />
    );
}
    return (
      <Form onSubmit={this.handleSubmit}>
                <Fragment>
                    {
                        true && (// !groupFromUrl && (
                            <Form.Field>
                                <label htmlFor="giveTo">
                                    {formatMessage('giveToLabel')}
                                </label>
                                <Form.Field
                                    control={Input}
                                    className="disabled-input"
                                    disabled
                                    id="giveTo"
                                    name="giveTo"
                                    size="large"
                                    value='Bangalore | Food banks of BC' // {giveTo.text}
                                />
                            </Form.Field>
                        )
                    }
                    {
                       false && ( // !!groupFromUrl && (
                            <Fragment>
                                <Form.Field>
                                    <label htmlFor="giveTo">
                                        {formatMessage('giveToLabel')}
                                    </label>
                                    <Form.Field
                                        control={Select}
                                        // error={!validity.isValidGiveTo}
                                        id="giveToList"
                                        name="giveToList"
                                        onChange={this.handleInputChangeGiveTo}
                                        options='' // {giveToList}
                                        placeholder={formatMessage('groupToGive')}
                                        value='' // {giveTo.value}
                                    />
                                </Form.Field>
                                <FormValidationErrorMessage
                                    // condition={!validity.isValidGiveTo}
                                    errorMessage={
                                        formatMessage('giveGroupToEqualGiveFrom')
                                    }
                                />
                            </Fragment>
                        )
                    }
                    <Form.Field>
                        <label htmlFor="giveAmount">
                            {formatMessage('amountLabel')}
                        </label>
                        <Form.Field
                            control={Input}
                            // error={!validity.isValidGiveAmount}
                            icon="dollar"
                            iconPosition="left"
                            id="giveAmount"
                            maxLength="20"
                            name="giveAmount"
                            onBlur={this.handleInputOnBlur}
                            onChange={this.handleInputChange}
                            placeholder={formatMessage('amountPlaceHolder')}
                            size="large"
                            value='' // {giveAmount}
                        />
                    </Form.Field>
                    <FormValidationErrorMessage
                        // condition={!validity.doesAmountExist || !validity.isAmountMoreThanOneDollor
                        // || !validity.isValidPositiveNumber}
                        errorMessage={formatMessage('amountLessOrInvalid', {
                            minAmount: 1,
                        })}
                    />
                    <FormValidationErrorMessage
                        // condition={!validity.isAmountLessThanOneBillion}
                        errorMessage={formatMessage('invalidMaxAmountError')}
                    />
                    <FormValidationErrorMessage
                        // condition={!validity.isAmountCoverGive}
                        errorMessage={formatMessage('giveAmountGreaterThanBalance')}
                    />
                    {true && (// (!this.props.currentUser.userAccountsFetched || !_isEmpty(giveFromList)) && (
                        <Fragment>
                            <Form.Field>
                                <label htmlFor="giveFrom">
                                    {formatMessage('giveFromLabel')}
                                </label>
                                <Popup
                                    content={formatMessage('donorGiveFromPopup')}
                                    position="top center"
                                    trigger={
                                        <Icon
                                            color="blue"
                                            name="question circle"
                                            size="large"
                                        />
                                    }
                                />
                                {giveFromField}
                            </Form.Field>
                            <FormValidationErrorMessage
                                // condition={!validity.isValidGiveFrom}
                                errorMessage={formatMessage('blankError')}
                            />
                        </Fragment>
                    )}
                    {repeatGift}
                    {accountTopUpComponent}
                    {/* {stripeCardComponent} */}
                    <Form.Field>
                        <Divider className="dividerMargin" />
                    </Form.Field>
                    <NoteTo
                        allocationType=""// {type}
                        formatMessage={formatMessage}
                        giveFrom='' // {giveFrom}
                        giveToType='' // {giveToType}
                        noteToCharity='' // {noteToCharity}
                        handleInputChange='' // {this.handleInputChange}
                        handleInputOnBlur='' // {this.handleInputOnBlur}
                        noteToSelf='' // {noteToSelf}
                        validity='' // {validity}
                    />
                    {privacyOptionComponent}
                    <Divider hidden />
                    { true && // !stepsCompleted &&
                        <Form.Button
                            className='btnPadding' // {isMobile ? 'mobBtnPadding' : 'btnPadding'}
                            // content={(!this.state.buttonClicked) ?
                            //     formatMessage('continueButton')
                            //     : formatMessage('submitingButton')}
                            content='Continue'
                            // disabled={(this.state.buttonClicked) ||
                            //     !this.props.currentUser.userAccountsFetched}
                            // fluid={isMobile}
                            type="submit"
                        />
                    }
                </Fragment>
            </Form>
    )
  }
}

Group.defaultProps = groupDefaultProps;

export default withTranslation(['group','noteTo','accountTopUp','privacyOptions']) (Group)