import React from 'react';
import {
    Form,
    Icon,
    Image,
    Input,
    Popup,
    Table,
} from 'semantic-ui-react';
import _ from 'lodash';
import {
    CardCVCElement,
    CardExpiryElement,
    CardNumberElement,
    injectStripe,
} from 'react-stripe-elements';

import '../style/styles.less';
import { testCardList } from '../../../helpers/constants/index';
import { hasMinTwoChars } from '../../../helpers/give/giving-form-validation';

const headerRow = [
    'Type',
    'Number',
    'Behaviour',
];
const renderBodyRow = ({
    type, number,
    behaviour,
}, i) => ({
    cells: [
        type || 'No name specified',
        number ? {
            content: number,
            key: 'number',
        } : 'Unknown',
        behaviour ? {
            content: behaviour,
            key: 'behaviour',
        } : 'None',
    ],
    key: type || `row-${i}`,
});

const fontFamily = 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif';

const createOptions = () => {
    return {
        style: {
            base: {
                '::placeholder': {
                    color: '#bbb',
                    fontFamily,
                },
                color: '#000000',

                fontFamily,
            },
            invalid: {
                color: '#DB2828',
                fontFamily,
            },
        },
    };
};

class CreditCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            creditCardBrand: 'credit card',
            creditCardType: '',
            inValidCardNameValue: false,
            inValidCardNumber: false,
            inValidCvv: false,
            inValidExpirationDate: false,
            inValidNameOnCard: false,
            isStripeElementsValid: false,
            nameOnCard: '',
            showTestCardLabel: ' Show Test Cards',
            showTestCards: false,
        };
        this.handleTestCreditCardList = this.handleTestCreditCardList.bind(this);
    }

    testCreditCardList() {
        return (
            <Table
                celled
                headerRow={headerRow}
                renderBodyRow={renderBodyRow}
                tableData={testCardList}
            />
        );
    }

    handleCCNoChange(event) {
        const creditCardType = event.brand;
        const allowedCards = [
            'visa',
            'mastercard',
            'amex',
        ];
        const isValidCardType = _.includes(allowedCards, creditCardType);
        if (event.error || !isValidCardType) {
            this.setState({
                creditCardType,
                inValidCardNumber: true,
            });
        } else if (!event.empty && event.complete) {
            this.setState({
                creditCardType,
                inValidCardNumber: false,
            });
            console.log(this.props.stripe);
            this.props.creditCardElement(this.props.stripe, this.state.nameOnCard);
        }
        // this.props.validateCCNo(this.state.inValidCardNumber);
    }

    handleCCNoBlur(event) {
        // if (event.empty && !event.complete) {
        //     this.setState({
        //         inValidCardNumber: true,
        //     });
        // }
    }

    handleCCExpiryChange(event) {
        // if (event.error || event.empty) {
        //     this.setState({ inValidExpirationDate: true });
        // } else if (!event.empty && event.complete) {
        //     this.props.creditCardElement(this.props.stripe, this.state.nameOnCard);
        //     this.setState({ inValidExpirationDate: false });
        // }
        // this.props.validateExpiraton(this.state.inValidExpirationDate);
    }

    handleNameChange(event) {
        const {
            name,
            value,
        } = event.target;

        this.setState({
            [name]: value,
        });
    }

    handleNameBlur(event) {
        // const {
        //     value,
        // } = event.target;

        // const cardName = value.replace(/ /g,'');

        // let inValidCardNameValue = false;
        // const letterNumber = /^\d+$/;
        // if (!cardName.match(letterNumber)) {
        //     inValidCardNameValue = false;
        // } else {
        //     inValidCardNameValue = true;
        // }

        // let isError = false;
        // if (!hasMinTwoChars(value)) {
        //     isError = true;
        // }       
        // this.setState({
        //     inValidCardNameValue,
        //     inValidNameOnCard: isError,
        // });
        // this.props.validateCardName(isError, inValidCardNameValue, this.state.nameOnCard);
    }

    handleCvvChange(event) {
        // if (event.error || event.empty) {
        //     this.setState({ inValidCvv: true });
        // } else if (!event.empty && event.complete) {
        //     this.props.creditCardElement(this.props.stripe, this.state.nameOnCard);
        //     this.setState({ inValidCvv: false });
        // }
        // this.props.validateCvv(this.state.inValidCvv);
    }


    handleTestCreditCardList() {
        this.setState({
            showTestCardLabel: this.state.showTestCards ? ' Show Test Cards' : ' Hide Test Cards',
            showTestCards: !this.state.showTestCards,
        });
    }

    render() {
        const {
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            nameOnCard,
            showTestCards,
            showTestCardLabel,
        } = this.state;
        return (
            <Form.Field>
                <Form.Field>
                    <a
                        className="achPointer"
                        onClick={this.handleTestCreditCardList}
                    >
                        {showTestCardLabel}
                    </a>
                </Form.Field>
                {
                    !!showTestCards && (
                        <Form.Field>
                            <label htmlFor="showCreditCardList">
                                More information on test accounts can be found at Stripe.
                            </label>
                            <Form.Field>
                                {this.testCreditCardList()}
                            </Form.Field>
                        </Form.Field>
                    )
                }
                <Form.Field>
                    <label htmlFor="card-number">
                        Card Number
                    </label>
                    <CardNumberElement
                        className="field fieldCC"
                        id="card-number"
                        name="card-number"
                        onChange={this.handleCCNoChange}
                        onBlur={this.handleCCNoBlur}
                        {...createOptions()}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="nameOnCard">
                        Name on Card
                    </label>
                    <Form.Field
                        control={Input}
                        id="nameOnCard"
                        name="nameOnCard"
                        onChange={this.handleNameChange}
                        onBlur={this.handleNameBlur}
                        placeholder="Name on Card"
                        size="large"
                        value={nameOnCard}
                    />
                </Form.Field>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label htmlFor="card-expiration">
                            Expiration Date
                        </label>
                        <CardExpiryElement
                            className="field fieldCC"
                            id="card-expiration"
                            onChange={this.handleCCExpiryChange}
                            {...createOptions()}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label htmlFor="card-cvv">
                            CVV
                        </label>
                        <CardCVCElement
                            className="field fieldCC"
                            id="card-cvv"
                            onChange={this.handleCvvChange}
                            placeholder="CVV"
                            {...createOptions()}
                        />
                    </Form.Field>
                </Form.Group>
            </Form.Field>
        );
    }
}

export default injectStripe(CreditCard);
