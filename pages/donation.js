import React, { cloneElement } from 'react';
import {connect} from 'react-redux'
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
        console.log(this.props);
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

function mapStateToProps (state) {
    return {
        auth: state.user.auth,
    }
}
  
export default connect(mapStateToProps)(Donations)
