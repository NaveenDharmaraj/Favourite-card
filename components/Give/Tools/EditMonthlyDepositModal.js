import { useState, useEffect } from "react";
import { Button, Dropdown, Form, Input, Modal } from "semantic-ui-react";
import { withTranslation } from '../../../i18n';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _every from 'lodash/every';
import _replace from 'lodash/replace';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic';

import DonationAmountField from "../DonationAmountField";
import PaymentOptions from '../../shared/PaymentInstruments';
import { formatAmount, formatCurrency, isValidGiftAmount, populatePaymentInstrument, validateDonationForm } from "../../../helpers/give/utils";
import { getAllActivePaymentInstruments } from '../../../actions/give';
import { findItemBasedOnId } from "../../../helpers/utils";
import { editUpcommingDeposit } from '../../../actions/user';

const NewCreditCard = dynamic(() => import('../../shared/NewCreditCard'), {
    ssr: false
});
const EditMonthlyDepositModal = ({ currentMonthlyDepositAmount, t, paymentInstrumentId, transactionId, activePage }) => {
    const formatMessage = t;
    const intializeValidations = {
        doesAmountExist: true,
        isAmountLessThanOneBillion: true,
        isAmountMoreThanOneDollor: true,
        isValidPositiveNumber: true,
        isCreditCardSelected: true,
    };
    const formatedCurrentMonthlyDepositAmount = currentMonthlyDepositAmount.replace('$', '');
    const commaFormattedAmount = formatAmount(parseFloat(formatedCurrentMonthlyDepositAmount.replace(/,/g, '')));
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.info);

    // boolean for showing edit monthly modal
    const [showEditModal, setShowEditModal] = useState(false);

    // state for amount value in edit modal
    const [amount, setAmount] = useState(commaFormattedAmount);

    //state for formatting currency
    const [formattedAmount, setFormattedAmount] = useState(formatedCurrentMonthlyDepositAmount)
    // initializing payment options with empty array
    const [paymentInstrumenOptions, setPaymentInstrumenOptions] = useState([]);

    // intializing validity for amount and payment
    const [validity, setValidity] = useState(intializeValidations);

    // state for payment option
    const [loader, setLoader] = useState(true);

    // state for current card select 
    const [currentCardSelected, setCurrentCardSelected] = useState(paymentInstrumentId);

    // boolean for showing add new credit card modal
    const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);

    //state for disable button
    const [disableButton, setDisableButton] = useState(true);

    // initializing the flow object for edit flow
    const flowObject = {
        giveData: {
            giveFrom: {},
            giveTo: {
                id: currentUser.id,
                type: 'user'
            },
        },
        type: 'donations'
    };
    useEffect(() => {
        // manually calling the stripe since we are not using layout component 
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        document.body.appendChild(script);
        setValidity(intializeValidations);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        const commaFormattedAmount = formatAmount(parseFloat(formatedCurrentMonthlyDepositAmount.replace(/,/g, '')));
        const formatedAmount = _replace(formatCurrency(commaFormattedAmount, 'en', 'USD'), '$', '');
        setAmount(commaFormattedAmount);
        setFormattedAmount(formatedAmount);
        setCurrentCardSelected(paymentInstrumentId);
    }, [currentMonthlyDepositAmount, paymentInstrumentId]);
    const handleInputChange = (event, data) => {
        const {
            name,
            options,
            value,
        } = data;
        let newValue = (!_isEmpty(options)) ? _find(options, { value }) : value;
        switch (name) {
            case 'donationAmount':
                setAmount(value);
                setFormattedAmount(value);
                break;
            case 'creditCard':
                setCurrentCardSelected(value);
                if (newValue.value === 0) {
                    setIsCreditCardModalOpen(true);
                }
        }
        setDisableButton(false);
    };

    const handleInputOnBlur = (event, data) => {
        event.preventDefault();
        const {
            name,
            value,
        } = !_isEmpty(data) ? data : event.target;
        const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
        let inputValue = value;
        if (!_isEmpty(value) && value.match(isValidNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')))
            setFormattedAmount(_replace(formatCurrency(inputValue, 'en', 'USD'), '$', ''));
            setAmount(value);
        }
        const validitions = validateDonationForm(name, inputValue, validity)
        setValidity({ ...validitions });
    };

    const handlePresetAmountClick = (event, data) => {
        const {
            value,
        } = data;
        const validitions = validateDonationForm('donationAmount', value, validity)
        setValidity({ ...validitions });
        setAmount(value);
        setFormattedAmount(_replace(formatCurrency(value, 'en', 'USD'), '$', ''));
        setDisableButton(false);
    }

    const handleEditClick = () => {
        setShowEditModal(true);
        setLoader(true)
        getAllActivePaymentInstruments(currentUser.id, dispatch, 'user')
            .then(({ data }) => {
                setPaymentInstrumenOptions(populatePaymentInstrument(data, formatMessage));
                setLoader(false)
            })
            .catch(() => {
                // handle Error
                setLoader(false);
            })
    }

    // handle close of edit monthly deposit modal
    const handleCloseModal = () => {
        setAmount(formatedCurrentMonthlyDepositAmount);
        setShowEditModal(false);
        setLoader(false);
        setValidity(intializeValidations);
    }

    // validating the form
    const validateForm = () => {
        let validation;
        validation = validateDonationForm('donationAmount', amount, validity);
        validation = validateDonationForm('creditCard', { value: currentCardSelected }, validity);
        setValidity({ ...validation });
        const validationsResponse = _every(validation);
        return validationsResponse;
    }
    //handling save button 
    const handleEditSave = () => {
        setDisableButton(true);
        if (validateForm()) {
            return dispatch(editUpcommingDeposit(transactionId, amount, currentCardSelected, activePage, currentUser.id))
                .then(() => {
                    setShowEditModal(false);
                    //setAmount(formatAmount(parseFloat(amount.replace(/,/g, ''))));
                    //setCurrentCardSelected(currentCardSelected);
                }).catch(() => {
                    setShowEditModal(true);
                })
        }
    }

    /**
     * handling credit card modal close .
     * @param {boolean} callPaymentInstrumentListApi On succes of adding new credit card call PaymentInstrumentListApi.
     * @param {string} id newly created credit card id.
     * @returns {void} .
     */
    const handleCreditCardModal = (callPaymentInstrumentListApi = false, id = "") => {
        setIsCreditCardModalOpen(false);
        setShowEditModal(true);
        setCurrentCardSelected(paymentInstrumentId);
        if (callPaymentInstrumentListApi) {
            setLoader(true);
            getAllActivePaymentInstruments(currentUser.id, dispatch, 'user')
                .then(({ data }) => {
                    setPaymentInstrumenOptions(populatePaymentInstrument(data, formatMessage));
                    setLoader(false);
                    setCurrentCardSelected(id);
                })
                .catch(() => {
                    // handle Error
                    setLoader(false);
                })
        }
    }
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
                    className='blue-bordr-btn-round-def c-small'
                    onClick={() => handleEditClick()}
                >
                    Edit
                    </Button>
            }
        >
            <Modal.Header className="monthly_deposit_heading">Edit monthly deposit    </Modal.Header>
            <Modal.Content className="Modal_monthly_deposit">
                <Modal.Description>
                    <Form>
                        <DonationAmountField
                            amount={formattedAmount}
                            formatMessage={formatMessage}
                            handleInputChange={handleInputChange}
                            handleInputOnBlur={handleInputOnBlur}
                            handlePresetAmountClick={handlePresetAmountClick}
                            validity={validity}
                        />
                        <PaymentOptions
                            creditCard={findItemBasedOnId(paymentInstrumenOptions, currentCardSelected)}
                            giveTo={{ value: currentCardSelected }}
                            handleAddNewButtonClicked={() => { }}
                            handleInputChange={handleInputChange}
                            disableField={loader}
                            formatMessage={formatMessage}
                            options={paymentInstrumenOptions}
                            validity={validity}
                            fromEdit={true}
                        />
                        {isCreditCardModalOpen &&
                            <NewCreditCard
                                handleCreditCardModal={handleCreditCardModal}
                                isCreditCardModalOpen={isCreditCardModalOpen}
                                setIsCreditCardModalOpen={setIsCreditCardModalOpen}
                                paymentInstrumenOptions={paymentInstrumenOptions}
                                flowObject={flowObject}
                                dispatch={dispatch}
                            />
                        }
                    </Form>
                </Modal.Description>
                <div className="btn-wraper text-right">
                    <Modal.Actions>
                        <Button
                            className="blue-btn-rounded-def"
                            onClick={() => handleEditSave()}
                            disabled={disableButton || !isValidGiftAmount(validity)}
                        >
                            Save
                            </Button>
                    </Modal.Actions>
                </div>
            </Modal.Content>
        </Modal>
    );
};


EditMonthlyDepositModal.defaultProps = {
    currentMonthlyDepositAmount: '',
    activePage: '',
    t: () => { },
    paymentInstrumentId: '',
    transactionId: ''
};

export default withTranslation(['donation', 'giveCommon'])(EditMonthlyDepositModal);
