import React, { Fragment } from 'react';
import {
    Button,
    Icon,
    Popup,
    List,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import ModalComponent from '../../shared/Modal';


class TaxReceipientCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownOpen: false,
            isSelectPhotoModalOpen: false,
        };
        this.onEdit = this.onEdit.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
    }

    onEdit() {
        this.setState({
            isDropdownOpen: false,
            isSelectPhotoModalOpen: true,
        });
    }

    onOpen() {
        this.setState({ isDropdownOpen: true });
    }

    onClose() {
        this.setState({ isDropdownOpen: false });
    }

    handleModalOpen(modalBool) {
        this.setState({
            isSelectPhotoModalOpen: modalBool,
        });
    }

    render() {
        const {
            isDropdownOpen,
            isSelectPhotoModalOpen,
        } = this.state;
        const {
            dispatch,
            taxReceipt,
        } = this.props;
        const {
            attributes: {
                addressOne,
                addressTwo,
                city,
                province,
                country,
                postalCode,
                fullName,
            },
        } = taxReceipt;
        if (!_isEmpty(taxReceipt.attributes) && taxReceipt.attributes.isDefault) {
            dispatch({
                payload: {
                    defaultTaxId: taxReceipt.id,

                },
                type: 'DEFAULT_TAX_RECEIPT_PROFILE_ID',
            });
        }
        return (
            <Fragment>
                <div className="info-panel more-btn mb-2">
                    <Popup
                        position="bottom right"
                        trigger={(
                            <Button className="more-btn-top-right transparent" circular icon>
                                <Icon name="ellipsis horizontal" />
                            </Button>
                        )}
                        basic
                        on="click"
                        open={isDropdownOpen}
                        onOpen={this.onOpen}
                        onClose={this.onClose}
                        className="dropdownPopup"
                    >
                        <Popup.Content>
                            <List>
                                <List.Item as="a" onClick={this.onEdit}>Edit</List.Item>
                            </List>
                        </Popup.Content>
                    </Popup>

                    <p className="font-s-15 bold mb-1-2">
                        {fullName}
                        {taxReceipt.attributes.isDefault && <span className="default">default</span>}
                    </p>
                    <p className="font-s-14">
                        {!_isEmpty(addressOne) && `${addressOne}, `}
                        {!_isEmpty(addressTwo) && `${addressTwo}, `}
                        {!_isEmpty(city) && `${city}, `}
                        {!_isEmpty(province) && `${province}, `}
                        {!_isEmpty(country) && `${country}, `}
                        {!_isEmpty(postalCode) && `${postalCode}`}
                    </p>
                </div>
                {
                    isSelectPhotoModalOpen && (
                        <ModalComponent
                            name='Edit tax receipt recipient' 
                            isSelectPhotoModalOpen={isSelectPhotoModalOpen}
                            taxReceipt={taxReceipt}
                            handleModalOpen={this.handleModalOpen}
                            action="update"
                            dispatch={dispatch}
                        />
                    )
                }
            </Fragment>
        );
    }
}
TaxReceipientCard.defaultProps = {
    taxReceipt: null,
};

export default TaxReceipientCard;
