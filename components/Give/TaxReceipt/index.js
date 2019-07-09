import React from 'react';
import _ from 'lodash';
import {
    connect
  } from 'react-redux'
import {
    reInitNextStep,
    proceed
  } from '../../../actions/give';
  import TaxReceiptFrom from './TaxReceiptProfileForm';
  import {
    Form,
    Select
  } from 'semantic-ui-react';
  import {
    getTaxReceiptProfile
  } from '../../../actions/user';
  import {
    validateTaxReceiptProfileForm
  } from '../../../helpers/give/utils'

  const messageList = {
    taxReceiptDefault: {
      defaultMessage: 'Add a new tax receipt',
      description: 'Message for adding new tax receipt',
      id: 'taxReceiptProfile.taxReceiptDefault',
    },
    taxReceiptRecipientLabel: {
      defaultMessage: 'Tax receipt recipient',
      description: 'Message for the tax receipt dropdown label',
      id: 'taxReceiptProfile.taxReceiptRecipientLabel',
    },
  };

  const intializeFormData = {
    attributes: {
      addressOne: '',
      addressTwo: '',
      city: '',
      country: '',
      fullName: '',
      postalCode: '',
      province: '',
    },
    type: 'taxReceiptProfiles',
  };

  class TaxReceipt extends React.Component {
    constructor(props) {
      super(props);
      const {
        options,
        taxSelected
      } = this.populateOptions([props.flowObject.selectedTaxReceiptProfile], props.flowObject.selectedTaxReceiptProfile)
      this.state = {
        flowObject: {
          ...props.flowObject,
        },
        selectedValue: props.flowObject.selectedTaxReceiptProfile.id,
        showFormData: true,
        validity: this.intializeValidations(),
        receiptOptions: options,
        selectedValue: taxSelected
      }

    }

    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props.taxReceiptProfiles !== prevProps.taxReceiptProfiles) {
        const {
          options,
          taxSelected
        } = this.populateOptions(this.props.taxReceiptProfiles, this.props.flowObject.selectedTaxReceiptProfile)

        this.setState({
          receiptOptions: options,
          selectedValue: taxSelected
        });
        // this.forceUpdate();
      }
    }

    componentDidMount() {
      const {
        dispatch
      } = this.props
      getTaxReceiptProfile(dispatch, 888000);
      if (this.state.flowObject) {
        reInitNextStep(dispatch, this.state.flowObject)
      }
    }

    handleDisplayForm = () => {
      this.setState({
        showFormData: true,
      });
    }

    handleInputChange = (e, {
      value
    }) => {
      this.setState({
        flowObject: {
          ...this.state.flowObject,
          selectedTaxReceiptProfile: this.getChangedProfileData(value),
        },
        selectedValue: value,
        showFormData: (value <= 0),
      });
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
      return (_.isEmpty(data)) ? _.merge({}, intializeFormData) : data;
    }

    validateForm() {
      let {
        validity
      } = this.state;
      const {
        addressOne,
        city,
        fullName,
        postalCode,
        province,
      } = this.state.flowObject.selectedTaxReceiptProfile.attributes;
      validity = validateTaxReceiptProfileForm('fullName', fullName, validity);
      validity = validateTaxReceiptProfileForm('addressOne', addressOne, validity);
      validity = validateTaxReceiptProfileForm('city', city, validity);
      validity = validateTaxReceiptProfileForm('postalCode', postalCode, validity);
      validity = validateTaxReceiptProfileForm('province', province, validity);
      console.log('validation result');
      console.log(validity);
      this.setState({
        validity
      });

      return _.every(validity);
    }

    handleSubmit() {
      this.setState({
        buttonClicked: true,
      });
      const isValid = this.validateForm();
      if (isValid) {
        const {
          accountHoldableData,
          flowObject,
          selectedValue,
        } = this.state;
        const {
          nextStep,
          taxReceiptProfiles,
        } = this.props;
        flowObject.nextSteptoProceed = nextStep;
        flowObject.taxReceiptProfileAction = 'no_change';
        if (!_.isEmpty(selectedValue) && selectedValue !== 0) {
          const selectedProfileFromList =
            _.find(taxReceiptProfiles, {
              id: selectedValue
            });
          if (!_.isEqual(
              flowObject.selectedTaxReceiptProfile.attributes,
              selectedProfileFromList.attributes,
            )) {
              flowObject.taxReceiptProfileAction = 'update';
              flowObject.visitedTaxPage = true;
          }
        } else {
          flowObject.selectedTaxReceiptProfile.relationships = {
            accountHoldable: {
              data: { id:888000,
                      type:"user"
                    },
            },
          };
          flowObject.taxReceiptProfileAction = 'create';
          flowObject.visitedTaxPage = true;
        }
        // if (_.isEqual(flowObject.selectedTaxReceiptProfile,
        //     this.props.flowObject.selectedTaxReceiptProfile)) {
        //   forceContinue = (forceContinue === this.props.nextStep.path) ?
        //     this.props.currentStep.path : this.props.nextStep.path;
        // }
        // Removing the error status from the layout
        // if (!_.isEmpty(appErrors) && appErrors.length > 0) {
        //   _.map(this.props.appErrors, (err) => {
        //     dismissUxCritialErrors(err);
        //   });
        // }
        // this.props.proceed({
        //   ...flowObject,
        // });
        const {
          dispatch,
          stepIndex,
          flowSteps
        } = this.props
        dispatch(proceed(this.state.flowObject, flowSteps[stepIndex + 1], stepIndex ));

      } else {
        this.setState({
          buttonClicked: false,
        });
      }

    }

    populateOptions = (taxReceiptProfiles, selectedTaxReceiptProfile) => {
      let options = [];
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
        selectedTaxReceiptProfile = _.merge({}, intializeFormData);
      }

      //      this.state.selectedValue = taxSelected;
      return {
        options,
        taxSelected
      };
      // this.setState({
      //   receiptOptions: options
      // })

    }

    handleChildInputChange = (name, value) => {
      const {
        attributes
      } = this.state.flowObject.selectedTaxReceiptProfile;
      if (name === 'country') {
        attributes.province = '';
      }
      attributes[name] = value;
      this.setState({
        flowObject: {
          ...this.state.flowObject,
          selectedTaxReceiptProfile: {
            ...this.state.flowObject.selectedTaxReceiptProfile,
            attributes: {
              ...attributes,
            },
          },
        },
      });
    }

    handleChildOnBlurChange = (name, value) => {
      let {
        validity
      } = this.state;
      validity = validateTaxReceiptProfileForm(name, value, validity);
      this.setState({
        validity
      });
    }

    intializeValidations() {
      this.validity = {
        isAddressHas2: true,
        isAddressLessThan128: true,
        isCityHas2Chars: true,
        isCityLessThan64: true,
        isFullNameHas2: true,
        isPostalCodehas5Chars: true,
        isPostalCodeLessThan16: true,
        isProvinceBlank: true,
        isValidAddress: true,
        isValidAddressFormat: true,
        isValidCity: true,
        isValidCityFormat: true,
        isValidFullName: true,
        isValidFullNameFormat: true,
        isValidPostalCode: true,
        isValidPostalCodeFormat: true,
        isValidProvince: true,
        isValidSecondAddress: true,
      };
      return this.validity;
    }

    displayTaxReceiptFrom() {
      const {
        flowObject: {
          selectedTaxReceiptProfile,
        },
        showFormData,
        selectedValue,
        validity
      } = this.state;
      console.log(this.props.taxReceiptGetApiStatus);
      console.log(this.props.taxReceiptProfiles)
      if(this.state.taxReceiptGetApiStatus){
        return(
        <div>
          TaxReceipt component!
          {/* <div onClick={()=> this.handleInputChange()}>set state here </div><br/> */}
          <div> tax form  </div>
          <Form>
              <Form.Field>
                <label htmlFor="addingTo">
                      TaxReceipt Profile
                </label>
                <Form.Field
                  control={Select}
                  id="taxReceiptRecipient"
                  name="taxReceiptRecipient"
                  options={this.state.receiptOptions}
                  onChange={this.handleInputChange}
                  value={selectedValue}
                />
              </Form.Field>
                <Form.Field>
                  <TaxReceiptFrom
                  showFormData = {showFormData}
                  handleDisplayForm={this.handleDisplayForm}
                  parentInputChange={this.handleChildInputChange}
                  parentOnBlurChange={this.handleChildOnBlurChange}
                  data={selectedTaxReceiptProfile}
                  validity={validity}
                  />
                </Form.Field>
          </Form>
          <div onClick={() => this.handleSubmit()} >Continue</div>
        </div>);
          } else{
            return (
            <div>Loading data...</div>
            );
          }

    }

    render() {
      console.log('Tax receipt  state->> ')
      console.log(this.state);

      return (
        this.displayTaxReceiptFrom()
        );
    }

  }

  function mapStateToProps(state) {
    return {
      taxReceiptProfiles: state.user.taxReceiptProfiles,
      taxReceiptGetApiStatus:state.taxReceiptGetApiStatus
    }
  }

  export default connect(mapStateToProps)(TaxReceipt);