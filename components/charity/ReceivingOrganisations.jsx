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

    render() {
        const {
            donationDetails: doneeList,
            currency,
            language,
            remainingElements,
            remainingAmount,
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
                    <div className="ScrollData" data-test="Charity_ReceivingOrganisations_doneeListModal">
                        {viewData}
                        {(remainingElements > 20)
                            && (
                                <div className="Ch_total" data-test="Charity_ReceivingOrganisations_totalAmount">
                                    <Header as="h3">
                                        <p>
                                            {remainingElements}
                                            &nbsp;
                                            {formatMessage('totalOrganisations')}
                                        </p>
                                        <span>{formatCurrency(remainingAmount, language, currency)}</span>
                                    </Header>

                                </div>
                            )}
                    </div>
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
    dispatch: () => { },
    donationDetails: [],
    language: 'en',
    remainingAmount: 0,
    remainingElements: 0,
    t: () => { },
    transactionsLoader: true,
};

ReceivingOrganisations.propTypes = {
    charityDetails: PropTypes.shape({
        id: number,
    }),
    currency: string,
    dispatch: func,
    donationDetails: arrayOf(PropTypes.element),
    language: string,
    remainingAmount: number,
    remainingElements: number,
    t: PropTypes.func,
    transactionsLoader: bool,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        donationDetails: state.charity.donationDetails,
        remainingAmount: state.charity.remainingAmount,
        remainingElements: state.charity.remainingElements,
        transactionsLoader: state.charity.showPlaceholder,
    };
}

const connectedComponent = withTranslation('charityProfile')(connect(mapStateToProps)(ReceivingOrganisations));
export {
    connectedComponent as default,
    ReceivingOrganisations,
    mapStateToProps,
};
