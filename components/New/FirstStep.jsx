import React from 'react';
import {
    Button,
    Header,
    Form,
    Grid,
    Input,
} from 'semantic-ui-react';
import _ from 'lodash';

import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';

function FirstStep(props) {
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
        <Grid.Row stretched>
            <Grid.Column className="left-bg">
                <div></div>
            </Grid.Column>
            <Grid.Column>
                <div className="login-form-wraper">
                    <div className="reg-header">
                        <Header as="h3">Create the change you want to see in the world</Header>
                        <Header as="h4"> Tell us about yourself. </Header>
                    </div>
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
                            <label>
                                Last name
                            </label>
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
                        <div className="reg-btn-wraper">
                            {/* { firstName && lastName
                            && (<Button type="submit" onClick={handleSubmit} primary>Continue</Button>)}
                            { (!firstName || !lastName)
                            && (<Button type="submit" disabled onClick={handleSubmit} primary>Continue</Button>)} */}
                            <Button
                                type="submit"
                                id="signUpCreateName"
                                onClick={handleSubmit}
                                primary
                                disabled={!isButtonDisabled([
                                    'firstName',
                                    'lastName',
                                ])}
                            >
                                Continue
                            </Button>
                        </div>
                    </Form>
                </div>
            </Grid.Column>
        </Grid.Row>
    );
}

export default FirstStep;
