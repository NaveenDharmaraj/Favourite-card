import { useState, useEffect } from "react";
import { Button, Dropdown, Form, Input, Modal } from "semantic-ui-react";
import { withTranslation } from '../../../i18n';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic';

import DonationAmountField from "../DonationAmountField";
import PaymentOptions from '../../shared/PaymentInstruments';
import { formatAmount, populatePaymentInstrument, validateDonationForm } from "../../../helpers/give/utils";
import { getAllActivePaymentInstruments } from '../../../actions/give';
import { findItemBasedOnId } from "../../../helpers/utils";

const NewCreditCard = dynamic(() => import('../../shared/NewCreditCard'), {
    ssr: false
});
const EditMonthlyDepositModal = ({ currentMonthlyDepositAmount, t, paymentInstrumentId }) => {
    const formatMessage = t;
    const intializeValidations = {
        doesAmountExist: true,
        isAmountLessThanOneBillion: true,
        isAmountMoreThanOneDollor: true,
        isValidPositiveNumber: true,
        isCreditCardSelected: true,
    };
    const formatedCurrentMonthlyDepositAmount = currentMonthlyDepositAmount.replace('$', '');

    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.info);

    // boolean for showing edit monthly modal
    const [showEditModal, setShowEditModal] = useState(false);

    // intializing the default amount value in edit modal
    const [amount, setAmount] = useState(formatedCurrentMonthlyDepositAmount);

    // initializing payment options with empty array
    const [paymentInstrumenOptions, setPaymentInstrumenOptions] = useState([]);

    // intializing validity for amount and payment
    const [validity, setValidity] = useState(intializeValidations);

    // intializing loader for payment option to be fetched
    const [loader, setLoader] = useState(true);

    // intializing the default credit card to be selected
    const [currentCardSelected, setCurrentCardSelected] = useState(paymentInstrumentId);

    // boolean for showing add new credit card modal
    const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);

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

        return () => {
            document.body.removeChild(script);
        }
    }, []);
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
                break;
            case 'creditCard':
                setCurrentCardSelected(value);
                if (newValue.value === 0) {
                    setIsCreditCardModalOpen(true);
                }
        }
    };

    const handleInputOnBlur = (event, data) => {
        event.preventDefault();
        const {
            name,
            value,
        } = !_isEmpty(data) ? data : event.target;
        const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
        if ((name === 'donationAmount') && !_isEmpty(value) && value.match(isValidNumber)) {
            setAmount(formatAmount(parseFloat(value.replace(/,/g, ''))));
            setValidity(validateDonationForm('donationAmount', value, validity));
        }
        setValidity(validateDonationForm(name, value, validity));
    };

    const handlePresetAmountClick = (event, data) => {
        const {
            value,
        } = data;
        setAmount(formatAmount(parseFloat(value.replace(/,/g, ''))));
        setValidity(validateDonationForm('donationAmount', value, validity));
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
    }

    //handling save button 
    const handleEditSave = () => {

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
            className="chimp-modal"
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
            <Modal.Header>Edit monthly deposit</Modal.Header>
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
                <div className="btn-wraper pt-2 text-right">
                    <Modal.Actions>
                        <Button
                            className="blue-btn-rounded-def"
                            onClick={() => handleEditSave()}
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
    t: () => { },
    paymentInstrumentId: ''
};

export default withTranslation(['donation', 'giveCommon'])(EditMonthlyDepositModal);
