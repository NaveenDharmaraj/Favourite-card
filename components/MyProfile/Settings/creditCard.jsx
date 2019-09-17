/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
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
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import {
    Elements,
    StripeProvider
} from 'react-stripe-elements';

import { withTranslation } from '../../../i18n';
import {
    getMyCreditCards,
    editUserCreditCard,
    deleteUserCreditCard,
    saveNewCreditCard,
    setUserDefaultCard,
} from '../../../actions/userProfile';
import Pagination from '../../shared/Pagination';
import PlaceHolderGrid from '../../shared/PlaceHolder';

const CreditCard = dynamic(() => import('../../shared/CreditCard'));

const { publicRuntimeConfig } = getConfig();

const {
    STRIPE_KEY
} = publicRuntimeConfig;

class MyCreditCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
                editMonth: '',
                editYear: '',
                isValidMonth: '',
                isValidYear: '',
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
            myCreditCardListLoader,
            isAddModalOpen,
        } = this.state;
        if (!_.isEqual(userCreditCardList, prevProps.userCreditCardList)) {
            myCreditCardListLoader = false;
            this.setState({ myCreditCardListLoader });
        }
        if(!_.isEqual(newCreditCardApiCall, prevProps.newCreditCardApiCall)) {
            isAddModalOpen = newCreditCardApiCall;
            this.setState({ isAddModalOpen });
        }
    }

    onOpen=()=>{
        this.setState({isDropdownOpen:true});
    }
    onClose=()=>{
        this.setState({isDropdownOpen:false});
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
        } else {
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
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            saveNewCreditCard(dispatch, stripeCreditCard, cardHolderName, id, isDefaultCard, currentActivePage);            
            this.setState({ isDefaultCard: false });
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
        const newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
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

    validateEditForm() {
        const {
            editDetails: {
                editMonth,
                editYear,
                editPaymetInstrumentId,
            }
        } = this.state;
        let {
            editDetails: {
                isValidMonth,
                isValidYear
            }
        } = this.state;
        isValidMonth = !(!editMonth || editMonth.length === 0);
        isValidYear = !(!editYear || editYear.length === 0);
        this.setState({
            editDetails: {
                isValidMonth,
                isValidYear,
            }
        });
        if(isValidMonth && isValidYear) {
            return true;
        }
        return false;
    }

    handleEditSave() {
        const isEditDataValid = this.validateEditForm();
        if(isEditDataValid) {
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
            editUserCreditCard(dispatch, editDetails);
            if (isDefaultCard) {
                setUserDefaultCard(dispatch, editDetails.editPaymetInstrumentId, id, currentActivePage);
            }
            this.setState({
                editDetails: {
                    editCardNumber: '',
                    editNameOnCard: '',
                    editPaymetInstrumentId: '',
                    editMonth: '',
                    editYear: '',
                    isValidMonth: '',
                    isValidYear: '',
                },
                isDefaultCard: false,
                isEditModalOpen: false,
            })
        } else {
            console.log('Form Not Valid');
        }
    }

    handleDeleteClick(cardData, deletePaymentInstrumentId) {
        this.setState({
            isDeleteMessageOpen: true,
            isDropdownOpen:false,
            deleteConfirmCard: cardData,
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
        deleteUserCreditCard(dispatch, deletePaymentInstrumentId, id, currentActivePage);
        this.setState({
            isDeleteMessageOpen: false,
        })
    }

    handleDeleteCancelClick() {
        this.setState({
            isDeleteMessageOpen: false,
            deletePaymentInstrumentId: '',
        })
    }

    onPageChanged(event, data) {
        console.log(data);
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        getMyCreditCards(dispatch, id, data.activePage);
        this.setState({
            currentActivePage: data.activePage,
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
                flowObject: {
                    ...this.state.flowObject,
                    cardHolderName,
                },
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
        let cardList = 'No credit card added yet';
        if (!_.isEmpty(userCreditCardList) && _.size(userCreditCardList.data) > 0) {
            cardList = userCreditCardList.data.map((data) => {
                const lastFour = data.attributes.description.slice(-4);
                const cardName = data.attributes.description.slice(0, -17);
                const primary = data.attributes.default ? 'Primary' : '';
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
                                        onClick={() => {this.handleEditClick(data)}}
                                    />
                                    {
                                        !data.attributes.default && (
                                            <Dropdown.Item
                                                text="Delete" 
                                                open={isDropdownOpen}
                                                onOpen={this.onOpen}
                                                onClose={this.onClose}
                                                onClick={() => {this.handleDeleteClick(data.attributes.description, data.id)}}
                                            />
                                        )
                                    }
                                    
                                </Dropdown.Menu>
                            </Dropdown>
                        </List.Content>
                        <List.Icon name="credit card" size="large" verticalAlign="middle" />
                        <List.Content>
                            <List.Header>{cardName}<span className="primary">{primary}</span></List.Header>
                        <div className="cardNo"><sup>**** **** **** </sup>{lastFour}</div>
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
                <div className="db-pagination right-align pt-2">
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
                editMonth,
                editYear,
            },
            myCreditCardListLoader,
        } = this.state;
        const {
            newCreditCardApiCall,
        } = this.props;
        const formatMessage = this.props.t;
        return (
            <div>
                <Grid verticalAlign="middle">
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={11} computer={11}>
                            <div className="userSettingsContainer">
                                <div className="settingsDetailWraper">
                                    <Header as="h4">Credit card </Header>
                                    <p>
                                        Add a new credit card to your account,
                                        remove an old one or change details if necessary.
                                    </p>
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <div className="right-align">
                                <Modal
                                    size="tiny"
                                    dimmer="inverted"
                                    className="chimp-modal"
                                    closeIcon
                                    open={newCreditCardApiCall}
                                    onClose={this.handleCCAddClose}
                                    trigger={<Button
                                        className="success-btn-rounded-def"
                                        onClick={this.handleAddCardClick}
                                        >
                                            Add new card
                                        </Button>}>
                                    <Modal.Header>Add a new credit card</Modal.Header>
                                    <Modal.Content>
                                        <Modal.Description className="font-s-16">
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
                                                            formatMessage = {formatMessage}
                                                            // eslint-disable-next-line no-return-assign
                                                            onRef={(ref) => (this.CreditCard = ref)}
                                                        />
                                                    </Elements>
                                                </StripeProvider>
                                                <Form.Field
                                                    checked={isDefaultCard}
                                                    control={Checkbox}
                                                    className="ui checkbox chkMarginBtm"
                                                    id="isDefaultCard"
                                                    label="Set as primary card"
                                                    name="isDefaultCard"
                                                    onChange={this.handleSetPrimaryClick}
                                                    readOnly={isDefaultCardReadOnly}
                                                />
                                            </Form>
                                        </Modal.Description>
                                        <div className="btn-wraper pt-3 text-right">
                                            <Button
                                                className="blue-btn-rounded-def sizeBig w-180"
                                                onClick={this.handleAddButtonClick}
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
                <div>
                    <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon open={this.state.isEditModalOpen} onClose={()=>{this.setState({isEditModalOpen: false})}}>
                        <Modal.Header>Edit credit card</Modal.Header>
                        <Modal.Content>
                            <Modal.Description className="font-s-16">
                                <Form>
                                    <Form.Field>
                                        <label>Card number</label>
                                        <input
                                            placeholder="Card number"
                                            readOnly
                                            value={editCardNumber}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Name on card</label>
                                        <input
                                            placeholder="Name on card"
                                            readOnly
                                            value={editNameOnCard}
                                        />
                                    </Form.Field>
                                    <Form.Group widths="equal">
                                        <Form.Input
                                            fluid
                                            label="Expiry Month"
                                            placeholder="MM"
                                            id="editMonth"
                                            name="editMonth"
                                            maxLength="2"
                                            type="number"
                                            onChange={this.handleInputChange}
                                            value={editMonth}
                                        />
                                        <Form.Input 
                                            fluid
                                            label="Expiry Month"
                                            placeholder="YYYY"
                                            id="editYear"
                                            name="editYear"
                                            maxLength="4"
                                            type="number"
                                            onChange={this.handleInputChange}
                                            value={editYear}
                                        />
                                    </Form.Group>
                                    <Form.Field
                                        checked={isDefaultCard}
                                        control={Checkbox}
                                        className="ui checkbox chkMarginBtm"
                                        id="isDefaultCard"
                                        label="Set as primary card"
                                        name="isDefaultCard"
                                        onChange={this.handleSetPrimaryClick}
                                        readOnly={isDefaultCardReadOnly}
                                    />
                                </Form>
                            </Modal.Description>
                            <div className="btn-wraper pt-3 text-right">
                                <Button
                                    className="blue-btn-rounded-def sizeBig w-180"
                                    onClick={this.handleEditSave}
                                >
                                    Save
                                </Button>
                            </div>
                        </Modal.Content>
                    </Modal>          
                </div>
                <div>
                    <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon open={this.state.isDeleteMessageOpen} onClose={()=>{this.setState({isDeleteMessageOpen: false})}}>
                        <Modal.Header>Delete card?</Modal.Header>
                        <Modal.Content>
                            <Modal.Description className="font-s-16">
                                Your {deleteConfirmCard} will be removed from your account.
                            </Modal.Description>
                            <div className="btn-wraper pt-3 text-right">
                            <Button
                                className="danger-btn-rounded-def c-small"
                                onClick={this.handleDeleteConfirmClick}
                            >
                                Delete
                            </Button>
                            <Button 
                                className="blue-bordr-btn-round-def c-small"
                                onClick={this.handleDeleteCancelClick}
                            >
                                Cancel
                            </Button>
                            </div>
                        </Modal.Content>
                    </Modal>
                </div>
                <div className="userCardList">
                    { myCreditCardListLoader
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
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userCreditCardList: state.userProfile.userCreditCardList,
        newCreditCardApiCall: state.userProfile.newCreditCardApiCall,
    };
}

export default withTranslation(['giveCommon'])(connect(mapStateToProps)(MyCreditCards))
