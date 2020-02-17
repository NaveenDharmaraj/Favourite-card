import React from 'react';
import {
    Header,
    Button,
    Grid,
    Modal,
    List,
    Form,
    Popup,
} from 'semantic-ui-react';
import _ from 'lodash';
import {
    connect,
} from 'react-redux';
import {
    PropTypes,
    func,
} from 'prop-types';

import {
    getEmailList,
    createUserEmailAddress,
} from '../../../actions/userProfile';
import { validateUserRegistrationForm } from '../../../helpers/users/utils';
import FormValidationErrorMessage from '../../../components/shared/FormValidationErrorMessage';

import EmailDetails from './emailDetails';

const actionTypes = {
    USER_PROFILE_ADD_DUPLICATE_EMAIL_ERROR: 'USER_PROFILE_ADD_DUPLICATE_EMAIL_ERROR',
};

class EmailList extends React.Component {
    static async getUpdatedList(dispatch, emailId, userId) {
        await createUserEmailAddress(dispatch, emailId, userId);
        return true;
    }

    constructor(props) {
        super(props);
        this.state = {
            emailId: '',
            showAddEmailModal: false,
            validEmailAddress: true,
        };
        this.renderEmailList = this.renderEmailList.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
        this.closeAddEmailModal = this.closeAddEmailModal.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
            userInfo: {
                id: userId,
            },
        } = this.props;
        getEmailList(dispatch, userId);
    }

    handleOnChange(event) {
        const {
            target: {
                value,
            },
        } = event;
        this.setState({
            emailId: value,
        });
    }

    handleEmailSubmit() {
        const {
            dispatch,
            userInfo: {
                id: userId,
            },
            showEmailError,
        } = this.props;
        const {
            emailId,
        } = this.state;
        let validity = {
            isEmailIdNotNull: true,
            isEmailIdValid: true,
            isEmailLengthInLimit: true,
            isEmailValidFormat: true,
        };
        let updateEmail = null;
        validity = validateUserRegistrationForm('emailId', emailId, validity);
        if (validity.isEmailIdValid) {
            dispatch({
                payload: {
                    showEmailError: false,
                },
                type: actionTypes.USER_PROFILE_ADD_DUPLICATE_EMAIL_ERROR,
            });
            updateEmail = EmailList.getUpdatedList(dispatch, emailId, userId);
            if (updateEmail === true) {
                this.setState({ emailId: '' });
                if (!showEmailError) {
                    this.closeAddEmailModal();
                }
            }
        } else {
            this.setState({ validEmailAddress: false });
        }
    }

    closeAddEmailModal() {
        const {
            dispatch,
        } = this.props;
        this.setState({
            emailId: '',
            showAddEmailModal: false,
            validEmailAddress: true,
        });
        dispatch({
            payload: {
                errorMessageTitle: '',
                showEmailError: false,
            },
            type: actionTypes.USER_PROFILE_ADD_DUPLICATE_EMAIL_ERROR,
        });
    }

    renderEmailList() {
        const {
            emailDetailList,
        } = this.props;
        return (
            emailDetailList.map((email) => (
                <EmailDetails
                    id={email.id}
                    email={email.attributes.email}
                    isPrimary={email.attributes.isPrimary}
                    verified={email.attributes.verified}
                />
            ))
        );
    }

    render() {
        const {
            emailDetailList,
            showEmailError,
            errorMessageTitle,
        } = this.props;
        const {
            emailId,
            showAddEmailModal,
            validEmailAddress,
        } = this.state;
        return (
            <div>
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper heading brdr-btm pb-1 pt-2 pMethodHead">
                        <Grid verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={11} computer={11}>
                                    <div className="pt-1">
                                        <Header as="h4">Email addresses </Header>
                                        <p>
                                        Add multiple email addresses to your account so that people can add you as a friend and send you charitable dollars.
                                        </p>
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={5} computer={5}>
                                    <div className="right-align">
                                        <Modal
                                            onClose={this.closeAddEmailModal}
                                            open={showAddEmailModal}
                                            size="tiny"
                                            dimmer="inverted"
                                            className="chimp-modal"
                                            closeIcon
                                            trigger={(
                                                (emailDetailList && emailDetailList.length >= 5)
                                                    ? (
                                                        <Popup
                                                            style={{ width: '200px' }}
                                                            position="top center"
                                                            basic
                                                            content="You can add up to 4 alternate e-mail IDs along with the Primary e-mail ID."
                                                            trigger={
                                                                (
                                                                    <span>
                                                                        <Button
                                                                            className="disabled success-btn-rounded-def"
                                                                        >
                                                                                Add new email
                                                                        </Button>
                                                                    </span>
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <Button
                                                            className="success-btn-rounded-def"
                                                            onClick={() => this.setState({
                                                                showAddEmailModal: true,
                                                            })}
                                                        >
                                                                Add new email
                                                        </Button>
                                                    )
                                            )}
                                        >
                                            <Modal.Header>Add email</Modal.Header>
                                            <Modal.Content>
                                                <Modal.Description className="font-s-16">
                                                    <Form>
                                                        <label>Email</label>
                                                        <Form.Field error={false}>
                                                            <input
                                                                placeholder="Email address"
                                                                value={emailId}
                                                                onChange={this.handleOnChange}
                                                            />
                                                        </Form.Field>
                                                        <FormValidationErrorMessage
                                                            className="mt-0"
                                                            condition={!validEmailAddress}
                                                            errorMessage="Enter valid email address"
                                                        />
                                                        <FormValidationErrorMessage
                                                            className="mt-0"
                                                            condition={showEmailError}
                                                            errorMessage={errorMessageTitle}
                                                        />
                                                    </Form>
                                                </Modal.Description>
                                                <div className="btn-wraper pt-3 text-right">
                                                    <Button
                                                        className="blue-btn-rounded-def  w-120"
                                                        onClick={this.handleEmailSubmit}
                                                    >
                                                    Add
                                                    </Button>
                                                </div>
                                            </Modal.Content>
                                            
                                        </Modal>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <div className="userCardList emailList">
                            <List celled verticalAlign="middle">
                                {!_.isEmpty(emailDetailList) && this.renderEmailList()}
                            </List>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

EmailList.defaultProps = {
    dispatch: func,
    userInfo: {
        id: null,
    },
};

EmailList.propTypes = {
    dispatch: _.noop,
    userInfo: PropTypes.shape({
        id: PropTypes.string,
    }),
};

function mapStateToProps(state) {
    return {
        emailDetailList: state.userProfile.emailDetailList,
        errorMessageTitle: state.userProfile.errorMessageTitle,
        showEmailError: state.userProfile.showEmailError,
        userInfo: state.user.info,
    };
}

export default connect(mapStateToProps)(EmailList);
