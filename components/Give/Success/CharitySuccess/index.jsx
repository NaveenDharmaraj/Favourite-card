
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
    getNextAllocationMonth,
} from '../../../../helpers/give/utils';
import { Link } from '../../../../routes';

const CharitySuccess = (props) => {
    const {
        successData,
        t: formatMessage,
    } = props;
    const {
        giveData: {
            giveTo,
            giftType,
        },
    } = successData;
    const {
        eftEnabled,
        name,
    } = giveTo;
    const month = getNextAllocationMonth(formatMessage, eftEnabled);
    const secondParagraph = formatMessage('charityTimeForSending', {
        charityName: name,
        month,
    });
    const thirdParagh = giftType && giftType.value > 0 ? formatMessage('charityRecurringThirdText') : null;
    const monthlyDepositButtonText = giftType && giftType.value > 0 ? formatMessage('charityMonthlyDepositButtonText') : null;
    const monthlyDepositLink = '/user/recurring-donations';
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
                !_isEmpty(monthlyDepositButtonText)
                && (
                    <div className="text-center">
                        <Link route={monthlyDepositLink}>
                            <Button className="blue-bordr-btn-round-def flowConfirmBtn">
                                {monthlyDepositButtonText}
                            </Button>
                        </Link>
                    </div>
                )
            }

            <div className="text-center mt-1">
                {/* route have been assumed for done here */}
                <Link route={'/dashboard'}>
                    <Button className="blue-btn-rounded-def flowConfirmBtn">
                        {doneButtonText}
                    </Button>
                </Link>
            </div>
        </Fragment>

    );
};

CharitySuccess.propTypes = {
    successData: PropTypes.shape({
        giveData: PropTypes.shape({
            giftType: PropTypes.shape({
                value: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),
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
    successData: {
        giveData: {
            giftType: {
                value: null,
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
export default withTranslation([
    'success',
])(memoCharitySuccess);
