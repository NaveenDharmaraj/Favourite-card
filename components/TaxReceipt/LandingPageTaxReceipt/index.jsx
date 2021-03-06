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
import ModalComponent from '../../shared/Modal';

class LandingPageTaxReceipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelectPhotoModalOpen: false,
        };
        this.onEdit = this.onEdit.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
    }


    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        getIssuedTaxreceipts(dispatch, `/taxReceipts?page[size]=10`);
    }

    onEdit() {
        this.setState({ isSelectPhotoModalOpen: true });
    }

    handleLoadMoreClick() {
        const {
            dispatch,
            nextLink,
        } = this.props;
        getIssuedTaxreceipts(dispatch, nextLink, true);
    }

    handleModalOpen(modalBool) {
        this.setState({
            isSelectPhotoModalOpen: modalBool,
        });
    }

    render() {
        const {
            issuedTaxReceiptList,
            dispatch,
            issuedTaxLloader,
            recordCount,
            viewMoreLoader,
        } = this.props;
        const {
            isSelectPhotoModalOpen,
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
                                        <p className="font-s-13">Manage the legal names and addresses that appear on tax receipts. You can have multiple recipients on one account (for example, a spouse).</p>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={4} computer={3} className="text-right">
                                        <Button className="success-btn-rounded-def" onClick={() => { this.onEdit(); }}>+ Add new recipient</Button>
                                        {
                                            isSelectPhotoModalOpen && (
                                                <ModalComponent
                                                    name="Add new tax receipt recipient"
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
                        <div className="mb-2 mt-3">
                            <p className="font-s-16 bold mb-1-2">Issued tax receipts</p>
                            <p className="font-s-13">Tax receipts are organized by recipient.</p>
                        </div>
                        {issuedTaxLloader ? <PlaceholderGrid row={2} column={2} /> : (
                            <Fragment>
                                {(!_isEmpty(issuedTaxReceiptList) && issuedTaxReceiptList.length > 0)
                                    ? (
                                        <div className="mb-1">
                                            <List celled verticalAlign="middle" className="receiptList">
                                                {_map(issuedTaxReceiptList, (issuedTaxReceipt) => (
                                                    <IssuedTaxReceiptCard issuedTaxReceipt={issuedTaxReceipt} />
                                                ))
                                                }
                                            </List>
                                        </div>
                                    )
                                    : <NoTaxReceipts />
                                }
                            </Fragment>
                        )}
                        {(recordCount && !_isEmpty(issuedTaxReceiptList) && recordCount > issuedTaxReceiptList.length)
                            ? (
                                <div className="text-center">
                                    <Button
                                        className="blue-bordr-btn-round-def"
                                        onClick={() => this.handleLoadMoreClick()}
                                        loading={viewMoreLoader}
                                        content="View more"
                                    />
                                </div>
                            ) : null
                        }
                    </Container>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.info,
    issuedTaxLloader: state.taxreceipt.issuedTaxLloader,
    issuedTaxReceiptList: state.taxreceipt.issuedTaxReceiptList,
    nextLink: state.taxreceipt.nextLink,
    recordCount: state.taxreceipt.recordCount,
    viewMoreLoader: state.taxreceipt.viewMoreLoader,
});

export default connect(mapStateToProps)(LandingPageTaxReceipt);
