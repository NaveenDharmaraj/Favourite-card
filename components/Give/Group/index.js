import React from 'react';

import {proceed} from '../../../actions/give';

import { groupDefaultProps } from '../../../helpers/give/defaultProps';
import { getGroupsFromSlug } from '../../../actions/user';

class Group extends React.Component {
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

  componentDidMount() {
    const {
      slug,
    } = this.props;
    if(slug !== null) {
      console.log(slug)
      getGroupsFromSlug(slug);
    }
  }
  render() {
    console.log(this.props);
    return (
      <div>
        Group new page - slug is {this.props.slug}
        <div onClick={()=> this.handleInputChange()}>set state here {this.state.flowObject.giveData.donationAmount}</div><br/>
        <div onClick={() => this.handleSubmit()} >Continue</div>
      </div>
    )
  }
}

Group.defaultProps = groupDefaultProps;

export default Group