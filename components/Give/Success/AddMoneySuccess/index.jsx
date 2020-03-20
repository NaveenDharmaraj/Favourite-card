
import React, {
    Fragment,
} from 'react';
import {
    Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../../i18n';
import '../../../../static/less/giveFlows.less';
import {
    getDonationMatchedData,
    formatCurrency,
    formatAmount,
    setDateForRecurring,
} from '../../../../helpers/give/utils';
import { Link } from '../../../../routes';

const AddMoneySuccess = (props) => {
    const {
        donationMatchData,
        i18n: {
            language,
        },
        successData,
        t: formatMessage,
    } = props;
    const {
        currency,
        giveData: {
            donationAmount,
            donationMatch,
            giveTo,
            giftType,
        },
    } = successData;
    let donationMatchedData = null;
    let displayAmount = Number(donationAmount);
    const amount = formatCurrency(formatAmount(displayAmount), language, currency);
    let secondParagraph = null;
    let thirdParagh = null;
    let taxButtonText = null;
    let taxProfileLink = '/user/tax-receipts';
    if(giftType && giftType.value === 0) {
        if (giveTo.type === 'companies') {
            secondParagraph = formatMessage('addMoneySecondTextCompany', {
                amount,
                companyName: giveTo.name,
            });
            taxButtonText = formatMessage('addMoneyCompanyTaxButtonText');
        } else {
            secondParagraph = formatMessage('addMoneySecondText', { amount });
            thirdParagh = formatMessage('addMoneyThirdText');
            taxButtonText = formatMessage('addMoneyTaxButtonText');
        }
    } else if (giftType && giftType.value !== 0){
        const startsOn = setDateForRecurring(giftType.value, formatMessage, language);
        secondParagraph = (giveTo.type === 'companies')
            ? formatMessage('addMoneyRecurringCompanySecondText', {
                amount,
                companyName: giveTo.name,
                startsOn,
            })
            : formatMessage('addMoneyRecurringSecondText', {
                amount,
                startsOn,
            });
    }

    if (!_isEmpty(donationMatch) && donationMatch.value > 0) {
        donationMatchedData = getDonationMatchedData(
            donationMatch.id,
            donationAmount,
            donationMatchData,
        );
        if(giftType && giftType.value === 0) {
            displayAmount += Number(donationMatchedData.amount);
            const matchedAmount = formatCurrency(formatAmount(donationMatchedData.amount), language, currency);
            const matchedText = (donationMatchedData.automaticMatching)
                ? formatMessage('addMoneyDonationMatchedAutoText', {
                    matchedAmount,
                    donationCompany: donationMatchedData.displayName,
                    totalAmount: formatCurrency(formatAmount(displayAmount), language, currency),
                })
                : formatMessage('addMoneyDonationMatchedManualText', {
                    matchedAmount,
                    donationCompany: donationMatchedData.displayName,
                });
            secondParagraph += matchedText;
        } else if (giftType && giftType.value !== 0){
            thirdParagh = formatMessage('addMoneyRecurringThirdText', {
                donationCompany: donationMatchedData.displayName,
            });
        }
    }
    let dashboardLink = '/dashboard';
    let dashBoardButtonText = formatMessage('goToYourDashboard');

    if (giveTo.type === 'companies') {
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
    currency: PropTypes.string,
    donationMatchData: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any,
        value: PropTypes.string,
    })),
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
    currency: 'USD',
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

export { AddMoneySuccess };
export default withTranslation([
    'success',
])(memoAddMoneySuccess);
