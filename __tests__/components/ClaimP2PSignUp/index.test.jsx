import React from 'react';
import {
    shallow,
} from 'enzyme';
import mockAxios from 'axios';

import ClaimP2PSignUp from '../../../components/ClaimP2PSignUp';
import FormValidationErrorMessage from '../../../components/shared/FormValidationErrorMessage';

const initializeComponent = (props = {}) => shallow(<ClaimP2PSignUp {...props} />);
describe('Testing ClaimP2PSignUp component form validations', () => {
    const props = {
        claimToken: '1234',
        email: 'chimp@gmail.com',
    };
    const component = initializeComponent(props);
    describe('Testing signUp "First Name" input feilds', () => {
        it('Should render sign up first name label', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_label_firstName' }).text()).toBe('First name');
        });
        it('Checking sign up first name input feild value', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' }).prop('value')).toBe('');
        });
        it('Should render sign up first name input feild placeholder', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' }).prop('placeholder')).toBe('Your first name');
        });
        it('Should change the first name value on user changing the text inside input box', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' })
                .simulate('change',
                    {}, {
                        name: 'firstName',
                        value: 'chimp',
                    });
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' }).prop('value')).toBe('chimp');
        });
        it('Should render FormValidationErrorMessage when the input field value is having length less than 2', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' })
                .simulate('blur',
                    {}, {
                        name: 'firstName',
                        value: 'c',
                    });
            expect(component.state().validity.doesFirstNameHave2).toBe(false);
            expect(component.find(FormValidationErrorMessage).at(1).dive().find('.error-message').text()).toEqual('<Icon />First Name should have minimum 2 characters')
        });
        it('Should render FormValidationErrorMessage when the input field value is null', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' })
                .simulate('blur',
                    {}, {
                        name: 'firstName',
                        value: '',
                    });
            expect(component.state().validity.isFirstNameNotNull).toBe(false);
            expect(component.find(FormValidationErrorMessage).at(0).dive().find('.error-message').text()).toEqual('<Icon />Please enter your first name')
        });
        it('Should render FormValidationErrorMessage when the input field value is null', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' })
                .simulate('blur',
                    {}, {
                        name: 'firstName',
                        value: '1234567891011121314151617181920chimp',
                    });
            expect(component.state().validity.isFirstnameLengthInLimit).toBe(false);
            expect(component.find(FormValidationErrorMessage).at(2).dive().find('.error-message').text()).toEqual('<Icon />First Name cannot have more than 30 characters')
        });
    });
    describe('Testing signUp "Last Name" input feilds', () => {
        it('Should render sign up Last name label', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_label_lastName' }).text()).toBe('Last name');
        });
        it('Should render sign up last name input feild', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_lastName' }).prop('value')).toBe('');
        });
        it('Should render sign up last name input feild placeholder', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_lastName' }).prop('placeholder')).toBe('Your last name');
        });
        it('Should change the last name value on user changing the text inside input box', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_lastName' })
                .simulate('change',
                    {}, {
                        name: 'lastName',
                        value: 'chimp',
                    });
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_lastName' }).prop('value')).toBe('chimp');
        });
        it('Should render FormValidationErrorMessage when the input field value is null', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_lastName' })
                .simulate('blur',
                    {}, {
                        name: 'lastName',
                        value: '',
                    });
            expect(component.state().validity.isLastNameNotNull).toBe(false);
            expect(component.find(FormValidationErrorMessage).at(3).dive().find('.error-message').text()).toEqual('<Icon />Please enter your last name')
        });
        it('Should render FormValidationErrorMessage when the input field value is null', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_lastName' })
                .simulate('blur',
                    {}, {
                        name: 'lastName',
                        value: '1234567891011121314151617181920chimp',
                    });
            expect(component.state().validity.isLastnameLengthInLimit).toBe(false);
            expect(component.find(FormValidationErrorMessage).at(4).dive().find('.error-message').text()).toEqual('<Icon />Last Name cannot have more than 30 characters')
        });
    });
    describe('Testing signUp "Email" input feilds', () => {
        it('Should render sign up Email label', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_label_email' }).text()).toBe('Email');
        });
        it('Should render sign up email input feild', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_email' }).prop('value')).toBe(props.email);
        });
        it('Should render sign up email input feild placeholder', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_email' }).prop('placeholder')).toBe('Enter your email');
        });
        it('Should disable sign up email input feild', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_email' }).prop('disabled')).toBe(true);
        });
    });
    describe('Testing signUp "Password" input feilds Validations', () => {
        it('Should render sign up Password label', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_label_password' }).text()).toBe('Password');
        });
        it('Should render sign up password input feild', () => {
            expect(component.find('.passwordField').prop('value')).toBe('');
        });
        it('Should render sign up password input feild placeholder', () => {
            expect(component.find('.passwordField').prop('placeholder')).toBe('Choose your password');
        });
        it('Should render sign up password input feild placeholder', () => {
            expect(component.find('.passwordField').prop('placeholder')).toBe('Choose your password');
        });
        it('Should change the password value on user changing the text inside input box', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_password' })
                .simulate('change',
                    {}, {
                        name: 'password',
                        value: 'pwd',
                    });
            expect(component.find('.passwordField').prop('value')).toBe('pwd');
        });
        it('Should render number of password characters in password input field value', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_passwordCount_Characters' }).text()).toBe('3/8 characters,');
        });
        it('Should render lowercase letter in password input field value', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_passwordCharacter_lowerCase' }).text()).toBe('lowercase letters (a-z),');
        });
        it('Should render uppercase letter in password input field value', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_passwordCharacter_upperCase' }).text()).toBe('uppercase letters (A-Z),');
        });
        it('Triggering handleSubmit function for creating new acount and checking whether it got called', async () => {
            mockAxios.post.mockImplementationOnce(() => Promise.resolve({
                data: { results: '1' },
            }));
            const fakeEvent = { preventDefault: () => { } };
            component.setState({
                firstName: 'chimp',
                lastName: 'test',
                password: 'Abc123@#1Se' 
            });
            component.find({ 'data-test': 'ClaimP2PSignUp_submit_button' }).simulate('click', fakeEvent);
            expect.assertions(2);
            expect(component.state().buttonClicked).toBe(true);
            expect(mockAxios.post).toHaveBeenCalledTimes(1);
        });
    });
});
