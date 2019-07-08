import React from 'react';

import {proceed} from '../../../actions/give';

import { donationDefaultProps } from '../../../helpers/give/defaultProps';

class Donation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      flowObject: props.flowObject
    }
  }
  
  handleInputChange = () => {
    this.setState({
      flowObject: {
        ...this.state.flowObject,
        giveData: {
          ...this.state.flowObject.giveData,
          donationAmount: '5.00',
        }
      }
    })
  }

  handleSubmit = () => {

    let {
      flowObject,
    } = this.state;

      flowObject = {
        ...flowObject,
        selectedTaxReceiptProfile: {
          attributes: {
            fullName: "John Doe y test",
            // isDefault: false,
            addressOne: "5678 Anywhere Lane",
            addressTwo: "",
            city: "Anyville",
            province: "BC",
            postalCode: "V1V1V1",
            country: "CA",
            accountNumber: "0000RF7D0000RFF5"
          },
          id: "999264",
          type:"taxReceiptProfiles"
        }
      }
    const {dispatch, stepIndex, flowSteps} = this.props
    dispatch(proceed(flowObject, flowSteps[stepIndex+1]))
  }

  render() {
    console.log('new page props')
    console.log(this.props);
    return (
      <div>
        Donation new page
        <div onClick={()=> this.handleInputChange()}>set state here {this.state.flowObject.giveData.donationAmount}</div><br/>
        <div onClick={() => this.handleSubmit()} >Continue</div>
      </div>
    )
  }

}

Donation.defaultProps = donationDefaultProps;

export default Donation