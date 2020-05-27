import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Header,
    Icon,
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
import { withTranslation } from '../../i18n';

class ReceivingOrganisations extends React.Component {
    constructor(props) {
        super(props);
        this.handleSeeMore = this.handleSeeMore.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
            donationDetails: doneeList,
            charityDetails: {
                id: charityId,
            },
            year,
        } = this.props;
        if (_isEmpty(doneeList)) {
            dispatch(getBeneficiaryDoneeList(charityId, year));
        }
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
        dispatch(getBeneficiaryDoneeList(charityId, year, currentPage + 1, true));
    }

    render() {
        const {
            donationDetails: doneeList,
            currentPage,
            currency,
            language,
            showButtonLoader,
            totalPages,
            transactionsLoader,
            t: formatMessage,
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
                        <Header as="h6">{formatMessage('charityProfile:charityHeader')}</Header>
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
                <PlaceholderGrid row={5} column={1} placeholderType="multiLine" />
            ) : (
                <Fragment>
                    <div className="ScrollData">
                        {viewData}
                    </div>

                    {(currentPage < totalPages)
                        && (
                            <div className="loadMore">
                                {
                                    showButtonLoader
                                        ? <Icon name="spinner" loading />
                                        : (
                                            <Button
                                                className="blue-bordr-btn-round-def"
                                                content={formatMessage('charityProfile:seeMore')}
                                                onClick={this.handleSeeMore}
                                            />
                                        )
                                }
                            </div>
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
    currency: 'USD',
    currentPage: null,
    dispatch: () => { },
    donationDetails: [],
    language: 'en',
    showButtonLoader: false,
    t: () => {},
    totalPages: null,
    transactionsLoader: true,
};

ReceivingOrganisations.propTypes = {
    charityDetails: PropTypes.shape({
        id: number,
    }),
    currency: string,
    currentPage: number,
    dispatch: func,
    donationDetails: arrayOf(PropTypes.element),
    language: string,
    showButtonLoader: bool,
    t: PropTypes.func,
    totalPages: number,
    transactionsLoader: bool,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        currentPage: state.charity.currentPage,
        donationDetails: state.charity.donationDetails,
        showButtonLoader: state.charity.showButtonLoader,
        totalPages: state.charity.totalPages,
        transactionsLoader: state.charity.showPlaceholder,
    };
}

export default withTranslation('charityProfile')(connect(mapStateToProps)(ReceivingOrganisations));
