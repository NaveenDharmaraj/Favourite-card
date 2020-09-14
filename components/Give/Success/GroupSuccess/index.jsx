
import React, {
    Fragment,
} from 'react';
import {
    Button,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import { withTranslation } from '../../../../i18n';
import '../../../../static/less/giveFlows.less';
import {
    formatCurrency,
    formatAmount,
    setDateForRecurring,
} from '../../../../helpers/give/utils';
import { Link } from '../../../../routes';

const GroupSuccess = (props) => {
    const {
        i18n: {
            language,
        },
        giveGroupDetails,
        groupMatchingDetails,
        successData,
        t: formatMessage,
    } = props;
    const {
        currency,
        giveData: {
            giveFrom,
            giveTo,
            giftType,
            giveAmount,
            matchingPolicyDetails,
        },
    } = successData;
    const {
        eftEnabled,
        name,
    } = giveTo;
    let secondParagraph = null;
    let thirdParagh = null;
    const isNonRecurring = !!(giftType && giftType.value === 0);
    if (!_isEmpty(groupMatchingDetails) && (!_isEmpty(matchingPolicyDetails) && matchingPolicyDetails.isValidMatchPolicy)) {
        const {
            attributes: {
                activeMatch,
            },
        } = giveGroupDetails;
        const activeMatchAmount = Number(groupMatchingDetails.attributes.matchAvailable);
        if (activeMatchAmount > 0 && groupMatchingDetails.giveFromFund === giveFrom.value) {
            const {
                company,
            } = activeMatch;
            const totalAmount = Number(giveAmount) + activeMatchAmount;
            thirdParagh = (isNonRecurring)
                ? formatMessage('groupMatchByText', {
                    groupName: name,
                    matchedAmount: formatCurrency(activeMatchAmount, language, currency),
                    matchedCompany: company,
                    totalAmount: formatCurrency(formatAmount(totalAmount), language, currency),
                })
                : formatMessage('groupMatchByRecurringText');
        }
    }
    const dashboardLink = (!_isEmpty(giveFrom) && giveFrom.type === 'companies')
        ? `/${giveFrom.type}/${giveFrom.slug}`
        : `/dashboard`;
    const startsOn = setDateForRecurring(giftType.value, formatMessage, language);
    if (giftType && giftType.value > 0) {
        secondParagraph = (giveFrom.type === 'user')
            ? formatMessage('groupTimeForSendingRecurring', {
                amount: formatCurrency(formatAmount(giveAmount), language, currency),
                groupName: name,
                startsOn,
            })
            : formatMessage('groupTimeForSendingRecurringFromOther', {
                amount: formatCurrency(formatAmount(giveAmount), language, currency),
                fromName: giveFrom.name,
                groupName: name,
                startsOn,
            });
    } else {
        secondParagraph = (giveFrom.type === 'user')
            ? formatMessage('groupTimeForSending', {
                groupName: name,
            })
            : formatMessage('groupTimeForSendingFromOther', {
                fromName: giveFrom.name,
                groupName: name,
            });

    }
    const doneButtonText = formatMessage('doneText');
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
                (!isNonRecurring)
                && (
                    <p className="text-center">
                        If you like, you can also
                        {' '}
                        <Link route={`/user/recurring-donations`}>set up a monthly deposit</Link>
                        {' '}
                        into your account to cover this monthly gift.
                    </p>
                )
            }

            <div className="text-center mt-1">
                {/* route have been assumed for done here */}
                <Link route={dashboardLink}>
                    <Button className="blue-btn-rounded-def flowConfirmBtn second_btn">
                        {doneButtonText}
                    </Button>
                </Link>
            </div>
        </Fragment>

    );
};

GroupSuccess.propTypes = {
    giveGroupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            activeMatch: PropTypes.shape({
                balance: PropTypes.string,
                company: PropTypes.string,
                maxMatchAmount: PropTypes.string,
            }),
            hasActiveMatch: PropTypes.bool,
        }),
    }),
    groupMatchingDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            matchAvailable: PropTypes.string,
        }),
        giveFromFund: PropTypes.string,
    }),
    i18n: PropTypes.shape({
        language: PropTypes.string,
    }),
    successData: PropTypes.shape({
        currency: PropTypes.string,
        giveData: PropTypes.shape({
            currency: PropTypes.string,
            giftType: PropTypes.shape({
                value: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),
            }),
            giveAmount: PropTypes.string,
            giveFrom: PropTypes.shape({
                name: PropTypes.string,
                slug: PropTypes.string,
                type: PropTypes.string,
                value: PropTypes.string,
            }),
            giveTo: PropTypes.shape({
                eftEnabled: PropTypes.bool,
                name: PropTypes.string,
            }),
            matchingPolicyDetails: PropTypes.shape({
                isValidMatchPolicy: PropTypes.bool,
            }),
        }),
        type: PropTypes.string,
    }),
    t: PropTypes.func,
};
GroupSuccess.defaultProps = {
    giveGroupDetails: {
        attributes: {
            activeMatch: {
                balance: '',
                company: '',
                maxMatchAmount: '',
            },
            hasActiveMatch: false,
        },
    },
    groupMatchingDetails: {
        attributes: {
            matchAvailable: '0.0',
        },
        giveFromFund: '',
    },
    i18n: {
        language: 'en',
    },
    successData: {
        currency: 'USD',
        giveData: {
            giftType: {
                value: null,
            },
            giveAmount: '',
            giveFrom: {
                name: '',
                slug: '',
                type: '',
                value: '',
            },
            giveTo: {
                eftEnabled: false,
                name: '',
            },
            matchingPolicyDetails: {
                isValidMatchPolicy: false,
            },
        },
        type: null,
    },
    t: () => { },
};

const memoGroupSuccess = React.memo(GroupSuccess);
export { GroupSuccess };
export default withTranslation([
    'success',
])(memoGroupSuccess);
