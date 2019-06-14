import React, { cloneElement } from 'react';

import DonationNew from '../components/give/donation/new';
import TaxReceipt from '../components/give/taxReceipt'

const renderChildWithProps = (props) => {
    console.log('render with props called')
    if (props.step === 'new') {
        return (<DonationNew />);
    } else if (props.step === 'tax-receipt') {
        return (<TaxReceipt />);
    }
    return null;
}


class Donation extends React.Component {
    static async getInitialProps ({query}) {
        return { step: query.step }
    }

    render() {
        return (
            <div>Donations page ! {this.props.step}
                { renderChildWithProps({...this.props}) }
            </div>

        );
    }
    
  }
  
export default Donation;