/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import _ from 'lodash';
import {
    Button,
    Header,
    Form,
    Modal,
    Grid,
    List,
    Dropdown,
    Checkbox,
    Table,
    Loader,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import {
    Elements,
    StripeProvider
} from 'react-stripe-elements';

import {
    Link,
} from '../../../routes';
import { withTranslation } from '../../../i18n';
import {
    getMyCreditCards,
    editUserCreditCard,
    deleteUserCreditCard,
    saveNewCreditCard,
    setUserDefaultCard,
    getPaymentInstrumentById,
} from '../../../actions/userProfile';
import Pagination from '../../shared/Pagination';
import PlaceHolderGrid from '../../shared/PlaceHolder';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import { populateCardData } from '../../../helpers/give/utils';
import { validateDate } from '../../../helpers/utils';

const CreditCard = dynamic(() => import('../../shared/CreditCard'));

const { publicRuntimeConfig } = getConfig();

const {
    STRIPE_KEY
} = publicRuntimeConfig;

class MyCreditCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: false,
            deleteButtonClicked: false,
            editButtonClicked: false,
            errorMessage: null,
            currentActivePage: 1,
            isAddModalOpen: false,
            isEditModalOpen: false,
            isDeleteMessageOpen: false,
            isDropdownOpen: false,
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            isDefaultCardReadOnly: false,
            isDefaultCard: false,
            deleteConfirmCard: '',
            deletePaymentInstrumentId: '',
            editDetails: {
                editCardNumber: '',
                editNameOnCard: '',
                editPaymetInstrumentId: '',
                expiry: '',
                isValidExpiry: true,
            },
            creditCard: {
                value: 0,
            },
            stripeCreditCard: '',
            cardHolderName: '',
            myCreditCardListLoader: !props.userCreditCardList,
        };
        this.onPageChanged = this.onPageChanged.bind(this);
        this.validateStripeCreditCardNo = this.validateStripeCreditCardNo.bind(this);
        this.validateStripeExpirationDate = this.validateStripeExpirationDate.bind(this);
        this.validateCreditCardCvv = this.validateCreditCardCvv.bind(this);
        this.validateCreditCardName = this.validateCreditCardName.bind(this);
        this.getStripeCreditCard = this.getStripeCreditCard.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEditSave = this.handleEditSave.bind(this);
        this.handleDeleteConfirmClick = this.handleDeleteConfirmClick.bind(this);
        this.handleDeleteCancelClick = this.handleDeleteCancelClick.bind(this);
        this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
        this.handleAddCardClick = this.handleAddCardClick.bind(this);
        this.handleSetPrimaryClick = this.handleSetPrimaryClick.bind(this);
        this.handleCCAddClose = this.handleCCAddClose.bind(this);
        this.handleEditExpiryBlur = this.handleEditExpiryBlur.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        getMyCreditCards(dispatch, id, 1);
    }

    componentDidUpdate(prevProps) {
        const {
            newCreditCardApiCall,
            userCreditCardList,
        } = this.props;
        let {
            currentActivePage,
            myCreditCardListLoader,
            isAddModalOpen,
        } = this.state;
        if (!_.isEqual(userCreditCardList, prevProps.userCreditCardList)) {
            myCreditCardListLoader = false;
            if (userCreditCardList.updatedCurrentActivePage > 0 && (userCreditCardList.updatedCurrentActivePage !== prevProps.userCreditCardList.updatedCurrentActivePage)) {
                currentActivePage = userCreditCardList.updatedCurrentActivePage;
            }
            this.setState({ currentActivePage, myCreditCardListLoader });
        }
        if (!_.isEqual(newCreditCardApiCall, prevProps.newCreditCardApiCall)) {
            isAddModalOpen = newCreditCardApiCall;
            this.setState({ isAddModalOpen });
        }
    }

    onOpen=()=>{
        this.setState({ isDropdownOpen: true });
    }
    onClose = () => {
        this.setState({ isDropdownOpen: false });
    }

    isValidCC(
        creditCard,
        inValidCardNumber,
        inValidExpirationDate,
        inValidNameOnCard,
        inValidCvv,
        inValidCardNameValue,
    ) {
        let validCC = true;
        if (creditCard.value === 0) {
            this.CreditCard.handleOnLoad(
                inValidCardNumber,
                inValidExpirationDate,
                inValidNameOnCard,
                inValidCvv,
                inValidCardNameValue,
            );
            validCC = (
                !inValidCardNumber &&
                !inValidExpirationDate &&
                !inValidNameOnCard &&
                !inValidCvv &&
                !inValidCardNameValue
            );
        }

        return validCC;
    }

    handleAddCardClick() {
        const {
            dispatch,
            userCreditCardList,
        } = this.props;
        let {
            isDefaultCard,
            isDefaultCardReadOnly,
        } = this.state;
        dispatch({
            payload: {
                newCreditCardApiCall: true,
            },
            type: 'ADD_NEW_CREDIT_CARD_STATUS',
        });
        if (userCreditCardList.count === 0) {
            isDefaultCard = true;
            isDefaultCardReadOnly = true;
        } else
            isDefaultCard = false; {
            isDefaultCardReadOnly = false;
        }
        this.setState({
            isAddModalOpen: true,
            isDefaultCard,
            isDefaultCardReadOnly,
        });
    }

    handleCCAddClose() {
        const {
            dispatch
        } = this.props;
        dispatch({
            payload: {
                newCreditCardApiCall: false,
            },
            type: 'ADD_NEW_CREDIT_CARD_STATUS',
        });
        this.setState({ isAddModalOpen: false });
    }

    handleAddButtonClick() {
        const {
            creditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isDefaultCard,
            isAddModalOpen,
            stripeCreditCard,
            cardHolderName,
            currentActivePage,
        } = this.state;
        const validateCC = this.isValidCC(
            creditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        );
        if(validateCC) {
            this.setState({
                buttonClicked: true,
            });
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            saveNewCreditCard(dispatch, stripeCreditCard, cardHolderName, id, isDefaultCard, currentActivePage).then(() => {
                this.setState({
                    buttonClicked: false,
                    isAddModalOpen: false,
                });
            }).catch((err) => {
                this.setState({
                    buttonClicked: false,
                    isAddModalOpen: false,
                });
            });
        }
    }

    handleSetPrimaryClick(event, data) {
        let {
            isDefaultCard,
        } = this.state;
        isDefaultCard = data.checked;
        this.setState({ isDefaultCard });
    }

    handleEditClick(paymentInstrument) {
        const lastFour = `**** **** **** ${paymentInstrument.attributes.description.slice(-4)}`;
        const cardName = paymentInstrument.attributes.description.slice(0, -17);
        const cardNameOnly = cardName.substr(0, cardName.indexOf("'"));
        const defaultCard = paymentInstrument.attributes.default ? true : false;
        let isDefaultCardReadOnly = false;
        if (defaultCard) {
            isDefaultCardReadOnly = true;
        } else {
            isDefaultCardReadOnly = false;
        }
        this.setState({
            isEditModalOpen: true,
            isDropdownOpen: false,
            isDefaultCardReadOnly,
            isDefaultCard: defaultCard,
            editDetails: {
                editCardNumber: lastFour,
                editNameOnCard: cardNameOnly,
                editPaymetInstrumentId: paymentInstrument.id,
                isValidExpiry: true,
            }
        });
    }

    handleInputChange(event, data) {
        const {
            name,
            options,
            value,
        } = data;
        const {
            editDetails,
        } = this.state;
        let newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        if (editDetails[name] !== newValue) {
            editDetails[name] = newValue;
        }
        this.setState({
            editDetails: {
                ...this.state.editDetails,
                ...editDetails,
            },
        });
    }

    handleKeyUp(event) {
        let code = event.keyCode;
        let allowedKeys = [8];
        if (allowedKeys.indexOf(code) !== -1) {
            return;
        }

        event.target.value = event.target.value.replace(
            /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
        ).replace(
            /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
        ).replace(
            /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
        ).replace(
            /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
        ).replace(
            /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
        ).replace(
            /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
        ).replace(
            /\/\//g, '/' // Prevent entering more than 1 `/`
        );
    }

    handleEditExpiryBlur(event, data) {
        const {
            value,
        } = !_.isEmpty(data) ? data : event.target;
        const {
            editDetails,
        } = this.state;

        //const expiryRegex = new RegExp(/^((0[1-9])|(1[0-2]))\/((2019)|(20[1-3][0-9]))$/);
        const isValid = validateDate(value);
        editDetails.isValidExpiry = isValid;
        this.setState({
            editButtonClicked: !isValid,
            editDetails: {
                ...this.state.editDetails,
                ...editDetails,
            },
        });
    }

    validateEditForm() {
        const {
            editDetails: {
                expiry,
            }
        } = this.state;
        let {
            editDetails: {
                isValidExpiry,
            }
        } = this.state;
        //const expiryRegex = new RegExp(/^((0[1-9])|(1[0-2]))\/((2019)|(20[1-3][0-9]))$/);
        isValidExpiry = validateDate(expiry);
        this.setState({
            editDetails: {
                ...this.state.editDetails,
                isValidExpiry,
            }
        });
        if (isValidExpiry) {
            return true;
        }
        return false;
    }

    handleEditSave() {
        this.setState({
            editButtonClicked: true,
        });
        const isEditDataValid = this.validateEditForm();
        if (isEditDataValid) {
            const {
                editDetails,
                isDefaultCard,
                currentActivePage,
            } = this.state;
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            editUserCreditCard(dispatch, editDetails).then(() => {
                this.setState({
                    editButtonClicked: false,
                });
                this.setState({
                    editDetails: {
                        editCardNumber: '',
                        editNameOnCard: '',
                        editPaymetInstrumentId: '',
                        expiry: '',
                        isValidExpiry: true,
                    },
                    isDefaultCard: false,
                    isEditModalOpen: false,
                })
            }).catch((err) => {
                this.setState({
                    editButtonClicked: false,
                });
            });;
            if (isDefaultCard) {
                setUserDefaultCard(dispatch, editDetails.editPaymetInstrumentId, id, currentActivePage);
            }
        } else {
            this.setState({
                editButtonClicked: false,
            });
        }
    }

    handleDeleteClick(cardData, deletePaymentInstrumentId) {
        const {
            dispatch,
        } = this.props;
        const cardDetails = populateCardData(cardData);
        const cardType = _.startCase(cardDetails.processor);
        const formatMessage = this.props.t;
        const deleteConfirmMessage = formatMessage(
            'giveCommon:creditCard.deleteCreditCardMsg',
            {
                cardType,
                truncatedPaymentId: cardDetails.truncatedPaymentId,
            },
        );
        dispatch(getPaymentInstrumentById(deletePaymentInstrumentId));
        this.setState({
            isDeleteMessageOpen: true,
            isDropdownOpen:false,
            deleteConfirmCard: deleteConfirmMessage,
            deletePaymentInstrumentId,
        });
    }

    handleDeleteConfirmClick() {
        const {
            deletePaymentInstrumentId,
            currentActivePage,
        } = this.state;
        const {
            dispatch,
            currentUser: {
                id,
            },
        } = this.props;
        this.setState({
            deleteButtonClicked: true,
        });
        if(deletePaymentInstrumentId != null) {
            deleteUserCreditCard(dispatch, deletePaymentInstrumentId, id, currentActivePage).then(() => {
                this.setState({
                    deleteButtonClicked: false,
                    isDeleteMessageOpen: false,
                });
            }).catch((err) => {
                this.setState({
                    deleteButtonClicked: false,
                    isDeleteMessageOpen: false,
                });
            });
        } else {
            this.setState({
                deleteButtonClicked: false,
            });
        }
    }

    handleDeleteCancelClick() {
        this.setState({
            isDeleteMessageOpen: false,
            deletePaymentInstrumentId: '',
        })
    }

    onPageChanged(event, data) {
        // console.log(data);
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        getMyCreditCards(dispatch, id, data.activePage);
        window.scrollTo(0, 0);
        this.setState({
            currentActivePage: data.activePage,
            myCreditCardListLoader: true,
        });
    }

    /**
     * validateStripeElements
     * @param {boolean} inValidCardNumber credit card number
     * @return {void}
     */
    validateStripeCreditCardNo(inValidCardNumber) {
        this.setState({ inValidCardNumber });
    }

    /**
     * validateStripeElements
     * @param {boolean} inValidExpirationDate credit card expiry date
     * @return {void}
     */
    validateStripeExpirationDate(inValidExpirationDate) {
        this.setState({ inValidExpirationDate });
    }

    /**
     * validateStripeElements
     * @param {boolean} inValidCvv credit card CVV
     * @return {void}
     */
    validateCreditCardCvv(inValidCvv) {
        this.setState({ inValidCvv });
    }

    /**     
     * @param {boolean} inValidNameOnCard credit card Name
     * @param {boolean} inValidCardNameValue credit card Name Value
     * @param {string} cardHolderName credit card Name Data
     * @return {void}
     */
    validateCreditCardName(inValidNameOnCard, inValidCardNameValue, cardHolderName) {
        let cardNameValid = inValidNameOnCard;
        if (cardHolderName.trim() === '' || cardHolderName.trim() === null) {
            cardNameValid = true;
        } else {
            this.setState({
                cardHolderName,
            });
        }
        this.setState({
            inValidCardNameValue,
            inValidNameOnCard: cardNameValid,
        });
    }

    getStripeCreditCard(data, cardHolderName) {
        this.setState({
            cardHolderName,
            stripeCreditCard: data,
        });
    }

    renderMyCreditCards() {
        const {
            userCreditCardList,
        } = this.props;
        const {
            currentActivePage,
            isDropdownOpen,
        } = this.state;
        let cardList = (
            <div className='noCard'>No credit card added yet</div>
        );
        if (!_.isEmpty(userCreditCardList) && _.size(userCreditCardList.data) > 0) {
            cardList = userCreditCardList.data.map((data) => {
                const lastFour = data.attributes.description.slice(-4);
                const cardName = data.attributes.description.slice(0, -17);
                let processor = ''; let cardClass = '';
                const isEnglishCard = data.attributes.description.indexOf(' ending ');
                const selectedCardName = _.split(data.attributes.description, ' ');
                if (isEnglishCard !== -1) {
                    processor = selectedCardName[selectedCardName.indexOf('ending') - 1].toLowerCase().trim();
                } else {
                    processor = selectedCardName[0].toLowerCase().trim();
                }
                if (processor.toLowerCase() === 'visa') {
                    cardClass = 'card visa';
                } else if(processor.toLowerCase() == 'mastercard') {
                    cardClass = 'card master';
                } else {
                    cardClass = 'card american';
                }
                const primary = data.attributes.default ? 'Primary' : '';
                const showActiveDetails = (data.attributes.activeMonthlyDonations > 0) ? true : false;
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Dropdown className="rightBottom" icon="ellipsis horizontal">
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        text="Edit"
                                        open={isDropdownOpen}
                                        onOpen={this.onOpen}
                                        onClose={this.onClose}
                                        onClick={() => { this.handleEditClick(data) }}
                                    />
                                    <Dropdown.Item
                                        disabled={showActiveDetails}
                                        text="Delete"
                                        open={isDropdownOpen}
                                        onOpen={this.onOpen}
                                        onClose={this.onClose}
                                        onClick={() => { this.handleDeleteClick(data.attributes.description, data.id) }}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </List.Content>
                        <List.Icon name={cardClass} size="large" verticalAlign="middle" />
                        <List.Content>
                            <div className='creditCardWrap'>
                                <div className='creditcardDetails'>
                                    <List.Header><span>{cardName}</span>
                                    {
                                        !_.isEmpty(primary) 
                                        &&
                                        (
                                            <span className="primary">{primary}</span>
                                        )
                                    }
                                    </List.Header>
                                    <div className="cardNo"><sup>**** **** **** </sup>{lastFour}</div>
                                </div>
                                {
                                    (showActiveDetails) && (
                                        <p>This card is linked to an active monthly deposit. If you need to delete this card, please <Link route={"/user/recurring-donations"}><a>update your monthly deposit</a></Link> first. </p>
                                    )
                                }
                            </div>
                        </List.Content>

                    </List.Item>
                );
            });
        }
        return (
            <Fragment>
                <List celled verticalAlign="middle">
                    {cardList}
                </List>
                <div className="db-pagination  pt-2">
                    {
                        !_.isEmpty(userCreditCardList) && userCreditCardList.pageCount > 1 && (
                            <Pagination
                                activePage={currentActivePage}
                                totalPages={userCreditCardList.pageCount}
                                onPageChanged={this.onPageChanged}
                            />
                        )
                    }
                </div>
            </Fragment>
        );
    }

    render() {
        const {
            buttonClicked,
            deleteButtonClicked,
            editButtonClicked,
            isAddModalOpen,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isDefaultCard,
            isDefaultCardReadOnly,
            deleteConfirmCard,
            editDetails: {
                editCardNumber,
                editNameOnCard,
                expiry,
                isValidExpiry,
            },
            myCreditCardListLoader,
        } = this.state;
        const formatMessage = this.props.t;
        const {
            activeMonthlyDonations
        } = this.props;
        let deleteCreditCardPopUpMsg = deleteConfirmCard;
        if (activeMonthlyDonations > 0) {
            deleteCreditCardPopUpMsg = `${deleteConfirmCard} ${formatMessage('giveCommon:creditCard.deleteCreditCardMsgActiveSubscription')}`;
        }
        return (
            <div>
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper heading brdr-btm pb-1 pt-2 pMethodHead">
                        <Grid verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={11} computer={11}>
                                    <Header as="h4" className="mb-0">Payment methods </Header>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={5} computer={5}>
                                    <div className="right-align-btn">
                                        <Modal
                                            size="tiny"
                                            dimmer="inverted"
                                            className="chimp-modal"
                                            closeIcon
                                            open={isAddModalOpen}
                                            onClose={this.handleCCAddClose}
                                            trigger={<Button
                                                className="success-btn-rounded-def"
                                                onClick={this.handleAddCardClick}
                                            >
                                                Add new card
                                                </Button>}>
                                            <Modal.Header>Add new card</Modal.Header>
                                            <Modal.Content>
                                                <Modal.Description className="font-s-16 pad-0">
                                                    <Form>
                                                        <StripeProvider apiKey={STRIPE_KEY}>
                                                            <Elements>
                                                                <CreditCard
                                                                    creditCardElement={this.getStripeCreditCard}
                                                                    creditCardValidate={inValidCardNumber}
                                                                    creditCardExpiryValidate={inValidExpirationDate}
                                                                    creditCardNameValidte={inValidNameOnCard}
                                                                    creditCardNameValueValidate={inValidCardNameValue}
                                                                    creditCardCvvValidate={inValidCvv}
                                                                    validateCCNo={this.validateStripeCreditCardNo}
                                                                    validateExpiraton={this.validateStripeExpirationDate}
                                                                    validateCvv={this.validateCreditCardCvv}
                                                                    validateCardName={this.validateCreditCardName}
                                                                    formatMessage={formatMessage}
                                                                    // eslint-disable-next-line no-return-assign
                                                                    onRef={(ref) => (this.CreditCard = ref)}
                                                                />
                                                            </Elements>
                                                        </StripeProvider>
                                                        <Form.Field
                                                            checked={isDefaultCard}
                                                            control={Checkbox}
                                                            className="ui checkbox chkMarginBtm checkboxToRadio"
                                                            id="isDefaultCard"
                                                            label="Set as primary card"
                                                            name="isDefaultCard"
                                                            onChange={this.handleSetPrimaryClick}
                                                            readOnly={isDefaultCardReadOnly}
                                                        />
                                                    </Form>
                                                </Modal.Description>
                                                <div className="btn-wraper pt-2 text-right">
                                                    <Button
                                                        className="blue-btn-rounded-def h-40"
                                                        onClick={this.handleAddButtonClick}
                                                        disabled={buttonClicked}
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
                    </div>
                        <div className="userCardList paymentCards border-top-0">
                            {myCreditCardListLoader
                                ? (
                                    <Table padded unstackable className="no-border-table">
                                        <PlaceHolderGrid row={2} column={2} placeholderType="table" />
                                    </Table>
                                )
                                : (
                                    this.renderMyCreditCards()
                                )}
                        </div>
                </div>
                <div>
                    <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon open={this.state.isEditModalOpen} onClose={() => { this.setState({ isEditModalOpen: false }) }}>
                        <Modal.Header>Edit credit card</Modal.Header>
                        <Modal.Content>
                            <Modal.Description className="font-s-16 pad-0">
                                <Form>
                                    <Form.Field className='addNewCard'>
                                        <label>Card number</label>
                                        <input
                                            placeholder="Card number"
                                            disabled
                                            value={editCardNumber}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Name on card</label>
                                        <input
                                            placeholder="Name on card"
                                            disabled
                                            value={editNameOnCard}
                                        />
                                    </Form.Field>
                                    <Form.Group widths="equal">
                                        <Form.Field>
                                            <Form.Input
                                                fluid
                                                label="Expiry"
                                                placeholder="MM/YY"
                                                id="expiry"
                                                name="expiry"
                                                maxLength="5"
                                                error={!isValidExpiry}
                                                onBlur={this.handleEditExpiryBlur}
                                                onChange={this.handleInputChange}
                                                onKeyUp={(e) => {this.handleKeyUp(e)}}
                                                value={expiry}
                                            />
                                            <FormValidationErrorMessage
                                                condition={!isValidExpiry}
                                                errorMessage="Please enter a valid expiry."
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Field
                                        checked={isDefaultCard}
                                        control={Checkbox}
                                        className="ui checkbox chkMarginBtm checkboxToRadio"
                                        id="isDefaultCard"
                                        label="Set as primary card"
                                        name="isDefaultCard"
                                        onChange={this.handleSetPrimaryClick}
                                        readOnly={isDefaultCardReadOnly}
                                    />
                                </Form>
                            </Modal.Description>
                            <div className="btn-wraper text-right">
                                <Button
                                    className="blue-btn-rounded-def h-40"
                                    onClick={this.handleEditSave}
                                    disabled={editButtonClicked}
                                >
                                    Save
                                </Button>
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
                <div>
                    <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon open={this.state.isDeleteMessageOpen} onClose={() => { this.setState({ isDeleteMessageOpen: false }) }}>
                        <Modal.Header>Delete card?</Modal.Header>
                        <Modal.Content>
                            {this.props.deleteMsgPopUpLoader ?
                                <Loader size='small' />
                                :
                                <Modal.Description className="font-s-14 pad-0">
                                    {deleteCreditCardPopUpMsg}
                                </Modal.Description>
                            }
                            <div className="btn-wraper pt-2 text-right">
                                <Button
                                    className="danger-btn-rounded-def c-small"
                                    onClick={this.handleDeleteConfirmClick}
                                    disabled={(deleteButtonClicked || this.props.deleteMsgPopUpLoader)}
                                >
                                    Delete
                            </Button>
                                <Button
                                    className="blue-bordr-btn-round-def c-small"
                                    onClick={this.handleDeleteCancelClick}
                                    disabled={deleteButtonClicked}
                                >
                                    Cancel
                            </Button>
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        activeMonthlyDonations: state.userProfile.activeMonthlyDonations,
        deleteMsgPopUpLoader: state.userProfile.deleteMsgPopUpLoader,
        userCreditCardList: state.userProfile.userCreditCardList,
        newCreditCardApiCall: state.userProfile.newCreditCardApiCall,
    };
}

MyCreditCards.defaultProps = {
    activeMonthlyDonations: 0,
    deleteMsgPopUpLoader: false,
}

export default withTranslation(['giveCommon'])(connect(mapStateToProps)(MyCreditCards))
