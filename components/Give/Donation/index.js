import React from 'react';

import {proceed} from '../../../actions/give';

import { donationDefaultProps } from '../../../utils/give/defaultProps';

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
    const {dispatch, stepIndex, flowSteps} = this.props
    dispatch(proceed(this.state.flowObject, flowSteps[stepIndex+1]))
  }
  render() {
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