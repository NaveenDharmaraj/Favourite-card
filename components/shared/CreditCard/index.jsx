import React from 'react';
import {
    Form,
    Input
} from 'semantic-ui-react';
import {
    CardCVCElement,
    CardExpiryElement,
    CardNumberElement,
    injectStripe,
} from 'react-stripe-elements';
import '../style/styles.less';

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
    }

    render() {
        return (
            <Form.Field>
                <Form.Field>
                    <label htmlFor="showCreditCardList">
                        Show Credit Card List
                    </label>
                    <Form.Field>
                        Test Credit Card List
                    </Form.Field>
                </Form.Field>
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

export default CreditCard;
