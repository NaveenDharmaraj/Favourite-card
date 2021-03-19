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
import _head from 'lodash/head';
import _camelCase from 'lodash/camelCase';
import _replace from 'lodash/replace';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import '../../../static/less/giveFlows.less';
import DonationFrequency from '../DonationFrequency';
import DonationAmountField from '../DonationAmountField';
import PrivacyOptions from '../PrivacyOptions';
import NoteTo from '../NoteTo';
import {
	formatCurrency,
	formatAmount,
	isValidGiftAmount,
	validateDonationForm,
	validateGiveForm,
} from '../../../helpers/give/utils';
import {
	getCoverAmount,
} from '../../../actions/give';
import { populateDropdownInfoToShare } from '../../../helpers/users/utils';
import { editUpcomingAllocation, getUserFund } from '../../../actions/user';
import {
	getGroupCampaignAdminInfoToShare,
	getCharityInfoToShare,
} from '../../../actions/userProfile';

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
	noteToRecipientSaved,
	noteToSelfSaved,
	isCampaign,
	hasCampaign,
	dedicate
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
		isAmountCoverGive: true,
	};
	const formatedCurrentMonthlyAllocAmount = currentMonthlyAllocAmount.replace(
		'$',
		''
	);
	const commaFormattedAmount = formatAmount(parseFloat(formatedCurrentMonthlyAllocAmount.replace(/,/g, '')));
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.info);
	let {
		attributes: { preferences },
		id,
	} = currentUser;
	const fund = useSelector((state) => state.user.fund);
	const infoOptions = useSelector((state) => state.userProfile.infoOptions);
	const charityShareInfoOptions = useSelector(
		(state) => state.userProfile.charityShareInfoOptions
	);
	const coverAmountDisplay = useSelector((state) => state.give.coverAmountDisplay);
	const [infoToShareList, setInfoToShareList] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [
		groupCampaignAdminShareInfoOptions,
		setGroupCampaignAdminShareInfoOptions,
	] = useState([]);
	const [defautlDropDownValue, setDefaultDropDownValue] = useState({});
	const [options, setOptions] = useState([
		{
			text: 'Give anonymously',
			value: 'anonymous',
		},
	]);
	const [giftFreq, setGiftFreq] = useState(giftType);
	const [defaultInfoToShare, setDefaultInfoToShare] = useState();
	const [defaultNameToShare, setDefaultNameToShare] = useState();
	const [privacyShareAmount, setPrivacyShareAmount] = useState();
	// state for amount value in edit modal
	const [amount, setAmount] = useState(commaFormattedAmount);

	//state for format amount
	const [formattedAmount, setFormattedAmount] = useState(formatedCurrentMonthlyAllocAmount);
	// intializing validity for amount and payment
	const [validity, setValidity] = useState(intializeValidations);

	const [noteToCharity, setNoteToCharity] = useState(noteToRecipientSaved);
	const [noteToSelf, setNoteToSelf] = useState(noteToSelfSaved);
	const [dedicateValue, setDedicateValue] = useState();
	const [dedicateType, setDedicateType] = useState();
	const [coverFeeModal, setCoverFeeModel] = useState(false);
	//state for disable button
	const [disableButton, setDisableButton] = useState(true);
    const initialiseGroupShareOptions = () =>{
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
        const preferenceName = isCampaign
            ? 'campaign_admins_info_to_share'
            : 'giving_group_admins_info_to_share';
        const preference = preferences[preferenceName].includes('address')
            ? `${preferences[preferenceName]}-${preferences[`${preferenceName}_address`]
            }`
            : preferences[preferenceName];
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
    const initialiseCharityShareOptions = () =>{
        const { infoToShareList } = populateDropdownInfoToShare(
            charityShareInfoOptions
        );
        setOptions(infoToShareList);
        const name = 'charities_info_to_share';
        const preference = preferences[name].includes('address')
            ? `${preferences[name]}-${preferences[`${name}_address`]}`
            : preferences[name];
        let dD = infoToShareList.find((opt) => opt.value === preference);
        setDefaultDropDownValue({ ...dD });
    }
	useEffect(() => {
		if (showEditModal) {
			const commaFormattedAmount = formatAmount(parseFloat(formatedCurrentMonthlyAllocAmount.replace(/,/g, '')));
			const formatedAmount = _replace(formatCurrency(commaFormattedAmount, 'en', 'USD'), '$', '');
			setAmount(commaFormattedAmount);
			setFormattedAmount(formatedAmount);
            setNoteToCharity(noteToRecipientSaved);
	        setNoteToSelf(noteToSelfSaved);
            if(!_isEmpty(dedicate)){
                setDedicateValue(_head(Object.values(dedicate)));
                setDedicateType(_camelCase(_head(Object.keys(dedicate))));
            } else{
                setDedicateValue('');
                setDedicateType('');
            }            
            setGiftFreq(giftType);
			if (giveToType === 'Beneficiary') {
				if (_isEmpty(charityShareInfoOptions)) {
					dispatch(getCharityInfoToShare(id));
					if (_isEmpty(fund)) {
						getUserFund(dispatch, currentUser.id);
					}
				} else{
                    initialiseCharityShareOptions();
                }
			} else {
				if (_isEmpty(infoOptions)) {
					dispatch(getGroupCampaignAdminInfoToShare(id, false));
				} else{
                    initialiseGroupShareOptions();

                }
			}
		}
	}, [showEditModal]);
   

	useEffect(() => {
		if (
			!_isEmpty(infoOptions) &&
			!_isEmpty(currentUser) &&
			giveToType !== 'Beneficiary' && showEditModal
		) {
			initialiseGroupShareOptions()
		}
	}, [infoOptions]);
	useEffect(() => {
		if (
			giveToType === 'Beneficiary' &&
			!_isEmpty(charityShareInfoOptions)
		) {
			initialiseCharityShareOptions();
		}
	}, [charityShareInfoOptions]);
	// initializing the flow object for edit flow
	const flowObject = {
		giveData: {
			giveFrom: {
				type: 'user',
				value: !_isEmpty(fund) ? fund.id : undefined,
			},
			giveTo: {
				type: giveToType === 'Beneficiary' ? 'beneficiaries' : giveToType,
			},
			giftType: giftType,
            dedicateGift:{},
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
				case 'giveAmount':
					setAmount(value);
					setFormattedAmount(value);
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
		}
		setDisableButton(false);
	};

	const handleInputOnBlur = (event, data) => {
		event.preventDefault();
		const { name, value } = !_isEmpty(data) ? data : event.target;
		const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
		if (Number(flowObject.giveData.giveFrom.value) > 0 && Number(amount) > 0) {
			getCoverAmount(flowObject.giveData.giveFrom.value, amount, dispatch);
		} else {
			getCoverAmount(flowObject.giveData.giveFrom.value, 0, dispatch);
		}
		let validitions = validateGiveForm(
			name,
			value,
			validity,
			flowObject.giveData
		);
		switch (name) {
			case 'giveAmount':
				if (!_isEmpty(value) && value.match(isValidNumber)) {
					const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')))
					setFormattedAmount(_replace(formatCurrency(inputValue, 'en', 'USD'), '$', ''));
					setAmount(value);
					validitions = validateGiveForm(
						'giveAmount',
						inputValue,
						validity,
						flowObject.giveData
					);
				}
				break;
			case 'noteToCharity':
				setNoteToCharity(value.trim());
				break;
			case 'noteToSelf':
				setNoteToSelf(value.trim());
				break;
			case 'inHonorOf':
			case 'inMemoryOf':
                flowObject.giveData.dedicateGift.dedicateType = dedicateType;
                flowObject.giveData.dedicateGift.dedicateValue = dedicateValue;
				setValidity(
					validateGiveForm(
						'dedicateType',
						null,
						validity,
						flowObject.giveData
					)
				);
				break;
		}


		setValidity({
			...validitions,
		});
	};

	const handlePresetAmountClick = (event, data) => {
		const { value } = data;
		const validitions = validateGiveForm(
			'giveAmount',
			value,
			validity,
			flowObject.giveData
		);
		setValidity({
			...validitions,
		});
		if (Number(flowObject.giveData.giveFrom.value) > 0 && Number(amount) > 0) {
			getCoverAmount(flowObject.giveData.giveFrom.value, value, dispatch);
		} else {
			getCoverAmount(flowObject.giveData.giveFrom.value, 0, dispatch);
		}
		setAmount(value);
        setFormattedAmount(_replace(formatCurrency(value, 'en', 'USD'), '$', ''));
		setDisableButton(false);
	};

	const handleEditClick = () => {
		setShowEditModal(true);
	};

	// handle close of edit monthly deposit modal
	const handleCloseModal = () => {
		//setAmount(formatedCurrentMonthlyAllocAmount);
		setNoteToCharity(noteToCharity);
		setNoteToSelf(noteToSelf)
		if(!_isEmpty(dedicate)){
            setDedicateValue(_head(Object.values(dedicate)));
            setDedicateType(_camelCase(_head(Object.keys(dedicate))));
        } else{
            setDedicateValue('');
            setDedicateType('');
        }
		setShowEditModal(false);
		setValidity(intializeValidations);
	};

	// validating the form
	const validateForm = () => {
		let validation;
        flowObject.giveData.dedicateGift.dedicateType = dedicateType;
        flowObject.giveData.dedicateGift.dedicateValue = dedicateValue;
		validation = validateGiveForm('giveAmount', amount, validity, flowObject.giveData);
        validation = validateGiveForm('dedicateType', null, validity, flowObject.giveData);
        validation = validateGiveForm('noteToSelf', noteToSelf, validity, flowObject.giveData);
        validation = validateGiveForm('noteToCharity', noteToCharity, validity, flowObject.giveData);
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
					activePage,
					currentUser.id
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
		setDisableButton(false);
	};
	const handleSpecialInstructionInputChange = (event, data) => {
		const { value, options } = data;
		setDefaultDropDownValue(_find(options, (o) => o.value === value));
		setDisableButton(false);
	};
	// Privacy section
	const privacyOptionComponent = (
		<PrivacyOptions
			displayName={currentUser.attributes.displayName}
			formatMessage={formatMessage}
			handleInputChange={handleInputChange}
			hasCampaign={hasCampaign}
			isCampaign={isCampaign}
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
			className={
				coverFeeModal
					? `chimp-modal-hidden`
					: `chimp-modal editMonthlyModal`
			}
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
			<Modal.Header> {`Edit monthly gift to ${recipientName}`} </Modal.Header>{' '}
			<Modal.Content>
				<Modal.Description>
					<div className="flowFirst recurring_edit_modal">
						<Form>
							<DonationAmountField
								amount={formattedAmount}
								formatMessage={formatMessage}
								handleInputChange={handleInputChange}
								handleInputOnBlur={handleInputOnBlur}
								handlePresetAmountClick={
									handlePresetAmountClick
								}
								validity={validity}
								isGiveFlow={true}
								fromCharity={giveToType === 'Beneficiary'}
							/>{' '}
							{giveToType === 'Beneficiary' && (
								<p className="coverFeeLabel">
									{!_isEmpty(coverAmountDisplay) &&
										coverAmountDisplay > 0
										? formatMessage(
											'charity:coverFeeLabelWithAmount',
											{
												amount: formatCurrency(
													coverAmountDisplay,
													language,
													'USD'
												),
											}
										)
										: formatMessage('charity:coverFeeLabel')}
									<Modal
										size="tiny"
										dimmer="inverted"
										closeIcon
										className={`chimp-modal`}
										open={coverFeeModal}
										onClose={() => {
											setCoverFeeModel(false);
										}}
										trigger={
											<a
												onClick={() =>
													setCoverFeeModel(true)
												}
												className="link border bold"
											>
												&nbsp;
												{formatMessage(
												'charity:learnMore'
											)}
											</a>
										}
									>
										<Modal.Header>
											{formatMessage(
												'charity:coverFeeModalHeader'
											)}
										</Modal.Header>
										<Modal.Content className="pb-2">
											{formatMessage(
												'charity:coverFeeModalContentFirst'
											)}
											<br />
											<br />
											{formatMessage(
												'charity:coverFeeModalContentSecond'
											)}
											<br />
											<br />
										</Modal.Content>
									</Modal>
								</p>
							)}
							{renderRepeatGift()}{' '}
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
							{!_isEmpty(infoOptions) &&
								giveToType !== 'Beneficiary' &&
								privacyOptionComponent}
							{giveToType === 'Beneficiary' &&
								!_isEmpty(options) &&
								!_isEmpty(defautlDropDownValue) &&
								charityPrivacyComponent()}
							<Form.Field className="give_flow_field recurring_edit_gift ">
								<DedicateType
									handleInputChange={handleInputChange}
									handleInputOnBlur={handleInputOnBlur}
									dedicateType={dedicateType}
									dedicateValue={dedicateValue}
									validity={validity}
									isEditAlloc={true}
								/>
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
												giveToType === 'Beneficiary'
													? 'Charity'
													: isCampaign ? 'Campaign' : giveToType
											}
											formatMessage={formatMessage}
											giveFrom={
												flowObject.giveData.giveFrom
											}
											noteToCharity={noteToCharity}
											handleInputChange={
												handleInputChange
											}
											handleInputOnBlur={
												handleInputOnBlur
											}
											noteToSelf={noteToSelf}
											validity={validity}
											isEditModal={true}
										/>{' '}
									</Grid.Column>{' '}
								</Grid.Row>{' '}
							</Grid>{' '}
						</Form>{' '}
					</div>
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
	t: () => { },
	transactionId: '',
};

export default withTranslation(['group', 'giveCommon', 'charity'])(
	EditMonthlyAllocationModal
);
