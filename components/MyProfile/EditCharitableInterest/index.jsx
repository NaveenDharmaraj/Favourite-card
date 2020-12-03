/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Modal,
    Button,
    Header,
    Grid,
    Responsive,
    Icon,
    Input,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';

import {
    saveCharitableCauses,
    saveCharitableTags,
} from '../../../actions/userProfile';

import MyCauses from './causes';
import MyTags from './tags';
const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'), {
    ssr: false
});

class EditCharitableInterest extends React.Component {
    constructor(props) {
        super(props);
        const userCauses = [];
        const userTags = [];
    }

    render() {
        const {
            buttonClicked,
            errorMessage,
            errorMessageTag,
            saveClicked,
            statusMessage,
            statusMessageTags,
            successMessage,
            successMessageTag,
        } = this.state;
        return (
            <Modal
                size="tiny"
                dimmer="inverted"
                closeIcon
                className="chimp-modal editCauseModal"
                open={this.state.showModal}
                onClose={()=>{this.setState({showModal: false})}}
                trigger={
                    <a className='editModalTrigger' onClick={() => this.setState({ showModal: true })}>Edit</a>
                }
            >
                <Modal.Header>
                    Causes and topics you care about
                    <Responsive minWidth={767}>
                        <span className='header-note'>Select causes, topics, or both to discover charities and Giving Groups that might interest you.</span>
                    </Responsive>
                </Modal.Header>
                <Modal.Content>
                    <Responsive maxWidth={767}>
                        <span className='header-note'>Select causes, topics, or both to discover charities and Giving Groups that might interest you.</span>
                    </Responsive>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column computer={10} mobile={16}>
                                <div className="causesec">
                                    <Header as='h4'>Causes</Header>
                                    <p>Causes represent broader areas of charitable interests.</p>
                                    <div className='causeselect-wraper' />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userCausesList: state.userProfile.userCausesList,
        userTagsFollowedList: state.userProfile.userTagsFollowedList,
    };
}

export default (connect(mapStateToProps)(EditCharitableInterest));
