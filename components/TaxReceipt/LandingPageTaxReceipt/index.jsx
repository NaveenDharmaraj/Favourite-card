import React, { Fragment } from 'react';
import {
    Container,
    Button,
    Breadcrumb,
    Divider,
    Grid,
    List,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';

import {
    getIssuedTaxreceipts,
} from '../../../actions/taxreceipt';
import {
    countryOptions,
} from '../../../helpers/constants';
import PlaceholderGrid from '../../shared/PlaceHolder';
import IssuedTaxReceiptCard from '../IssuedTaxReceiptCard';
import NoTaxReceipts from '../../TaxReceipt/NoTaxReceipts';
import TaxReceipientsList from '../TaxReceipientsList';
import IndividualTaxDoantionsList from '../IndividualTaxDoantionsList';
import ModalComponent from '../../shared/Modal';

class LandingPageTaxReceipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: !props.issuedTaxReceiptList,
            donationDetailhide: true,
            isSelectPhotoModalOpen: false,
        };
        this.onEdit = this.onEdit.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.renderdonationDetailShow = this.renderdonationDetailShow.bind(this);
    }



    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        getIssuedTaxreceipts(dispatch);
    }

    componentDidUpdate(prevProps) {
        const {
            issuedTaxReceiptList,
        } = this.props;
        let {
            loader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_isEqual(issuedTaxReceiptList, prevProps.issuedTaxReceiptList)) {
                loader = false;
            }
            this.setState({
                loader,
            });
        }
    }

    onEdit() {
        this.setState({ isSelectPhotoModalOpen: true });
    }

    handleModalOpen(modalBool) {
        this.setState({
            isSelectPhotoModalOpen: modalBool,
        });
    }

    renderdonationDetailShow(id, currentIssuedTaxReceipt, toogling) {
        this.setState({
            donationDetailhide: toogling,
            id,
            currentIssuedTaxReceipt,
        });
    }

    render() {
        const {
            issuedTaxReceiptList,
            dispatch,
        } = this.props;
        const {
            donationDetailhide,
            id,
            isSelectPhotoModalOpen,
            currentIssuedTaxReceipt,
            loader,
        } = this.state;
        const intializeFormData = {
            attributes: {
                addressOne: '',
                addressTwo: '',
                city: '',
                country: countryOptions[0].value,
                fullName: '',
                postalCode: '',
                province: '',
            },
            relationships: {
                accountHoldable: {
                    data: {
                        id: this.props.currentUser.id,
                        type: 'user',
                    },
                },
            },
            type: 'taxReceiptProfiles',
        };
        return (
            <Fragment>
                {donationDetailhide ? (
                    <Fragment>
                        <div className="top-breadcrumb">
                            <Container>
                                <Breadcrumb className="c-breadcrumb">
                                    <Breadcrumb.Section link>Tax receipts </Breadcrumb.Section>
                                </Breadcrumb>
                            </Container>
                        </div>

                        <div className="search-result">
                            <Container>
                                <div>
                                    <Grid verticalAlign="middle" stackable>
                                        <Grid.Row>
                                            <Grid.Column mobile={16} tablet={12} computer={13}>
                                                <p className="font-s-16 bold mb-1-2">Tax receipt recipients</p>
                                                <p className="font-s-13">Manage the legal names and addresses that appear on tax receipts. You can have multiple recepients on one account (for example, a spouse).</p>
                                            </Grid.Column>
                                            <Grid.Column mobile={16} tablet={4} computer={3} className="text-right">
                                                <Button className="success-btn-rounded-def" onClick={()=>{this.onEdit()}}>+ Add new recipient</Button>
                                                {
                                                    isSelectPhotoModalOpen && (
                                                        <ModalComponent
                                                            name='Add new tax recipt recipient'
                                                            isSelectPhotoModalOpen={isSelectPhotoModalOpen}
                                                            dispatch={dispatch}
                                                            taxReceipt={intializeFormData}
                                                            handleModalOpen={this.handleModalOpen}
                                                            action="add"
                                                        />
                                                    )
                                                }
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </div>
                                <Divider />
                                <TaxReceipientsList />
                                <div className="mb-2">
                                    <p className="font-s-16 bold mb-1-2">Issued tax receipts</p>
                                    <p className="font-s-13">Tax receipts are organizied by recipient.</p>
                                </div>
                                {loader ? <PlaceholderGrid row={2} column={2} /> : (
                                    <Fragment>
                                        {(!_isEmpty(issuedTaxReceiptList) && issuedTaxReceiptList.length > 0)
                                            ? (
                                                <div className="mb-1">
                                                    <List celled verticalAlign="middle" className="receiptList">
                                                        {_map(issuedTaxReceiptList, (issuedTaxReceipt) => (
                                                            <IssuedTaxReceiptCard issuedTaxReceipt={issuedTaxReceipt} renderdonationDetailShow={this.renderdonationDetailShow} />
                                                        ))
                                                        }
                                                    </List>
                                                </div>
                                            )
                                            : <NoTaxReceipts />
                                        }
                                    </Fragment>
                                )}
                            </Container>
                        </div>
                    </Fragment>
                ) : (
                    <IndividualTaxDoantionsList renderdonationDetailShow={this.renderdonationDetailShow} id={id} currentIssuedTaxReceipt={currentIssuedTaxReceipt} />
                )
                }
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.info,
    issuedTaxReceiptList: state.taxreceipt.issuedTaxReceiptList,
});

export default connect(mapStateToProps)(LandingPageTaxReceipt);
