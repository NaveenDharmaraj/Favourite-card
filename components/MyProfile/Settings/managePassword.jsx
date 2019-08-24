import React from 'react';
import jwt from 'jwt-decode';
import _ from 'lodash';
import {
    Button,
    Input,
    Form,
} from 'semantic-ui-react';

import storage from '../../../helpers/storage';
import validateUserRegistrationForm from '../../../helpers/users/utils';

class ManagePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authId: this.getAuthId(),
            password: '',
            validity: {
                isPasswordValid: false,
            },
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this
    getAuthId() {
        const token = storage.get('auth0AccessToken', 'cookie');
        const { sub } = jwt(token);
        return sub;
    }

    handleInputChange(event, data) {
        const {
            options,
            value,
        } = data;
        let {
            validity,
        } = this.state;
        const newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        validity = validateUserRegistrationForm('password', newValue, validity);
        this.setState({
            password: newValue,
            validity: {
                ...this.state.validity,
                validity,
            },
        });
    }

    render() {
        const {
            password,
            validity,
        } = this.state;
        const pwdCharCount = (password) ? password.length : 0;
        return (
            <div>
                <Form>
                    <Form.Field>
                        <label htmlFor="password">New Password</label>
                        <Form.Field
                            control={Input}
                            id="password"
                            name="password"
                            type="password"
                            value={_.isEmpty(password) ? '' : password}
                            onChange={this.handleInputChange}
                            placeholder="New Password"
                        />
                    </Form.Field>
                    <p>
                        <span className={(validity.doesPwdHaveCount) ? 'blueText' : ''}>
                            {pwdCharCount}
                            / 8 Characters,
                        </span>
                        <span className={(validity.doesPwdhaveLowerCase) ? 'blueText' : ''}> Lowercase letters (a-z), </span>
                        <span className={(validity.doesPwdhaveUpperCase) ? 'blueText' : ''}>Uppercase letters (A-Z), </span>
                        <span className={(validity.doesPwdhaveSpecialChars) ? 'blueText' : ''}>Special characters (e.g. !@#$%^&)</span>
                    </p>
                    <div className="pt-2">
                        <Button className="blue-btn-rounded-def w-140" disabled={ !validity.isPasswordValid }>Save</Button>
                        <Button className="blue-bordr-btn-round-def w-140">Cancel</Button>
                    </div>
                </Form>
            </div>
        );
    }
}

export default ManagePassword;
