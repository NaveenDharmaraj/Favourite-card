import React from 'react';

import {proceed} from '../../../actions/give';

import { beneficiaryDefaultProps } from '../../../utils/give/defaultProps';

class Charity extends React.Component {
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
        Charity new page - slug is {this.props.slug}
        <div onClick={()=> this.handleInputChange()}>set state here {this.state.flowObject.giveData.donationAmount}</div><br/>
        <div onClick={() => this.handleSubmit()} >Continue</div>
      </div>
    )
  }
}

Charity.defaultProps = beneficiaryDefaultProps;

export default Charity