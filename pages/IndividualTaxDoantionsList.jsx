import React from 'react';
import {
    Accordion,
    Container,
    List,
    Breadcrumb,
    Divider,
    Image,
    Table,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
    connect,
} from 'react-redux';
import PropTypes from 'prop-types';

import { Router } from '../routes';
import Layout from '../components/shared/Layout';
import docIcon from '../static/images/icons/icon-document.svg?next-images-ignore=true';
import {
    actionTypes,
    getIssuedTaxreceiptYearlyDetail,
} from '../actions/taxreceipt';
import PlaceholderGrid from '../components/shared/PlaceHolder';
import IndividualTaxDonationContent from '../components/TaxReceipt/IndividualTaxDonationContent';

class IndividualTaxDoantionsList extends React.Component {
    static async getInitialProps({
        query,
    }) {
        return {
            id: query.slug,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            id,
        } = this.props;
        getIssuedTaxreceiptYearlyDetail(dispatch, id);
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
                issuedTaxReceiptYearlyDetail: [],
            },
            type: actionTypes.ISSUED_TAX_RECEIPIENT_YEARLY_DETAIL,
        });
        dispatch({
            payload: {
                issuedTaxReceiptDonationsDetail: {},
            },
            type: actionTypes.ISSUED_TAX_RECEIPIENT_DONATIONS_DETAIL,
        });
    }

    render() {
        const {
            currentIssuedTaxReceipt: {
                address_one,
                address_two,
                city,
                province,
                country,
                postal_code,
                full_name,
                isDefault,
            },
            id,
            issuedTaxReceiptDonationsDetail,
            issuedTaxReceiptYearlyDetail,
            yearLoader,
        } = this.props;
        return (
            <Layout authRequired>
                <div className="top-breadcrumb">
                    <Container>
                        <Breadcrumb className="c-breadcrumb">
                            <Breadcrumb.Section link onClick={() => { Router.pushRoute('/user/tax-receipts'); }}>Tax receipts</Breadcrumb.Section>
                            <Breadcrumb.Divider icon="caret right" />
                            <Breadcrumb.Section active>
                                {full_name}
                            </Breadcrumb.Section>
                        </Breadcrumb>
                    </Container>
                </div>
                <div className="search-result">
                    <Container>
                        <p className="bold font-s-16 mt-2">Issued tax receipts</p>
                        <Divider />
                        <div className="info-panel more-btn mb-3">
                            <List verticalAlign="middle" className="receiptList pd-0">
                                <List.Item>
                                    <Image className="greyIcon mr-1" src={docIcon} />
                                    <List.Content>
                                        <List.Header className="font-s-15 mb-1-2">
                                            {full_name}
                                            {isDefault && <span className="default">default</span>}
                                        </List.Header>
                                        <p className="font-s-14">
                                            {!_isEmpty(address_one) && `${address_one}, `}
                                            {!_isEmpty(address_two) && `${address_two}, `}
                                            {!_isEmpty(city) && `${city}, `}
                                            {!_isEmpty(province) && `${province}, `}
                                            {!_isEmpty(country) && `${country}, `}
                                            {!_isEmpty(postal_code) && `${postal_code}`}
                                        </p>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </div>
                        {yearLoader ? (
                            <Table padded unstackable className="no-border-table">
                                <PlaceholderGrid row={2} column={2} placeholderType="table" />
                            </Table>
                        ) : (
                            <div className="mt-1 mb-1">
                                <Accordion className="taxAccordion">
                                    {(!_isEmpty(issuedTaxReceiptYearlyDetail) && issuedTaxReceiptYearlyDetail.length > 0) ? (
                                        issuedTaxReceiptYearlyDetail.map((donationDetail, index) => (
                                            <IndividualTaxDonationContent
                                                donationDetail={donationDetail}
                                                DonationsDetails={(!_isEmpty(issuedTaxReceiptDonationsDetail) && !_isEmpty(issuedTaxReceiptDonationsDetail[donationDetail.year])) && issuedTaxReceiptDonationsDetail[donationDetail.year]}
                                                index={index}
                                                id={id}
                                                name={full_name}
                                            />
                                        ))

                                    )
                                        : 'No Yearly Transaction Available'}
                                </Accordion>

                            </div>
                        )}
                    </Container>
                </div>
            </Layout>
        );
    }
}
const mapStateToProps = (state) => ({
    issuedTaxReceiptDonationsDetail: state.taxreceipt.issuedTaxReceiptDonationsDetail,
    issuedTaxReceiptYearlyDetail: state.taxreceipt.issuedTaxReceiptYearlyDetail,
    year: state.taxreceipt.year,
    yearLoader: state.taxreceipt.yearLoader,
});

IndividualTaxDoantionsList.propTypes = {
    currentIssuedTaxReceipt: {
        address_one: PropTypes.string,
        address_two: PropTypes.string,
        city: PropTypes.string,
        province: PropTypes.string,
        country: PropTypes.string,
        postal_code: PropTypes.string,
        full_name: PropTypes.string,
        isDefault: PropTypes.bool,
    },
    dispatch: PropTypes.func,
    issuedTaxReceiptYearlyDetail: PropTypes.arrayOf(PropTypes.shape({
        year: PropTypes.string,
    })),
    name: PropTypes.string,
};

IndividualTaxDoantionsList.defaultProps = {
    currentIssuedTaxReceipt: {
        address_one: "123",
        address_two: "456",
        city: "salem",
        province: "",
        country: "",
        postal_code: "",
        full_name: "chimp",
        isDefault: true,
    },
    dispatch: () => { },
    issuedTaxReceiptYearlyDetail: null,
    name: '',
};

export default connect(mapStateToProps)(IndividualTaxDoantionsList);
