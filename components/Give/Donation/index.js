import React, {
    Fragment,
  } from 'react';
  import _ from 'lodash';
  import dynamic from 'next/dynamic';
  import {
    Checkbox,
    Divider,
    Form,
    Header,
    Icon,
    Input,
    Popup,
    Select,
  } from 'semantic-ui-react';
  import {
      connect,
  } from 'react-redux';
  import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
  import Note from '../../shared/Note';
  import TextAreaWithInfo from '../../shared/TextAreaWithInfo';
  import DropDownAccountOptions from '../../shared/DropDownAccountOptions';
  import {proceed} from '../../../actions/give';
  import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
  import { getCompanyPaymentAndTax } from '../../../actions/give';
  import { withTranslation } from '../../../i18n';
  
  import {
    donationDefaultProps,
   } from '../../../helpers/give/defaultProps';
  import {
    isValidGiftAmount,
    onWhatDayList,
    populateDonationMatch,
    populatePaymentInstrument,
    formatAmount,
    getDefaultCreditCard,
    setDateForRecurring,
    validateDonationForm,
    fullMonthNames,
    formatCurrency,
  } from '../../../helpers/give/utils';

const CreditCardWrapper = dynamic(() => import('../../shared/CreditCardWrapper'), {
    ssr: false
});
  
  
  class Donation extends React.Component {
      constructor(props) {
      super(props)
      this.state = {
          flowObject: props.flowObject,
          buttonClicked: false,
          disableButton: !props.userAccountsFetched,
          // forceContinue: props.forceContinue,
          inValidCardNameValue: true,
          inValidCardNumber: true,
          inValidCvv: true,
          inValidExpirationDate: true,
          inValidNameOnCard: true,
          validity: this.intializeValidations(),
          dropDownOptions: {},
      }
      }
  
      componentDidMount() {
          const {dispatch} = this.props;
          dispatch(getDonationMatchAndPaymentInstruments());
      }
  
      intializeValidations() {
          this.validity = {
              doesAmountExist: true,
              isAmountLessThanOneBillion: true,
              isAmountMoreThanOneDollor: true,
              isNoteToSelfInLimit: true,
              isNoteToSelfValid: true,
              isValidAddingToSource: true,
              isValidNoteSelfText: true,
              isValidPositiveNumber: true,
              };
          return this.validity;
      }
  
      /**
       * Synchronise form data with React state
       * @param  {Event} event The Event instance object.
       * @param  {object} options The Options of event
       * @return {Void} { void } The return nothing.
       */
      handleInputOnBlur = (event, data) => {
          event.preventDefault();
          const {
              name,
              value,
          } = !_.isEmpty(data) ? data : event.target;
          const {
              flowObject: {
                  giveData,
              },
          } = this.state;
          let {
              validity,
          } = this.state;
          let inputValue = value;
          const isNumber = /^\d+(\.\d*)?$/;
          if ((name === 'donationAmount') && !_.isEmpty(value) && value.match(isNumber)) {
              giveData[name] = formatAmount(value);
              inputValue = formatAmount(value);
          }
          validity = validateDonationForm(name, inputValue, validity)
          this.setState({
              flowObject: {
                  ...this.state.flowObject,
                  giveData,
              },
              validity,
          });
      };
  
      /**
       * validateForm() when click on continue on AddMoney view
       * @return {void}
       */
      validateForm() {
          const {
              flowObject:{
                  giveData:{
                      giveTo,
                      donationAmount,
                      noteToSelf
                  },
              },
          } = this.state;
          let { validity } = this.state;
          validity = validateDonationForm('donationAmount', donationAmount, validity);
          validity = validateDonationForm('noteToSelf', noteToSelf, validity);
          validity = validateDonationForm('giveTo', giveTo.value, validity);
          this.setState({ validity });
          return _.every(validity);
      }
  
      handleInputChange = (event, data) =>  {
          const {
              name,
              options,
              value,
          } = data;
          const { target } = event;
          let {
              flowObject: {
                  giveData,
                  selectedCreditCard
              },
              // dropDownOptions,
              validity,
          } = this.state;
          const {
              flowObject: {
                  type,
              },
          } = this.state;
          const {
              i18n:{
                  language,
              },
          } = this.props;
          const formatMessage = this.props.t;
          let newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
          let setDisableFlag = false;
          if (giveData[name] !== newValue) {
              giveData[name] = newValue;
              giveData.userInteracted = true;
            switch (name) {
                case 'giveTo':
                    if(giveData.giveTo.type === 'companies') {
                        const {dispatch} = this.props;
                        getCompanyPaymentAndTax(dispatch, Number(giveData.giveTo.id));
                        setDisableFlag = true;
                        giveData.creditCard = {
                            value: null,
                        };
                        giveData.donationMatch = {
                            value: null,
                        };
                    } else {
                            giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.paymentInstrumentsData, formatMessage));
                            const [
                                defaultMatch,
                            ] = populateDonationMatch(this.props.donationMatchData,formatMessage, language);
                            giveData.donationMatch = defaultMatch;
                    }
                    break;
                case 'automaticDonation':
                    const inputValue  = target.checked;
                    giveData.automaticDonation = inputValue;
                    giveData.giftType.value = (inputValue) ? 1 : 0;

                case 'giftType':
                    //giveData.giftType.value = newValue.value;
                    // giveData = resetDataForGiftTypeChange(giveData, dropDownOptions, coverFeesData);
                    break;
                case 'creditCard':
                    selectedCreditCard = giveData.creditCard.value > 0 ? '' : 'new';                    
                default: break;
              }
              this.setState({
                  disableButton: setDisableFlag,
                  flowObject: {
                      ...this.state.flowObject,
                      giveData,
                      selectedCreditCard
                  },
                  validity: {
                      ...this.state.validity,
                      validity,
                  },
              });
          }
      }
  
  
    handleSubmit = () => {
        const {
            dispatch,
            stepIndex,
            flowSteps,
            companyDetails:{
                companyDefaultTaxReceiptProfile,
            },
            defaultTaxReceiptProfile,
        } = this.props
        const {
            flowObject,
        } = this.state;
        const {
            giveData: {
                giveTo,
                creditCard,
            },
        } = flowObject;
        this.setState({
            buttonClicked: true,
        });
        if(this.validateForm()){
            if (creditCard.value > 0) {
                flowObject.selectedTaxReceiptProfile = (giveTo.type === 'companies') ?
                    companyDefaultTaxReceiptProfile :
                    defaultTaxReceiptProfile;
            }
            dispatch(proceed({
                ...flowObject}, flowSteps[stepIndex+1]))
        } else {
            this.setState({
                buttonClicked: false,
            });
        }
    }
      /**
       * Renders the JSX for the donation amount field.
       * @param {number} amount The donation amount.
       * @param {object} validity The validity object.
       * @param {function} formatMessage I18 formatting.
       * @return {JSX} JSX representing donation amount.
       */
  
    renderDonationAmountField(amount, validity, formatMessage) {
        return (
            <Form.Field>
                <label htmlFor="donationAmount">
                  {formatMessage('amountLabel')}
                </label>
                <Form.Field
                    control={Input}
                    id="donationAmount"
                    error={!isValidGiftAmount(validity)}
                    icon="dollar"
                    iconPosition="left"
                    name="donationAmount"
                    maxLength="7"
                    onBlur={this.handleInputOnBlur}
                    onChange={this.handleInputChange}
                    placeholder={formatMessage('amountPlaceHolder')}
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
                      errorMessage={formatMessage('giveCommon:errorMessages.invalidMaxAmountError')}
                  />
            </Form.Field>
        );
    }
  
        /**
       * Render recurring donation option.
       * @param {object} formData The state object representing form data.
       * @param {function} formatMessage  I18 formatting.
       * @param {string} language language
       * @return {JSX} JSX representing the adding to source selection.
       */
    renderingRecurringDonationFields(formData, formatMessage, language) {
        return (
            <Fragment>
                <Form.Field>
                    <label htmlFor="automaticDonation">
                      {formatMessage('automaticDonationLabel')}
                    </label>
                    <Popup
                        content={<div>{formatMessage('automaticDonationPopup')}</div>}
                        position="top center"
                        trigger={
                            <Icon
                                color="blue"
                                name="question circle"
                                size="large"
                            />
                        }
                    />
                    <br />
                    <Form.Field
                        checked={formData.automaticDonation }
                        control={Checkbox}
                        className="ui checkbox chkMarginBtm"
                        id="automaticDonation"
                        name="automaticDonation"
                        onChange={this.handleInputChange}
                        toggle
                    />
                    <div>
                      {formatMessage('recurringMontlyDonationLabel')}
                    </div>
                </Form.Field>
                {
                    !!formData.automaticDonation && (
                        <Form.Field>
                            <label htmlFor="onWhatDay">
                              donationOnWhatDayLabel
                            </label>
                            <Form.Field
                                control={Select}
                                id="giftType"
                                name="giftType"
                                options={onWhatDayList(formatMessage)}
                                onChange={this.handleInputChange}
                                value={formData.giftType.value}
                            />
                            <div className="recurringMsg">
                            {formatMessage(
                                      'donationRecurringDateNote',
                                      { 
                                          recurringDate: setDateForRecurring(formData.giftType.value, formatMessage, language)
                                      },
                                  )}
                            </div>
                        </Form.Field>
                    )
                }
            </Fragment>
        );
    }
  
    renderdonationMatchOptions(
          formData,
          options,
          formatMessage,
          donationMatchData,
          language,
          currency,
      ){
      let donationMatchField = null;
      if (formData.giveTo.type === 'user' && !_.isEmpty(options)) {
          let donationMatchedData = {};
          let convertedPolicyPeriod = formatMessage('policyPeriodYear');
          const currentDate = new Date();
          let donationMonth = currentDate.getFullYear();
          if(formData.donationMatch.value > 0) {
              donationMatchedData = _.find(
                  donationMatchData, (item) => item.attributes.employeeRoleId == formData.donationMatch.value,
              );
              if (donationMatchedData.attributes.policyPeriod === 'month') {
                  convertedPolicyPeriod = formatMessage('policyPeriodMonth');
                  const months = fullMonthNames(formatMessage);
                  donationMonth = months[currentDate.getMonth()];
              }
          }
          donationMatchField = (
              <Form.Field>
                  <label htmlFor="donationMatch">
                  {formatMessage('donationMatchLabel')}
                  </label>
                  <Popup
                      content={<div>{formatMessage('donationsMatchPopup')}</div>}
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
                      control={Select}
                      id="donationMatch"
                      name="donationMatch"
                      onChange={this.handleInputChange}
                      options={options}
                      value={formData.donationMatch.value}
                  />
                  {
                      (!_.isEmpty(donationMatchedData)) && (
                          <Form.Field>
                              <div className="recurringMsg">
                                  {formatMessage('donationMatchNote', {
                                      companyName:
                                          donationMatchedData.attributes.companyName,
                                      donationMonth: donationMonth,
                                      totalMatched:
                                          formatCurrency(
                                              donationMatchedData.attributes.totalMatched,
                                              language,
                                              currency,
                                          ),
                                      totalRequested:
                                          formatCurrency(
                                              donationMatchedData.attributes.totalRequested,
                                              language,
                                              currency,
                                          ),
                                  })}
                                  <br />
                                  {formatMessage(
                                      'donationMatchPolicyNote', {
                                          companyName:
                                              donationMatchedData.attributes.companyName,
                                          policyMax:
                                              formatCurrency(
                                                  donationMatchedData.attributes.policyMax,
                                                  language,
                                                  currency,
                                              ),
                                          policyPercentage:
                                              donationMatchedData.attributes.policyPercentage,
                                          policyPeriod: convertedPolicyPeriod,
                                      },
                                  )}
                              </div>
                          </Form.Field>
                      )
                  }
              </Form.Field>
          );
      }
      return donationMatchField;
    }
  
    renderpaymentInstrumentOptions(formData, options, formatMessage){
          const creditCardField = (
              <Form.Field>
                  <label htmlFor="creditCard">
                  {formatMessage('creditCardLabel')}
                  </label>
                  <Form.Field
                      control={Select}
                      id="creditCard"
                      name="creditCard"
                      onChange={this.handleInputChange}
                      options={options}
                      placeholder={formatMessage('creditCardPlaceholder')}
                      value={formData.creditCard.value}
                  />
              </Form.Field>
          );
  
          return creditCardField;
  
    }
  
    componentDidUpdate(oldProps) {
      let {
          flowObject:{
              giveData,
          }
      } = this.state;
      const {
          i18n:{
              language,
          },
      } = this.props;
      const formatMessage = this.props.t;
      let doSetState = false;
      if(giveData.giveTo.type === 'companies' && !_.isEqual(this.props.companyDetails, oldProps.companyDetails)) {
          giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.companyDetails.companyPaymentInstrumentsData, formatMessage));
          doSetState = true;
      }
      if(!_.isEqual(this.props.companiesAccountsData, oldProps.companiesAccountsData) && giveData.giveTo.value === null){
          if(_.isEmpty(this.props.companiesAccountsData) && !_.isEmpty(this.props.fund)){
              const {
                  fund,
              } = this.props;
              giveData.giveTo = {
                  balance: fund.attributes.balance,
                  data: {
                      fundName: fund.attributes.name,
                      fundType: 'user',
                  },
                  disabled: false,
                  id: '888000',
                  name: `Namee`,
                  text: `${fund.attributes.name}`, // (${currencyFormatting(fund.attributes.balance, formatNumber, currency)})`,
                  type: 'user',
                  value: fund.id,
              };
              if(!_.isEmpty(this.props.donationMatchData)){
                  const [
                      defaultMatch,
                  ] = populateDonationMatch(this.props.donationMatchData, formatMessage, language);
                  giveData.donationMatch = defaultMatch;
              }
              doSetState = true;
          }
      }
      if(doSetState) {
          this.setState({
              buttonClicked: false,
              disableButton:false,
              flowObject: {
                  ...this.state.flowObject,
                  giveData:{
                      ...this.state.flowObject.giveData,
                      giveData,
                  },
              },
          });
      }
    }
  
    render() {
      const {
          flowObject: {
              currency,
              giveData,
              type,
              selectedCreditCard
          },
          validity,
      } = this.state;
      const {
          donationMatchData,
          paymentInstrumentsData,
          companyDetails,
          i18n:{
              language,
          },
      } = this.props;
      const formatMessage = this.props.t;
      const donationMatchOptions = populateDonationMatch(donationMatchData, formatMessage, language);
      let paymentInstruments = paymentInstrumentsData;
      if(giveData.giveTo.type === 'companies'){
          paymentInstruments = !_.isEmpty(companyDetails.companyPaymentInstrumentsData) ? companyDetails.companyPaymentInstrumentsData : [];
      }
      const paymentInstrumenOptions  = populatePaymentInstrument(paymentInstruments, formatMessage);
      return (
        <Fragment>
          <Form onSubmit={this.handleSubmit}>
          { this.renderDonationAmountField(giveData.donationAmount, validity, formatMessage) }
          <DropDownAccountOptions
            type={type}
            validity= {validity.isValidAddingToSource}
            selectedValue={giveData.giveTo.value}
            name="giveTo"
            parentInputChange={this.handleInputChange}
            parentOnBlurChange={this.handleInputOnBlur}
          />
          { this.renderingRecurringDonationFields(giveData, formatMessage, language) }
          <Note
              fieldName="noteToSelf"
              handleOnInputChange={this.handleInputChange}
              handleOnInputBlur={this.handleOnInputBlur}
              formatMessage ={formatMessage}
              labelText={formatMessage('noteToSelfLabel')}
              popupText={formatMessage('donorNoteToSelfPopup')}
              placeholderText={formatMessage('noteToSelfPlaceHolder')}
              text={giveData.noteToSelf}
          />
          { this.renderdonationMatchOptions(giveData, donationMatchOptions, formatMessage, donationMatchData, language, currency)}
          { this.renderpaymentInstrumentOptions(giveData, paymentInstrumenOptions, formatMessage)}
        {
            selectedCreditCard === 'new' && (
                <Form.Field>
                    <CreditCardWrapper />
                </Form.Field>
            )
        }
          <Divider hidden />
              <Form.Button
                  // className={isMobile ? 'mobBtnPadding' : 'btnPadding'}
                  content={(!this.state.buttonClicked) ? formatMessage('giveCommon:continueButton')
                      : formatMessage('giveCommon:submittingButton')}
                  disabled={(this.state.buttonClicked) || this.state.disableButton}
                  // fluid={isMobile}
                  type="submit"
              />
          </Form>
          <div>
          {/* <div onClick={() => this.handleSubmit()} >Continue</div> */}
          </div>
        </Fragment>
  
      )
    }
  }
  
  Donation.defaultProps = {
      ...donationDefaultProps,
      companyDetails: [],
  };
  
  const  mapStateToProps = (state) => {
      return {
          companyDetails: state.give.companyData,
          userAccountsFetched: state.user.userAccountsFetched,
      };
  }
  export default withTranslation(['donation', 'giveCommon'])(connect(mapStateToProps)(Donation));
