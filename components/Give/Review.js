import React from 'react';
import {reInitNextStep, proceed} from '../../actions/give';

class Review extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const {dispatch, flowObject} = this.props
    if (flowObject) {
        reInitNextStep(dispatch, flowObject)
    }
  }
  handleSubmit = () => {
    const {dispatch, stepIndex, flowSteps, flowObject} = this.props
    dispatch(proceed(flowObject, flowSteps[stepIndex+1], true))
  }
  render() {
    return (
        <div>
        { (this.props.flowObject) && 
        (<div>
            Review component!
            {this.props.flowObject.giveData.donationAmount} <br/>
            {this.props.flowObject.selectedTaxReceiptProfile.name} <br/><br/>
            <div onClick={() => this.handleSubmit()} >Continue</div>
        </div>)
        }
        </div>
    );
  }
}

  
export default Review;