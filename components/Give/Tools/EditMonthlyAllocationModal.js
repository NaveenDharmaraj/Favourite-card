import { useState, useEffect } from 'react';
import { Button, Grid, Form, Input, Modal } from 'semantic-ui-react';
import { withTranslation } from '../../../i18n';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
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
	populatePaymentInstrument,
	validateDonationForm,
    validateGiveForm,
} from '../../../helpers/give/utils';
import { getAllActivePaymentInstruments } from '../../../actions/give';
import { populateDropdownInfoToShare } from '../../../helpers/users/utils';
import { editUpcommingDeposit } from '../../../actions/user';
import { getGroupCampaignAdminInfoToShare } from '../../../actions/userProfile';

const DedicateType = dynamic(() => import('../DedicateGift'), {
	ssr: false,
});

const EditMonthlyAllocationModal = ({
	currentMonthlyAllocAmount,
	t,
	paymentInstrumentId,
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
	const [infoToShareList, setInfoToShareList] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [
		groupCampaignAdminShareInfoOptions,
		setGroupCampaignAdminShareInfoOptions,
	] = useState([]);
	const [giftFreq, setGiftFreq] = useState(giftType);
	useEffect(() => {
		if (showEditModal) {
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
	}, [showEditModal]);
	const [defaultInfoToShare, setDefaultInfoToShare] = useState();
	const [defaultNameToShare, setDefaultNameToShare] = useState();
	const [privacyShareAmount, setPrivacyShareAmount] = useState();
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

	// state for amount value in edit modal
	const [amount, setAmount] = useState(formatedCurrentMonthlyAllocAmount);

	// initializing payment options with empty array
	const [paymentInstrumenOptions, setPaymentInstrumenOptions] = useState([]);

	// intializing validity for amount and payment
	const [validity, setValidity] = useState(intializeValidations);

	// state for payment option
	const [loader, setLoader] = useState(true);

	// state for current card select
	const [currentCardSelected, setCurrentCardSelected] = useState(
		paymentInstrumentId
	);

	const [noteToCharity, setNoteToCharity] = useState(notetoRecipient);
	const [noteToSelf, setNoteToSelf] = useState('');

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
			dedicateGift: {
				dedicateType: '',
				dedicateValue: '',
			},
		},
		type: 'donations',
	};

	const handleInputChange = (event, data) => {
		const { name, options, value } = data;
		let newValue = !_isEmpty(options)
			? _find(options, {
					value,
			  })
			: value;
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
			case 'noteToCharity':
				setNoteToCharity(newValue);
			case 'inHonorOf':
			case 'inMemoryOf':
				setValidity(
					validateGiveForm('dedicateType', null, validity, giveData)
				);
				break;
		}
		setDisableButton(false);
	};

	const handleInputOnBlur = (event, data) => {
		event.preventDefault();
		const { name, value } = !_isEmpty(data) ? data : event.target;
		const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
		if (
			name === 'donationAmount' &&
			!_isEmpty(value) &&
			value.match(isValidNumber)
		) {
			setAmount(formatAmount(parseFloat(value.replace(/,/g, ''))));
		}
		const validitions = validateDonationForm(name, value, validity);
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
		getAllActivePaymentInstruments(currentUser.id, dispatch, 'user')
			.then(({ data }) => {
				setPaymentInstrumenOptions(
					populatePaymentInstrument(data, formatMessage)
				);
				setLoader(false);
			})
			.catch(() => {
				// handle Error
				setLoader(false);
			});
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
		validation = validateDonationForm(
			'creditCard',
			{
				value: currentCardSelected,
			},
			validity
		);
		setValidity({
			...validation,
		});
		const validationsResponse = _every(validation);
		return validationsResponse;
	};
	//handling save button
	const handleEditSave = () => {
		setDisableButton(true);
		if (validateForm()) {
			return dispatch(
				editUpcommingDeposit(
					transactionId,
					amount,
					currentCardSelected,
					activePage,
					currentUser.id
				)
			)
				.then(() => {
					setShowEditModal(false);
					setAmount(
						formatAmount(parseFloat(amount.replace(/,/g, '')))
					);
					setCurrentCardSelected(currentCardSelected);
				})
				.catch(() => {
					setShowEditModal(true);
				});
		}
	};

	const handlegiftTypeButtonClick = (e, { value }) => {
		setGiftFreq({
			value,
		});
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
						{renderRepeatGift()}{' '}
						{!_isEmpty(infoOptions) && privacyOptionComponent}{' '}
						<Form.Field className="give_flow_field">
							<DedicateType
								handleInputChange={handleInputChange}
								handleInputOnBlur={handleInputOnBlur}
								dedicateType={
									flowObject.giveData.dedicateGift
										.dedicateType
								}
								dedicateValue={
									flowObject.giveData.dedicateGift
										.dedicateValue
								}
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
										allocationType={giveToType}
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
	paymentInstrumentId: '',
	transactionId: '',
};

export default withTranslation(['donation', 'giveCommon'])(
	EditMonthlyAllocationModal
);
