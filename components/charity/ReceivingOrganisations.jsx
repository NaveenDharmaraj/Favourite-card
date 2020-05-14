import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Header,
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
            year,
        } = this.props;
        getBeneficiaryDoneeList(dispatch, charityId, year);
    }

    render() {
        const {
            donationDetails: {
                donationDetails: {
                    _embedded: {
                        donee_list: doneeList,
                    },
                },
            },
            currency,
            language,
            transactionsLoader,
        } = this.props;
        return (
            doneeList.map((donee) => {
                let location = '';
                if (donee.city === '' && donee.province !== '') {
                    location = donee.province;
                } else if (donee.city !== '' && donee.province === '') {
                    location = donee.city;
                } else if (donee.city !== '' && donee.province !== '') {
                    location = `${donee.city}, ${donee.province}`;
                }
                return (
                    <div className="ch_giftPopcontent">
                        <Header as="h6">{!_.isEmpty(donee.donee_beneficiary_id) ? 'CHARITY' : ''}</Header>
                        <Header as="h3">
                            {donee.donee_name}
                            <span>
                                {formatCurrency(donee.gifts_total, language, currency)}
                            </span>
                        </Header>
                        <Header as="h5">
                            {location}
                        </Header>
                    </div>
                );
            })
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
