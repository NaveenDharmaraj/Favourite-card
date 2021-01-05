/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Fragment } from 'react';
import {
    Button,
    Form,
    Modal,
    Table,
    Input,
    Dropdown,
    Responsive,
    Accordion,
    TableBody,
    TableCell,
} from 'semantic-ui-react';

class TransactionTableRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          showDeleteModal: false,
          showEditModal: false,
          activeIndexs: [] 
        }
    }

    closeModal = () => {
        this.setState({ 
            showDeleteModal: false,
            showEditModal: false 
        });
    }

    closeModalAndDelete = () =>{
        const {
            transactionId,
            transactionType,
            deleteTransaction,
        } = this.props;
        this.setState({ showDeleteModal: false });
        deleteTransaction(transactionId, transactionType)
    }

    handleClick = (e, titleProps) => {
        debugger;
        const { index } = titleProps;
        const { activeIndexs } = this.state;
        const newIndex = activeIndexs;
    
        const currentIndexPosition = activeIndexs.indexOf(index);
        if (currentIndexPosition > -1) {
          newIndex.splice(currentIndexPosition, 1);
        } else {
          newIndex.push(index);
        }
    
        this.setState({ activeIndexs: newIndex });
      };

    render() {
        const {
            firstColoumn,
            secondColoumn,
            thirdColoumn,
            fourthColoumn,
            fifthColoumn,
            modalHeader,
            index,
        } = this.props;
        const {
            showDeleteModal,
            showEditModal,
            activeIndexs, 
          } = this.state;

        const deleteModal  = (
            <Modal 
                size="tiny"
                dimmer="inverted"
                className="chimp-modal"
                closeIcon
                onClose={this.closeModal}
                open={showDeleteModal}
                trigger={
                    <a
                        className='deleteLink'
                        onClick={() => this.setState({ showDeleteModal: true })}
                    >
                        Delete
                    </a>
                }
            >
                <Modal.Header>{modalHeader}</Modal.Header>
                <Modal.Content>
                <Modal.Description className="font-s-16">
                    Are you sure you want to delete the transaction?
                </Modal.Description>
                <div className="btn-wraper pt-3 text-right">
                    <Modal.Actions>
                        <Button
                            className="danger-btn-rounded-def c-small"
                            color='red'
                            onClick={this.closeModalAndDelete}
                        >
                            Delete
                        </Button>
                        <Button
                            className="blue-bordr-btn-round-def c-small"
                            onClick={() => this.setState({ showDeleteModal: false })}
                        >
                            Cancel
                        </Button>
                    </Modal.Actions>
                    </div>
                </Modal.Content>
            </Modal>
        );
        const editModal = (
            <Modal 
                size="tiny"
                dimmer="inverted"
                className="chimp-modal"
                closeIcon
                onClose={this.closeModal}
                open={showEditModal}
                trigger={
                    <Button
                        className='blue-bordr-btn-round-def c-small'
                        onClick={() => this.setState({ showEditModal: true })}
                    >
                        Edit
                    </Button>
                }
            >
                <Modal.Header>Edit monthly deposit</Modal.Header>
                <Modal.Content>
                <Modal.Description>
                    <Form>
                        <Form.Field
                            label='Amount'
                            control={Input}
                            icon="dollar"
                            iconPosition="left"
                        />
                        <div className="price_btn">
                            <Button  className="btn-basic-outline btntext invisionwidth" type="button" size="small" >$25</Button>
                            <Button  className="btn-basic-outline btntext invisionwidth" type="button" size="small" >$50</Button>
                            <Button  className="btn-basic-outline btntext invisionwidth" type="button" size="small" >$100</Button>
                            <Button  className="btn-basic-outline btntext invisionwidth" type="button" size="small" >$500</Button>
                        </div>
                        <div className='field mt-2'>
                            <label>Payment method</label>
                            <div className="paymentMethodDropdown">
                                <Dropdown
                                    id="creditCard"
                                    name="creditCard"
                                    button
                                    icon='cardVisa'
                                    className="dropdownWithArrowParent icon creditCardDropDown"
                                    selection
                                    fluid
                                    floating
                                    labeled
                                />
                            </div>
                        </div>
                    
                    </Form>
                </Modal.Description>
                    <div className="btn-wraper pt-2 text-right">
                        <Modal.Actions>
                            <Button
                                className="blue-btn-rounded-def"
                                onClick={() => this.setState({ showEditModal: false })}
                            >
                                Save
                            </Button>
                        </Modal.Actions>
                    </div>
                </Modal.Content>
            </Modal>
        );
        return (
            <Fragment>

                {/* Desktop transaction details row start */}
                <Responsive minWidth={992} as={'tr'}>
                    {(firstColoumn) && (<Table.Cell>{firstColoumn}</Table.Cell>)}
                    {(secondColoumn) && (<Table.Cell className="text-right">{secondColoumn}</Table.Cell>)}
                    {(thirdColoumn) && (<Table.Cell>{thirdColoumn}</Table.Cell>)}
                    {(fourthColoumn) && (<Table.Cell>{fourthColoumn}</Table.Cell>)}
                    {(fifthColoumn) && (<Table.Cell>{fifthColoumn}</Table.Cell>)}
                    <Table.Cell>
                        {editModal}
                        {deleteModal}
                    </Table.Cell>
                </Responsive>
                {/* Desktop transaction details row end */}

                {/* Mobile transaction details row start (Accordion) */}
                <Responsive maxWidth={991} className='accordionWrap'>
                    <Accordion.Title 
                        active={activeIndexs.includes(index)}
                        index={index}
                        onClick={this.handleClick}   
                    >
                        {firstColoumn}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndexs.includes(index)}>
                        <Table unstackable>
                            <TableBody>
                                <Table.Row>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>{secondColoumn}</TableCell>
                                </Table.Row>
                                <Table.Row>
                                    <TableCell>Day of month</TableCell>
                                    <TableCell>{thirdColoumn}</TableCell>
                                </Table.Row>
                                <Table.Row>
                                    <TableCell>Matched by</TableCell>
                                    <TableCell>{fourthColoumn}</TableCell>
                                </Table.Row>
                                <Table.Row>
                                    <TableCell>Created</TableCell>
                                    <TableCell>{fifthColoumn}</TableCell>
                                </Table.Row>
                            </TableBody>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.Cell colSpan='2'>
                                        {editModal}
                                        {deleteModal}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Accordion.Content>
                </Responsive>
                {/* Mobile transaction details row end (Accordion) */}
            </Fragment>
        );
    }
}
export default TransactionTableRow;
