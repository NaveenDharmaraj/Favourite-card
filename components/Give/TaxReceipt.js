import React from 'react';
import {reInitNextStep, proceed} from '../../actions/give';

class TaxReceipt extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      flowObject: props.flowObject
    }
  }
  componentDidMount() {
    const {dispatch} = this.props
    if (this.state.flowObject) {
      reInitNextStep(dispatch, this.state.flowObject)
    }
  }
  handleInputChange = () => {
    this.setState({
      flowObject: {
        ...this.state.flowObject,
        selectedTaxReceiptProfile: {
          name: 'Arun',
        },
      }
    })
  }
  handleSubmit = () => {
    const {dispatch, stepIndex, flowSteps} = this.props
    dispatch(proceed(this.state.flowObject, flowSteps[stepIndex+1]))
  }
  render() {
    console.log('Tax receipt ->> ', this.props)
    return (
      <div>
        TaxReceipt component!
        <div onClick={()=> this.handleInputChange()}>set state here {this.state.flowObject.selectedTaxReceiptProfile.name}</div><br/>
        <div onClick={() => this.handleSubmit()} >Continue</div>
      </div>);
  }
}

  
export default TaxReceipt;