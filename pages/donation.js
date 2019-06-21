import React, { cloneElement } from 'react';
import {connect} from 'react-redux'
import { validateUser } from '../actions/user';

import Layout from '../components/shared/Layout';
import Donation from '../components/give/Donation';
import TaxReceipt from '../components/give/TaxReceipt'

const renderChildWithProps = (props) => {
    console.log('render with props called')
    if (props.step === 'new') {
        return (<Donation />);
    } else if (props.step === 'tax-receipt') {
        return (<TaxReceipt />);
    }
    return null;
}


class Donations extends React.Component {
    static async getInitialProps ({query}) {
        return { 
            step: query.step,
        }
    }

    componentDidMount() {
        const {dispatch} = this.props
        validateUser(dispatch);
        validateUser(dispatch);
    }

    render() {
        console.log(this.props);
        return (
            <Layout>
                <div>Donations page ! {this.props.step}
                    { renderChildWithProps({...this.props}) }
                </div>
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
