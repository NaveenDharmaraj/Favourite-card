import React, {
  Fragment,
} from 'react';
import _ from 'lodash';
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
import TextAreaWithInfo from '../../shared/TextAreaWithInfo';
import DropDownAccountOptions from './DropDownAccountOptions';
import {proceed} from '../../../actions/give';
import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
import { getCompanyPaymentAndTax } from '../../../actions/give';

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
} from '../../../helpers/give/utils';


class Donation extends React.Component {
    constructor(props) {
    super(props)
    this.state = {
        flowObject: props.flowObject,
        buttonClicked: false,
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
            },
            // dropDownOptions,
            validity,
        } = this.state;
        const {
            flowObject: {
                type,
            },
        } = this.state;

        let newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        if (giveData[name] !== newValue) {
            giveData[name] = newValue;
            giveData.userInteracted = true;
            switch (name) {
                case 'giveTo':
                    if(giveData.giveTo.type === 'companies') {
                        const {dispatch} = this.props;
                        getCompanyPaymentAndTax(dispatch, Number(giveData.giveTo.id));
                        giveData.creditCard = {
                            value: null,
                        };
                        giveData.donationMatch = {
                            value: null,
                        };
                    } else {
                            giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.paymentInstrumentsData));
                            const [
                                defaultMatch,
                            ] = populateDonationMatch(this.props.donationMatchData);
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
                default: break;
            }
            this.setState({
                flowObject: {
                    ...this.state.flowObject,
                    giveData,
                },
                validity: {
                    ...this.state.validity,
                    validity,
                },
            });
        }
    }

  handleSubmit = () => {
    const {dispatch, stepIndex, flowSteps} = this.props
    dispatch(proceed(this.state.flowObject, flowSteps[stepIndex+1]))
  }
    /**
     * Renders the JSX for the donation amount field.
     * @param {number} amount The donation amount.
     * @param {object} validity The validity object.
     * @return {JSX} JSX representing donation amount.
     */

    renderDonationAmountField(amount, validity) {
      return (
          <Form.Field>
              <label htmlFor="donationAmount">
                  Amount
              </label>
              <Form.Field
                  control={Input}
                  id="donationAmount"
                  error={!isValidGiftAmount(validity)}
                  icon="dollar"
                  iconPosition="left"
                  name="donationAmount"
                  maxLength="7"
                  // onBlur={this.handleInputOnBlur}
                  onChange={this.handleInputChange}
                  placeholder='Enter Amount'
                  size="large"
                  value={amount}
              />
                <FormValidationErrorMessage
                        condition={!validity.isDonationAmountBlank || !validity.isDonationAmountMoreThan1Dollor
                        || !validity.isDonationAmountPositive}
                        errorMessage='Min 5'
                        // errorMessage={formatMessage(errorMessages.amountLessOrInvalid, {
                        //     minAmount: 5,
                        // })}
                />
                <FormValidationErrorMessage
                        condition={!validity.isDonationAmountLessThan1Billion}
                        errorMessage='less than one million'
                        // errorMessage={formatMessage(errorMessages.invalidMaxAmountError)}
                />
              {/* <FormValidationErrorMessage
                  condition={!validity.doesAmountExist || !validity.isAmountMoreThanOneDollor
                  || !validity.isValidPositiveNumber}
                  errorMessage='Min 5'
              />
              <FormValidationErrorMessage
                  condition={!validity.isAmountLessThanOneBillion}
                  errorMessage='less than one million'
              /> */}
          </Form.Field>
      );
  }

      /**
     * Render recurring donation option.
     * @param {object} formData The state object representing form data.
     * @param {boolean} isMobile True if render fields for mobile, false otherwise.
     * @return {JSX} JSX representing the adding to source selection.
     */
    renderingRecurringDonationFields(formData) {
      return (
          <Fragment>
              <Form.Field>
                  <label htmlFor="automaticDonation">
                    Repeat monthly
                  </label>
                  <Popup
                      content={<div>content</div>}
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
                    recurringMontlyDonationLabel
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
                              options={onWhatDayList()}
                              onChange={this.handleInputChange}
                              value={formData.giftType.value}
                          />
                          <div className="recurringMsg">
                            donationRecurringDateNote
                          </div>
                      </Form.Field>
                  )
              }
          </Fragment>
      );
  }

      /**
     * Render the notes field.
     * @param {function} formatMessage I18 formatting.
     * @param {string} reason The donor's reason to donate.
     * @param {*} validity The validity object.
     * @return {JSX} JSX representing the notes field.
     */
    renderNotesFields(reason, validity) {
      return (
          <Form.Field>
              <label htmlFor="noteToSelf">
                noteToSelfLabel
              </label>
              <Popup
                  content={<div>donationsNoteToSelfPopup</div>}
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
                  className="with-info"
                  control={TextAreaWithInfo}
                  error={!validity.isNoteToSelfValid}
                  name="noteToSelf"
                  id="noteToSelf"
                  info='remainingChars'
                  //onBlur={this.handleInputOnBlur}
                  onChange={this.handleInputChange}
                  placeholder='noteToSelfPlaceHolder'
                  value={reason}
              />
              <FormValidationErrorMessage
                  condition={!validity.isNoteToSelfInLimit}
                  errorMessage='invalidLengthError'
              />
              <FormValidationErrorMessage
                  condition={!validity.isValidNoteSelfText}
                  errorMessage='invalidNoteTextError'
              />
          </Form.Field>
      );
  }

  renderdonationMatchOptions(formData, options){
    let donationMatchField = null;
    if (formData.giveTo.type === 'user' && !_.isEmpty(options)) {
        donationMatchField = (
            <Form.Field>
                <label htmlFor="donationMatch">
                donationMatchLabel{/*{formatMessage(fields.donationMatchLabel)} */}
                </label>
                <Popup
                    content={<div>donationsMatchPopup</div>}
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
            </Form.Field>
        );
    }
    return donationMatchField;
  }

  renderpaymentInstrumentOptions(formData, options){
        const creditCardField = (
            <Form.Field>
                <label htmlFor="creditCard">
                creditCardLabel
                </label>
                <Form.Field
                    control={Select}
                    id="creditCard"
                    name="creditCard"
                    onChange={this.handleInputChange}
                    options={options}
                    placeholder={'creditCardPlaceholder'}
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
    let doSetState = false;
    if(giveData.giveTo.type === 'companies' && this.props.companyDetails !== oldProps.companyDetails) {
        giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.companyDetails.companyPaymentInstrumentsData));
        doSetState = true;
        // this.setState({
        //     flowObject: {
        //         ...this.state.flowObject,
        //         giveData:{
        //             ...this.state.flowObject.giveData,
        //             giveData,
        //         },
        //     },
        // });
    }
    if(this.props.companiesAccountsData !== oldProps.companiesAccountsData){
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
                id: '999614',
                name: `Namee`,
                text: `${fund.attributes.name}`, // (${currencyFormatting(fund.attributes.balance, formatNumber, currency)})`,
                type: 'user',
                value: fund.id,
            };
            if(!_.isEmpty(this.props.donationMatchData)){
                const [
                    defaultMatch,
                ] = populateDonationMatch(this.props.donationMatchData);
                giveData.donationMatch = defaultMatch;
            }
            doSetState = true;
            // this.setState({
            //     flowObject: {
            //         ...this.state.flowObject,
            //         giveData:{
            //             ...this.state.flowObject.giveData,
            //             giveData,
            //         },
            //     },
            // });
        }
    }
    if(doSetState) {
        this.setState({
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
        giveData,
      },
      validity,
    } = this.state;
    const {
        donationMatchData,
        paymentInstrumentsData,
        companyDetails,
    } = this.props;
    const donationMatchOptions = populateDonationMatch(donationMatchData);
    let paymentInstruments = paymentInstrumentsData;
    if(giveData.giveTo.type === 'companies'){
        paymentInstruments = !_.isEmpty(companyDetails.companyPaymentInstrumentsData) ? companyDetails.companyPaymentInstrumentsData : [];
    }
    const paymentInstrumenOptions  = populatePaymentInstrument(paymentInstruments);
    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit}>
        { this.renderDonationAmountField(giveData.donationAmount, validity) }
        <DropDownAccountOptions
          validity= {validity}
          selectedValue={giveData.giveTo.value}
          parentInputChange={this.handleInputChange}
          // parentOnBlurChange={this.handleChildOnBlurChange}
        />
        { this.renderingRecurringDonationFields(giveData) }
        {/* { this.renderNotesFields(giveData.noteToSelf, validity) } */}
        { this.renderdonationMatchOptions(giveData, donationMatchOptions)}
        { this.renderpaymentInstrumentOptions(giveData, paymentInstrumenOptions)}

        </Form>
        <div>
        <div onClick={() => this.handleSubmit()} >Continue</div>
        </div>
      </Fragment>

    )
  }
}

Donation.defaultProps = {
    ...donationDefaultProps,
    companyDetails: [],
};

function mapStateToProps(state) {
    return {
        companyDetails: state.give.companyData,
    };
}
export default connect(mapStateToProps)(Donation);
// export default Donation;
