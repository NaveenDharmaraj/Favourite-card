
import React, {
    Fragment,
} from 'react';
import {
    Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _concat from 'lodash/concat';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../../i18n';
import '../../../../static/less/giveFlows.less';
import { Link } from '../../../../routes';

const P2PSuccess = (props) => {
    const {
        successData,
        t: formatMessage,
    } = props;
    const {
        giveData,
    } = successData;
    let name;
    let secondParagraph;
    if (giveData) {
        const receipientsArr = _concat(giveData.selectedFriendsList.map((friend) => friend.displayName), giveData.recipients);
        name = receipientsArr.join();
        if (receipientsArr.length > 1) {
            const last = receipientsArr.pop();
            name = `${receipientsArr.join(', ')}, and ${last}`; // added extra coma for bugherd #290
        }
        secondParagraph = (giveData.giveFrom.type === 'user')
            ? formatMessage('fromToRecipient', { name })
            : formatMessage('fromOtherToRecipient', {
                fromName: giveData.giveFrom.name,
                name,
            });
    }
    const dashboardLink = (!_isEmpty(giveData.giveFrom) && giveData.giveFrom.type === 'companies')
        ? `/${giveData.giveFrom.type}/${giveData.giveFrom.slug}`
        : `/dashboard`;
    const doneButtonText = formatMessage('doneText');
    return (
        <Fragment>
            <p className="text-center">
                {secondParagraph}
            </p>

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

P2PSuccess.propTypes = {
    successData: PropTypes.shape({
        giveData: PropTypes.shape({
            giftType: PropTypes.shape({
                value: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),
            }),
            giveFrom: PropTypes.shape({
                name: PropTypes.string,
                slug: PropTypes.string,
                type: PropTypes.string,
            }),
            giveTo: PropTypes.shape({
                eftEnabled: PropTypes.bool,
                name: PropTypes.string,
            }),
            recipients: PropTypes.arrayOf(PropTypes.string),
            selectedFriendsList: PropTypes.arrayOf(
                PropTypes.shape({
                    displayName: PropTypes.string,
                }),
            ),
        }),
        type: PropTypes.string,
    }),
    t: PropTypes.func,
};
P2PSuccess.defaultProps = {
    successData: {
        giveData: {
            giftType: {
                value: null,
            },
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

const memoP2PSuccess = React.memo(P2PSuccess);
export default withTranslation([
    'success',
])(memoP2PSuccess);