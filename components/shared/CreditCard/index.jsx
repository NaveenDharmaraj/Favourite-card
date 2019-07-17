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
import { testCardList } from '../../../helpers/constants/index';

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
