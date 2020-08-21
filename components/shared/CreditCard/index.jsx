import React, { Fragment } from 'react';
import {
    Form,
    Icon,
    Image,
    Input,
    Popup,
    Table,
} from 'semantic-ui-react';
import _ from 'lodash';
import {
    CardCVCElement,
    CardExpiryElement,
    CardNumberElement,
    injectStripe,
} from 'react-stripe-elements';
import getConfig from 'next/config';

import '../style/styles.less';
import cvvImg from '../../../static/images/ccv-diagram.png';
import { testCardList } from '../../../helpers/constants/index';
import { hasMinTwoChars } from '../../../helpers/give/giving-form-validation';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';

const { publicRuntimeConfig } = getConfig();

const {
    NODE_ENV
} = publicRuntimeConfig;
const headerRow = [
    'Type',
    'Number',
    'Behaviour',
];
const renderBodyRow = ({
    type, number,
    behaviour,
}, i) => ({
    cells: [
        type || 'No name specified',
        number ? {
            content: number,
            key: 'number',
        } : 'Unknown',
        behaviour ? {
            content: behaviour,
            key: 'behaviour',
        } : 'None',
    ],
    key: type || `row-${i}`,
});

const fontFamily = 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif';

const createOptions = () => {
    return {
        style: {
            base: {
                '::placeholder': {
                    color: '#bbb',
                    fontFamily,
                },
                color: '#000000',

                fontFamily,
            },
            invalid: {
                color: '#DB2828',
                fontFamily,
            },
        },
    };
};

class CreditCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            creditCardBrand: 'credit card',
            creditCardType: '',
            inValidCardNameValue: false,
            inValidCardNumber: false,
            inValidCvv: false,
            inValidExpirationDate: false,
            inValidNameOnCard: false,
            isStripeElementsValid: false,
            nameOnCard: '',
            showTestCardLabel: ' Show Test Cards',
            showTestCards: false,
        };
        this.handleTestCreditCardList = this.handleTestCreditCardList.bind(this);
        this.handleCCNoChange = this.handleCCNoChange.bind(this);
        this.handleCCNoBlur = this.handleCCNoBlur.bind(this);
        this.handleCCExpiryChange = this.handleCCExpiryChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNameBlur = this.handleNameBlur.bind(this);
        this.handleCvvChange = this.handleCvvChange.bind(this);
        this.handleOnLoad = this.handleOnLoad.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    handleOnLoad() {
        const {
            creditCardValidate,
            creditCardExpiryValidate,
            creditCardNameValidte,
            creditCardNameValueValidate,
            creditCardCvvValidate,
        } = this.props;
        this.setState({
            inValidCardNameValue: creditCardNameValueValidate,
            inValidCardNumber: creditCardValidate,
            inValidCvv: creditCardCvvValidate,
            inValidExpirationDate: creditCardExpiryValidate,
            inValidNameOnCard: creditCardNameValidte,
        });
    }

    handleCCNoChange(event) {
        const creditCardType = event.brand;
        const allowedCards = [
            'visa',
            'mastercard',
            'amex',
        ];
        const isValidCardType = _.includes(allowedCards, creditCardType);
        if (event.error || !isValidCardType) {
            this.setState({
                creditCardType,
                inValidCardNumber: true,
            });
        } else if (!event.empty && event.complete) {
            this.setState({
                creditCardType,
                inValidCardNumber: false,
            });
            this.props.creditCardElement(this.props.stripe, this.state.nameOnCard);
        }
        this.props.validateCCNo(this.state.inValidCardNumber);
    }

    handleCCNoBlur(event) {
        if (event.empty && !event.complete) {
            this.setState({
                inValidCardNumber: true,
            });
        }
    }

    handleCCExpiryChange(event) {
        if (event.error || event.empty) {
            this.setState({ inValidExpirationDate: true });
        } else if (!event.empty && event.complete) {
            this.props.creditCardElement(this.props.stripe, this.state.nameOnCard);
            this.setState({ inValidExpirationDate: false });
        }
        this.props.validateExpiraton(this.state.inValidExpirationDate);
    }

    handleNameChange(event) {
        const {
            name,
            value,
        } = event.target;

        this.setState({
            [name]: value,
        });
    }

    handleNameBlur(event) {
        const {
            value,
        } = event.target;

        const cardName = value.replace(/ /g,'');

        const format = /[ !@#$%^&*()_+\=\[\]{};:"\\|,<>\/?]/;
        const specialCharacters = format.test(cardName);

        let inValidCardNameValue = false;
        const letterNumber = /^\d+$/;
        if ((!cardName.match(letterNumber)) && !specialCharacters) {
            inValidCardNameValue = false;
        } else {
            inValidCardNameValue = true;
        }

        let isError = false;
        if (!hasMinTwoChars(value)) {
            isError = true;
        }
        this.setState({
            inValidCardNameValue,
            inValidNameOnCard: isError,
        });
        this.props.validateCardName(isError, inValidCardNameValue, this.state.nameOnCard);
    }

    handleCvvChange(event) {
        if (event.error || event.empty) {
            this.setState({ inValidCvv: true });
        } else if (!event.empty && event.complete) {
            this.props.creditCardElement(this.props.stripe, this.state.nameOnCard);
            this.setState({ inValidCvv: false });
        }
        this.props.validateCvv(this.state.inValidCvv);
    }

    // eslint-disable-next-line class-methods-use-this
    testCreditCardList() {
        return (
            <Table
                celled
                headerRow={headerRow}
                renderBodyRow={renderBodyRow}
                tableData={testCardList}
            />
        );
    }

    handleTestCreditCardList() {
        this.setState({
            showTestCardLabel: this.state.showTestCards ? ' Show Test Cards' : ' Hide Test Cards',
            showTestCards: !this.state.showTestCards,
        });
    }

    render() {
        const {
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            nameOnCard,
            showTestCards,
            showTestCardLabel,
        } = this.state;
        const { formatMessage } = this.props;
        return (
            <Form.Field className='addNewCard'>
                {
                    NODE_ENV !== 'production' && (
                        <Fragment>
                            <Form.Field>
                                <a onClick={this.handleTestCreditCardList}>
                                    {showTestCardLabel}
                                </a>
                            </Form.Field>
                            {
                                !!showTestCards && (
                                    <Form.Field>
                                        <label htmlFor="showCreditCardList">
                                            {formatMessage('giveCommon:creditCard.testCreditCardListMessage')}
                                        </label>
                                        <Form.Field>
                                            {this.testCreditCardList()}
                                        </Form.Field>
                                    </Form.Field>
                                )
                            }
                        </Fragment>
                    )
                }
                <Form.Field>
                    <label htmlFor="card-number">
                        {formatMessage('giveCommon:creditCard.cardNumberLabel')}
                    </label>
                    <CardNumberElement
                        className="field fieldCC"
                        id="card-number"
                        name="card-number"
                        placeholder="0000 0000 0000 0000"
                        onChange={this.handleCCNoChange}
                        onBlur={this.handleCCNoBlur}
                        {...createOptions()}
                    />
                    <FormValidationErrorMessage
                        condition={inValidCardNumber}
                        errorMessage={formatMessage('giveCommon:creditCardErrorMessages.errorCardNumber')}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="nameOnCard">
                        {formatMessage('giveCommon:creditCard.nameOnCardLabel')}
                    </label>
                    <Form.Field
                        control={Input}
                        id="nameOnCard"
                        name="nameOnCard"
                        onChange={this.handleNameChange}
                        onBlur={this.handleNameBlur}
                        placeholder={formatMessage('giveCommon:creditCard.nameOnCardPlaceholder')}
                        size="large"
                        value={nameOnCard}
                    />
                    <FormValidationErrorMessage
                        condition={inValidNameOnCard}
                        errorMessage={formatMessage('giveCommon:creditCardErrorMessages.invalidNameOnCard')}
                    />
                    <FormValidationErrorMessage
                        condition={!inValidNameOnCard && inValidCardNameValue}
                        errorMessage={formatMessage('giveCommon:creditCardErrorMessages.invalidCardNameError')}
                    />
                </Form.Field>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label htmlFor="card-expiration">
                            {formatMessage('giveCommon:creditCard.expiryDateLabel')}
                        </label>
                        <CardExpiryElement
                            className="field fieldCC"
                            id="card-expiration"
                            onChange={this.handleCCExpiryChange}
                            {...createOptions()}
                        />
                        <FormValidationErrorMessage
                            condition={inValidExpirationDate}
                            errorMessage={formatMessage('giveCommon:creditCardErrorMessages.invalidExpiryYear')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label htmlFor="card-cvv">
                            {formatMessage('giveCommon:creditCard.cvvLabel')}
                        </label>
                        <Popup
                            content={<Image src={cvvImg} />}
                            position="top center"
                            trigger={(
                                <Icon
                                    className="popCvv"
                                    color="blue"
                                    name="question circle"
                                    size="large"
                                />
                            )}
                        />
                        <CardCVCElement
                            className="field fieldCC"
                            id="card-cvv"
                            onChange={this.handleCvvChange}
                            placeholder="123"
                            {...createOptions()}
                        />
                        <FormValidationErrorMessage
                            condition={inValidCvv}
                            errorMessage={formatMessage('giveCommon:creditCardErrorMessages.invalidCvv')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form.Field>
        );
    }
}

export default injectStripe(CreditCard);
