import React from 'react';
import { Button, Checkbox, Form, Modal } from "semantic-ui-react";
import {
    Elements,
    StripeProvider
} from 'react-stripe-elements';
import getConfig from 'next/config';
import { withTranslation } from '../../../i18n';

import CreditCard from "../CreditCard";
import { addNewCardAndLoad } from '../../../actions/give';

const { publicRuntimeConfig } = getConfig();

const {
    STRIPE_KEY
} = publicRuntimeConfig;

class NewCreditCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: false,
            cardHolderName: '',
            disableCreditCard: true,
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            isDefaultCard: false,
        }
    }

    handleCCAddClose = () => {
        const {
            handleCreditCardModal
        } = this.props;
        handleCreditCardModal();
    }
    handleSetPrimaryClick = (event, data) => {
        let {
            isDefaultCard,
        } = this.state;
        isDefaultCard = data.checked;
        this.setState({ isDefaultCard });
    }
    getStripeCreditCard = (data, cardHolderName) => {
        this.setState({
            cardHolderName,
            stripeCreditCard: data,
        });
    }
    /**
  * validateStripeElements
  * @param {boolean} inValidCardNumber credit card number
  * @return {void}
  */
    validateStripeCreditCardNo = (inValidCardNumber) => {
        this.setState({
            inValidCardNumber,
            disableCreditCard: false,
        });
    }

    /**
  * validateStripeElements
  * @param {boolean} inValidExpirationDate credit card expiry date
  * @return {void}
  */
    validateStripeExpirationDate = (inValidExpirationDate) => {
        this.setState({
            inValidExpirationDate,
            disableCreditCard: false,
        });
    }
    /**
       * validateStripeElements
       * @param {boolean} inValidCvv credit card CVV
       * @return {void}
       */
    validateCreditCardCvv = (inValidCvv) => {
        this.setState({
            disableCreditCard: false,
            inValidCvv
        });
    }
    /**     
         * @param {boolean} inValidNameOnCard credit card Name
         * @param {boolean} inValidCardNameValue credit card Name Value
         * @param {string} cardHolderName credit card Name Data
         * @return {void}
         */
    validateCreditCardName = (inValidNameOnCard, inValidCardNameValue, cardHolderName) => {
        let cardNameValid = inValidNameOnCard;
        if (cardHolderName.trim() === '' || cardHolderName.trim() === null) {
            cardNameValid = true;
        }
        this.setState({
            ...(!cardNameValid && { cardHolderName }),
            inValidCardNameValue,
            inValidNameOnCard: cardNameValid,
        });
    }
    isValidCC(
        //creditCard,
        inValidCardNumber,
        inValidExpirationDate,
        inValidNameOnCard,
        inValidCvv,
        inValidCardNameValue,
    ) {
        let validCC = true;
        // if (creditCard.value === 0) {
        //     this.CreditCard.handleOnLoad(
        // inValidCardNumber,
        // inValidExpirationDate,
        // inValidNameOnCard,
        // inValidCvv,
        // inValidCardNameValue,
        //     );
        validCC = (
            !inValidCardNumber &&
            !inValidExpirationDate &&
            !inValidNameOnCard &&
            !inValidCvv &&
            !inValidCardNameValue
        );
        //}
        return validCC;
    }
    handleOnChangeCardName = () => {
        this.setState({
            disableCreditCard: false,
        })
    }
    handleAddNewCreditCard = () => {
        const {
            cardHolderName,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isDefaultCard,
            stripeCreditCard,
        } = this.state;
        const {
            flowObject,
        } = this.props;
        const validateCC = this.isValidCC(
            //creditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        );
        if (validateCC) {
            this.setState({
                buttonClicked: true,
            });
            const {
                dispatch,
                handleCreditCardModal
            } = this.props;
            flowObject.cardHolderName = cardHolderName;
            flowObject.stripeCreditCard = stripeCreditCard;
            dispatch(addNewCardAndLoad(flowObject, isDefaultCard)).then(({data}) => {
                const statusMessageProps = {
                    message: 'Payment method added',
                    type: 'success',
                };
                dispatch({
                    payload: {
                        errors: [
                            statusMessageProps,
                        ],
                    },
                    type: 'TRIGGER_UX_CRITICAL_ERROR',
                });
                handleCreditCardModal(true, data.id);
            }).catch((error) => {
                this.setState({
                    buttonClicked: false,
                });
            });
        }
    }
    render() {
        const formatMessage = this.props.t;
        const {
            paymentInstrumenOptions,
            isCreditCardModalOpen
        } = this.props;
        const {
            buttonClicked,
            disableCreditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isDefaultCard,
        } = this.state;
        return (
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
                                        handleOnChangeCardName={this.handleOnChangeCardName}
                                        formatMessage={formatMessage}
                                        onRef={(ref) => (this.CreditCard = ref)}
                                    />
                                </Elements>
                            </StripeProvider>
                            <Form.Field
                                checked={isDefaultCard}
                                control={Checkbox}
                                className="ui checkbox chkMarginBtm checkboxToRadio"
                                disabled={!paymentInstrumenOptions}
                                id="isDefaultCard"
                                label="Set as primary card"
                                name="isDefaultCard"
                                onChange={this.handleSetPrimaryClick}
                            />
                        </Form>
                    </Modal.Description>
                    <div className="btn-wraper pt-1 text-right">
                        <Button
                            className="blue-btn-rounded-def w-140"
                            onClick={this.handleAddNewCreditCard}
                            disabled={buttonClicked || disableCreditCard}
                        >
                            Done
                    </Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }
}

NewCreditCard.defaultProps = {
    flowObject: {
        cardHolderName: '',
        giveData: {
            giveFrom: {},
            giveTo: {
                id: '',
                type: 'user'
            },
        },
        stripeCreditCard: '',
        type: 'donations'
    },
    isCreditCardModalOpen: false,
    handleCreditCardModal: () => { },
    t: () => { }
};

export default withTranslation(['common'])(NewCreditCard);
