import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
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
} from 'prop-types';
import {
    connect,
} from 'react-redux';

import { getTransactionDetails } from '../../actions/group';
import PaginationComponent from '../shared/Pagination';

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
        const url = `groups/${groupId}/activities?filter[moneyItems]=all&page[number]=${data.activePage}&page[size]=2`;
        getTransactionDetails(dispatch, groupId, url);
        this.setState({
            activePage: data.activePage,
        });
    }

    render() {
        const {
            groupTransactions: {
                data: groupData,
                meta: {
                    pageCount,
                },
            },
        } = this.props;
        const {
            activePage,
        } = this.state;
        let transactionData = 'No Data';
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
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="amount">
                                {transactionSign}
                                $
                                {transaction.attributes.amount}
                            </Table.Cell>
                        </Table.Row>
                    </Fragment>
                );
            });
        }

        return (
            <div className="pt-2">
                <Table basic="very" className="brdr-top-btm db-activity-tbl">
                    <Table.Body>
                        {transactionData}
                    </Table.Body>
                </Table>
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
            </div>
        );
    }
}

TransactionDetails.defaultProps = {
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
};

TransactionDetails.propTypes = {
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
};


function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        groupTransactions: state.group.groupTransactions,
    };
}

export default connect(mapStateToProps)(TransactionDetails);
