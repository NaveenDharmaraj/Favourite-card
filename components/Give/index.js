import React from 'react';

import TaxReceipt from './TaxReceipt'


const renderChildWithProps = (props) => {
    console.log('render with props called')
    if (props.step === 'new') {
        return (
            <div>
             { props.children }
             </div>
            );
    } else if (props.step === 'tax-receipt') {
        return (<TaxReceipt />);
    }
    return null;
}

class Give extends React.Component {

    render() {
        return ( 
            <div>{renderChildWithProps(this.props)} 
            </div>
        )
    }

}

export default Give;
