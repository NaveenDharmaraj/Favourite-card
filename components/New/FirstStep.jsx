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
        <Grid.Row>
            <Grid.Column className="left-bg"></Grid.Column>
            <Grid.Column>
                <div className="login-form-wraper">
                    <div className="reg-header">
                        <Header as="h3">Create the change you want to see in the world.</Header>
                        <Header as="h4"> Tell us about yourself. </Header>
                    </div>
                    <Form>
                        <Form.Field>
                            <label>First Name</label>
                            <Form.Field
                                control={Input}
                                id="firstName"
                                name="firstName"
                                value={_.isEmpty(firstName) ? '' : firstName}
                                onChange={parentInputChange}
                                onBlur={handleInputOnBlur}
                                error={!validity.isFirstNameNotNull}
                                placeholder="Your first name"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isFirstNameNotNull}
                                errorMessage="Please input your first name"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>
                                Last Name
                            </label>
                            <Form.Field
                                control={Input}
                                id="lastName"
                                name="lastName"
                                value={_.isEmpty(lastName) ? '' : lastName}
                                onChange={parentInputChange}
                                onBlur={handleInputOnBlur}
                                error={!validity.isLastNameNotNull}
                                placeholder="Your last name"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isLastNameNotNull}
                                errorMessage="Please input your last name"
                            />
                        </Form.Field>
                        <div className="reg-btn-wraper">
                            {/* { firstName && lastName
                            && (<Button type="submit" onClick={handleSubmit} primary>Continue</Button>)}
                            { (!firstName || !lastName)
                            && (<Button type="submit" disabled onClick={handleSubmit} primary>Continue</Button>)} */}
                            <Button type="submit" 
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
