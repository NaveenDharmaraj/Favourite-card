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
} from 'prop-types';

import { formatCurrency } from '../../helpers/give/utils';
import {
    getBeneficiaryDoneeList,
} from '../../actions/charity';
import PlaceholderGrid from '../shared/PlaceHolder';

class ReceivingOrganisations extends React.Component {
    static showList(list) {
        const currency = 'USD';
        const language = 'en';
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

    constructor(props) {
        super(props);
        this.state = {
            transactionsLoader: !(props.donationDetails && props.donationDetails.donationDetails
                                    && props.donationDetails.donationDetails._embedded
                                    && props.donationDetails.donationDetails._embedded.donee_list.length > 0
            ),
        };
    }

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

    componentDidUpdate(prevProps) {
        const {
            donationDetails: {
                donationDetails: {
                    _embedded: {
                        donee_list: doneeList,
                    },
                },
            },
        } = this.props;
        let {
            transactionsLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_isEmpty(doneeList)) {
                transactionsLoader = false;
            }
            this.setState({
                transactionsLoader,
            });
        }
    }

    render() {
        const {
            donationDetails,
        } = this.props;
        const {
            transactionsLoader,
        } = this.state;
        return (
            <Table basic="very" className="no-border-table">
                {!transactionsLoader ? (
                    <Table.Body>
                        {(donationDetails && donationDetails.donationDetails && donationDetails.donationDetails._embedded
                        && ReceivingOrganisations.showList(donationDetails.donationDetails._embedded.donee_list)
                        )}
                    </Table.Body>
                ) : (<PlaceholderGrid row={3} column={2} placeholderType="table" />)
                }
                <Table.Footer className="brdr-footer">
                    <Table.Row>
                        {/* <Table.Cell>118 gifts to qualified organizations totalled</Table.Cell>
                        <Table.Cell className="bold">$14,234,189.0</Table.Cell> */}
                    </Table.Row>
                </Table.Footer>
            </Table>
        );
    }
}

ReceivingOrganisations.defaultProps = {
    charityDetails: PropTypes.shape({
        charityDetails: PropTypes.shape({
            id: null,
        }),
    }),
    dispatch: func,
    donationDetails: PropTypes.shape({
        donationDetails: PropTypes.shape({
            _embedded: PropTypes.shape({
                donee_list: [],
            }),
        }),
    }),
};

ReceivingOrganisations.propTypes = {
    charityDetails: PropTypes.shape({
        charityDetails: PropTypes.shape({
            id: number,
        }),
    }),
    dispatch: _.noop,
    donationDetails: PropTypes.shape({
        donationDetails: PropTypes.shape({
            _embedded: PropTypes.shape({
                donee_list: arrayOf(PropTypes.element),
            }),
        }),
    }),
};

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
        donationDetails: state.charity.donationDetails,
    };
}

export default connect(mapStateToProps)(ReceivingOrganisations);
