/* eslint-disable react/prop-types */
import React from 'react';
import {
    Button,
    Header,
    Radio,
    Image,
    Form,
    Modal,
    Grid,
    List,
    Dropdown,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    getMyCreditCards,
} from '../../../actions/userProfile';
import noteicon from '../../../static/images/icons/icon-document.svg';

class CreditCard extends React.Component {
    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        getMyCreditCards(dispatch, id);
    }

    renderMyCreditCards() {
        const {
            userCreditCardList,
        } = this.props;
        let cardList = 'No Data';
        if (!_.isEmpty(userCreditCardList)) {
            cardList = userCreditCardList.data.map((data) => {                
                return (
                    <List.Item>
                        <List.Content floated="right">
                            <Dropdown className="rightBottom" icon="ellipsis horizontal">
                                <Dropdown.Menu>
                                    <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<Dropdown.Item text="Edit" />}>
                                        <Modal.Header>Edit credit card</Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description className="font-s-16">
                                                <Form>
                                                    <Form.Field>
                                                        <label>Card number</label>
                                                        <input placeholder="Card number" />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>Name on card</label>
                                                        <input placeholder="Name on card" />
                                                    </Form.Field>
                                                    <Form.Group widths="equal">
                                                        <Form.Input fluid label="Expiry" placeholder="mm/yy" />
                                                        <Form.Input fluid label="CVV" placeholder="CVV" />
                                                    </Form.Group>
                                                    <Form.Field>
                                                        <Radio label="Set as primary card" />
                                                    </Form.Field>
                                                </Form>
                                            </Modal.Description>
                                            <div className="btn-wraper pt-3 text-right">
                                                <Button className="blue-btn-rounded-def sizeBig w-180">Save</Button>
                                            </div>
                                        </Modal.Content>
                                    </Modal>
                                    <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<Dropdown.Item text="Delete" />}>
                                        <Modal.Header>Delete card?</Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description className="font-s-16">
                                                Your [card type: Visa/Mastercard/Amex]
                                                ending in [last four digits] will be removed
                                                from your account.
                                            </Modal.Description>
                                            <div className="btn-wraper pt-3 text-right">
                                                <Button className="danger-btn-rounded-def c-small">Delete</Button>
                                                <Button className="blue-bordr-btn-round-def c-small">Cancel</Button>
                                            </div>
                                        </Modal.Content>
                                    </Modal>
                                </Dropdown.Menu>
                            </Dropdown>
                        </List.Content>
                        <List.Icon name="credit card" size="large" verticalAlign="middle" />
                        <List.Content>
                            <List.Header>{data.attributes.description}</List.Header>
                        </List.Content>
                    </List.Item>
                );
            });
        }
        return (
            <List celled verticalAlign="middle">
                {cardList}
            </List>
        );
    }

    render() {
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
                                <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<Button className="success-btn-rounded-def">Add new card</Button>}>
                                    <Modal.Header>Add a new credit card</Modal.Header>
                                    <Modal.Content>
                                        <Modal.Description className="font-s-16">
                                            <Form>
                                                <Form.Field>
                                                    <label>Card number</label>
                                                    <input placeholder='Card number' />
                                                </Form.Field>
                                                <Form.Field>
                                                    <label>Name on card</label>
                                                    <input placeholder='Name on card' />
                                                </Form.Field>
                                                <Form.Group widths='equal'>
                                                    <Form.Input fluid label='Expiry' placeholder='mm/yy'/>
                                                    <Form.Input fluid label='CVV' placeholder='CVV' />
                                                </Form.Group>
                                                <Form.Field>
                                                    <Radio label='Set as primary card' />
                                                </Form.Field>
                                            </Form>
                                        </Modal.Description>
                                        <div className="btn-wraper pt-3 text-right">
                                            <Button className="blue-btn-rounded-def sizeBig w-180">Add</Button>
                                        </div>
                                    </Modal.Content>
                                </Modal>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div className="userCardList">
                    {this.renderMyCreditCards()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userCreditCardList: state.userProfile.userCreditCardList,
    };
}

export default (connect(mapStateToProps)(CreditCard));
