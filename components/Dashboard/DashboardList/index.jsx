/* eslint-disable react/prop-types */
import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Card,
    Container,
    Table,
    Image,
    List,
    Grid,
    Header,
    Menu,
    Modal,
    Popup,
    TableCell,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import getConfig from 'next/config';

import {
    getDashBoardData,
} from '../../../actions/dashboard';
import Pagination from '../../shared/Pagination';
import noDataImg from '../../../static/images/noresults.png';
import iconsRight from '../../../static/images/icons/icon-document.svg';
import PlaceHolderGrid from '../../shared/PlaceHolder';
import userGroupImage from '../../../static/images/no-data-avatar-group-chat-profile.png';
import { withTranslation } from '../../../i18n';
import grayfilter from '../../../static/images/icon_gray_filter.svg';
import {
    formatCurrency,
} from '../../../helpers/give/utils';
import DashboardTransactionDetails from '../DashboardTransactionDetails';

const { publicRuntimeConfig } = getConfig();
const {
    CORP_DOMAIN,
    HELP_CENTRE_URL,
} = publicRuntimeConfig;
class DashboradList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            currentActivePage: 1,
            dashboardListLoader: !props.dataList,
            filterType: 'all',
            disableFilter: false,
        };
        this.onPageChanged = this.onPageChanged.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        getDashBoardData(dispatch, 'all', id, 1);
        this.setState({
            disableFilter: true
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            dataList,
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        let {
            dashboardListLoader,
        } = this.state;
        const {
            filterType,
        } = this.state;
        if (!_.isEqual(this.state, prevState)) {
            if (!_.isEqual(filterType, prevState.filterType)) {
                getDashBoardData(dispatch, filterType, id, 1);
                if(filterType === 'all') {
                    this.setState({
                        disableFilter: true,
                    });
                }
            }
        }
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(dataList, prevProps.dataList)) {
                dashboardListLoader = false;
            }
            this.setState({
                dashboardListLoader,
            });
        }
    }

    onPageChanged(event, data) {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        const { filterType } = this.state;
        getDashBoardData(dispatch, filterType, id, data.activePage);
        this.setState({
            currentActivePage: data.activePage,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    nodataCard() {
        const { t: formatMessage } = this.props;
        return (
            <Card fluid className="noDataCard rightImg noHeader">
                <Card.Content>
                    <Image
                        floated="right"
                        src={noDataImg}
                    />
                    <Card.Header className="font-s-14">
                        <Header as="h4">
                            <Header.Subheader>
                                <Header.Content>
                                    {formatMessage('giveCommon:accountActivity.notransactionText')}
                                </Header.Content>
                            </Header.Subheader>
                        </Header>
                    </Card.Header>
                </Card.Content>
            </Card>
        );
    }

    listItem() {
        const {
            currentUser: {
                id,
            },
            dataList,
            i18n: {
                language,
            },
            t: formatMessage,
        } = this.props;
        let accordianHead = this.nodataCard();
        let compareDate = '';
        if (dataList && dataList.data && _.size(dataList.data) > 0) {
            accordianHead = dataList.data.map((data, index) => {
                let date = new Date(data.attributes.createdAt);
                const dd = date.getDate();
                const mm = date.getMonth();
                const month = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ];
                const yyyy = date.getFullYear();
                date = `${month[mm]} ${dd}, ${yyyy}`;
                const modalDate = `${month[mm]} ${dd}, ${yyyy}`;
                let dateClass = 'date boderBottom';
                if (date !== compareDate) {
                    compareDate = date;
                } else {
                    dateClass = 'date';
                    date = '';
                }
                if (date) {
                    dateClass += ' mobBrdrBtm';
                }
                let givingType = ''; let rowClass = ''; let givingTypeClass = ''; let descriptionType = ''; let entity = ''; let transactionSign = ''; let profileUrl = '';
                let informationSharedEntity = '';
                let imageCls = 'ui image';
                let transactionTypeDisplay = '';
                const isGiftCancelled = (data.attributes.status === 'cancelled'
                || data.attributes.status === 'returned_to_donor'
                || data.attributes.status === 'expired'
                || data.attributes.status === 'bounced');
                const giftReversed = <label className='giftNotSent'>{formatMessage('giveCommon:giftReversedText')}</label>;
                const giftReturned = <label className='giftNotSent'>{formatMessage('giveCommon:accountActivity.giftReturnedText')}</label>;
                const giftRefund = <label className='giftNotSent'>{formatMessage('giveCommon:accountActivity.giftRefundText')}</label>;
                const matchReturned = <label className='giftNotSent'>{formatMessage('giveCommon:accountActivity.matchReturnedText')}</label>;
                const isScheduledAllocation = data.attributes.parentTransactionType === 'ScheduledP2pAllocation';
                const newtransactionTypeDisplay = (isScheduledAllocation ? 'Scheduled Allocation' : 'Gift given');
                if (!_.isEmpty(data.attributes.destination)) {
                    if (data.attributes.destination.type.toLowerCase() === 'group') {
                        givingType = 'giving group';
                        rowClass = 'm-allocation';
                        givingTypeClass = 'grp-color';
                        transactionTypeDisplay = isGiftCancelled ? giftReturned : 'Gift given';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `groups/${data.attributes.destination.slug}`;
                        informationSharedEntity = data.attributes.hasCampaign ? 'Giving Group and Campaign admins' : 'Giving Group admin';
                    } else if (data.attributes.destination.type.toLowerCase() === 'beneficiary') {
                        givingType = 'charity';
                        rowClass = 'allocation';
                        givingTypeClass = 'charity-color';
                        transactionTypeDisplay = isGiftCancelled ? giftReturned : 'Gift given';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `charities/${data.attributes.destination.slug}`;
                        informationSharedEntity = 'charity';
                    } else if (data.attributes.destination.type.toLowerCase() === 'campaign') {
                        givingType = 'campaign';
                        rowClass = 'allocation';
                        givingTypeClass = 'grp-color';
                        transactionTypeDisplay = isGiftCancelled ? giftReturned : 'Gift given';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `campaigns/${data.attributes.destination.slug}`;
                        informationSharedEntity = 'campaign';
                    } else if (data.attributes.transactionType.toLowerCase() === 'donation') {
                        givingType = '';
                        rowClass = 'donation';
                        descriptionType = 'Added to ';
                        entity = 'your Impact Account';
                        transactionSign = '+';
                        transactionTypeDisplay = isGiftCancelled ? giftRefund : 'Deposit';
                        imageCls = 'ui avatar image';
                    } else if (data.attributes.transactionType.toLowerCase() === 'matchallocation') {
                        givingType = '';
                        rowClass = 'gift';
                        descriptionType = 'Matched by ';
                        transactionTypeDisplay = isGiftCancelled ? matchReturned : 'Matched';
                        entity = data.attributes.source.name;
                        transactionSign = '+';
                    } else if (data.attributes.destination.id === Number(id)) {
                        givingType = '';
                        rowClass = 'gift';
                        descriptionType = 'Received a gift from ';
                        transactionTypeDisplay = isGiftCancelled ? giftReturned : 'Gift received';
                        transactionSign = isGiftCancelled ? '-' : '+';
                        if (!_.isEmpty(data.attributes.source)) {
                            entity = data.attributes.source.name;
                            if (data.attributes.source.type === 'User') {
                                profileUrl = `users/profile/${data.attributes.source.id}`;
                            } else if (data.attributes.source.type.toLowerCase() === 'campaign') {
                                profileUrl = `campaigns/${data.attributes.source.slug}`;
                            } else if (data.attributes.source.type.toLowerCase() === 'group') {
                                profileUrl = `groups/${data.attributes.source.slug}`;
                            }
                        } else {
                            // fall back to description InvestmentTransfer, Dispostion
                            descriptionType = data.attributes.description;
                        }
                    } else if ((data.attributes.source.id === Number(id) && data.attributes.transactionType.toLowerCase() === 'fundallocation')) {
                        givingType = '';
                        rowClass = 'gift';
                        transactionTypeDisplay = isGiftCancelled ? giftReturned : newtransactionTypeDisplay;
                        descriptionType = 'Given to ';
                        entity = data.attributes.hasChildAllocations ? `${data.attributes.destination.name} and others` : data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = !isScheduledAllocation ? `users/profile/${data.attributes.destination.id}` : '';
                    }
                } else if (data.attributes.source.id === Number(id) && data.attributes.transactionType.toLowerCase() === 'fundallocation') {
                    givingType = '';
                    rowClass = 'gift';
                    transactionTypeDisplay = isGiftCancelled ? giftReturned : newtransactionTypeDisplay;
                    descriptionType = 'Given to ';
                    entity = data.attributes.hasChildAllocations ? `${data.attributes.recipientEmail} and others` : data.attributes.recipientEmail;
                    transactionSign = isGiftCancelled ? '+' : '-';
                } else if (data.attributes.source.id === Number(id)) {
                    // last catch block to handle all other senarios
                    transactionTypeDisplay = 'Gift given';
                    descriptionType = data.attributes.description;
                    transactionSign = '-';
                    // for catransfer destination is blank but it is a deposit
                    if (data.attributes.transactionType.toLowerCase() === 'catransfer') {
                        transactionSign = isGiftCancelled ? '+' : '-';
                        transactionTypeDisplay = isGiftCancelled ? giftReversed : 'Deposit';
                    }
                }
                const amount = data.attributes.hasChildAllocations ? formatCurrency(data.attributes.totalAmount, language, 'USD') : formatCurrency(data.attributes.amount, language, 'USD');
                return (
                    <Table.Row className={rowClass} key={index}>
                        <Table.Cell className={dateClass}>{date}</Table.Cell>
                        <Table.Cell>
                            <List verticalAlign="middle">
                                <List.Item>
                                    <Image className={imageCls} size="tiny" src={data.attributes.hasChildAllocations ? userGroupImage : data.attributes.imageUrl} />
                                    <List.Content>
                                        <List.Header>
                                            {descriptionType}
                                            {(profileUrl) ? (
                                                <b>
                                                    <a href={profileUrl} className="bolder blackText" target="_blank">
                                                        {entity}
                                                    </a>
                                                </b>
                                            ) : (
                                                <b>
                                                    {entity}
                                                </b>
                                            )}
                                        </List.Header>
                                        <List.Description className={givingTypeClass}>
                                            {givingType}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Table.Cell>
                        <TableCell>
                            <Modal
                                size="tiny"
                                dimmer="inverted"
                                className="chimp-modal acntActivityModel"
                                closeIcon
                                trigger={
                                    (
                                        <span className="descriptionRight">
                                            <Image className="icons-right-page" src={iconsRight} />
                                        </span>
                                    )}
                            >
                                <Modal.Header>{modalDate}</Modal.Header>
                                <Modal.Content>
                                    <div className="acntActivityHeader">
                                        <Header as="h2" icon>
                                            <Image className={imageCls} size="tiny" src={isScheduledAllocation ? userGroupImage : data.attributes.imageUrl} />
                                            {transactionSign}
                                            {amount}
                                            <Header.Subheader>
                                                {isGiftCancelled
                                                    ? (
                                                        transactionTypeDisplay
                                                    )
                                                    : (
                                                        <Fragment>
                                                            {descriptionType}
                                                            {(profileUrl) ? (
                                                                <span>
                                                                    {entity}
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    {entity}
                                                                </span>
                                                            )}
                                                        </Fragment>
                                                    )}
                                            </Header.Subheader>
                                        </Header>
                                    </div>
                                    {
                                        !_.isEmpty(data.attributes.metaValues) && (
                                            <DashboardTransactionDetails
                                                data={data}
                                                modalDate={modalDate}
                                                informationSharedEntity={informationSharedEntity}
                                                sourceUserId={id}
                                            />
                                        )
                                    }
                                    {isGiftCancelled
                                        && (
                                            <div className="learnAboutWrap">
                                                {(data.attributes.transactionType.toLowerCase() === 'matchallocation')
                                                && (
                                                    <p>Due to a refund in a previous transaction. </p>
                                                )}
                                                If you have questions about this transaction,
                                                <a href={`${CORP_DOMAIN}/contact/`}> contact us </a>
                                                for help.
                                            </div>
                                        )
                                    }
                                </Modal.Content>
                            </Modal>
                        </TableCell>
                        <Table.Cell className="reason">{transactionTypeDisplay}</Table.Cell>
                        <Table.Cell className="amount">
                            {transactionSign}
                            {amount}
                        </Table.Cell>
                    </Table.Row>
                );
            });
        }
        return (
            <Table basic="very" className="brdr-top-btm db-activity-tbl">
                <Table.Body>
                    {accordianHead}
                </Table.Body>
            </Table>
        );
    }

    handleCancel = () => {
        this.setState({ isOpen: false });
    }

    handleOpen = () => {
        this.setState({ isOpen: true })
    }

    render() {
        const {
            dataList,
            t: formatMessage,
        } = this.props;
        const {
            currentActivePage,
            dashboardListLoader,
            isOpen,
            filterType,
            disableFilter,
        } = this.state;
        return (
            <div className="pt-2 pb-2">
                <Container>
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={11} tablet={12} computer={12}>
                                <Header as="h3">
                                    <Header.Content>
                                        {formatMessage('giveCommon:accountActivity.accountActivityHeader')}
                                    </Header.Content>
                                </Header>
                            </Grid.Column>
                            <Grid.Column mobile={5} tablet={4} computer={4}>
                                <Popup
                                    basic
                                    open={isOpen}
                                    onClose={this.handleCancel}
                                    onOpen={this.handleOpen}
                                    show="Hide"
                                    on="click"
                                    wide
                                    className="filter-popup"
                                    position="bottom right"
                                    trigger={(
                                        <Menu.Item className="user-img give-btn">
                                            <div className="text-right Filter_icon_text">
                                                <span><Image className="filter_icons" src={grayfilter}/></span>
                                                <span className="Filter_text">{formatMessage('giveCommon:accountActivity.filterText')}</span>
                                            </div>
                                        </Menu.Item>
                                    )}
                                >
                                    <Popup.Content className="dropdown_filter">
                                        <List>
                                            <List.Item
                                                as='a'
                                                onClick={() => {
                                                    this.setState({
                                                        dashboardListLoader: true,
                                                        filterType: 'all',
                                                        isOpen: false,
                                                    })
                                                }}
                                                disabled={disableFilter}
                                                className="filterType_bg_hover"
                                            >
                                                {formatMessage('giveCommon:accountActivity.allText')}
                                            </List.Item>
                                            <List.Item
                                                as='a'
                                                onClick={() => {
                                                    this.setState({
                                                        dashboardListLoader: true,
                                                        disableFilter: false,
                                                        filterType: 'in',
                                                        isOpen: false,
                                                    })
                                                }}
                                                disabled={filterType === 'in' ?  true : false}
                                                className="filterType_bg_hover"
                                            >
                                                {formatMessage('giveCommon:accountActivity.inText')}
                                            </List.Item>
                                            <List.Item
                                                as='a'
                                                onClick={() => {
                                                    this.setState({
                                                        dashboardListLoader: true,
                                                        filterType: 'out',
                                                        isOpen: false,
                                                        disableFilter: false
                                                    })
                                                }}
                                                disabled={filterType === 'out' ?  true : false}
                                                className="filterType_bg_hover"
                                            >
                                                {formatMessage('giveCommon:accountActivity.outText')}
                                            </List.Item>
                                        </List>
                                    </Popup.Content>
                                </Popup>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <div className="pt-2">
                        {dashboardListLoader ? (
                            <Table padded unstackable className="no-border-table">
                                <PlaceHolderGrid row={6} column={4} placeholderType="table" />
                            </Table>
                        ) : (
                            this.listItem()
                        )}
                    </div>
                    <div className="paginationWraper">
                        <div className="db-pagination right-align pt-2">
                            {
                                !_.isEmpty(dataList) && dataList.count > 1 && dashboardListLoader === false && (
                                    <Pagination
                                        activePage={currentActivePage}
                                        totalPages={dataList.count}
                                        onPageChanged={this.onPageChanged}
                                    />
                                )
                            }
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        dataList: state.dashboard.dashboardData,
    };
}

export default withTranslation([
    'giveCommon',
])(connect(mapStateToProps)(DashboradList));
