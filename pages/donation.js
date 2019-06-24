import React, { cloneElement } from 'react';
import { validateUser } from '../actions/user';

import Donation from '../components/Give/Donation';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Donations extends React.Component {
    static async getInitialProps ({query}) {
        return { 
            step: query.step,
        }
    }

    componentDidMount() {
        const {dispatch} = this.props
        validateUser(dispatch);
    }

    render() {
        return (
            <Layout>
                Donations page ! {this.props.step}
                <GiveWrapper {...this.props}>
                    <Donation />
                </GiveWrapper> 
            </Layout>
        );
    }
    
}
  
export default Donations
