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
    Modal,
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
import { withTranslation } from '../../../i18n';
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
            currentActivePage: 1,
            dashboardListLoader: !props.dataList,
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
    }

    componentDidUpdate(prevProps) {
        const {
            dataList,
        } = this.props;
        let {
            dashboardListLoader,
        } = this.state;
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
        getDashBoardData(dispatch, 'all', id, data.activePage);
        this.setState({
            currentActivePage: data.activePage,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    nodataCard() {
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
                                    No transactions yet.
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
                const isGiftCancelled = (data.attributes.status === 'cancelled' || data.attributes.status === 'returned_to_donor');
                const giftNotSent = <label className='giftNotSent'>GIFT NOT SENT</label>;
                const giftReversed = <label className='giftNotSent'>GIFT CANCELLED</label>;
                if (!_.isEmpty(data.attributes.destination)) {
                    if (data.attributes.destination.type.toLowerCase() === 'group') {
                        givingType = 'giving group';
                        rowClass = 'm-allocation';
                        givingTypeClass = 'grp-color';
                        transactionTypeDisplay = isGiftCancelled ? giftNotSent : 'Gift given';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `groups/${data.attributes.destination.slug}`;
                        informationSharedEntity = 'Giving Group admin';
                    } else if (data.attributes.destination.type.toLowerCase() === 'beneficiary') {
                        givingType = 'charity';
                        rowClass = 'allocation';
                        givingTypeClass = 'charity-color';
                        transactionTypeDisplay = isGiftCancelled ? giftNotSent : 'Gift given';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `charities/${data.attributes.destination.slug}`;
                        informationSharedEntity = 'charity';
                    } else if (data.attributes.destination.type.toLowerCase() === 'campaign') {
                        givingType = 'campaign';
                        rowClass = 'allocation';
                        givingTypeClass = 'grp-color';
                        transactionTypeDisplay = isGiftCancelled ? giftNotSent : 'Gift given';
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
                        transactionTypeDisplay = isGiftCancelled ? giftNotSent : 'Deposit';
                        imageCls = 'ui avatar image';
                    } else if (data.attributes.transactionType.toLowerCase() === 'matchallocation') {
                        givingType = '';
                        rowClass = 'gift';
                        descriptionType = 'Matched by ';
                        transactionTypeDisplay = 'Matched';
                        entity = data.attributes.source.name;
                        transactionSign = '+';
                    } else if (data.attributes.destination.id === Number(id)) {
                        givingType = '';
                        rowClass = 'gift';
                        descriptionType = 'Received a gift from ';
                        transactionTypeDisplay = isGiftCancelled ? giftReversed : 'Gift received';
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
                        transactionTypeDisplay = isGiftCancelled ? giftNotSent : 'Gift given';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `users/profile/${data.attributes.destination.id}`;
                    }
                } else if (data.attributes.source.id === Number(id) && data.attributes.transactionType.toLowerCase() === 'fundallocation') {
                    givingType = '';
                    rowClass = 'gift';
                    transactionTypeDisplay = isGiftCancelled ? giftReversed : 'Gift given';
                    descriptionType = 'Given to ';
                    entity = data.attributes.recipientEmail;
                    transactionSign = '-';
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
                const amount = formatCurrency(data.attributes.amount, language, 'USD');
                return (
                    <Table.Row className={rowClass} key={index}>
                        <Table.Cell className={dateClass}>{date}</Table.Cell>
                        <Table.Cell>
                            <List verticalAlign="middle">
                                <List.Item>
                                    <Image className={imageCls} size="tiny" src={data.attributes.imageUrl} />
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
                                            <Modal size="tiny" dimmer="inverted" className="chimp-modal acntActivityModel" closeIcon trigger={<span className="descriptionRight"><Image className="icons-right-page" src={iconsRight}/></span>}>
                                                <Modal.Header>{modalDate}</Modal.Header>
                                                <Modal.Content>
                                                    <div className="acntActivityHeader">
                                                        <Header as="h2" icon>
                                                            <Image className={imageCls} size="tiny" src={data.attributes.imageUrl} />
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
                                                        <div className='learnAboutWrap'>
                                                            Learn about the common reasons<br/>
                                                            <a href={`${HELP_CENTRE_URL}article/198-gifts-returned-to-your-impact-account `}> why a gift is not sent. </a>
                                                            Or,
                                                            <a href={`${CORP_DOMAIN}/contact/`}> contact us </a>
                                                            for help.
                                                        </div>
                                                    )
                                                    }
                                                </Modal.Content>
                                            </Modal>
                                        </List.Header>
                                        <List.Description className={givingTypeClass}>
                                            {givingType}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Table.Cell>
                        <Table.Cell className={`reason ${!isGiftCancelled ? 'reasonText' : ''}`}>{transactionTypeDisplay}</Table.Cell>
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

    render() {
        const {
            dataList,
        } = this.props;
        const {
            currentActivePage,
            dashboardListLoader,
        } = this.state;
        return (
            <div className="pt-2 pb-2">
                <Container>
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={12} computer={12}>
                                <Header as="h3">
                                    <Header.Content>
                                        Account activity
                                    </Header.Content>
                                </Header>
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
                                !_.isEmpty(dataList) && dataList.count > 1 && (
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
