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
    arrayOf,
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
    USER_PROFILE_SHOW_EMAIL_LOADER: 'USER_PROFILE_SHOW_EMAIL_LOADER',
};

class EmailList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailId: '',
            showAddEmailModal: false,
            validEmailAddress: false,
            validity: this.intializeValidations(),
        };
        this.renderEmailList = this.renderEmailList.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
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

    componentDidUpdate(prevProps) {
        const {
            showAddButtonLoader,
            showEmailError,
        } = this.props;
        if (!_.isEqual(this.props, prevProps)) {
            if (!showEmailError && !showAddButtonLoader) {
                this.closeAddEmailModal();
            }
        }
    }

    intializeValidations() {
        this.validity = {
            isEmailIdNotNull: true,
            isEmailIdValid: true,
            isEmailLengthInLimit: true,
            isEmailValidFormat: true,
        };
        return this.validity;
    }

    handleOnChange(event) {
        const {
            target: {
                value,
            },
        } = event;
        let validEmail = this.intializeValidations();
        validEmail = validateUserRegistrationForm('emailId', value, validEmail);
        if (validEmail.isEmailIdValid) {
            this.setState({
                validEmailAddress: true,
            });
        } else {
            this.setState({
                validEmailAddress: false,
            });
        }
        this.setState({
            emailId: value,
        });
    }

    handleOnBlur(event) {
        const {
            target: {
                value,
            },
        } = event;
        let {
            validity,
        } = this.state;
        validity = this.intializeValidations();
        validity = validateUserRegistrationForm('emailId', value, validity);
        this.setState({
            validity,
        });
    }

    handleEmailSubmit() {
        const {
            dispatch,
            userInfo: {
                id: userId,
            },
        } = this.props;
        const {
            validity,
            emailId,
        } = this.state;
        if (validity.isEmailIdValid) {
            createUserEmailAddress(dispatch, emailId, userId);
        }
    }

    closeAddEmailModal() {
        const {
            dispatch,
        } = this.props;
        let {
            validity,
        } = this.state;
        validity = this.intializeValidations();
        this.setState({
            validity,
        });
        this.setState({
            emailId: '',
            showAddEmailModal: false,
            validEmailAddress: false,
            validity,
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
            showAddButtonLoader,
            showEmailError,
            errorMessageTitle,
        } = this.props;
        const {
            emailId,
            showAddEmailModal,
            validEmailAddress,
            validity,
        } = this.state;
        return (
            <div>
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper heading brdr-btm pb-1 pt-2 pMethodHead">
                        <Grid verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={16} computer={11}>
                                    <div className="pt-1">
                                        <Header as="h4">Email addresses </Header>
                                        <p>
                                            If you use multiple email addresses, you can add them here.
                                            Friends will be able to give to you using any of the email addresses associated with your account.
                                            Only the email address you set as primary can be used to log in.
                                        </p>
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={16} computer={5}>
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
                                                        <Form.Field error={false}>
                                                            <label>Email</label>
                                                            <input
                                                                placeholder="Email address"
                                                                value={emailId}
                                                                onBlur={this.handleOnBlur}
                                                                onChange={this.handleOnChange}
                                                            />
                                                        </Form.Field>
                                                        <FormValidationErrorMessage
                                                            className="mt-0"
                                                            condition={showEmailError}
                                                            errorMessage={errorMessageTitle}
                                                        />
                                                        <FormValidationErrorMessage
                                                            className="mt-0"
                                                            condition={!validity.isEmailIdNotNull}
                                                            errorMessage="Please enter your email address"
                                                        />
                                                        <FormValidationErrorMessage
                                                            className="mt-0"
                                                            condition={!validity.isEmailValidFormat}
                                                            errorMessage="Please enter a valid email address"
                                                        />
                                                        <FormValidationErrorMessage
                                                            className="mt-0"
                                                            condition={!validity.isEmailLengthInLimit && validity.isEmailIdNotNull}
                                                            errorMessage="Email address cannot have more than 100 characters"
                                                        />
                                                    </Form>
                                                </Modal.Description>
                                                <div className="btn-wraper pt-3 text-right">
                                                    <Button
                                                        loading={showAddButtonLoader}
                                                        disabled={!validEmailAddress}
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
    emailDetailList: [],
    errorMessageTitle: '',
    showAddButtonLoader: false,
    showEmailError: false,
    userInfo: {
        id: '',
    },
};

EmailList.propTypes = {
    dispatch: _.noop,
    emailDetailList: arrayOf(PropTypes.element),
    errorMessageTitle: PropTypes.string,
    showAddButtonLoader: PropTypes.bool,
    showEmailError: PropTypes.bool,
    userInfo: PropTypes.shape({
        id: PropTypes.string,
    }),
};

function mapStateToProps(state) {
    return {
        emailDetailList: state.userProfile.emailDetailList,
        errorMessageTitle: state.userProfile.errorMessageTitle,
        showAddButtonLoader: state.userProfile.showAddButtonLoader,
        showEmailError: state.userProfile.showEmailError,
        userInfo: state.user.info,
    };
}

export default connect(mapStateToProps)(EmailList);
