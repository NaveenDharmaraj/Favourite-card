import React from 'react';
import { connect } from 'react-redux';
import {
    Table,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import _ from 'lodash';
import {
    arrayOf,
    PropTypes,
    number,
    func,
    string,
    bool,
} from 'prop-types';

import { formatCurrency } from '../../helpers/give/utils';
import {
    getBeneficiaryDoneeList,
} from '../../actions/charity';
import PlaceholderGrid from '../shared/PlaceHolder';

import CharityNoDataState from './CharityNoDataState';

class ReceivingOrganisations extends React.Component {
    componentDidMount() {
        const {
            dispatch,
            charityDetails: {
                charityDetails: {
                    id: charityId,
                },
            },
        } = this.props;
        getBeneficiaryDoneeList(dispatch, charityId);
    }

    showList() {
        const {
            currency,
            donationDetails: {
                donationDetails: {
                    _embedded: {
                        donee_list: list,
                    },
                },
            },
            language,
        } = this.props;
        // TODO 'language' from withTranslation
        return (
            list.map((donee) => (
                <Table.Row>
                    <Table.Cell>{donee.donee_name}</Table.Cell>
                    <Table.Cell className="bold">
                        {formatCurrency(donee.gifts_total, language, currency)}
                    </Table.Cell>
                </Table.Row>
            )));
    }

    render() {
        const {
            donationDetails: {
                donationDetails: {
                    page: {
                        size,
                        totalElements,
                    },
                    totalAmount: {
                        remainingAmount,
                        totalAmount,
                    },
                    _embedded: {
                        donee_list: doneeList,
                    },
                },
            },
            currency,
            language,
            transactionsLoader,
        } = this.props;
        let remainingOrganisation = null;
        if (totalElements && (totalElements > 20) && size) {
            remainingOrganisation = totalElements - size;
        }
        let listData = <CharityNoDataState />;
        let totalData = '';
        if (!_isEmpty(doneeList)) {
            listData = (
                <Table.Body>
                    {this.showList()}
                    {remainingOrganisation
                        && (
                            <Table.Row>
                                <Table.Cell>{`${remainingOrganisation} other organizations`}</Table.Cell>
                                <Table.Cell className="bold">
                                    {formatCurrency(remainingAmount, language, currency)}
                                </Table.Cell>
                            </Table.Row>
                        )
                    }
                </Table.Body>
            );
            totalData = (
                <Table.Footer className="brdr-footer">
                    <Table.Row>
                        <Table.Cell>
                            {`${totalElements} gifts to qualified organizations totalled`}
                        </Table.Cell>
                        <Table.Cell className="bold">
                            {formatCurrency(totalAmount, language, currency)}
                        </Table.Cell>
                    </Table.Row>
                </Table.Footer>
            );
        }
        return (
            <Table basic="very" className="no-border-table">
                {!transactionsLoader
                    ? listData
                    : (<PlaceholderGrid row={3} column={2} placeholderType="table" />)
                }
                {(!transactionsLoader)
                    ? totalData
                    : (<PlaceholderGrid row={1} column={2} placeholderType="table" />)
                }
            </Table>
        );
    }
}

ReceivingOrganisations.defaultProps = {
    charityDetails: {
        charityDetails: {
            id: null,
        },
    },
    currency: 'USD',
    dispatch: func,
    donationDetails: {
        donationDetails: {
            _embedded: {
                donee_list: [],
            },
            page: {
                size: null,
                totalElements: null,
            },
            totalAmount: {
                remainingAmount: null,
                totalAmount: null,
            },
        },
    },
    language: 'en',
    transactionsLoader: true,
};

ReceivingOrganisations.propTypes = {
    charityDetails: PropTypes.shape({
        charityDetails: PropTypes.shape({
            id: number,
        }),
    }),
    currency: string,
    dispatch: _.noop,
    donationDetails: PropTypes.shape({
        donationDetails: PropTypes.shape({
            _embedded: PropTypes.shape({
                donee_list: arrayOf(PropTypes.element),
            }),
            page: PropTypes.shape({
                size: number,
                totalElements: number,
            }),
            totalAmount: PropTypes.shape({
                remainingAmount: number,
                totalAmount: number,
            }),
        }),
    }),
    language: string,
    transactionsLoader: bool,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        donationDetails: state.charity.donationDetails,
        transactionsLoader: state.charity.showPlaceholder,
    };
}

export default connect(mapStateToProps)(ReceivingOrganisations);
