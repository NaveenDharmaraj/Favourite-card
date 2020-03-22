import React, {
    Fragment,
  } from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';
import _merge from 'lodash/merge';
import {
    Container,
    Button,
    Checkbox,
    Divider,
    Dropdown,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Modal,
    Popup,
    Radio,
    Select,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import Note from '../../shared/Note';
import DropDownAccountOptions from '../../shared/DropDownAccountOptions';
import FlowBreadcrumbs from '../FlowBreadcrumbs';
import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
import { proceed, getCompanyPaymentAndTax } from '../../../actions/give';
import {
    saveNewCreditCard,
} from '../../../actions/userProfile';
import { withTranslation } from '../../../i18n';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import '../../shared/style/styles.less';
import '../../../static/less/giveFlows.less';
import {
    Elements,
    StripeProvider
} from 'react-stripe-elements';
import {
    countryOptions,
} from '../../../helpers/constants';
import ModalComponent from '../../shared/Modal';

const { publicRuntimeConfig } = getConfig();

const {
    STRIPE_KEY
} = publicRuntimeConfig;
  
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
// import '../../../static/less/giveFlows.less';

const CreditCard = dynamic(() => import('../../shared/CreditCard'));
const messageList = {
	taxReceiptDefault: {
		defaultMessage: 'Add a new tax receipt recipient',
		description: 'Message for adding new tax receipt',
		id: 'taxReceiptProfile.taxReceiptDefault',
	},
	taxReceiptRecipientLabel: {
		defaultMessage: 'Tax receipt recipient',
		description: 'Message for the tax receipt dropdown label',
		id: 'taxReceiptProfile.taxReceiptRecipientLabel',
	},
    }; 

    
class Donation extends React.Component {
    constructor(props) {
    super(props);
    const flowType = _.replace(props.baseUrl, /\//, '');
    let payload = null;
            //Initialize the flowObject to default value when got switched from other flows
            if (props.flowObject.type !== flowType) {
                const defaultPropsData =  _merge({}, donationDefaultProps);
                payload = {
                    ...defaultPropsData.flowObject,
                    nextStep: props.step,
                };
            }
            else{
                const defaultPropsData = _merge({}, props.flowObject);
                payload = {
                    ...defaultPropsData,
                    nextStep: props.step,
                }
            }
            const {
                options,
                taxSelected,
                taxProfileData,
            } = this.populateOptions(props.taxReceiptProfiles, props.defaultTaxReceiptProfile);
            let flowObject = _.cloneDeep(payload);
        this.state = {
            buttonClicked: false,
            flowObject: {...flowObject,
                            selectedTaxReceiptProfile: taxProfileData},
            disableButton: !props.userAccountsFetched,
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            isCreditCardModalOpen: false,
            isTaxReceiptModelOpen: false,
            receiptOptions: options,
			selectedValue: taxSelected,
            validity: this.intializeValidations(),
            dropDownOptions: {},
        }
        if (props.recurringType) {
            this.state.flowObject.giveData.automaticDonation = true;
            this.state.flowObject.giveData.giftType.value = 1;
        }
        this.validateStripeCreditCardNo = this.validateStripeCreditCardNo.bind(this);
        this.validateStripeExpirationDate = this.validateStripeExpirationDate.bind(this);
        this.validateCreditCardCvv = this.validateCreditCardCvv.bind(this);
        this.validateCreditCardName = this.validateCreditCardName.bind(this);
        this.getStripeCreditCard = this.getStripeCreditCard.bind(this);
        this.handleCCAddClose = this.handleCCAddClose.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleAddButtonClick= this.handleAddButtonClick.bind(this);
        this.handleNewAddButtonClick = this.handleNewAddButtonClick.bind(this);
        dismissAllUxCritialErrors(props.dispatch);
    }

    intializeFormData = {
        attributes: {
            addressOne: '',
            addressTwo: '',
            city: '',
            country: countryOptions[0].value,
            fullName: '',
            postalCode: '',
            province: '',
        },
        relationships: {
            accountHoldable: {
                data: {
                    id: this.props.currentUser.id,
                    type: 'user',
                },
            },
        },
        type: 'taxReceiptProfiles',
    };

    componentDidMount() {
        const {
        dispatch,
        currentUser: {
            id,
        }
    } = this.props;
        dispatch(getDonationMatchAndPaymentInstruments(id, 'donations'));
    }

    populateOptions = (taxReceiptProfiles, selectedTaxReceiptProfile) => {
        
		let options = [];
		let taxProfileData = selectedTaxReceiptProfile;
		if (!_.isEmpty(taxReceiptProfiles)) {
			taxReceiptProfiles.map((item) => {
				const {
					attributes
				} = item;
				options.push({
					text: `${attributes.fullName} - ${attributes.addressOne} ${attributes.city}`,
					value: item.id,
				});
			});
		}
		options.push({
			text: (messageList.taxReceiptDefault.defaultMessage),
			value: 0,
		});
		let taxSelected = options[options.length - 1].value;
		if (!_.isEmpty(selectedTaxReceiptProfile) &&
			!!(selectedTaxReceiptProfile.id)) {
			taxSelected = selectedTaxReceiptProfile.id;
		} else if (_.isEmpty(selectedTaxReceiptProfile)) {
			taxProfileData = _.merge({}, this.intializeFormData);
		}
		return {
			options,
			taxSelected,
			taxProfileData,
		};

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
            isTaxReceiptPresent:true
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
        // const isNumber = /^\d+(\.\d*)?$/;
        const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]+)?$/;
        // giveData[name] = formatAmount(value);
        if ((name === 'donationAmount') && !_.isEmpty(value) && value.match(isValidNumber)) {
            inputValue = formatAmount(value);
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
            giveData[name] = inputValue;
            giveData.formatedDonationAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        }
        if(name !== 'giveTo') {
            validity = validateDonationForm(name, inputValue, validity, giveData);
        }
        if(name === 'noteToSelf'){
            giveData[name] = inputValue.trim();
        }
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
    
    onChangeTaxReceipt = (event,data) => {
        // if the correct one is selected then...
        if(data.value == "newCardModal"){
            this.setState({open: true});
        }else{
            this.setState({open: false});
        }
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
        let setDisableFlag = this.state.disableButton;
        if (giveData[name] !== newValue) {
            giveData[name] = newValue;
            giveData.userInteracted = true;
        switch (name) {
            case 'giveTo':
                
                if(giveData.giveTo.type === 'companies') {

                    setDisableFlag = true;
                    const {dispatch} = this.props;
                    getCompanyPaymentAndTax(dispatch, Number(giveData.giveTo.id));
                    giveData.creditCard = {
                        value: null,
                    };
                    giveData.donationMatch = {
                        value: null,
                    };
                    const {
                        options,
                        taxSelected,
                        taxProfileData,
                    } = this.populateOptions(this.props.companyDetails.taxReceiptProfiles, this.state.flowObject.selectedTaxReceiptProfile);
                    this.setState({
                        flowObject: {
                            ...this.state.flowObject,
                            selectedTaxReceiptProfile: taxProfileData,
                        },
                        receiptOptions: options,
                        selectedValue: taxSelected,
                    })

                } else {
                    
                        giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.paymentInstrumentsData, formatMessage));
                        const [
                            defaultMatch,
                        ] = populateDonationMatch(this.props.donationMatchData,formatMessage, language);
                        giveData.donationMatch = defaultMatch;
                        setDisableFlag = false;
                        const {
                            options,
                            taxSelected,
                            taxProfileData,
                        } = this.populateOptions(this.props.userTaxReceiptProfiles, this.props.defaultTaxReceiptProfile);
                        this.setState({
                            flowObject: {
                                ...this.state.flowObject,
                                selectedTaxReceiptProfile: taxProfileData,
                            },
                            receiptOptions: options,
                            selectedValue: taxSelected,
                        })
                }
                validity = validateDonationForm(name, newValue, validity, giveData);
                break;
            case 'automaticDonation':
                const inputValue  = value;
                giveData.automaticDonation = inputValue;
                giveData.giftType.value = (inputValue) ? 1 : 0;
                break;
            case 'donationAmount' :
                giveData.formatedDonationAmount = newValue;
                break;
            case 'creditCard'  :
                if(newValue.value === 0) {
                    this.setState({
                        isCreditCardModalOpen:true
                    })
                }  
            case 'taxReceipt' :
                if(data.value === 0){
                    this.setState({isTaxReceiptModelOpen: true});
                }
                else {
                    this.setState({
                        flowObject: {
                            ...this.state.flowObject,
                            selectedTaxReceiptProfile: this.getChangedProfileData(value),
                        },
                        selectedValue: value,
                        // showFormData: (value <= 0),
                    });
                }
                
                break;                        
            default: break;
            }
            this.setState({
                disableButton: setDisableFlag,
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
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        } = this.state;
        const {
            giveData: {
                giveTo,
                creditCard,
            },
        } = flowObject;
        const validateCC = this.isValidCC(
            creditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        );
        if(this.validateForm() && validateCC){
            if (creditCard.value > 0) {
                flowObject.selectedTaxReceiptProfile = (giveTo.type === 'companies') ?
                    companyDefaultTaxReceiptProfile :
                    defaultTaxReceiptProfile;
            }
            flowObject.stepsCompleted = false;
            dismissAllUxCritialErrors(this.props.dispatch);
            dispatch(proceed({
                ...flowObject}, flowSteps[stepIndex+1], stepIndex));
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
                {formatMessage('giveCommon:amountLabel')}
              </label>
              <Form.Field
                  control={Input}
                  id="donationAmount"
                  error={!isValidGiftAmount(validity)}
                  icon="dollar"
                  iconPosition="left"
                  name="donationAmount"
                  maxLength="8"
                  onBlur={this.handleInputOnBlur}
                  onChange={this.handleInputChange}
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
                <div className="mt-1">
                    <Button className="btn-basic-outline" type="button" size="small" value="25" onClick={this.handlePresetAmountClick} >$25</Button>
                    <Button className="btn-basic-outline" type="button" size="small" value="50" onClick={this.handlePresetAmountClick} >$50</Button>
                    <Button className="btn-basic-outline" type="button" size="small" value="100" onClick={this.handlePresetAmountClick} >$100</Button>
                    <Button className="btn-basic-outline" type="button" size="small" value="500" onClick={this.handlePresetAmountClick} >$500</Button>
                </div>
            </Form.Field>
        );
    }

    handlePresetAmountClick = (event, data) =>{
        const {
            value,
        } = data;
        const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        const formatedDonationAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        
        this.setState({
            ...this.state,
            flowObject:{
                ...this.state.flowObject,
                giveData:{
                    ...this.state.flowObject.giveData,
                    donationAmount:inputValue,
                    formatedDonationAmount,
                }
            }
        });
    }
  
    renderingRecurringDonationFields(formData, formatMessage, language) {
        let recurringFields = (
            <>
            <div className="mb-2">
                <Form.Field>
                    <label>Frequency</label>
                </Form.Field>
                <Form.Field>
                    <Radio
                        className="chimpRadio font-w-n"
                        label='Add once'
                        name='automaticDonation'
                        value={false}
                        checked={!formData.automaticDonation}
                        onChange={this.handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        className="chimpRadio font-w-n"
                        label='Add monthly'
                        name='automaticDonation'
                        value={true}
                        checked={!!formData.automaticDonation}
                        onChange={this.handleInputChange}
                    />
                </Form.Field>
            </div>
            {
                ((!!formData.automaticDonation) && (
                    <>
                        <div className="mt-1 mb-1-2">
                            <Button 
                                className={(formData.giftType.value ===1 ? 'btn-basic-outline selected-btn': 'btn-basic-outline' )}
                                size="small"
                                type="button"
                                active={formData.giftType.value === 1}
                                onClick={this.handlegiftTypeButtonClick}
                                value={1}
                                >1st of every month
                            </Button>
                            <Button
                                className={(formData.giftType.value ===15 ? 'btn-basic-outline selected-btn': 'btn-basic-outline' )}
                                active={formData.giftType.value === 15}
                                type="button"
                                size="small"
                                onClick={this.handlegiftTypeButtonClick}
                                value={15}
                                >15th of every month
                            </Button>
                        </div>
                        <div className="recurringMsg">
                        {formatMessage(
                                'donationRecurringDateNote',
                                { 
                                    recurringDate: setDateForRecurring(formData.giftType.value, formatMessage, language)
                                },
                            )}
                        </div>
                    </>
                ))
            }
            </>
        );
       

        return recurringFields;
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
                                            formatCurrency((donationMatchedData.attributes.policyPercentage/100), language, currency),
                                          policyPeriod: convertedPolicyPeriod,
                                      },
                                  )}
                                  <br/>
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
            <Fragment>
                <Form.Field>
                    <label htmlFor="creditCard">
                    Payment method
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
            </Fragment>
          );
  
          return creditCardField;
  
    }
  
    componentDidUpdate(oldProps) {
      let {
          flowObject:{
              currency,
              giveData,
          }
      } = this.state;
      const {
          i18n:{
              language,
          },
      } = this.props;
    //   let options = {};
    //   let taxSelected = {};
      const formatMessage = this.props.t;
      let doSetState = false;
      if(this.props.userAccountsFetched !== oldProps.userAccountsFetched){
            doSetState = true;
      }
      if(giveData.giveTo.type === 'companies' && !_.isEqual(this.props.companyDetails, oldProps.companyDetails)) {
          
          this.intializeFormData.relationships.accountHoldable.data = {
              id: giveData.giveTo.id,
              type:'companies',
          };
          giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.companyDetails.companyPaymentInstrumentsData, formatMessage));        
        const {
            options,
            taxSelected,
            taxProfileData,
        } = this.populateOptions(this.props.companyDetails.taxReceiptProfiles, this.props.companyDetails.companyDefaultTaxReceiptProfile);
        this.setState({
            flowObject: {
				...this.state.flowObject,
				selectedTaxReceiptProfile: taxProfileData,
			},
            receiptOptions: options,
            selectedValue: taxSelected,
        })
          doSetState = true;
      }
      
      if(giveData.giveTo.type === 'user' && !_.isEqual(this.props.paymentInstrumentsData, oldProps.paymentInstrumentsData)) {

            giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.paymentInstrumentsData, formatMessage));

            const {
                options,
                taxSelected,
                taxProfileData,
            } = this.populateOptions(this.props.userTaxReceiptProfiles, this.props.flowObject.selectedTaxReceiptProfile);
            this.setState({
                flowObject: {
                    ...this.state.flowObject,
                    selectedTaxReceiptProfile: taxProfileData,
                },
                receiptOptions: options,
                selectedValue: taxSelected,
            })
            doSetState = true;
        }
      if((!_.isEqual(this.props.companiesAccountsData, oldProps.companiesAccountsData)
        || _.isEmpty(this.props.companiesAccountsData)) && giveData.giveTo.value === null){
          if(_.isEmpty(this.props.companiesAccountsData) && !_.isEmpty(this.props.fund)){
              const {
                  fund,
                  currentUser: {
                    id,
                    attributes: {
                        avatar,
                        firstName,
                        lastName,
                    }
                  },
              } = this.props;
              giveData.giveTo = {
                  avatar,
                  balance: fund.attributes.balance,
                  disabled: false,
                  id: id,
                  name: `${firstName} ${lastName}`,
                  text: `${fund.attributes.name} (${formatCurrency(fund.attributes.balance, language, currency)})`,
                  type: 'user',
                  value: fund.id,
              };
              giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.paymentInstrumentsData, formatMessage));

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
                      ...giveData,
                  },
              },
          });
      }
    }

    getChangedProfileData(value) {

		let {
			taxReceiptProfiles
		} = this.props
		taxReceiptProfiles = !_.isEmpty(taxReceiptProfiles) ? taxReceiptProfiles : [this.props.flowObject.selectedTaxReceiptProfile];

		const {
			flowObject: {
				selectedTaxReceiptProfile,
			},
		} = this.props;
		let data = null;
		if (value > 0) {
			data = _.merge({}, _.find(taxReceiptProfiles, {
				id: value
			}));
			if (
				!_.isEmpty(selectedTaxReceiptProfile) &&
				!_.isEmpty(selectedTaxReceiptProfile.id) &&
				selectedTaxReceiptProfile.id === value
			) {
				data = selectedTaxReceiptProfile;
			}
		} else if (
			!_.isEmpty(selectedTaxReceiptProfile) &&
			!(selectedTaxReceiptProfile.id)
		) {
			data = selectedTaxReceiptProfile;
		}
		return (_.isEmpty(data)) ? _.merge({}, this.intializeFormData) : data;
    }
    
    /**
     * validateStripeElements
     * @param {boolean} inValidCardNumber credit card number
     * @return {void}
     */
    validateStripeCreditCardNo(inValidCardNumber) {
        this.setState({ inValidCardNumber });
    }

    /**
     * validateStripeElements
     * @param {boolean} inValidExpirationDate credit card expiry date
     * @return {void}
     */
    validateStripeExpirationDate(inValidExpirationDate) {
        this.setState({ inValidExpirationDate });
    }

    /**
     * validateStripeElements
     * @param {boolean} inValidCvv credit card CVV
     * @return {void}
     */
    validateCreditCardCvv(inValidCvv) {
        this.setState({ inValidCvv });
    }

    /**     
     * @param {boolean} inValidNameOnCard credit card Name
     * @param {boolean} inValidCardNameValue credit card Name Value
     * @param {string} cardHolderName credit card Name Data
     * @return {void}
     */
    validateCreditCardName(inValidNameOnCard, inValidCardNameValue, cardHolderName) {
        let cardNameValid = inValidNameOnCard;
        if (cardHolderName.trim() === '' || cardHolderName.trim() === null) {
            cardNameValid = true;
        } else {
            this.setState({
                flowObject: {
                    ...this.state.flowObject,
                    cardHolderName,
                },
            });
        }
        this.setState({
            inValidCardNameValue,
            inValidNameOnCard: cardNameValid,
        });
    }

    getStripeCreditCard(data, cardHolderName) {        
        this.setState({
            flowObject: {
                ...this.state.flowObject,
                cardHolderName,
                stripeCreditCard: data,
            }
        });
    }

    isValidCC(
        creditCard,
        inValidCardNumber,
        inValidExpirationDate,
        inValidNameOnCard,
        inValidCvv,
        inValidCardNameValue,
    ) {
        let validCC = true;
        if (creditCard.value === 0) {
            this.CreditCard.handleOnLoad(
                inValidCardNumber,
                inValidExpirationDate,
                inValidNameOnCard,
                inValidCvv,
                inValidCardNameValue,
            );
            validCC = (
                !inValidCardNumber &&
                !inValidExpirationDate &&
                !inValidNameOnCard &&
                !inValidCvv &&
                !inValidCardNameValue
            );
        }

        return validCC;
    }

    handleNewAddButtonClick(e, data) {
        if(e.target.id === "addNewCreditCard"){
            this.setState({
                isCreditCardModalOpen:true
            })
        } else if(e.target.id === "addNewTaxReceipt") {
            this.setState({
                isTaxReceiptModelOpen:true
            })
        }
        
    }

    handleAddButtonClick() {
        const {
            flowObject:{
                cardHolderName,
                giveData:{
                    creditCard,
                },
                stripeCreditCard
            },
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isDefaultCard,
            currentActivePage,
        } = this.state;
        const validateCC = this.isValidCC(
            creditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        );
        if(validateCC) {
            this.setState({
                buttonClicked: true,
                statusMessage: false,
            });
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            saveNewCreditCard(dispatch, stripeCreditCard, cardHolderName, id, isDefaultCard, currentActivePage).then(() => {
                this.setState({
                    buttonClicked: false,
                    errorMessage: null,
                    successMessage: 'Credit card saved.',
                    statusMessage: true,
                    isCreditCardModalOpen: false,
                });
            }).catch((err) => {
                this.setState({
                    buttonClicked: false,
                    errorMessage: 'Error in saving the Credit Card.',
                    statusMessage: true,
                    isAddModalOpen: false,
                });
            });
        }
    }

    handleCCAddClose() {
        // const {
        //     dispatch
        // } = this.props;
        // dispatch({
        //     payload: {
        //         newCreditCardApiCall: false,
        //     },
        //     type: 'ADD_NEW_CREDIT_CARD_STATUS',
        // });
        
        this.setState({ 
            ...this.state,    
            isCreditCardModalOpen: false
        });
    }
    handleModalOpen(modalBool) {
        this.setState({
            isTaxReceiptModelOpen: modalBool,
        });
    }

    handlegiftTypeButtonClick = (e, { value }) =>{
        this.setState({ 
            flowObject: {
                ...this.state.flowObject,
                giveData:{
                    ...this.state.flowObject.giveData,
                    giftType:{
                        value:value
                    },
                },
            },
        })
    }

    render() {
        const {
            buttonClicked,
            dispatch,
            flowObject: {
                currency,
                giveData,
                type,
            },
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isCreditCardModalOpen,
            isTaxReceiptModelOpen,
            validity,
            receiptOptions,
            selectedValue,
        } = this.state;
        const {
            currentStep,
            donationMatchData,
            flowSteps,
            paymentInstrumentsData,
            companyDetails,
            i18n:{
                language,
            },
            creditCardApiCall,
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
            <div className="flowReviewbanner">
                    <Container>
                        <div className="flowReviewbannerText">
                            <Header as='h2'>Add money</Header>
                        </div>
                    </Container>
                </div>
                <div className="flowReview">
                    <Container>
                        <Grid centered verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={14} computer={12}>
                                    <div className="flowBreadcrumb flowPadding">
                                        <FlowBreadcrumbs
                                            currentStep={currentStep}
                                            formatMessage={formatMessage}
                                            steps={flowSteps}
                                            flowType={type}/>
                                    </div>
                                    <div className="flowFirst">
                                        <Form onSubmit={this.handleSubmit}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={12} computer={10}>
                                                        { this.renderDonationAmountField(giveData.formatedDonationAmount, validity, formatMessage) }
                                                        
                                                        <DropDownAccountOptions
                                                            formatMessage={formatMessage}
                                                            type={type}
                                                            validity= {validity.isValidAddingToSource}
                                                            selectedValue={this.state.flowObject.giveData.giveTo.value}
                                                            name="giveTo"
                                                            parentInputChange={this.handleInputChange}
                                                            parentOnBlurChange={this.handleInputOnBlur}
                                                        />
                                                        { this.renderingRecurringDonationFields(giveData, formatMessage, language) }
                                                        {
                                                            ((_isEmpty(paymentInstrumenOptions) && giveData.giveTo.value > 0) || giveData.creditCard.value === 0) && (
                                                                <>
                                                                <label>Payment method</label>
                                                                <div 
                                                                    className="addNewCardInput"
                                                                    id="addNewCreditCard"
                                                                    onClick={this.handleNewAddButtonClick}>
                                                                         + Add new card
                                                                </div>
                                                                </>
                                                            )
                                                        }
                                                        {/* if no credit card added */}

                                                        {
                                                            ((!_isEmpty(paymentInstrumenOptions) && parseFloat(giveData.donationAmount.replace(/,/g, ''))> 0) &&
                                                                this.renderpaymentInstrumentOptions(giveData, paymentInstrumenOptions, formatMessage)
                                                            )
                                                        }
                                                        {
                                                            <Modal
                                                                size="tiny"
                                                                dimmer="inverted"
                                                                className="chimp-modal"
                                                                closeIcon
                                                                open={isCreditCardModalOpen}
                                                                onClose={this.handleCCAddClose}
                                                                    >
                                                                <Modal.Header>Add new card</Modal.Header>
                                                                <Modal.Content>
                                                                    <Modal.Description className="font-s-16">
                                                                        <Form>
                                                                            <StripeProvider apiKey={STRIPE_KEY}>
                                                                                <Elements>
                                                                                    <CreditCard
                                                                                        creditCardElement={this.getStripeCreditCard}
                                                                                        creditCardValidate={inValidCardNumber}
                                                                                        creditCardExpiryValidate={inValidExpirationDate}
                                                                                        creditCardNameValidte={inValidNameOnCard}
                                                                                        creditCardNameValueValidate={inValidCardNameValue}
                                                                                        creditCardCvvValidate={inValidCvv}
                                                                                        validateCCNo={this.validateStripeCreditCardNo}
                                                                                        validateExpiraton={this.validateStripeExpirationDate}
                                                                                        validateCvv={this.validateCreditCardCvv}
                                                                                        validateCardName={this.validateCreditCardName}
                                                                                        formatMessage = {formatMessage}
                                                                                        // eslint-disable-next-line no-return-assign
                                                                                        onRef={(ref) => (this.CreditCard = ref)}
                                                                                    />
                                                                                </Elements>
                                                                            </StripeProvider>
                                                                            <Form.Field
                                                                                // checked={isDefaultCard}
                                                                                control={Checkbox}
                                                                                className="ui checkbox chkMarginBtm checkboxToRadio"
                                                                                id="isDefaultCard"
                                                                                label="Set as primary card"
                                                                                name="isDefaultCard"
                                                                                onChange={this.handleSetPrimaryClick}
                                                                                // readOnly={isDefaultCardReadOnly}
                                                                            />
                                                                        </Form>
                                                                    </Modal.Description>
                                                                    <div className="btn-wraper pt-3 text-right">
                                                                        <Button
                                                                            className="blue-btn-rounded-def sizeBig w-180"
                                                                            onClick={this.handleAddButtonClick}
                                                                            disabled={buttonClicked}
                                                                        >
                                                                            Add
                                                                        </Button>
                                                                    </div>
                                                                </Modal.Content>
                                                            </Modal>
                                                        }
                                                        {
                                                        (receiptOptions.length> 1) ? (
                                                            <Form.Field className="mb-2">
                                                                <div className="paymentMethodDropdown">
                                                                    <label htmlFor="">Tax receipt</label>            
                                                                    <Dropdown
                                                                        button
                                                                        name="taxReceipt"
                                                                        icon='cardExpress'
                                                                        floating
                                                                        fluid
                                                                        selection
                                                                        options={receiptOptions}
                                                                        onChange={this.handleInputChange}
                                                                        placeholder='Select Tax Receipt'
                                                                        value={selectedValue}
                                                                    />
                                                                </div>
                                                            </Form.Field>
                                                            ) : (null)
                                                        }
                                                        {
                                                            ((receiptOptions.length === 1) && (parseFloat(giveData.donationAmount.replace(/,/g, ''))> 0) ) ? (
                                                                <>
                                                                <label>Tax Receipt</label>
                                                                <div 
                                                                    className="addNewCardInput"
                                                                    id="addNewTaxReceipt"
                                                                    onClick={this.handleNewAddButtonClick}>
                                                                         + Add new tax receipt
                                                                </div>
                                                                </>
                                                            ) : (null)
                                                        }            
                                                        {
                                                            isTaxReceiptModelOpen && (
                                                                <ModalComponent
                                                                    name="Add new tax receipt recipient"
                                                                    isSelectPhotoModalOpen={isTaxReceiptModelOpen}
                                                                    dispatch={dispatch}
                                                                    taxReceipt={this.intializeFormData}
                                                                    handleModalOpen={this.handleModalOpen}
                                                                    action="add"
                                                                />
                                                            )
                                                        }
                                                            

                                                        <Note
                                                            fieldName="noteToSelf"
                                                            handleOnInputChange={this.handleInputChange}
                                                            handleOnInputBlur={this.handleInputOnBlur}
                                                            formatMessage ={formatMessage}
                                                            labelText={formatMessage('noteToSelfLabel')}
                                                            popupText={formatMessage('donorNoteToSelfPopup')}
                                                            placeholderText={formatMessage('noteToSelfPlaceHolder')}
                                                            text={giveData.noteToSelf}
                                                        />
                                                        { this.renderdonationMatchOptions(giveData, donationMatchOptions, formatMessage, donationMatchData, language, currency)}

                                                        <Divider hidden />
                                                        <Form.Button
                                                            primary
                                                            className="blue-btn-rounded"
                                                            // className={isMobile ? 'mobBtnPadding' : 'btnPadding'}
                                                            content={(!creditCardApiCall) ? formatMessage('giveCommon:continueButton')
                                                                : formatMessage('giveCommon:submittingButton')}
                                                            disabled={(creditCardApiCall) || this.state.disableButton}
                                                            // fluid={isMobile}
                                                            type="submit"
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Form>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>
        </Fragment>

        )
    }
}

Donation.defaultProps = {
    ...donationDefaultProps,
    companyDetails: [],
};

const  mapStateToProps = (state, props) => {

    return {
        userTaxReceiptProfiles: state.user.taxReceiptProfiles,
        userTaxReceiptGetApiStatus:state.user.taxReceiptGetApiStatus,
        userTaxReceiptEditApiCall: state.give.taxReceiptEditApiCall,
        // companyTaxReceiptProfiles: state.give.companyData.taxReceiptProfiles,
		// companyTaxReceiptGetApiStatus:state.give.companyData.taxReceiptGetApiStatus,
		companyTaxReceiptEditApiCall: state.give.taxReceiptEditApiCall,
        companyDetails: state.give.companyData,
        userAccountsFetched: state.user.userAccountsFetched,
        currentUser: state.user.info,
        creditCardApiCall: state.give.creditCardApiCall,
    };
}
export default withTranslation(['donation', 'giveCommon'])(connect(mapStateToProps)(Donation));
