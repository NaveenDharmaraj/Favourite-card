
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
    getNextAllocationMonth,
    formatCurrency,
    formatAmount,
} from '../../../../helpers/give/utils';
import { Link } from '../../../../routes';

const CharitySuccess = (props) => {
    const {
        i18n: {
            language,
        },
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
        },
    } = successData;
    const {
        eftEnabled,
        name,
    } = giveTo;
    const dashboardLink = (!_isEmpty(giveFrom) && giveFrom.type === 'companies')
        ? `/${giveFrom.type}/${giveFrom.slug}`
        : `/dashboard`;
    const month = getNextAllocationMonth(formatMessage, eftEnabled);
    const isNonRecurring = !!(giftType && giftType.value === 0);
    let secondParagraph;
    if (giftType && giftType.value > 0) {
        secondParagraph = (giveFrom.type === 'user')
            ? formatMessage('charityTimeForSendingRecurring', {
                amount: formatCurrency(formatAmount(giveAmount), language, currency),
                charityName: name,
                month,
            })
            : formatMessage('charityTimeForSendingRecurringFromOther', {
                amount: formatCurrency(formatAmount(giveAmount), language, currency),
                charityName: name,
                fromName: giveFrom.name,
                month,
            });
    } else {
        secondParagraph = (giveFrom.type === 'user')
            ? formatMessage('charityTimeForSending', {
                charityName: name,
                month,
            })
            : formatMessage('charityTimeForSendingFromOther', {
                charityName: name,
                fromName: giveFrom.name,
                month,
            });
    }
    const doneButtonText = formatMessage('doneText');
    return (
        <Fragment>
            <p className="text-center">
                {secondParagraph}
                {(!!isNonRecurring) && (
                    <Fragment>
                    &nbsp;
                        <a
                            href="https://help.chimp.net/article/74-how-charities-receive-money"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Learn more
                        </a>
                        .
                    </Fragment>
                )}
            </p>
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

CharitySuccess.propTypes = {
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
            }),
            giveTo: PropTypes.shape({
                eftEnabled: PropTypes.bool,
                name: PropTypes.string,
            }),
        }),
        type: PropTypes.string,
    }),
    t: PropTypes.func,
};
CharitySuccess.defaultProps = {
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
            },
            giveTo: {
                eftEnabled: false,
                name: '',
            },
        },
        type: null,
    },
    t: () => { },
};

const memoCharitySuccess = React.memo(CharitySuccess);
export { CharitySuccess };
export default withTranslation([
    'success',
])(memoCharitySuccess);
