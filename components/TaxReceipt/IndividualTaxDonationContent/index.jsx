import React, { Fragment } from 'react';
import {
    Accordion,
    Button,
    Icon,
    List,
    Image,
    Table,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
    connect,
} from 'react-redux';
import _isEqual from 'lodash/isEqual';
import _uniqBy from 'lodash/uniqBy';

import angleDown from '../../../static/images/icons/icon-arrow-down.svg';
import downloadIcon from '../../../static/images/icons/icon-download.svg';
import {
    downloadTaxreceiptDonationsDetail,
    getIssuedTaxreceiptDonationsDetail,
} from '../../../actions/taxreceipt';
import {
    formatCurrency,
    formatAmount,
    monthNamesForGivingTools,
} from '../../../helpers/give/utils';
import { withTranslation } from '../../../i18n';
import PlaceholderGrid from '../../shared/PlaceHolder';

const formatDateTaxReceipt = (date) => {
    const dateArray = date.split('-');
    const month = monthNamesForGivingTools(dateArray[1]);
    return `${month} ${dateArray[2]}, ${dateArray[0]}`;
};

class IndividualTaxDonationContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: null,
            contentLoader: false,
            loadMoreIncrementor: 1,
            loadMoreLoader: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.onPageChanged = this.onPageChanged.bind(this);
        this.displayDownloadedFileName = this.displayDownloadedFileName.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            DonationsDetails,
        } = this.props;

        let{
            contentLoader,
            loadMoreLoader,
            loadMoreIncrementor,
        } = this.state;


        if (!_isEqual(this.props, prevProps)){
            if (!_isEqual(DonationsDetails, prevProps.DonationsDetails)){
                    contentLoader = false;
                    loadMoreLoader = false;
                    loadMoreIncrementor += 1;
            }
            this.setState({
                contentLoader,
                loadMoreIncrementor,
                loadMoreLoader,
            })
        }
    }


    onPageChanged(year) {
        const {
            id,
            dispatch,
            DonationsDetails,
        } = this.props;
        let {
            loadMoreIncrementor,
        } = this.state;
        if (!_isEmpty(DonationsDetails) && DonationsDetails.pageCount && loadMoreIncrementor <= DonationsDetails.pageCount) {
            getIssuedTaxreceiptDonationsDetail(dispatch, id, year, loadMoreIncrementor);
            this.setState({
                loadMoreLoader: true,
            });
        }
    }

    handleClick(year, index) {
        let {
            activeIndex,
            contentLoader,
        } = this.state;
        const {
            id,
            dispatch,
        } = this.props;
        const newIndex = activeIndex === index ? -1 : index;
        if (activeIndex !== index && activeIndex !== -1) {
            getIssuedTaxreceiptDonationsDetail(dispatch, id, year, 1);
            contentLoader = true;
        }

        this.setState({
            activeIndex: newIndex,
            contentLoader,
            loadMoreIncrementor: 1,
        });
    }

    displayDownloadedFileName() {
        const {
            name,
            donationDetail: {
                year,
            },
        } = this.props;
        const firstName = `tax-receipt-for-${name}`;
        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        date.toString();
        if (year === today.getFullYear().toString()) {
            if (`${today.getMonth() + 1}-${today.getDate()}` === '1-1') {
                return `${firstName}-for-${date}.`;
            }
            return `${firstName}-from-${year}-01-01-to-${date}.pdf`;
        }
        return `${firstName}-from-${year}-01-01-to-${year}-12-31.pdf`;
    }

    downloadTaxReceipt(event, year) {
        event.stopPropagation();
        const {
            id,
            dispatch,
        } = this.props;
        downloadTaxreceiptDonationsDetail(dispatch, id, year).then((result) => {
            const blob = new Blob([
                result,
            ], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            if (url) {
                const fileName = this.displayDownloadedFileName();
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                // Append to html page
                document.body.appendChild(link);
                // Force download
                link.click();
                // Clean up and remove the link
                link.parentNode.removeChild(link);
            }
            dispatch({
                payload: {
                    downloadloader: false,
                },
                type: 'DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL_LOADER',
            });
        }).catch((err) => {
            console.error(err);
            dispatch({
                payload: {
                    downloadloader: false,
                },
                type: 'DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL_LOADER',
            });
        });
    }

    render() {
        const {
            activeIndex,
            contentLoader,
            loadMoreIncrementor,
            loadMoreLoader,
        } = this.state;
        const {
            currentYear,
            donationDetail,
            downloadloader,
            DonationsDetails,
            index,
            i18n: {
                language,
            },
        } = this.props;
        return (
            <Fragment>
                <Accordion.Title id={index} active={activeIndex === index} index onClick={(e) => { this.handleClick(donationDetail.year, index); }}>
                    <div className="leftIcon">
                        <Image src={angleDown} className="greyIcon" />
                    </div>
                    <div className="leftContent">
                        <div className="year">{donationDetail.year}</div>
                        <div>
                            {donationDetail.total}
                            tax-receiptable donations
                        </div>
                    </div>
                    <div className="rightContent" id={index}>
                        {formatCurrency(formatAmount(donationDetail.total_amount), language, 'USD')}
                        {(downloadloader && currentYear === donationDetail.year) ? <Icon name="spinner" loading /> : (
                            <div className="downloadIcon" id={index} onClick={(event) => { this.downloadTaxReceipt(event, donationDetail.year); }}>
                                <Image src={downloadIcon} />
                            </div>
                        )}
                    </div>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === index}>

                {contentLoader ? (
                    <Table padded unstackable className="no-border-table">
                        <PlaceholderGrid row={2} column={2} placeholderType="table" />
                    </Table>
                )
                    : ((!_isEmpty(DonationsDetails) && !_isEmpty(DonationsDetails.data) && DonationsDetails.data.length > 0) && (
                        DonationsDetails.data.map((yearlydetails) => (
                            <List divided verticalAlign="middle">
                                <List.Item className="pt-1 pb-1">
                                    <List.Content floated="right" className="bold">
                                        {formatCurrency(formatAmount(yearlydetails.amount), language, 'USD')}
                                    </List.Content>
                                    <List.Content>{formatDateTaxReceipt(yearlydetails.transfer_date)}</List.Content>
                                </List.Item>
                            </List>
                        ))
                    ))

                }
                </Accordion.Content>
                {
                    (!_isEmpty(DonationsDetails) && DonationsDetails.pageCount && DonationsDetails.recordCount
                    && DonationsDetails.pageCount > 1 && DonationsDetails.data.length <= DonationsDetails.recordCount) && (
                        <Accordion.Content active={activeIndex === index}>
                            <div className="text-center">
                                {
                                    loadMoreLoader ? <Icon name="spinner" loading /> : (
                                        <Button className="blue-bordr-btn-round-def" onClick={() => { this.onPageChanged(donationDetail.year); }}> Load More </Button>
                                    )
                                }
                            </div>
                        </Accordion.Content>
                    )
                }
            </Fragment>

        );
    }
}
const mapStateToProps = (state) => ({
    currentYear: state.taxreceipt.currentYear,
    downloadloader: state.taxreceipt.downloadloader,
});

IndividualTaxDonationContent.defaultProps = {
    donationDetail: {
        year: null,
    },
    index: null,
    DonationsDetails: {
        data: [],
        pageCount: null,
    },
};

export default withTranslation('giveCommon')(connect(mapStateToProps)(IndividualTaxDonationContent));
