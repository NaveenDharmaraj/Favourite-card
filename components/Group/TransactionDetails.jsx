import React, {
    Fragment,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Button,
    Table,
    Image,
    List,
    Dropdown,
    Menu,
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

import { withTranslation } from '../../i18n';
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
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.state = {
            activePage: 1,
            selectedValue: 'all',
        };
    }

    componentDidMount() {
        const {
            dispatch,
            groupDetails: {
                id: groupId,
            },
        } = this.props;
        const {
            selectedValue,
        } = this.state;
        dispatch(getTransactionDetails(groupId, selectedValue));
    }

    onPageChange(event, data) {
        const {
            dispatch,
            groupDetails: {
                id: groupId,
            },
        } = this.props;
        const {
            selectedValue,
        } = this.state;
        dispatch(getTransactionDetails(groupId, selectedValue, data.activePage));
        this.setState({
            activePage: data.activePage,
        });
    }

    handleFilterChange(event, data) {
        const {
            dispatch,
            groupDetails: {
                id: groupId,
            },
        } = this.props;
        dispatch(getTransactionDetails(groupId, data.value));
        this.setState({
            activePage: 1,
            selectedValue: data.value,
        });
    }

    toggleVisibility(event, transactionId) {
        const {
            dispatch,
        } = this.props;
        dispatch(toggleTransactionVisibility(transactionId, event.target.id));
    }

    render() {
        const {
            currency,
            groupDetails: {
                attributes: {
                    isAdmin,
                    slug,
                },
            },
            groupTransactions: {
                data: groupData,
                meta: {
                    pageCount,
                },
            },
            isChimpAdmin,
            language,
            t: formatMessage,
            tableListLoader,
        } = this.props;
        const {
            activePage,
            selectedValue,
        } = this.state;
        const options = [
            {
                text: formatMessage('groupProfile:allActivity'),
                value: 'all',
            },
            {
                text: formatMessage('groupProfile:giftsReceived'),
                value: 'in',
            },
            {
                text: formatMessage('groupProfile:giftsGiven'),
                value: 'out',
            },
        ];

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
                date = `${month[mm]} ${dd}, ${yyyy}`;
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
                        <Table.Row className="EmilyData">
                            <Table.Cell className="date">{date}</Table.Cell>
                            <Table.Cell className="EmilyGroup full_width_text">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image className="pr_Img" size="tiny" src={transaction.attributes.imageUrl} />
                                        <List.Content>
                                            <List.Header>
                                                <span className="adminEmily">
                                                    {transaction.attributes.description}
                                                </span>
                                            </List.Header>
                                            {(isChimpAdmin && transaction.attributes.canToggleName && !transaction.attributes.isOneTimeUser)
                                            && (
                                                <Fragment>
                                                    <a id="name" onClick={() => this.toggleVisibility(event,transaction.id)} className="linkgroupProfile">
                                                        {formatMessage('groupProfile:toggleDisplayname')}
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
                                        formatMessage('groupProfile:hidden')
                                    )}
                                {(isChimpAdmin && transaction.attributes.canToggleAmount && !transaction.attributes.isOneTimeUser)
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
               <div className="btn_wrapper">
               {!_isEmpty(groupData) && isAdmin && (
                    <a href={`/groups/${slug}.csv`} target="_blank">
                        <Button
                            className="blue-bordr-btn-round btn_downloading"
                        >
                            {formatMessage('groupProfile:downloadData')}
                            <div className="btn-icon-line"><Image src={downloadIcon} /></div>
                        </Button>
                    </a>

                )
                }
                <Menu compact className="dropdownRight">
                    <Dropdown
                        value={selectedValue}
                        options={options}
                        onChange={this.handleFilterChange}
                        item
                        fluid
                    />
                </Menu>
               </div>
                <Table basic="very" unstackable className="db-activity-tbl Bottomborder Transactions_table">
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
    dispatch: () => {},
    groupDetails: {
        id: '',
    },
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
    t: () => {},
    tableListLoader: true,
};

TransactionDetails.propTypes = {
    currency: string,
    dispatch: func,
    groupDetails: {
        id: string,
    },
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
    t: func,
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

const connectedComponent = withTranslation([
    'common',
    'groupProfile',
])(connect(mapStateToProps)(TransactionDetails));
export {
    connectedComponent as default,
    TransactionDetails,
    mapStateToProps,
};
