/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import {
    useState, useEffect, Fragment,
} from 'react';
import {
    Button,
    Grid,
    Form,
    Input,
    Modal,
    Popup,
    Icon,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _trim from 'lodash/trim';
import _every from 'lodash/every';
import _replace from 'lodash/replace';
import _map from 'lodash/map';
import _flatMap from 'lodash/flatMap';
import _filter from 'lodash/filter';
import _split from 'lodash/split';
import {
    useDispatch, useSelector,
} from 'react-redux';
import dynamic from 'next/dynamic';

import { withTranslation } from '../../../i18n';
import '../../../static/less/giveFlows.less';
import DonationAmountField from '../DonationAmountField';
import {
    formatCurrency,
    formatAmount,
    isValidGiftAmount,
    calculateP2pTotalGiveAmount,
    validateGiveForm,
    getSelectedFriendList,
    populateFrequenyOptions,
} from '../../../helpers/give/utils';
import {
    parseEmails,
} from '../../../helpers/give/giving-form-validation';
import { dateFormatConverter } from '../../../helpers/utils';
import {
    getCoverAmount,
} from '../../../actions/give';
import {
    editUpcomingP2p,
    getFriendsList,
} from '../../../actions/user';
import { getEmailList } from '../../../actions/userProfile';
import Note from '../../shared/Note';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import P2pFrequency from '../Friend/p2pFrequency';
import ChimpDatePicker from '../Friend/p2pDatePicker';
import FriendsDropDown from '../../shared/FriendsDropDown';

// const ChimpDatePicker = dynamic(() => {import('../Friend/p2pDatePicker'), { ssr: false }});

const EditP2pAllocationModal = ({
    currentMonthlyAllocAmount,
    t,
    transactionId,
    activePage,
    recipientName,
    language,
    giveToType,
    noteToRecipientSaved,
    noteToSelfSaved,
    destinationDetails,
    reasonToGive,
    nextTransaction,
    giveFrequency,
    status,
}) => {
    const formatMessage = t;
    const intializeValidations = {
        // doesAmountExist: true,
        // isAmountLessThanOneBillion: true,
        // isAmountMoreThanOneDollor: true,
        // isNoteToRecipientsInLimit: true,
        // isNoteToSelfInLimit: true,
        // isValidDate: true,
        // isValidNoteSelfText: true,
        // isValidNoteToRecipients: true,
        // isValidNoteToSelf: true,
        // isValidPositiveNumber: true,
        doesAmountExist: true,
        isAmountCoverGive: true,
        isAmountLessThanOneBillion: true,
        isAmountMoreThanOneDollor: true,
        isNoteToCharityInLimit: true,
        isNoteToSelfInLimit: true,
        isNumberOfEmailsLessThanMax: true,
        isRecepientSelected: true,
        isRecipientHaveSenderEmail: true,
        isRecipientListUnique: true,
        isReloadRequired: true,
        isValidDate: true,
        isValidDecimalAmount: true,
        isValidEmailList: true,
        isValidGiveAmount: true,
        isValidGiveFrom: true,
        isValidNoteSelfText: true,
        isValidNoteToCharityText: true,
        isValidNoteToRecipients: true,
        isValidNoteToSelf: true,
        isValidPositiveNumber: true,
    };
    const formatedCurrentMonthlyAllocAmount = currentMonthlyAllocAmount.replace(
        '$',
        '',
    );
    const commaFormattedAmount = formatAmount(parseFloat(formatedCurrentMonthlyAllocAmount.replace(/,/g, '')));
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.info);
    const {
        attributes: { email },
        id,
    } = currentUser;
    const fund = useSelector((state) => state.user.fund);
    const friendListData = useSelector((state) => state.user.friendsList);
    const [
        showEditModal,
        setShowEditModal,
    ] = useState(false);

    // state for amount value in edit modal
    const [
        amount,
        setAmount,
    ] = useState(commaFormattedAmount);

    // state for format amount
    const [
        formattedAmount,
        setFormattedAmount,
    ] = useState(formatedCurrentMonthlyAllocAmount);
    // intializing validity for amount and payment
    const [
        validity,
        setValidity,
    ] = useState(intializeValidations);

    const [
        noteToRecipients,
        setNoteToRecipients,
    ] = useState(noteToRecipientSaved);
    const [
        noteToSelf,
        setNoteToSelf,
    ] = useState(noteToSelfSaved);

    // state for disable button
    const [
        disableButton,
        setDisableButton,
    ] = useState(true);
    const [
        sendGift,
        setSendGift,
    ] = useState('schedule');
    const [
        frequencyObject,
        setFrequencyObject,
    ] = useState({});
    const [
        sendDate,
        setSendDate,
    ] = useState('');
    const [
        reason,
        setReason,
    ] = useState('Birthday');
    const [
        reasonOther,
        setReasonOther,
    ] = useState('');
    const [
        showDropDown,
        setShowDropDown,
    ] = useState(true);
    const [
        friendsList,
        setFriendsList,
    ] = useState([]);
    const [
        showGiveToEmail,
        setShowGiveToEmail,
    ] = useState(false);
    const [
        recipients,
        setRecipients,
    ] = useState([]);
    const [
        totalP2pGiveAmount,
        setTotalP2pGiveAmount,
    ] = useState(0);
    const [
        chimpUsersNotFriends,
        setChimpUsersNotFriends,
    ] = useState([]);
    const emailDetailList = useSelector((state) => state.userProfile.emailDetailList);
    const allFriendsList = useSelector((state) => state.user.friendsList);

    function setValuesForRecipients() {
        // let emp
        const friendsIds = _map(friendListData, (f) => f.attributes.user_id);
        const chimpUsersNotFriendsEmail = _map(
            _filter(
                destinationDetails, (user) => user.receiverExists && !friendsIds.includes(user.receiver_id),
            ),
            'email',
        );
        const usersFriends = _map(
            _filter(
                destinationDetails, (user) => user.receiverExists && friendsIds.includes(user.receiver_id),
            ),
            'receiver_id',
        );
        setChimpUsersNotFriends(chimpUsersNotFriendsEmail);
        setRecipients([
            ..._map(_filter(destinationDetails, (u) => !u.receiverExists), 'email'),
            ...chimpUsersNotFriendsEmail,
        ]);
        setFriendsList([
            ...usersFriends,
        ]);
    }
    useEffect(() => {
        if (showEditModal) {
            const commaFormattedAmount = formatAmount(parseFloat(formatedCurrentMonthlyAllocAmount.replace(/,/g, '')));
            const formatedAmount = _replace(formatCurrency(commaFormattedAmount, 'en', 'USD'), '$', '');
            setAmount(commaFormattedAmount);
            setFormattedAmount(formatedAmount);
            setNoteToRecipients(noteToRecipientSaved);
            setNoteToSelf(noteToSelfSaved);
            setReason(reasonToGive);
            setFrequencyObject({
                options: populateFrequenyOptions(new Date(nextTransaction), t),
                value: giveFrequency,
            });
            setSendDate(new Date(nextTransaction));
            setTotalP2pGiveAmount(calculateP2pTotalGiveAmount(destinationDetails.length, formatedCurrentMonthlyAllocAmount));
            if (_isEmpty(emailDetailList)) {
                getEmailList(dispatch, id);
            }
            if (_isEmpty(friendListData)) {
                dispatch(getFriendsList(email));
            } else {
                console.log('executed from popup useEffect', 'recipients ---->', recipients, 'friendsList---->', friendsList);
                setValuesForRecipients();
            }
        }
    }, [
        showEditModal,
    ]);
    useEffect(() => {
        if (!_isEmpty(friendListData) && chimpUsersNotFriends.length === 0 && showEditModal) {
            console.log('executed from friendsApi useEffect', 'recipients ---->', recipients, 'friendsList---->', friendsList);

            setValuesForRecipients();
        }
    }, [
        friendListData,
    ]);
    const handleDateChange = (date) => {
        try {
            const convertIncomingDate = new Date(date) && dateFormatConverter(new Date(date), '-');
            const currentDate = dateFormatConverter(new Date(), '-');
            const checkCurrentDate = new Date(convertIncomingDate) >= new Date(currentDate);
            if (checkCurrentDate) {
                const frequencyOptions = populateFrequenyOptions(new Date(date), t);
                setFrequencyObject({
                    ...frequencyObject,
                    options: frequencyOptions,
                });
                setSendDate(new Date(date));
                setValidity({
                    ...validity,
                    isValidDate: true,
                });
                setDisableButton(false);
            } else {
                setValidity({
                    ...validity,
                    isValidDate: false,
                });
            }
        } catch (err) {
            // handle error
        }
    };

    const handleSendMoneyInputChange = (event, data) => {
        const {
            name,
            value,
        } = data || event.target;
        if (name === 'sendGift') {
            // setSendGift(value);
            // if (value === 'now') {
            //     setFrequencyObject({});
            //     setSendDate(null);
            //     // validity.isValidDate = true;
            // } else {
            //     setSendDate(new Date());
            //     setFrequencyObject({
            //         options: populateFrequenyOptions(new Date()),
            //         value: 'once',
            //     });
            // }
        } else if (name === 'frequency') {
            setFrequencyObject({
                ...frequencyObject,
                value,
            });
        } else if (name === 'reason' || name === 'reasonOther') {
            setReason(name === 'reason' ? value : 'Other');
            setReasonOther(name === 'reason' ? null : value);
        }
        setDisableButton(false);
    };
    // initializing the flow object for edit flow
    const flowObject = {
        giveData: {
            giftType: {
                value: 0,
            },
            giveFrom: {
                type: 'user',
                value: !_isEmpty(fund) ? fund.id : undefined,
            },
            giveTo: {
                type: giveToType === 'Beneficiary' ? 'beneficiaries' : giveToType,
            },


        },
        type: 'allocations',
    };
    const parseRecipients = (recipients) => (_trim(recipients).length > 0
        ? _split(recipients, ',')
        : []);

    const handleInputChange = (event, data) => {
        const {
            name, options, value, newIndex,
        } = data;
        let newValue = !_isEmpty(options)
            ? _find(options, {
                value,
            })
            : value;
        const coverFeesAmount = 0;
        newValue = (name !== 'friendsList' && !_isEmpty(options)) ? _find(options, { value }) : value;
        switch (name) {
            case 'giveAmount':
                setAmount(value);
                setFormattedAmount(value);
                break;
            case 'noteToRecipients':
                setNoteToRecipients(newValue);
                break;
            case 'noteToSelf':
                setNoteToSelf(newValue);
                break;
            case 'recipients':
                setRecipients(parseRecipients(newValue));
                setTotalP2pGiveAmount(calculateP2pTotalGiveAmount((friendsList.length + recipients.length), amount));
                if (_isEmpty(parseRecipients) && _isEmpty(newValue)) {
                    flowObject.giveData.friendsList = friendsList;
                    const validations = validateGiveForm(
                        'recipients',
                        [],
                        validity,
                        flowObject.giveData,
                        coverFeesAmount,
                        email,
                    );
                    validations.isValidEmailList = true;
                    setValidity(validations);
                }
                break;
            case 'friendsList':
                setFriendsList(newValue);
                flowObject.giveData.friendsList = friendsList;
                setTotalP2pGiveAmount(calculateP2pTotalGiveAmount((friendsList.length + recipients.length), amount));
                setValidity(validateGiveForm(
                    'recipients',
                    recipients,
                    validity,
                    flowObject.giveData,
                    coverFeesAmount,
                    email,
                ));
                break;
            default: break;
        }
        setDisableButton(false);
    };

    const handleInputOnBlur = (event, data) => {
        event.preventDefault();
        const {
            name, value,
        } = !_isEmpty(data) ? data : event.target;
        const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
        const userEmailList = [];
        if (!_isEmpty(emailDetailList)) {
            emailDetailList.map((d) => {
                userEmailList.push(d.attributes.email);
            });
        }
        const coverFeesAmount = 0;
        flowObject.giveData.friendsList = friendsList;
        let validitions = validateGiveForm(
            name,
            value,
            validity,
            flowObject.giveData,
            userEmailList,
        );
        switch (name) {
            case 'giveAmount':
                if (!_isEmpty(value) && value.match(isValidNumber)) {
                    const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
                    setFormattedAmount(_replace(formatCurrency(inputValue, 'en', 'USD'), '$', ''));
                    setAmount(value);
                    validitions = validateGiveForm(
                        'giveAmount',
                        inputValue,
                        validity,
                        flowObject.giveData,
                    );
                    if (Number(flowObject.giveData.giveFrom.value) > 0 && Number(amount) > 0) {
                        getCoverAmount(flowObject.giveData.giveFrom.value, amount, dispatch);
                    } else {
                        getCoverAmount(flowObject.giveData.giveFrom.value, 0, dispatch);
                    }
                }
                break;
            case 'noteToRecipients':
                setNoteToRecipients(value.trim());
                break;
            case 'noteToSelf':
                setNoteToSelf(value.trim());
                break;
            case 'recipients':
                validitions = validateGiveForm(
                    'recipients',
                    recipients,
                    validity,
                    flowObject.giveData,
                    coverFeesAmount,
                    userEmailList,
                );
                break;
            default: break;
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
            flowObject.giveData,
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
        // setAmount(formatedCurrentMonthlyAllocAmount);
        setNoteToRecipients(noteToRecipients);
        setNoteToSelf(noteToSelf);
        // setRecipients([]);
        setShowEditModal(false);
        setValidity(intializeValidations);
    };

    // validating the form
    const validateForm = () => {
        let validation;
        validation = validateGiveForm('giveAmount', amount, validity, flowObject.giveData);
        validation = validateGiveForm('noteToSelf', noteToSelf, validity, flowObject.giveData);
        validation = validateGiveForm('noteToRecipients', noteToRecipients, validity, flowObject.giveData);
        setValidity({
            ...validation,
        });
        const validationsResponse = _every(validation);
        return validationsResponse;
    };
    // handling save button
    const handleEditSave = () => {
        setDisableButton(true);
        if (validateForm()) {
            const selectedFriendsEmail = _map(getSelectedFriendList(allFriendsList, friendsList), 'email');
            const rescipientList = parseEmails([
                ...recipients,
                ...selectedFriendsEmail,
            ]);
            dispatch(
                editUpcomingP2p(
                    transactionId,
                    amount,
                    reason,
                    rescipientList,
                    sendDate,
                    frequencyObject.value,
                    noteToRecipients,
                    noteToSelf,
                    activePage,
                    currentUser.id,
                ),
            )
                .then((result) => {
                    setShowEditModal(false);
                })
                .catch((error) => {
                    setShowEditModal(true);
                });
        }
    };
    return (
        <Modal
            size="tiny"
            dimmer="inverted"
            className="chimp-modal editMonthlyModal"
            closeIcon
            onClose={() => handleCloseModal()}
            open={showEditModal}
            trigger={(
                <Button
                    className="blue-bordr-btn-round-def c-small"
                    onClick={() => handleEditClick()}
                    // disabled={status !== 'active'}
                >
                    Edit
                </Button>
            )}
        >
            <Modal.Header>
                {`Edit`}
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <div className="flowFirst recurring_edit_modal recurring_p2p_edit_modal">
                        <Form>
                            <Fragment>
                                <Grid.Column className="friends-error" mobile={16} tablet={12} computer={10}>
                                    <label htmlFor="recipients">
                                        {formatMessage('friends:recipientsLabel')}
                                    </label>
                                    <Popup
                                        content={formatMessage('friends:recipientsPopup')}
                                        position="top center"
                                        trigger={(
                                            <Icon
                                                color="blue"
                                                name="question circle"
                                                size="large"
                                            />
                                        )}
                                    />
                                    {showDropDown
                                        && (
                                            <FriendsDropDown
                                                handleOnInputBlur={handleInputOnBlur}
                                                handleOnInputChange={handleInputChange}
                                                values={friendsList}
                                            />
                                        )
                                    }
                                    {!showDropDown
                                        && (
                                            <div className="disabled-giveto">
                                                <Form.Field>
                                                    <Form.Field
                                                        control={Input}
                                                        disabled
                                                        id="recipientName"
                                                        maxLength="20"
                                                        name="recipientName"
                                                        size="large"
                                                        placeholder="You're not connected to friends on Charitable Impact yet"
                                                    />
                                                </Form.Field>
                                                <span className="givetoInfoText">You can find friends to give to on Charitable Impact under your profile.</span>
                                            </div>
                                        )
                                    }
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={16} computer={16}>
                                    {showDropDown
                                        && (
                                            <p>
                                                <a className="giveToEmailsText" onClick={() => { setShowGiveToEmail(!showGiveToEmail); }}>
                                                    {formatMessage('friends:giveToEmailsText')}
                                                </a>
                                            </p>
                                        )
                                    }
                                    {(showGiveToEmail || !_isEmpty(recipients) || (typeof showDropDown !== 'undefined' && !showDropDown))
                                        && (
                                            <Note
                                                enableCharacterCount={false}
                                                fieldName="recipients"
                                                formatMessage={formatMessage}
                                                handleOnInputChange={handleInputChange}
                                                handleOnInputBlur={handleInputOnBlur}
                                                labelText={formatMessage('friends:recipientsLabel')}
                                                popupText={formatMessage('friends:recipientsPopup')}
                                                placeholderText={formatMessage('friends:recipientsPlaceholderText')}
                                                text={recipients.join(',')}
                                                hideLabel
                                            />
                                        )}
                                    <FormValidationErrorMessage
                                        condition={!validity.isValidEmailList}
                                        errorMessage={formatMessage('friends:invalidEmailError')}
                                    />
                                    <FormValidationErrorMessage
                                        condition={!validity.isRecipientListUnique}
                                        errorMessage={formatMessage('friends:duplicateEmail')}
                                    />
                                    <FormValidationErrorMessage
                                        condition={!validity.isRecipientHaveSenderEmail}
                                        errorMessage={formatMessage('friends:haveSenderEmail')}
                                    />
                                    <FormValidationErrorMessage
                                        condition={!validity.isNumberOfEmailsLessThanMax}
                                        errorMessage={formatMessage('friends:maxEmail')}
                                    />
                                    <FormValidationErrorMessage
                                        condition={showDropDown && !validity.isRecepientSelected}
                                        errorMessage={formatMessage('friends:userWithFriendsError')}
                                    />
                                    <FormValidationErrorMessage
                                        condition={!showDropDown && !validity.isRecepientSelected}
                                        errorMessage={formatMessage('friends:userWithoutFriendsError')}
                                    />
                                </Grid.Column>
                            </Fragment>
                            <DonationAmountField
                                amount={formattedAmount}
                                formatMessage={formatMessage}
                                handleInputChange={handleInputChange}
                                handleInputOnBlur={handleInputOnBlur}
                                handlePresetAmountClick={
                                    handlePresetAmountClick
                                }
                                validity={validity}
                                isGiveFlow
                                fromCharity={giveToType === 'Beneficiary'}
                            />
                            <p className="multipleFriendAmountFieldText">
                                {formatMessage('friends:multipleFriendAmountFieldText')}
                            </p>
                            <div className="p2pCalenderWrapper">
                                {/* <div className="p2p_gift">
                                    <label className="label_gift">When would you like to send this gift?</label>
                                    <Form.Field className="radio_btn">
                                        <Radio
                                            label="Send now"
                                            name="sendGift"
                                            className="checkbox chimpRadio"
                                            value="now"
                                            onChange={handleSendMoneyInputChange}
                                            checked={sendGift === 'now'}
                                        />
                                    </Form.Field>
                                    <Form.Field className="radio_btn">
                                        <Radio
                                            label="Schedule gift"
                                            name="sendGift"
                                            className="checkbox chimpRadio"
                                            value="schedule"
                                            onChange={handleSendMoneyInputChange}
                                            checked={sendGift === 'schedule'}
                                        />
                                    </Form.Field>

                                </div> */}
                                {sendGift === 'schedule' && (
                                    <Fragment>
                                        <div className="Send_date">
                                            <label className="label_gift">Send date</label>
                                            <ChimpDatePicker
                                                dateValue={sendDate}
                                                onChangeValue={(date) => handleDateChange(date)}
                                            />
                                        </div>
                                        {!validity.isValidDate && (
                                            <FormValidationErrorMessage
                                                condition={!validity.isValidDate}
                                                errorMessage="Select a date to send your gift."
                                            />
                                        )
                                        }
                                        <div>
                                            <P2pFrequency
                                                frequencyObject={frequencyObject}
                                                handleSendMoneyInputChange={handleSendMoneyInputChange}
                                            />
                                        </div>
                                    </Fragment>
                                )
                                }
                                {/* <div>
                                    <P2pReasons
                                        reason={reason}
                                        reasonOther={reasonOther}
                                        handleSendMoneyInputChange={handleSendMoneyInputChange}
                                    />
                                </div> */}
                            </div>
                            <Form.Field>
                                <label htmlFor="giveFrom">
                                    {formatMessage('dropDownAccountOptions:giveFromLabel')}
                                </label>
                                <Form.Field
                                    control={Input}
                                    id="giveFrom"
                                    name="giveFrom"
                                    maxLength="8"
                                    size="large"
                                    value={`${currentUser.attributes.displayName}'s Impact account: ${currentUser.attributes.balance}`}
                                    disabled
                                    className="amountField"
                                />
                            </Form.Field>
                            <Grid className="to_space">
                                <Grid.Row className="to_space">
                                    <Grid.Column mobile={16} tablet={16} computer={16}>
                                        <div className="give_flow_field">
                                            <Note
                                                fieldName="noteToRecipients"
                                                formatMessage={formatMessage}
                                                handleOnInputChange={handleInputChange}
                                                handleOnInputBlur={handleInputOnBlur}
                                                labelText={formatMessage('friends:noteToRecipientsLabel')}
                                                popupText={formatMessage('friends:noteToRecipientsPopup')}
                                                placeholderText={formatMessage('friends:noteToRecipientsPlaceholderText')}
                                                text={noteToRecipients}
                                                fromP2P
                                            />
                                        </div>
                                        <div className="give_flow_field">
                                            {(flowObject.giveData.giveFrom.type === 'groups' || flowObject.giveData.giveFrom.type === 'user') && (
                                                <Note
                                                    fieldName="noteToSelf"
                                                    formatMessage={formatMessage}
                                                    handleOnInputChange={handleInputChange}
                                                    handleOnInputBlur={handleInputOnBlur}
                                                    labelText={formatMessage(`friends:noteToSelfLabel${flowObject.giveData.giveFrom.type}`)}
                                                    popupText={formatMessage(`friends:noteToSelfPopup${flowObject.giveData.giveFrom.type}`)}
                                                    placeholderText={formatMessage(`friends:noteToSelfPlaceholderText${flowObject.giveData.giveFrom.type}`)}
                                                    text={noteToSelf}
                                                />
                                            )}
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>
                        {' '}
                    </div>
                </Modal.Description>
                {' '}
                <div className="btn-wraper text-right">
                    <Modal.Actions>
                        <Button
                            className="blue-btn-rounded-def"
                            onClick={() => handleEditSave()}
                            disabled={
                                disableButton || !isValidGiftAmount(validity)
                            }
                        >
							Save
                            {' '}
                        </Button>
                        {' '}
                    </Modal.Actions>
                    {' '}
                </div>
                {' '}
            </Modal.Content>
            {' '}
        </Modal>
    );
};

EditP2pAllocationModal.defaultProps = {
    activePage: '',
    currentMonthlyAllocAmount: '',
    destinationDetails: [],
    t: () => { },
    transactionId: '',
};

export default withTranslation([
    'giveCommon',
    'friends',
    'accountTopUp',
    'dropDownAccountOptions',
    'noteTo',
])(
    EditP2pAllocationModal,
);
