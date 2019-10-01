/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
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

// eslint-disable-next-line react/prefer-stateless-function
class EditCharitableInterest extends React.Component {
    constructor(props) {
        super(props);
        const userCauses = [];
        const userTags = [];
        if (!_.isEmpty(props.userCausesList)) {
            props.userCausesList.forEach((cause) => {
                if (typeof cause.attributes.status !== 'undefined') {
                    userCauses.push(cause.attributes.name);
                }
            });
        }
        if (!_.isEmpty(props.userTagsFollowedList)) {
            props.userTagsFollowedList.data.forEach((tag) => {
                userTags.push(tag.attributes.name);
            });
        }
        this.state = {
            buttonClicked: true,
            errorMessage: null,
            errorMessageTag: null,
            isCausesValid: false,
            saveClicked: false,
            statusMessage: false,
            statusMessageTags: false,
            successMessage: '',
            successMessageTag: '',
            userCauses,
            userTags,
            
            
        };
        this.getSelectedCausesSave = this.getSelectedCausesSave.bind(this);
        this.getSelectedTagsSave = this.getSelectedTagsSave.bind(this);
        this.handleCharitableInterestSubmit = this.handleCharitableInterestSubmit.bind(this);
        this.resetSaveClicked = this.resetSaveClicked.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            userCausesList,
            userTagsFollowedList,
        } = this.props;
        const {
            userCauses,
            userTags,
        } = this.state;
        if (!_.isEqual(userCausesList, prevProps.userCausesList) && !_.isEmpty(userCausesList)) {
            userCausesList.forEach((cause) => {
                if (typeof cause.attributes.status !== 'undefined') {
                    userCauses.push(cause.attributes.name);
                }
            });
        }
        if (!_.isEqual(userTagsFollowedList, prevProps.userTagsFollowedList) && !_.isEmpty(userTagsFollowedList)) {
            userTagsFollowedList.data.forEach((tag) => {
                userTags.push(tag.attributes.name);
            });
        }
        this.state = {
            userCauses,
            userTags,
        };
    }

    getSelectedCausesSave(userCauses) {
        this.setState({
            buttonClicked: false,
            userCauses,
            statusMessage: false,
        });
    }

    getSelectedTagsSave(userTags) {
        this.setState({
            buttonClicked: false,
            userTags,
            statusMessage: false,
        });
    }

    validateForm() {
        const {
            userCauses,
        } = this.state;
        let {
            isCausesValid,
        } = this.state;
        isCausesValid = (userCauses.length >= 3);
        this.setState({
            isCausesValid,
        });
        return isCausesValid;
    }

    handleCharitableInterestSubmit() {
        this.setState({
            buttonClicked: true,
            statusMessage: false,
            statusMessageTags: false,
        });
        const isValid = this.validateForm();
        if (isValid) {
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            const {
                userCauses,
                userTags,
            } = this.state;
            this.setState({ saveClicked: true });
            saveCharitableCauses(dispatch, id, userCauses).then(() => {
                this.setState({
                    errorMessage: null,
                    successMessage: 'Changes saved.',
                    statusMessage: true,
                    buttonClicked: true,
                });
            }).catch(() => {
                this.setState({
                    errorMessage: 'Error in saving the Causes.',
                    statusMessage: true,
                    buttonClicked: true,
                });
            });
            saveCharitableTags(dispatch, id, userTags).then(() => {
                this.setState({
                    errorMessage: null,
                    successMessage: 'Changes saved.',
                    statusMessage: true,
                    buttonClicked: true,
                });
            }).catch(() => {
                this.setState({
                    errorMessageTag: 'Error in saving the Tags.',
                    statusMessageTags: true,
                    buttonClicked: true,
                });
            });
        } else {
            this.setState({
                buttonClicked: false,
                errorMessage: 'Please select 3 or more cause',
                statusMessage: true,
            });
        }
    }

    resetSaveClicked(setValue) {
        this.setState({
            saveClicked: setValue,
        });
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
            <div>
                {
                    statusMessage && (
                        <div className="mb-2">
                            <ModalStatusMessage 
                                message = {!_.isEmpty(successMessage) ? successMessage : null}
                                error = {!_.isEmpty(errorMessage) ? errorMessage : null}
                            />
                        </div>
                    )
                }
                {
                    statusMessageTags && (
                        <div className="mb-2">
                            <ModalStatusMessage 
                                message = {!_.isEmpty(successMessageTag) ? successMessageTag : null}
                                error = {!_.isEmpty(errorMessageTag) ? errorMessageTag : null}
                            />
                        </div>
                    )
                }
                <MyCauses getSelectedCauses={this.getSelectedCausesSave} />
                <MyTags getSelectedTags={this.getSelectedTagsSave} saveClickedTags={saveClicked} resetSaveClicked={this.resetSaveClicked} />
                <div className="pt-2">
                    <Button
                        className="blue-btn-rounded-def w-140"
                        onClick={this.handleCharitableInterestSubmit}
                        disabled={buttonClicked}
                    >
                    Save
                    </Button>
                </div>
            </div>
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
