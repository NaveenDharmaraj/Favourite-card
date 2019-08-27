/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    saveCharitableInterests,
} from '../../../actions/userProfile';
import MyCauses from './causes';
import MyTags from './tags';

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
            isCausesValid: false,   
            userCauses,
            userTags,
        };
        this.getSelectedCausesSave = this.getSelectedCausesSave.bind(this);
        this.getSelectedTagsSave = this.getSelectedTagsSave.bind(this);
        this.handleCharitableInterestSubmit = this.handleCharitableInterestSubmit.bind(this);
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
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userCausesList, prevProps.userCausesList)) {
                if (!_.isEmpty(userCausesList)) {
                    userCausesList.forEach((cause) => {
                        if (typeof cause.attributes.status !== 'undefined') {
                            userCauses.push(cause.attributes.name);
                        }
                    });
                }
            }
        }
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userTagsFollowedList, prevProps.userTagsFollowedList)) {
                if (!_.isEmpty(userTagsFollowedList)) {
                    userTagsFollowedList.data.forEach((tag) => {
                        userTags.push(tag.attributes.name);
                    });
                }
            }
        }
        this.state = {
            userCauses,
            userTags,
        };
    }

    getSelectedCausesSave(userCauses) {
        this.setState({ userCauses });
    }

    getSelectedTagsSave(userTags) {
        this.setState({ userTags });
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
            saveCharitableInterests(dispatch, id, userCauses, userTags);
        }
    }

    render() {
        return (
            <div>
                <MyCauses getSelectedCauses={this.getSelectedCausesSave} />
                <MyTags getSelectedTags={this.getSelectedTagsSave} />
                <div className="pt-2">
                    <Button
                        className="blue-btn-rounded-def w-140"
                        onClick={this.handleCharitableInterestSubmit}
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
