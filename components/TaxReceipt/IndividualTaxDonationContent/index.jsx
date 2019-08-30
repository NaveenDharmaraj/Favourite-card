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
import PlaceholderGrid from '../../shared/PlaceHolder';

class IndividualTaxDonationContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: null,
            contentLoader: false,
            downloadloader: false,
            issuedTaxReceiptDonationsDetailState: [],
            loadMoreIncrementor: 1,
            loadMoreLoader: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.onPageChanged = this.onPageChanged.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            issuedTaxReceiptDonationsDetail,
        } = this.props;
        let {
            contentLoader,
            downloadloader,
            loadMoreLoader,
            issuedTaxReceiptDonationsDetailState,
        } = this.state;
        if (!_isEqual(this.props, prevProps)) {

            if (!_isEqual(issuedTaxReceiptDonationsDetail, prevProps.issuedTaxReceiptDonationsDetail)) {
                issuedTaxReceiptDonationsDetailState = _uniqBy(issuedTaxReceiptDonationsDetailState.concat(issuedTaxReceiptDonationsDetail), 'donation_id');
                contentLoader = false;
                loadMoreLoader = false;
            }

            this.setState({
                contentLoader,
                downloadloader,
                issuedTaxReceiptDonationsDetailState,
                loadMoreLoader,
            });
        }
    }

    onPageChanged(year) {
        const {
            id,
            dispatch,
            issuedTaxReceiptYearlyDetailPageCount,
        } = this.props;
        let {
            loadMoreIncrementor,
        } = this.state;
        if (loadMoreIncrementor < issuedTaxReceiptYearlyDetailPageCount) {
            loadMoreIncrementor += 1;
            getIssuedTaxreceiptDonationsDetail(dispatch, id, year, loadMoreIncrementor);
            this.setState({
                loadMoreIncrementor,
                loadMoreLoader: true,
            });
        }
    }

    handleClick(year, index) {
        let { activeIndex, contentLoader, issuedTaxReceiptDonationsDetailState} = this.state;
        const {
            id,
            dispatch,
        } = this.props;
        const newIndex = activeIndex === index ? -1 : index;
        if (activeIndex !== index && activeIndex !== -1) {
            contentLoader = true;
            getIssuedTaxreceiptDonationsDetail(dispatch, id, year, 1);
            issuedTaxReceiptDonationsDetailState = [];
        }

        this.setState({
            activeIndex: newIndex,
            contentLoader,
            issuedTaxReceiptDonationsDetailState,
            loadMoreIncrementor: 1,
        });
    }

    downloadTaxReceipt(event, year) {
        event.stopPropagation();
        const {
            id,
            dispatch,
        } = this.props;
        downloadTaxreceiptDonationsDetail(dispatch, id, year);
        this.setState({
            downloadloader: true,
        });
    }

    render() {
        const {
            activeIndex,
            contentLoader,
            downloadloader,
            issuedTaxReceiptDonationsDetailState,
            loadMoreIncrementor,
            loadMoreLoader,
        } = this.state;
        const {
            donationDetail,
            index,
            issuedTaxReceiptYearlyDetailPageCount,
        } = this.props;
        return (
            <Fragment>
                <Accordion.Title active={activeIndex === index} index onClick={(e) => {this.handleClick(donationDetail.year, index);}}>
                    <div className="leftIcon">
                        <Image src={angleDown} className="greyIcon" />
                    </div>
                    <div className="leftContent">
                        <div className="year">{donationDetail.year}</div>
                        <div>{donationDetail.total} tax-receiptable donations</div>
                    </div>
                    <div className="rightContent">
                                                        $
                        {donationDetail.total_amount}
                        {downloadloader ? <Icon name="spinner" loading /> : (
                            <div className="downloadIcon" onClick={(event)=>{this.downloadTaxReceipt(event, donationDetail.year);}}>
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
                        : ((!_isEmpty(issuedTaxReceiptDonationsDetailState) && issuedTaxReceiptDonationsDetailState.length > 0) && (
                            issuedTaxReceiptDonationsDetailState.map((yearlydetails) => (
                                <List divided verticalAlign="middle">
                                    <List.Item className="pt-1 pb-1">
                                        <List.Content floated="right" className="bold">
                                                                    $
                                            {yearlydetails.amount}
                                        </List.Content>
                                        <List.Content>{yearlydetails.transfer_date}</List.Content>
                                    </List.Item>
                                </List>
                            ))
                        ))

                    }
                </Accordion.Content>

                {
                    (issuedTaxReceiptYearlyDetailPageCount > 1 && loadMoreIncrementor < issuedTaxReceiptYearlyDetailPageCount) && (
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
    issuedTaxReceiptDonationsDetail: state.taxreceipt.issuedTaxReceiptDonationsDetail,
    issuedTaxReceiptYearlyDetailPageCount: state.taxreceipt.issuedTaxReceiptYearlyDetailPageCount,
});

export default connect(mapStateToProps)(IndividualTaxDonationContent);
