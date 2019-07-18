import React from 'react';
import {
    Elements,
    StripeProvider
} from 'react-stripe-elements';
import CreditCard from '../CreditCard';

class CreditCardWrapper extends React.Component {
    render() {
        return(
            <StripeProvider apiKey='123456'>
                <Elements>
                    <CreditCard />
                </Elements>
            </StripeProvider>
        );
    }
}

export default CreditCardWrapper;
