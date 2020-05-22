import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Header,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
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

class ReceivingOrganisations extends React.Component {
    constructor(props) {
        super(props);
        this.handleSeeMore = this.handleSeeMore.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
            charityDetails: {
                id: charityId,
            },
            year,
        } = this.props;
        dispatch(getBeneficiaryDoneeList(charityId, year));
    }

    handleSeeMore() {
        const {
            currentPage,
            dispatch,
            charityDetails: {
                id: charityId,
            },
            year,
        } = this.props;
        dispatch(getBeneficiaryDoneeList(charityId, year,currentPage + 1,true));
    }

    render() {
        const {
            donationDetails: doneeList,
            currentPage,
            currency,
            language,
            totalPages,
            transactionsLoader,
        } = this.props;
        let viewData = '';
        if (!_isEmpty(doneeList)) {
            viewData = doneeList.map((donee) => {
                let location = '';
                if (_isEmpty(donee.city) && !_isEmpty(donee.province)) {
                    location = donee.province;
                } else if (!_isEmpty(donee.city) && _isEmpty(donee.province)) {
                    location = donee.city;
                } else if (!_isEmpty(donee.city) && !_isEmpty(donee.province)) {
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
            });
        }

        return (
            transactionsLoader ? (

                <PlaceholderGrid row={6} column={1} placeholderType="multiLine" />

            ) : (
                <Fragment>
                    {viewData}
                    {(currentPage < totalPages)
                    && (
                    <Button
                        className="blue-btn-rounded-def"
                        content="see more"
                        onClick = {this.handleSeeMore}
                    />
                    )}
                </Fragment>
                )
        );
    }
}

ReceivingOrganisations.defaultProps = {
    charityDetails: {
        id: null,
    },
    currentPage: null,
    currency: 'USD',
    dispatch: () => {},
    donationDetails: [],
    language: 'en',
    totalPages: null,
    transactionsLoader: true,
};

ReceivingOrganisations.propTypes = {
    charityDetails: PropTypes.shape({
        id: number,
    }),
    currentPage: number,
    currency: string,
    dispatch: func,
    donationDetails: arrayOf(PropTypes.element),
    language: string,
    totalPages: number,
    transactionsLoader: bool,
};

function mapStateToProps(state) {
    return {
        currentPage: state.charity.currentPage,
        charityDetails: state.charity.charityDetails,
        donationDetails: state.charity.donationDetails,
        totalPages: state.charity.totalPages,
        transactionsLoader: state.charity.showPlaceholder,
    };
}

export default connect(mapStateToProps)(ReceivingOrganisations);
