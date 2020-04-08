
import React, {
    Fragment,
} from 'react';
import {
    Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

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
    const dashboardLink = (!_.isEmpty(giveFrom) && giveFrom.type === 'companies')
        ? `/${giveFrom.type}/${giveFrom.slug}`
        : `/dashboard`;
    const month = getNextAllocationMonth(formatMessage, eftEnabled);
    const isRecurring = !!(giftType && giftType.value === 0);
    const secondParagraph = giftType && giftType.value > 0 ? formatMessage('charityTimeForSendingRecurring', {
        amount: formatCurrency(formatAmount(giveAmount), language, currency),
        charityName: name,
        month,
    }) : formatMessage('charityTimeForSending', {
        charityName: name,
        month,
    });
    const doneButtonText = formatMessage('doneText');
    return (
        <Fragment>
            <p className="text-center">
                {secondParagraph}
                {(!!isRecurring) && (
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
                (!isRecurring)
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
                    <Button className="blue-btn-rounded-def flowConfirmBtn">
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
