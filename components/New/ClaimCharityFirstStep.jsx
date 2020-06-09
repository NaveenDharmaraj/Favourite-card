import React from 'react';
import {
    Container,
    Header,
    Button,
    Form,
    Input,
} from 'semantic-ui-react';
import _ from 'lodash';
import '../../static/less/claimcharity.less';
import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';

function OneLastStep(props) {
    const {
        firstName,
        handleSubmit,
        isButtonDisabled,
        lastName,
        parentInputChange,
        handleInputOnBlur,
        validity
    } = props;
    return (
        <div className="OneLastStepBanner">
            <Container>
                <div className="lefttopicon"></div>
                <div className="onelaststepwapper">
                    <div className="OneLastStepHeading">
                        <Header as='h3'>One last step</Header>
                    </div>
                    <div className="Onelaststepsubhesding">
                        <p>To finish creating your Charity Account, you’ll first need to open a personal Impact Account. It’s how you’ll access your new Charity Account.</p>
                    </div>
                    <div className="lefttopiconbox">
                        <Form>
                            <Form.Field>
                                <label>First name</label>
                                <Form.Field
                                    control={Input}
                                    id="firstName"
                                    name="firstName"
                                    value={_.isEmpty(firstName) ? '' : firstName}
                                    onChange={parentInputChange}
                                    onBlur={handleInputOnBlur}
                                    error={!validity.isFirstNameValid}
                                    placeholder="Your first name"
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isFirstNameNotNull}
                                    errorMessage="Please enter your first name"
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.doesFirstNameHave2 && validity.isFirstNameNotNull}
                                    errorMessage="First Name should have minimum 2 characters"
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isFirstnameLengthInLimit && validity.isFirstNameNotNull}
                                    errorMessage="First Name cannot have more than 30 characters"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Last name</label>
                                <Form.Field
                                    control={Input}
                                    id="lastName"
                                    name="lastName"
                                    value={_.isEmpty(lastName) ? '' : lastName}
                                    onChange={parentInputChange}
                                    onBlur={handleInputOnBlur}
                                    error={!validity.isLastNameValid}
                                    placeholder="Your last name"
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isLastNameNotNull}
                                    errorMessage="Please enter your last name"
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isLastnameLengthInLimit && validity.isLastNameNotNull}
                                    errorMessage="Last Name cannot have more than 30 characters"
                                />
                            </Form.Field>
                            <div className="OneLastbtn">
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className=" primary blue-btn-rounded w-180 pt-1 pb-1"
                                    disabled={!isButtonDisabled([
                                        'firstName',
                                        'lastName',
                                    ])}
                                >
                                    Continue
                                </Button>
                                <p>Already have an account? <a href="#" className="login-btn">Log in</a></p>
                            </div>
                        </Form>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default OneLastStep;