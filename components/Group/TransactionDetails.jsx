import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    Button,
    Table,
    Image,
    List,
} from 'semantic-ui-react';
import {
    arrayOf,
    PropTypes,
    string,
    number,
    func,
    bool,
} from 'prop-types';
import {
    connect,
} from 'react-redux';

import {
    getTransactionDetails,
    toggleTransactionVisibility,
} from '../../actions/group';
import {
    formatCurrency,
} from '../../helpers/give/utils';
import PaginationComponent from '../shared/Pagination';
import PlaceholderGrid from '../shared/PlaceHolder';
import downloadIcon from '../../static/images/icons/icon-download.svg';

import GroupNoDataState from './GroupNoDataState';

class TransactionDetails extends React.Component {
    constructor(props) {
        super(props);
        this.onPageChange = this.onPageChange.bind(this);
        this.state = {
            activePage: 1,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            id,
        } = this.props;
        getTransactionDetails(dispatch, id);
    }

    onPageChange(event, data) {
        const {
            id: groupId,
            dispatch,
        } = this.props;
        const url = `groups/${groupId}/activities?filter[moneyItems]=all&page[number]=${data.activePage}&page[size]=10`;
        getTransactionDetails(dispatch, groupId, url);
        this.setState({
            activePage: data.activePage,
        });
    }

    toggleVisibility(event, transactionId) {
        const {
            dispatch,
        } = this.props;
        toggleTransactionVisibility(dispatch, transactionId, event.target.id);
    }

    render() {
        const {
            currency,
            groupDetails: {
                attributes: {
                    isAdmin,
                    slug,
                }
            },
            groupTransactions: {
                data: groupData,
                meta: {
                    pageCount,
                },
            },
            isChimpAdmin,
            language,
            tableListLoader,
        } = this.props;
        const {
            activePage,
        } = this.state;
        let transactionData = (
            <GroupNoDataState
                type="transactions"
            />
        );
        if (!_isEmpty(groupData)) {
            transactionData = groupData.map((transaction) => {
                let date = new Date(transaction.attributes.createdAt);
                const dd = date.getDate();
                const mm = date.getMonth();
                const month = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const yyyy = date.getFullYear();
                date = `${month[mm]} ${dd} ,${yyyy}`;
                let rowClass = '';
                let transactionSign = '';
                const imageCls = 'ui image';
                const amountStatus = transaction.attributes.showAmount ? 'hide' : 'unhide';

                // TODO after Api Changes to show + or -
                if (transaction.attributes.transactionType === 'GroupReceivedAllocationEvent') {
                    transactionSign = '+';
                    rowClass = 'm-allocation';
                } else {
                    transactionSign = '-';
                    rowClass = 'allocation';
                }
                return (
                    <Fragment>
                        <Table.Row className={rowClass}>
                            <Table.Cell className="date">{date}</Table.Cell>
                            <Table.Cell>
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image className={imageCls} size="tiny" src={transaction.attributes.imageUrl} />
                                        <List.Content>
                                            <List.Header>
                                                {transaction.attributes.description}
                                            </List.Header>
                                            {(isChimpAdmin && transaction.attributes.canToggleName)
                                            && (
                                                <Fragment>
                                                    <a id="name" onClick={() => this.toggleVisibility(event,transaction.id)} className="mr-1">
                                                                toggle display of name
                                                    </a>
                                                </Fragment>
                                            )}
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="amount">
                                {transaction.attributes.showAmount
                                    ? (
                                        <Fragment>
                                            {transactionSign}
                                            {formatCurrency(transaction.attributes.totalAmount, language, currency)}
                                        </Fragment>
                                    )
                                    : (
                                        'Hidden'
                                    )}
                                {(isChimpAdmin && transaction.attributes.canToggleAmount)
                                && (
                                    <Fragment>
                                        <br />
                                        <a className="font-w-normal font-s-14 pointer" id="amount" onClick={() => this.toggleVisibility(event,transaction.id)}>
                                            {amountStatus}
                                        </a>
                                    </Fragment>
                                )}
                            </Table.Cell>
                        </Table.Row>
                    </Fragment>
                );
            });
        }

        return (
            <div>
                {!_isEmpty(groupData) && isAdmin && (
                    <a href={`/groups/${slug}.csv`} target="_blank">
                        <Button
                            className="blue-bordr-btn-round"
                        >
                            Download transaction data <div className="btn-icon-line"><Image src={downloadIcon} /></div>
                        </Button>
                    </a>

                )
                }
                <Table basic="very" className="brdr-top-btm db-activity-tbl">
                    {!tableListLoader ? (
                        <Table.Body>
                            {transactionData}
                        </Table.Body>
                    ) : (<PlaceholderGrid row={3} column={3} placeholderType="table" />)
                    }
                </Table>
                {!_isEmpty(groupData) && pageCount > 1
                    && (
                        <div className="db-pagination right-align pt-2">
                            <PaginationComponent
                                activePage={activePage}
                                onPageChanged={this.onPageChange}
                                totalPages={pageCount}
                                firstItem={(activePage === 1) ? null : undefined}
                                lastItem={(activePage === pageCount) ? null : undefined}
                                prevItem={(activePage === 1) ? null : undefined}
                                nextItem={(activePage === pageCount) ? null : undefined}
                            />
                        </div>
                    )
                }
            </div>
        );
    }
}

TransactionDetails.defaultProps = {
    currency: 'USD',
    dispatch: func,
    groupTransactions: {
        data: [],
        links: {
            next: '',
        },
        meta: {
            pageCount: '',
        },
    },
    id: null,
    isChimpAdmin: false,
    language: 'en',
    tableListLoader: true,
};

TransactionDetails.propTypes = {
    currency: string,
    dispatch: _.noop,
    groupTransactions: {
        data: arrayOf(PropTypes.element),
        links: PropTypes.shape({
            next: string,
        }),
        meta: PropTypes.shape({
            pageCount: string,
        }),
    },
    id: number,
    isChimpAdmin: bool,
    language: string,
    tableListLoader: bool,
};


function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        groupTransactions: state.group.groupTransactions,
        isChimpAdmin: state.user.isAdmin,
        tableListLoader: state.group.showPlaceholder,
    };
}

export default connect(mapStateToProps)(TransactionDetails);
