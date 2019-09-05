import React, { Fragment } from 'react';
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
import _isEqual from 'lodash/isEqual';
import {
    connect,
} from 'react-redux';
import PropTypes from 'prop-types';

import docIcon from '../../../static/images/icons/icon-document.svg?next-images-ignore=true';
import {
    actionTypes,
    getIssuedTaxreceiptYearlyDetail,
} from '../../../actions/taxreceipt';
import PlaceholderGrid from '../../shared/PlaceHolder';
import IndividualTaxDonationContent from '../IndividualTaxDonationContent';

class IndividualTaxDoantionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: !(!_isEmpty(props.issuedTaxReceiptYearlyDetail)),
        };
        this.displayDownloadedFileName = this.displayDownloadedFileName.bind(this);
    }


    componentDidMount() {
        const {
            dispatch,
            id,
        } = this.props;
        getIssuedTaxreceiptYearlyDetail(dispatch, id);
        window.scrollTo(0, 0);
    }

    componentDidUpdate(prevProps) {
        const {
            issuedTaxReceiptYearlyDetail,
            url,
            urlChange,
        } = this.props;
        let {
            loader,
        } = this.state;
        if (!_isEqual(this.props, prevProps)) {
            if (!_isEqual(issuedTaxReceiptYearlyDetail, prevProps.issuedTaxReceiptYearlyDetail)) {
                loader = false;
            }
            if (!_isEqual(urlChange, prevProps.urlChange) && !_isEmpty(url)) {
                const fileName = this.displayDownloadedFileName();
                const link = document.createElement('a');
                link.href = url;
                link.issuedTaxReceiptDonationsDetailStatesetAttribute('download', fileName);
                // Append to html page
                document.body.appendChild(link);
                // Force download
                link.click();
                // Clean up and remove the link
                link.parentNode.removeChild(link);
                downloadloader = false;
            }
            this.setState({
                loader,
            });
        }
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
                issuedTaxReceiptDonationsDetail: [],
            },
            type: actionTypes.ISSUED_TAX_RECEIPIENT_DONATIONS_DETAIL,
        });
    }

    displayDownloadedFileName() {
        const {
            name,
            year,
        } = this.props;
        const firstName = `tax-receipt-for-${name}`;
        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        date.toString();
        if (year === today.getFullYear().toString()) {
            if (`${today.getMonth() + 1}-${today.getDate()}` === '1-1') {
                return `${firstName}-for-${date}.`;
            }
            return `${firstName}-from-${year}-01-01-to-${date}.`;
        }
        return `${firstName}-from-${year}-01-01-to-${year}-12-31.`;
    }

    render() {
        const {
            loader,
        } = this.state;
        const {
            currentIssuedTaxReceipt: {
                addressOne,
                addressTwo,
                city,
                province,
                country,
                postalCode,
                full_name,
                isDefault,
            },
            id,
            issuedTaxReceiptYearlyDetail,
            renderdonationDetailShow,
        } = this.props;
        return (
            <Fragment>
                <div className="top-breadcrumb">
                    <Container>
                        <Breadcrumb className="c-breadcrumb">
                            <Breadcrumb.Section link onClick={() => { renderdonationDetailShow(null, null, true); }}>Tax receipts</Breadcrumb.Section>
                            <Breadcrumb.Divider icon="caret right" />
                            <Breadcrumb.Section active>
                                { full_name }
                            </Breadcrumb.Section>
                        </Breadcrumb>
                    </Container>
                </div>
                <div className="search-result">
                    <Container>
                        <p className="bold font-s-16 mt-2">Issue tax receipts</p>
                        <Divider />
                        <div className="info-panel more-btn">
                            <List verticalAlign="middle" className="receiptList pd-0">
                                <List.Item>
                                    <Image className="greyIcon mr-1" src={docIcon} />
                                    <List.Content>
                                        <List.Header className="font-s-15 mb-1-2">
                                            {full_name}
                                            {isDefault && <span className="default">default</span>}
                                        </List.Header>
                                        <p className="font-s-14">
                                            {!_isEmpty(addressOne) && `${addressOne},`}
                                            {!_isEmpty(addressTwo) && `${addressTwo},`}
                                            {!_isEmpty(city) && `${city},`}
                                            {!_isEmpty(province) && `${province},`}
                                            {!_isEmpty(country) && `${country},`}
                                            {!_isEmpty(postalCode) && `${postalCode},`}
                                        </p>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </div>
                        {loader ? (
                            <Table padded unstackable className="no-border-table">
                                <PlaceholderGrid row={2} column={2} placeholderType="table" />
                            </Table>
                        ) : (
                            <div className="mt-1 mb-1">
                                <Accordion className="taxAccordion">
                                    {(!_isEmpty(issuedTaxReceiptYearlyDetail) && issuedTaxReceiptYearlyDetail.length > 0) && (
                                        issuedTaxReceiptYearlyDetail.map((donationDetail, index) => (
                                            <IndividualTaxDonationContent
                                                donationDetail={donationDetail}
                                                index={index}
                                                id={id}
                                            />
                                        ))

                                    )}
                                </Accordion>

                            </div>
                        )}
                    </Container>
                </div>
            </Fragment>
        );
    }
}
const mapStateToProps = (state) => ({
    currentUser: state.user.info,
    issuedTaxReceiptDonationsDetail: state.taxreceipt.issuedTaxReceiptDonationsDetail,
    issuedTaxReceiptYearlyDetail: state.taxreceipt.issuedTaxReceiptYearlyDetail,
    issuedTaxReceiptYearlyDetailPageCount: state.taxreceipt.issuedTaxReceiptYearlyDetailPageCount,
    url: state.taxreceipt.url,
    urlChange: state.taxreceipt.urlChange,
    year: state.taxreceipt.year,
});
IndividualTaxDoantionsList.propTypes = {
    dispatch: PropTypes.func,
    issuedTaxReceiptYearlyDetail: PropTypes.arrayOf(PropTypes.shape({
        year: PropTypes.string,
    })),
    name: PropTypes.string,
    renderdonationDetailShow: PropTypes.func,

};

IndividualTaxDoantionsList.defaultProps = {
    dispatch: () => {},
    issuedTaxReceiptYearlyDetail: null,
    name: '',
    renderdonationDetailShow: () => {},

};

export default connect(mapStateToProps)(IndividualTaxDoantionsList);
