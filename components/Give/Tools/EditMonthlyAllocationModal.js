import { useState, useEffect } from 'react';
import {
	Button,
	Grid,
	Form,
	Input,
	Modal,
	Popup,
	Icon,
	Select,
} from 'semantic-ui-react';
import { withTranslation } from '../../../i18n';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _includes from 'lodash/includes';
import _every from 'lodash/every';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import DonationFrequency from '../DonationFrequency';
import DonationAmountField from '../DonationAmountField';
import PrivacyOptions from '../PrivacyOptions';
import NoteTo from '../NoteTo';
import {
	formatAmount,
	isValidGiftAmount,
	validateDonationForm,
	validateGiveForm,
} from '../../../helpers/give/utils';
import { populateDropdownInfoToShare } from '../../../helpers/users/utils';
import { editUpcomingAllocation } from '../../../actions/user';
import {
	getGroupCampaignAdminInfoToShare,
	getCharityInfoToShare,
} from '../../../actions/userProfile';
const SpecialInstruction = dynamic(() => import('../SpecialInstruction'));

const DedicateType = dynamic(() => import('../DedicateGift'), {
	ssr: false,
});

const EditMonthlyAllocationModal = ({
	currentMonthlyAllocAmount,
	t,
	transactionId,
	activePage,
	recipientName,
	giftType,
	language,
	giveToType,
	notetoRecipient,
}) => {
	const formatMessage = t;

	const intializeValidations = {
		doesAmountExist: true,
		isAmountLessThanOneBillion: true,
		isAmountMoreThanOneDollor: true,
		isValidPositiveNumber: true,
		isCreditCardSelected: true,
		isValidNoteSelfText: true,
		isValidNoteToCharity: true,
		isValidNoteToCharityText: true,
		isValidNoteToSelf: true,
		isNoteToCharityInLimit: true,
		isNoteToSelfInLimit: true,
		isDedicateGiftEmpty: true,
	};
	const formatedCurrentMonthlyAllocAmount = currentMonthlyAllocAmount.replace(
		'$',
		''
	);
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.info);
	let {
		attributes: { preferences },
		id,
	} = currentUser;
	const infoOptions = useSelector((state) => state.userProfile.infoOptions);
	const charityShareInfoOptions = useSelector(
		(state) => state.userProfile.charityShareInfoOptions
	);

	const [infoToShareList, setInfoToShareList] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [
		groupCampaignAdminShareInfoOptions,
		setGroupCampaignAdminShareInfoOptions,
	] = useState([]);
	const [defautlDropDownValue, setDefaultDropDownValue] = useState();
	const [options, setOptions] = useState([
		{
			text: 'Give anonymously',
			value: 'anonymous',
		},
	]);
	const [giftFreq, setGiftFreq] = useState(giftType);
	useEffect(() => {
		if (showEditModal) {
			if (giveToType === 'Beneficiary') {
				if (_isEmpty(charityShareInfoOptions)) {
					dispatch(getCharityInfoToShare(id));
				} else {
					const { infoToShareList } = populateDropdownInfoToShare(
						charityShareInfoOptions
					);
					const name = 'charities_info_to_share';
					const preference = preferences[name].includes('address')
						? `${preferences[name]}-${
								preferences[`${name}_address`]
						  }`
						: preferences[name];
					setOptions(infoToShareList);
					setDefaultDropDownValue(
						infoToShareList.find((opt) => opt.value === preference)
					);
				}
			} else {
				if (_isEmpty(infoOptions)) {
					dispatch(getGroupCampaignAdminInfoToShare(id, false));
				} else {
					let {
						groupMemberInfoToShare,
						groupCampaignAdminShareInfoOptions,
					} = infoOptions;
					const { infoToShareList } = populateDropdownInfoToShare(
						groupMemberInfoToShare
					);
					setInfoToShareList(infoToShareList);
					setGroupCampaignAdminShareInfoOptions(
						groupCampaignAdminShareInfoOptions
					);
				}
			}
		}
	}, [showEditModal]);
	const [defaultInfoToShare, setDefaultInfoToShare] = useState();
	const [defaultNameToShare, setDefaultNameToShare] = useState();
	const [privacyShareAmount, setPrivacyShareAmount] = useState();
	const [trpId, setTrpId] = useState();
	useEffect(() => {
		if (!_isEmpty(infoOptions) && !_isEmpty(currentUser)) {
			let {
				groupMemberInfoToShare,
				groupCampaignAdminShareInfoOptions,
			} = infoOptions;
			const { infoToShareList } = populateDropdownInfoToShare(
				groupMemberInfoToShare
			);
			setInfoToShareList(infoToShareList);
			setGroupCampaignAdminShareInfoOptions(
				groupCampaignAdminShareInfoOptions
			);
			const prefernceName =
				giveToType === 'Campaign'
					? 'campaign_admins_info_to_share'
					: 'giving_group_admins_info_to_share';
			const preference = preferences[prefernceName].includes('address')
				? `${preferences[prefernceName]}-${
						preferences[`${prefernceName}_address`]
				  }`
				: preferences[prefernceName];
			setPrivacyShareAmount(
				preferences['giving_group_members_share_my_giftamount']
			);
			if (
				!_isEmpty(groupCampaignAdminShareInfoOptions) &&
				groupCampaignAdminShareInfoOptions.length > 0
			) {
				const { infoToShareList } = populateDropdownInfoToShare(
					groupCampaignAdminShareInfoOptions
				);
				setDefaultInfoToShare(
					infoToShareList.find((opt) => opt.value === preference)
				);
			}
			setDefaultNameToShare(
				infoToShareList.find(
					(opt) =>
						opt.value ===
						preferences['giving_group_members_info_to_share']
				) || {}
			);
		}
	}, [infoOptions]);
	useEffect(() => {
		if (
			giveToType === 'Beneficiary' &&
			!_isEmpty(charityShareInfoOptions)
		) {
			const { infoToShareList } = populateDropdownInfoToShare(
				charityShareInfoOptions
			);
			setOptions(infoToShareList);
			const name = 'charities_info_to_share';
			const preference = preferences[name].includes('address')
				? `${preferences[name]}-${preferences[`${name}_address`]}`
				: preferences[name];
			setDefaultDropDownValue(
				infoToShareList.find((opt) => opt.value === preference)
			);
		}
	}, [charityShareInfoOptions]);
	// state for amount value in edit modal
	const [amount, setAmount] = useState(formatedCurrentMonthlyAllocAmount);

	// intializing validity for amount and payment
	const [validity, setValidity] = useState(intializeValidations);

	// state for payment option
	const [loader, setLoader] = useState(true);

	const [noteToCharity, setNoteToCharity] = useState(notetoRecipient);
	const [noteToSelf, setNoteToSelf] = useState('');
	const [dedicateValue, setDedicateValue] = useState('');
	const [dedicateType, setDedicateType] = useState('');
	//state for disable button
	const [disableButton, setDisableButton] = useState(true);

	// initializing the flow object for edit flow
	const flowObject = {
		giveData: {
			giveFrom: {
				type: 'user',
			},
			giveTo: {
				id: currentUser.id,
				type: 'user',
			},
			giftType: giftType,
		},
		type: 'allocations',
	};

	const handleInputChange = (event, data) => {
		const { name, options, value, newIndex } = data;
		let newValue = !_isEmpty(options)
			? _find(options, {
					value,
			  })
			: value;
		const privacyCheckbox = [
			'privacyShareAddress',
			'privacyShareAmount',
			'privacyShareEmail',
			'privacyShareName',
		];
		const isValidPrivacyOption = _includes(privacyCheckbox, name);
		if (isValidPrivacyOption) {
			const { target } = event;
			newValue = target.checked;
		}
		if (name === 'inHonorOf' || name === 'inMemoryOf') {
			if (newIndex === -1) {
				setDedicateType('');
				setDedicateValue('');
			} else {
				setDedicateType(name);
				setDedicateValue(value);
			}
			setValidity({ ...validity, isDedicateGiftEmpty: true });
		}
		if (name !== 'inHonorOf' && name !== 'inMemoryOf') {
			switch (name) {
				case 'donationAmount':
					setAmount(value);
					break;
				case 'nameToShare':
					setDefaultNameToShare(newValue);
					if (
						newValue.value !== 'anonymous' &&
						infoToShare.value === 'anonymous'
					) {
						setDefaultInfoToShare(
							infoToShareList.find((opt) => opt.value === 'name')
						);
					} else {
						setDefaultInfoToShare(
							infoToShareList.find((opt) => opt.value === 'name')
						);
					}
					break;
				case 'infoToShare':
					setDefaultInfoToShare(newValue);
					break;
				case 'privacyShareAmount':
					setPrivacyShareAmount(newValue);
					break;
				case 'noteToCharity':
					setNoteToCharity(newValue);
					break;
				case 'noteToSelf':
					setNoteToSelf(newValue);
					break;
			}
			setDisableButton(false);
		}
	};

	const handleInputOnBlur = (event, data) => {
		event.preventDefault();
		const { name, value } = !_isEmpty(data) ? data : event.target;
		const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;

		switch (name) {
			case 'donationAmount':
				if (_isEmpty(value) && value.match(isValidNumber)) {
					setAmount(
						formatAmount(parseFloat(value.replace(/,/g, '')))
					);
				}
			case 'noteToCharity':
				setNoteToCharity(value.trim());
				break;
			case 'noteToSelf':
				setNoteToSelf(value.trim());
			case 'inHonorOf':
			case 'inMemoryOf':
				// setValidity(
				// 	validateGiveForm(
				// 		'dedicateType',
				// 		null,
				// 		validity,
				// 		flowObject.giveData
				// 	)
				// );
				break;
		}
		const validitions = validateGiveForm(
			name,
			value,
			validity,
			flowObject.giveData
		);
		setValidity({
			...validitions,
		});
	};

	const handlePresetAmountClick = (event, data) => {
		const { value } = data;
		const validitions = validateDonationForm(
			'donationAmount',
			value,
			validity
		);
		setValidity({
			...validitions,
		});
		setAmount(formatAmount(parseFloat(value.replace(/,/g, ''))));
		setDisableButton(false);
	};

	const handleEditClick = () => {
		setShowEditModal(true);
		setLoader(true);
	};

	// handle close of edit monthly deposit modal
	const handleCloseModal = () => {
		setAmount(formatedCurrentMonthlyAllocAmount);
		setShowEditModal(false);
		setLoader(false);
	};

	// validating the form
	const validateForm = () => {
		let validation;
		validation = validateDonationForm('donationAmount', amount, validity);

		setValidity({
			...validation,
		});
		const validationsResponse = _every(validation);
		return validationsResponse;
	};
	//handling save button
	const handleEditSave = () => {
		setDisableButton(true);
		let privacyShareAdminName = false;
		let privacyShareEmail = false;
		let privacyShareAddress = false;
		let privacyShareName = true;
		if (giveToType !== 'Beneficiary') {
			if (defaultInfoToShare.value !== 'anonymous') {
				if (defaultInfoToShare.value === 'name') {
					privacyShareAdminName = true;
				} else if (defaultInfoToShare.value === 'name_email') {
					privacyShareAdminName = true;
					privacyShareEmail = true;
				} else if (
					defaultInfoToShare.value.includes('name_address_email')
				) {
					privacyShareAdminName = true;
					privacyShareEmail = true;
					privacyShareAddress = true;
				}
			}
		}

		if (
			!giveToType === 'Beneficiary' &&
			defautlDropDownValue.value !== 'anonymous'
		) {
			privacyShareName = true;
			privacyShareAdminName = true;
		} else {
			privacyShareName = false;
		}
		if (validateForm()) {
			dispatch(
				editUpcomingAllocation(
					transactionId,
					giveToType,
					amount,
					giftFreq,
					giveToType === 'Beneficiary'
						? defautlDropDownValue
						: defaultInfoToShare,
					defaultNameToShare,
					{
						privacyShareAdminName,
						privacyShareEmail,
						privacyShareAddress,
						privacyShareName,
						privacyShareAmount,
					},
					noteToSelf,
					noteToCharity,
					dedicateType,
					dedicateValue,
                    activePage
				)
			)
				.then((result) => {
					setShowEditModal(false);
				})
				.catch((error) => {
					setShowEditModal(true);
				});
		}
	};

	const handlegiftTypeButtonClick = (e, { value }) => {
		setGiftFreq({
			value,
		});
	};
	const handleSpecialInstructionInputChange = (event, data) => {
		const { value } = data;
		setDefaultDropDownValue(value);
		handleInputChange(event, data);
	};
	// Privacy section
	const privacyOptionComponent = (
		<PrivacyOptions
			displayName={currentUser.attributes.displayName}
			formatMessage={formatMessage}
			handleInputChange={handleInputChange}
			hasCampaign={false} // change later
			isCampaign={giveToType === 'Campaign'}
			giveFrom={flowObject.giveData.giveFrom}
			giveToType={giveToType}
			infoToShare={defaultInfoToShare}
			groupCampaignAdminShareInfoOptions={
				groupCampaignAdminShareInfoOptions
			}
			nameToShare={defaultNameToShare}
			privacyShareAmount={privacyShareAmount}
			privacyNameOptions={infoToShareList}
			preferences={preferences}
			userId={currentUser.id}
		/>
	);

	// Frequency section
	const renderRepeatGift = () => {
		let repeatGift = null;
		repeatGift = (
			<DonationFrequency
				isGiveFlow={true}
				formatMessage={formatMessage}
				giftType={giftFreq}
				handlegiftTypeButtonClick={handlegiftTypeButtonClick}
				handleInputChange={handleInputChange}
				language={language}
				isEditModal={true}
				// isCampaign={recipientName.incl}
			/>
		);
		return repeatGift;
	};
	const charityPrivacyComponent = () => {
		return (
			<Form.Field className="give_flow_field">
				<label htmlFor="infoToShare">
					{formatMessage('specialInstruction:infoToShareLabel')}
				</label>
				<Popup
					content={formatMessage(
						'specialInstruction:infotoSharePopup'
					)}
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
					className="infoToShareDropdown dropdownWithArrowParent icon"
					id="infoToShare"
					name="infoToShare"
					options={options}
					onChange={handleSpecialInstructionInputChange}
					value={defautlDropDownValue.value}
				/>
			</Form.Field>
		);
	};
	return (
		<Modal
			size="tiny"
			dimmer="inverted"
			className="chimp-modal editMonthlyModal"
			closeIcon
			onClose={() => handleCloseModal()}
			open={showEditModal}
			trigger={
				<Button
					className="blue-bordr-btn-round-def c-small"
					onClick={() => handleEditClick()}
				>
					Edit{' '}
				</Button>
			}
		>
			<Modal.Header> {recipientName} </Modal.Header>{' '}
			<Modal.Content>
				<Modal.Description>
					<Form>
						<DonationAmountField
							amount={amount}
							formatMessage={formatMessage}
							handleInputChange={handleInputChange}
							handleInputOnBlur={handleInputOnBlur}
							handlePresetAmountClick={handlePresetAmountClick}
							validity={validity}
						/>{' '}
						<Form.Field>
							<label htmlFor="giveFrom">
								{formatMessage('giveFromLabel')}
							</label>
							<Form.Field
								control={Input}
								id={'giveFrom'}
								name={'giveFrom'}
								maxLength="8"
								size="large"
								value={`${currentUser.attributes.displayName}'s Impact account: ${currentUser.attributes.balance}`}
								disabled
								className={`amountField`}
							/>
						</Form.Field>
						{renderRepeatGift()}{' '}
						{!_isEmpty(infoOptions) &&
							giveToType !== 'Beneficiary' &&
							privacyOptionComponent}
						{giveToType === 'Beneficiary' &&
							!_isEmpty(options) &&
							!_isEmpty(defautlDropDownValue) &&
							charityPrivacyComponent()}
						<Form.Field className="give_flow_field">
							<DedicateType
								handleInputChange={handleInputChange}
								handleInputOnBlur={handleInputOnBlur}
								dedicateType={dedicateType}
								dedicateValue={dedicateValue}
								validity={validity}
							/>{' '}
						</Form.Field>{' '}
						<Grid className="to_space">
							<Grid.Row className="to_space">
								<Grid.Column
									mobile={16}
									tablet={16}
									computer={16}
								>
									<NoteTo
										allocationType={
											giveToType === ' Beneficiary'
												? 'Charity'
												: giveToType
										}
										formatMessage={formatMessage}
										giveFrom={flowObject.giveData.giveFrom}
										noteToCharity={noteToCharity}
										handleInputChange={handleInputChange}
										handleInputOnBlur={handleInputOnBlur}
										noteToSelf={noteToSelf}
										validity={validity}
										isEditModal={true}
									/>{' '}
								</Grid.Column>{' '}
							</Grid.Row>{' '}
						</Grid>{' '}
					</Form>{' '}
				</Modal.Description>{' '}
				<div className="btn-wraper text-right">
					<Modal.Actions>
						<Button
							className="blue-btn-rounded-def"
							onClick={() => handleEditSave()}
							disabled={
								disableButton || !isValidGiftAmount(validity)
							}
						>
							Save{' '}
						</Button>{' '}
					</Modal.Actions>{' '}
				</div>{' '}
			</Modal.Content>{' '}
		</Modal>
	);
};

EditMonthlyAllocationModal.defaultProps = {
	currentMonthlyAllocAmount: '',
	activePage: '',
	t: () => {},
	transactionId: '',
};

export default withTranslation(['group', 'giveCommon'])(
	EditMonthlyAllocationModal
);
