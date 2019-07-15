import React from 'react';
import {
    Form,
    Icon,
    Image,
    Input,
    Popup,
    Table,
} from 'semantic-ui-react';
import {
    CardCVCElement,
    CardExpiryElement,
    CardNumberElement,
    injectStripe,
} from 'react-stripe-elements';
import '../style/styles.less';

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


const testCardList = [
    {
        behaviour: 'Approved',
        number: '4242424242424242',
        type: 'VISA',
    },
    {
        behaviour: 'Approved',
        number: '4000056655665556',
        type: 'VISA debi',
    },
    {
        behaviour: 'Approved',
        number: '4000000760000002',
        type: 'Visa - Brazil',
    },
    {
        behaviour: 'Approved',
        number: '5555555555554444',
        type: 'Mastercard',
    },
    {
        behaviour: 'Approved',
        number: '5200828282828210',
        type: 'Mastercard debit',
    },
    {
        behaviour: 'Approved',
        number: '5105105105105100',
        type: 'Mastercard prepaid',
    },
    {
        behaviour: 'Approved',
        number: '378282246310005',
        type: 'AMEX',
    },
    {
        behaviour: 'Approved',
        number: '6011111111111117',
        type: 'Discover',
    },
    {
        behaviour: 'Approved',
        number: '30569309025904',
        type: 'Diners Club',
    },
    {
        behaviour: 'Approved',
        number: '3530111333300000',
        type: 'JCB',
    },
    {
        behaviour: 'CVV Will Fail',
        number: '4000000000000101',
        type: '-',
    },
    {
        behaviour: 'Charges Will Fail',
        number: '4000000000000341',
        type: '-',
    },
    {
        behaviour: 'Card Declined',
        number: '4000000000000002',
        type: '-',
    },
    {
        behaviour: 'Incorrect CVV',
        number: '4000000000000127',
        type: '-',
    },
    {
        behaviour: 'Card Declined because fraudlent',
        number: '4100000000000019',
        type: '-',
    },
    {
        behaviour: 'Card Declined because expired',
        number: '4000000000000069',
        type: '-',
    },
    {
        behaviour: 'Card Declined because Processing Error',
        number: '4000000000000119',
        type: '-',
    },
    {
        behaviour: 'Card Declined fails Luhn Check',
        number: '4242424242424241',
        type: '-',
    },
    {
        behaviour: 'Charge succeed, but risk_level = elevated',
        number: '4000000000009235',
        type: '-',
    },
    {
        behaviour: '3D secure supported not required',
        number: '4000000000003055',
        type: '-',
    },
    {
        behaviour: '3D secure supported and required',
        number: '4000000000003063',
        type: '-',
    },
    {
        behaviour: '3D secure not supported or required',
        number: '378282246310005',
        type: '-',
    },
];

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
            showTestCardClicked: false,
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

    handleTestCreditCardList() {
        this.setState({
            showTestCardClicked: !this.state.showTestCardClicked,
            showTestCardLabel: this.state.showTestCardClicked ? ' Show Test Cards' : ' Hide Test Cards',
            showTestCards: !this.state.showTestCardClicked,
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
                        placeholder='Name on Card'
                        size="large"
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
