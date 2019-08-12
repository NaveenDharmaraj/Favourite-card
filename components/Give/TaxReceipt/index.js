import React from 'react';
import _ from 'lodash';
import {
		connect
	} from 'react-redux'
import {
		getCompanyTaxReceiptProfile,
		reInitNextStep,
		proceed
	} from '../../../actions/give';
import TaxReceiptFrom from './TaxReceiptProfileForm';
import {
		Form,
		Select,
		Input,
		Icon,
		Button
} from 'semantic-ui-react';
import {
	validateTaxReceiptProfileForm
} from '../../../helpers/give/utils'
import { withTranslation } from '../../../i18n';

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
			taxSelected,
			taxProfileData,
		} = this.populateOptions(props.taxReceiptProfiles, props.flowObject.selectedTaxReceiptProfile);
		this.state = {
			flowObject: {
				...props.flowObject,
				selectedTaxReceiptProfile: taxProfileData,
			},
			showFormData: true,
			validity: this.intializeValidations(),
			receiptOptions: options,
			selectedValue: taxSelected
		}

	}

	componentDidMount() {
		const {
			dispatch
		} = this.props;

		const {
			flowObject
		} = this.state;

		if (flowObject) {
			reInitNextStep(dispatch, flowObject)
		}
		if(flowObject && flowObject.stepsCompleted){
			Router.pushRoute('/dashboard');
		}
		window.scrollTo(0, 0);
	}

	componentDidUpdate(oldProps) {
		if(!_.isEqual(this.props.taxReceiptProfiles, oldProps.taxReceiptProfiles)) {
			const {
				options,
				taxSelected,
				taxProfileData,
			} = this.populateOptions(this.props.taxReceiptProfiles, this.state.flowObject.selectedTaxReceiptProfile);
			this.setState({
				receiptOptions: options,
				selectedValue: taxSelected,
				flowObject: {
					...this.props.flowObject,
					selectedTaxReceiptProfile: taxProfileData,
				},
			})
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
				flowObject,
				selectedValue,
			} = this.state;
			const {
				nextStep,
				taxReceiptProfiles,
			} = this.props;
			const {
				giveData: {
					giveTo,
					giveFrom,
				},
			} = flowObject;
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
						data: { 
							id: (flowObject.type === 'donations') ? giveTo.id: giveFrom.id,
							type: (flowObject.type === 'donations') ? giveTo.type: giveFrom.type,
						},
					},
				};
				flowObject.taxReceiptProfileAction = 'create';
				flowObject.visitedTaxPage = true;
			}

			const {
				dispatch,
				stepIndex,
				flowSteps
			} = this.props
			dispatch(proceed(flowObject, flowSteps[stepIndex + 1], stepIndex ));

		} else {
			this.setState({
				buttonClicked: false,
			});
		}

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
			taxProfileData = _.merge({}, intializeFormData);
		}
		return {
			options,
			taxSelected,
			taxProfileData,
		};

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

	renderTaxReceiptFrom() {
		const {
			flowObject: {
				selectedTaxReceiptProfile,
			},
			selectedValue,
		} = this.state;
		const formatMessage = this.props.t;
		let fieldData = (
			<Form.Field
				className="field-loader"
				control={Input}
				disabled
				id="taxReceiptRecipient"
				icon={<Icon name="spinner" loading />}
				iconPosition="left"
				name="taxReceiptRecipient"
				placeholder="preloadedAccountPlaceHolder"
			/>
		);
			fieldData = (
				<Form.Field
					control={Select}
					id="taxReceiptRecipient"
					name="taxReceiptRecipient"
					options={this.state.receiptOptions}
					onChange={this.handleInputChange}
					value={selectedValue}
				/>
			)
			return(
				<Form.Field>
					<label htmlFor="addingTo">
								{formatMessage('taxReceiptRecipientLabel')}
					</label>
					{fieldData}
				</Form.Field>

			);
	}

	renderContinueButton() {
		let button = (
			<Button primary onClick={() => this.handleSubmit()} className="blue-btn-rounded">Continue</Button>
		);
		if(this.state.buttonClicked) {
			button = (
				<Button primary disabled onClick={() => this.handleSubmit()} className="blue-btn-rounded">Continue</Button>
			); 
		}
		return (button);

	}

	render() {
		const {
			flowObject: {
				selectedTaxReceiptProfile,
			},
			showFormData,
			selectedValue,
			validity
		} = this.state;
		const formatMessage = this.props.t;
		return (
			<div>
				<Form>
					{this.renderTaxReceiptFrom()}
						<Form.Field>
							<TaxReceiptFrom
							showFormData = {showFormData}
							handleDisplayForm={this.handleDisplayForm}
							parentInputChange={this.handleChildInputChange}
							parentOnBlurChange={this.handleChildOnBlurChange}
							data={selectedTaxReceiptProfile}
							validity={validity}
							formatMessage={formatMessage}
							/>
						</Form.Field>
				</Form>
				<br />
				{this.renderContinueButton()}
			</div>
		);
	}
}

const  mapStateToProps = (state, props) => {
	const type  = (props.flowObject.type === 'donations') ?
		props.flowObject.giveData.giveTo.type :
		props.flowObject.giveData.giveFrom.type;
	if(type === 'user') {
		return {
			taxReceiptProfiles: state.user.taxReceiptProfiles,
			taxReceiptGetApiStatus:state.user.taxReceiptGetApiStatus
		}
	}
	return {
		taxReceiptProfiles: state.give.companyData.taxReceiptProfiles,
		taxReceiptGetApiStatus:state.give.companyData.taxReceiptGetApiStatus
	}
}
export default withTranslation('taxReceipt')(connect(mapStateToProps)(TaxReceipt));
