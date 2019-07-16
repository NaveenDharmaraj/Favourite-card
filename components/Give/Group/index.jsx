/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Checkbox,
    Divider,
    Form,
    Icon,
    Image,
    Input,
    List,
    Popup,
    Select,
} from 'semantic-ui-react';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _every from 'lodash/every';
import _map from 'lodash/map';
import _merge from 'lodash/merge';
import {
    connect,
} from 'react-redux';
import { beneficiaryDefaultProps } from '../../../helpers/give/defaultProps';
import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
import {
    getDefaultCreditCard,
    populateDonationMatch,
    populateGiveToGroupsofUser,
    populateGiftType,
    populatePaymentInstrument,
    populateInfoToShare,
} from '../../../helpers/give/utils';
import {
    getBeneficiariesForGroup,
    getBeneficiaryFromSlug,
    getGroupsFromSlug,
    proceed,
} from '../../../actions/give';

import { groupDefaultProps } from '../../../helpers/give/defaultProps';
// import { stat } from 'fs';

class Group extends React.Component {
  constructor(props) {
    props.flowObject.giveData.giveTo.type = 'user';
    super(props)
    this.state = {
      flowObject: _merge({}, props.flowObject),
      benificiaryIndex: 0,
      buttonClicked: false,
      dropDownOptions: {
          giftTypeList: populateGiftType(),
          // giveFromList: populateAccountOptions({
          //     companiesAccountsData,
          //     firstName,
          //     fund,
          //     id,
          //     lastName,
          //     userCampaigns,
          //     userGroups,
          // }),
          // giveToList: populateGiveToGroupsofUser(giveGroupBenificairyDetails),
          // infoToShareList: populateInfoToShare(
          //     taxReceiptProfiles,
          //     companyDetails,
          //     props.flowObject.giveData.giveFrom,
          //     {
          //         displayName,
          //         email,
          //     },
          // ),
          paymentInstrumentList: populatePaymentInstrument(paymentInstruments),
      },
      findAnotherRecipientLabel: 'Find another recipient',
      inValidCardNameValue: true,
      inValidCardNumber: true,
      inValidCvv: true,
      inValidExpirationDate: true,
      inValidNameOnCard: true,
      showAnotherRecipient: false,
      validity: this.intializeValidations(),
  };
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

  componentDidMount() {
    const {
      slug,
      dispatch
    } = this.props;
    if(slug !== null) {
      console.log(slug)
      getGroupsFromSlug(dispatch, slug);
    }
    dispatch(getDonationMatchAndPaymentInstruments());

  }
  componentDidUpdate(prevProps) {
    console.log('this.props');
    console.log(prevProps);
    console.log(this.props)
    
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
        isValidAddingToSource: true,
        isValidDecimalAmount: true,
        isValidDecimalDonationAmount: true,
        isValidDonationAmount: true,
        isValidGiveAmount: true,
        isValidGiveFrom: true,
        isValidNoteSelfText: true,
        isValidNoteToCharity: true,
        isValidNoteToCharityText: true,
        isValidNoteToSelf: true,
        isValidPositiveNumber: true,
    };
    return this.validity;
  }

  render() {
    let {
      flowObject:{
        giveData:{
          giveAmount,
          giveTo,

        }
      }
    } = this.props;

    console.log(this.props);
    let giveFromField = (
      <Form.Field
          className="field-loader"
          control={Input}
          disabled
          icon={<Icon name="spinner" loading />}
          iconPosition="left"
          id="giveFrom"
          name="giveFrom"
          placeholder="Select a source account"
      />
  );
  // if (!_isEmpty(giveFromList)) {
  //     giveFromField = (
  //         <Form.Field
  //             control={Select}
  //             error={!validity.isValidGiveFrom}
  //             id="giveFrom"
  //             name="giveFrom"
  //             onBlur={this.handleInputOnBlur}
  //             onChange={this.handleInputChange}
  //             options={giveFromList}
  //             placeholder={formatMessage(fields.accountPlaceHolder)}
  //             value={giveFrom.value}
  //         />
  //     );
  // }
    return (
      <div>
        Group new page - slug is {this.props.slug}
        <div onClick={()=> this.handleInputChange()}>set state here {this.state.flowObject.giveData.donationAmount}</div><br/>
        <Form.Field>
          <label htmlFor="giveTo">
              Give To
          </label>
          <Form.Field
              control={Input}
              className="disabled-input"
              disabled
              id="giveTo"
              name="giveTo"
              size="large"
              value="Name of Group"
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="giveAmount">
              Amount
          </label>
          <Form.Field
              control={Input}
              // error={!validity.isValidGiveAmount}
              icon="dollar"
              iconPosition="left"
              id="giveAmount"
              maxLength="20"
              name="giveAmount"
              // onBlur={this.handleInputOnBlur}
              // onChange={this.handleInputChange}
              placeholder="Enter Amount"
              size="large"
              value={giveAmount}
          />
          </Form.Field>
          <Fragment>
            <Form.Field>
                <label htmlFor="giveFrom">
                    Give From
                </label>
                <Popup
                    content="We’re asking you to select an account because you administer more than one CHIMP Account.  Note that Group accounts with a Matching Campaign are not listed because they can only give directly to a charity."
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
            {/* <FormValidationErrorMessage
                condition={!validity.isValidGiveFrom}
                errorMessage={formatMessage(errorMessages.blankError)}
            /> */}
            </Fragment>
        <Button  style={{ marginTop: '1rem' }} onClick={() => this.handleSubmit()} >Continue</Button>
      </div>
    )
  }
}


Group.defaultProps = groupDefaultProps;

const  mapStateToProps = (state, props) => {
  console.log('state');
  console.log(state);
  console.log('props');
  console.log(props);

  // if(props.flowObject && props.flowObject.giveData.giveTo.type === 'user') {
  //   return {
  //     taxReceiptProfiles: state.user.taxReceiptProfiles,
  //     taxReceiptGetApiStatus:state.user.taxReceiptGetApiStatus
  //   }
  // }
  // return {
  //   taxReceiptProfiles: state.give.companyData.taxReceiptProfiles,
  //   taxReceiptGetApiStatus:state.give.companyData.taxReceiptGetApiStatus
  // }
  return {
    giveData: state.give.giveData
  }
}
export default connect(mapStateToProps)(Group)

