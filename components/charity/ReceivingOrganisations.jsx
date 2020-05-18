import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Header,
    Placeholder,
    Divider,
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
            transactionsLoader ? (
                <Fragment>
                    <Placeholder>
                        <Placeholder.Line length='short' />
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='medium' />
                    </Placeholder>
                    <Divider />
                    <Placeholder>
                        <Placeholder.Line length='short' />
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='medium' />
                    </Placeholder>
                    <Divider />
                    <Placeholder>
                        <Placeholder.Line length='short' />
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='medium' />
                    </Placeholder>
                    <Divider />
                    <Placeholder>
                        <Placeholder.Line length='short' />
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='medium' />
                    </Placeholder>
                    <Divider />
                </Fragment>

            // <PlaceholderGrid row={3} column={1} placeholderType="multiLine" />
            ) : (
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
                            <Header as="h6">CHARITY</Header>
                            <Header as="h3">
                                <p>
                                    {donee.donee_name}
                                </p>
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
            )
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
