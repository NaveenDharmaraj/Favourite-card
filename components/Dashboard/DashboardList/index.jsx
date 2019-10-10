/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Card,
    Container,
    Table,
    Image,
    List,
    Grid,
    Header,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    getDashBoardData,
} from '../../../actions/dashboard';
import Pagination from '../../shared/Pagination';
import noDataImg from '../../../static/images/noresults.png';
import PlaceHolderGrid from '../../shared/PlaceHolder';
import { withTranslation } from '../../../i18n';
import {
    formatCurrency,
} from '../../../helpers/give/utils';

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
                const month = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
                const yyyy = date.getFullYear();
                date = `${month[mm]} ${dd}, ${yyyy}`;
                if (date !== compareDate) {
                    compareDate = date;
                } else {
                    date = '';
                }
                let givingType = ''; let rowClass = ''; let givingTypeClass = ''; let descriptionType = ''; let entity = ''; let transactionSign = ''; let profileUrl='';
                let imageCls = 'ui image';
                if (data.attributes.destination !== null) {
                    if (data.attributes.destination.type.toLowerCase() === 'group') {
                        givingType = 'giving group';
                        rowClass = 'm-allocation';
                        givingTypeClass = 'grp-color';
                        data.attributes.transactionType = 'Gift given';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `groups/${data.attributes.destination.slug}`;
                    } else if (data.attributes.destination.type.toLowerCase() === 'beneficiary') {
                        givingType = 'charity';
                        rowClass = 'allocation';
                        givingTypeClass = 'charity-color';
                        data.attributes.transactionType = 'Gift given';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `charities/${data.attributes.destination.slug}`;
                    } else if (data.attributes.destination.type.toLowerCase() === 'campaign') {
                        givingType = 'campaign';
                        rowClass = 'allocation';
                        givingTypeClass = 'grp-color';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `campaigns/${data.attributes.destination.slug}`;
                    } else if ((data.attributes.transactionType.toLowerCase() === 'fundallocation' || data.attributes.transactionType.toLowerCase() === 'gift') && data.attributes.destination.id !== Number(id)) {
                        givingType = '';
                        rowClass = 'gift';
                        data.attributes.transactionType = 'Gift';
                        descriptionType = 'Given to ';
                        entity = data.attributes.destination.name;
                        transactionSign = '-';
                        profileUrl = `users/profile/${data.attributes.destination.id}`;
                    } else if (data.attributes.transactionType.toLowerCase() === 'donation') {
                        givingType = '';
                        rowClass = 'donation';
                        descriptionType = 'Added to ';
                        entity = 'your Impact Account';
                        transactionSign = '+';
                        imageCls = 'ui avatar image';
                    } else if (data.attributes.destination.id === Number(id)) {
                        givingType = '';
                        rowClass = 'gift';
                        descriptionType = 'Received a gift from ';
                        data.attributes.transactionType = 'Gift received';
                        entity = data.attributes.source.name;
                        transactionSign = '+';
                        profileUrl = `users/profile/${data.attributes.source.id}`;
                    }
                } else if (data.attributes.transactionType.toLowerCase() === 'fundallocation' || data.attributes.transactionType.toLowerCase() === 'gift') {
                    givingType = '';
                    rowClass = 'gift';
                    data.attributes.transactionType = 'Gift';
                    descriptionType = 'Given to ';
                    entity = data.attributes.recipientEmail;
                    transactionSign = '-';
                }
                const amount = formatCurrency(data.attributes.amount, language, 'USD');
                const transactionType = data.attributes.transactionType.toLowerCase() === 'donation' ? 'Deposit' : data.attributes.transactionType;
                return (
                    <Table.Row className={rowClass} key={index}>
                        <Table.Cell className="date">{date}</Table.Cell>
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
                                        </List.Header>
                                        <List.Description className={givingTypeClass}>
                                            {givingType}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Table.Cell>
                        <Table.Cell className="reason">{transactionType}</Table.Cell>
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
                        { dashboardListLoader ? (
                            <Table padded unstackable className="no-border-table">
                                <PlaceHolderGrid row={4} column={4} placeholderType="table" />
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

export default withTranslation(['giveCommon'])(connect(mapStateToProps)(DashboradList));
