
import React, {
    Fragment,
} from 'react';
import {
    Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import { withTranslation } from 'react-i18next';

import '../../../../static/less/giveFlows.less';
import {
    getDonationMatchedData, formatCurrency, formatAmount,
} from '../../../../helpers/give/utils';
import { Link } from '../../../../routes';

const AddMoneySuccess = (props) => {
    const currency = 'USD';
    const {
        donationMatchData,
        i18n: {
            language,
        },
        successData,
        t: formatMessage,
    } = props;
    const {
        giveData: {
            donationAmount,
            donationMatch,
            giveTo,
            giftType,
        },
    } = successData;
    let donationMatchedData = null;
    let displayAmount = Number(donationAmount);
    // donationmatch value exists it get added to displayamount
    if (!_isEmpty(donationMatch) && donationMatch.value > 0) {
        donationMatchedData = getDonationMatchedData(
            donationMatch.id,
            donationAmount,
            donationMatchData,
        );
        displayAmount += Number(donationMatchedData.amount);
    }
    const amount = formatCurrency(formatAmount(displayAmount), language, currency);
    let secondParagraph = formatMessage('addMoneySecondText', { amount });
    const thirdParagh = giftType && giftType.value === 0 ? formatMessage('addMoneyThirdText') : null;
    let taxProfileLink = '/user/tax-receipts';
    const taxButtonText = giftType && giftType.value === 0 ? formatMessage('addMoneyTaxButtonText') : null;
    let dashboardLink = '/dashboard';
    let dashBoardButtonText = formatMessage('goToYourDashboard');

    if (giveTo.type === 'companies') {
        secondParagraph = formatMessage('addMoneySecondTextCompany', {
            amount,
            companyName: giveTo.name,
        });
        taxProfileLink = `/companies/${giveTo.slug}/tax-receipts`;
        dashboardLink = `/companies/${giveTo.slug}`;
        dashBoardButtonText = formatMessage('goToCompanyDashboard', { companyName: giveTo.name });
    }
    return (
        <Fragment>
            <p className="text-center">
                {secondParagraph}
            </p>
            {
                !_isEmpty(thirdParagh)
                && (
                    <p className="text-center">
                        {thirdParagh}

                    </p>
                )
            }
            {
                !_isEmpty(taxButtonText)
                && (
                    <div className="text-center">
                        <Link route={taxProfileLink}>
                            <Button className="blue-bordr-btn-round-def flowConfirmBtn">
                                {taxButtonText}
                            </Button>
                        </Link>
                    </div>
                )
            }

            <div className="text-center mt-1">
                <Link route={dashboardLink}>
                    <Button className="blue-btn-rounded-def flowConfirmBtn">
                        {dashBoardButtonText}
                    </Button>
                </Link>
            </div>
        </Fragment>

    );
};

AddMoneySuccess.propTypes = {
    donationMatchData: PropTypes.arrayOf,
    i18n: PropTypes.shape({
        language: PropTypes.string,
    }),
    successData: PropTypes.shape({
        giveData: PropTypes.shape({
            donationAmount: PropTypes.string,
            donationMatch: PropTypes.shape({
                id: PropTypes.any,
                value: PropTypes.string,
            }),
            giftType: PropTypes.shape({
                value: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),
            }),
            giveTo: PropTypes.shape({
                name: PropTypes.string,
                slug: PropTypes.string,
                type: PropTypes.string,
            }),
        }),
        type: PropTypes.string,
    }),
    t: PropTypes.func,
};
AddMoneySuccess.defaultProps = {
    donationMatchData: [],
    i18n: {
        language: 'en',
    },
    successData: {
        giveData: {
            donationAmount: '',
            donationMatch: {
                id: null,
                value: null,
            },
            giftType: {
                value: null,
            },
            giveTo: {
                name: '',
                slug: '',
                type: '',
            },
        },
        type: null,
    },
    t: () => { },
};

const memoAddMoneySuccess = React.memo(AddMoneySuccess);
export default withTranslation([
    'success',
])(memoAddMoneySuccess);
