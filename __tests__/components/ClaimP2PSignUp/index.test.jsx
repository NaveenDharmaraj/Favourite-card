import React from 'react';
import {
    shallow,
} from 'enzyme';

import { ClaimP2PSignUp } from '../../../components/ClaimP2PSignUp';
import FormValidationErrorMessage from '../../../components/shared/FormValidationErrorMessage';

const initializeComponent = (props = {}) => shallow(<ClaimP2PSignUp {...props} />);
describe('Testing ClaimP2PSignUp component form validations', () => {
    const t = jest.fn().mockImplementation((key) => key);
    const props = {
        claimToken: '1234',
        dispatch: jest.fn(),
        email: 'chimp@gmail.com',
        t,
    };
    const component = initializeComponent(props);
    describe('Testing signUp "First Name" input feilds', () => {
        it('Should render sign up first name label', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_label_firstName' }).text()).toBe('claimP2P_signUp.firstNameLabel');
        });
        it('Checking sign up first name input feild value', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' }).prop('value')).toBe('');
        });
        it('Should render sign up first name input feild placeholder', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' }).prop('placeholder')).toBe('claimP2P_signUp.firstNamePlaceholder');
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
            expect(component.find(FormValidationErrorMessage).at(1).dive().find('.error-message').text()).toEqual('<Icon />error:signUpValidationError.firstNameHaveLength2')
        });
        it('Should render FormValidationErrorMessage when the input field value is null', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' })
                .simulate('blur',
                    {}, {
                        name: 'firstName',
                        value: '',
                    });
            expect(component.state().validity.isFirstNameNotNull).toBe(false);
            expect(component.find(FormValidationErrorMessage).at(0).dive().find('.error-message').text()).toEqual('<Icon />error:signUpValidationError.firstNameNotNull')
        });
        it('Should render FormValidationErrorMessage when the input field value is null', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_firstName' })
                .simulate('blur',
                    {}, {
                        name: 'firstName',
                        value: '1234567891011121314151617181920chimp',
                    });
            expect(component.state().validity.isFirstnameLengthInLimit).toBe(false);
            expect(component.find(FormValidationErrorMessage).at(2).dive().find('.error-message').text()).toEqual('<Icon />error:signUpValidationError.firstnameLengthInLimit')
        });
    });
    describe('Testing signUp "Last Name" input feilds', () => {
        it('Should render sign up Last name label', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_label_lastName' }).text()).toBe('claimP2P_signUp.lastNameLabel');
        });
        it('Should render sign up last name input feild', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_lastName' }).prop('value')).toBe('');
        });
        it('Should render sign up last name input feild placeholder', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_lastName' }).prop('placeholder')).toBe('claimP2P_signUp.lastNamePlaceholder');
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
            expect(component.find(FormValidationErrorMessage).at(3).dive().find('.error-message').text()).toEqual('<Icon />error:signUpValidationError.lastNameNotNull')
        });
        it('Should render FormValidationErrorMessage when the input field value is null', () => {
            component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_lastName' })
                .simulate('blur',
                    {}, {
                        name: 'lastName',
                        value: '1234567891011121314151617181920chimp',
                    });
            expect(component.state().validity.isLastnameLengthInLimit).toBe(false);
            expect(component.find(FormValidationErrorMessage).at(4).dive().find('.error-message').text()).toEqual('<Icon />error:signUpValidationError.lastnameLengthInLimit')
        });
    });
    describe('Testing signUp "Email" input feilds', () => {
        it('Should render sign up Email label', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_label_email' }).text()).toBe('claimP2P_signUp.emailLabel');
        });
        it('Should render sign up email input feild', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_email' }).prop('value')).toBe(props.email);
        });
        it('Should disable sign up email input feild', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_inputFeild_email' }).prop('disabled')).toBe(true);
        });
    });
    describe('Testing signUp "Password" input feilds Validations', () => {
        it('Should render sign up Password label', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_label_password' }).text()).toBe('claimP2P_signUp.password');
        });
        it('Should render sign up password input feild', () => {
            expect(component.find('.passwordField').prop('value')).toBe('');
        });
        it('Should render sign up password input feild placeholder', () => {
            expect(component.find('.passwordField').prop('placeholder')).toBe('claimP2P_signUp.passwordPlaceholder');
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
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_passwordCount_Characters' }).text()).toBe('3/signUpPasswordValidation.noOfCharacter');
        });
        it('Should render lowercase letter in password input field value', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_passwordCharacter_lowerCase' }).text()).toBe('signUpPasswordValidation.lowerCaseCharacter');
        });
        it('Should render uppercase letter in password input field value', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_passwordCharacter_upperCase' }).text()).toBe('signUpPasswordValidation.upperCaseCharacter');
        });
        it('Should render special letter in password input field value', () => {
            expect(component.find({ 'data-test': 'ClaimP2PSignUp_passwordCharacter_specialCase' }).text()).toBe('signUpPasswordValidation.specialCharacter');
        });
        it('Triggering handleSubmit function for creating new acount and checking whether it got called', async () => {
            const fakeEvent = { preventDefault: () => console.log('preventDefault') };
            component.setState({ firstName: 'chimp', lastName: 'test', password: 'Abc123@#1Se' });  
            component.find({ 'data-test': 'ClaimP2PSignUp_submit_button' }).simulate('click', fakeEvent);
            expect(component.state().buttonClicked).toBe(true);
        });
    });
});
