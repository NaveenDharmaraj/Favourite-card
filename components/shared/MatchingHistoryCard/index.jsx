import React from 'react';
import {
    Grid,
    Image,
    Button,
} from 'semantic-ui-react';
import {
    string,
    func,
    PropTypes,
} from 'prop-types';

import {
    formatCurrency,
    formatDateForGivingTools,
} from '../../../helpers/give/utils';
import { withTranslation } from '../../../i18n';

const MatchingHistoryCard = (props) => {
    const {
        match,
        t: formatMessage,
    } = props;
    const {
        companyAvatar,
        endDate,
        startDate,
        totalMatched,
        companyName,
    } = match;
    const language = 'en';
    const currency = 'USD';
    return (
        <div className="MatchingMessages">
                    <div className="MatchingPartnerWapper margingWapper">
                        <div className="h_profileMatching borderprofile">
                            <Image src={companyAvatar} />
                        </div>
                    </div>
                    <div className="MessagestwapperText">
                        <p>
                            {formatMessage('groupProfile:totalMatchText', {
                                totalMatched: formatCurrency(totalMatched, language, currency),
                            })}
                            <span className="textColor"> &nbsp;
                                {` ${companyName}.`}
                            </span>
                        </p>
                    </div>
                    <div className="Messagestwapper">
                        <span className="white-btn-rounded-def Messagestabbtn">
                            {
                                `${formatDateForGivingTools(startDate)}
                            – ${formatDateForGivingTools(endDate)}`}
                        </span>
                    </div>
        </div>
    );
};

MatchingHistoryCard.defaultProps = {
    match: {
        companyAvatar: '',
        companyName: '',
        endDate: '',
        startDate: '',
        totalMatched: '',
    },
    t: () => {},
};

MatchingHistoryCard.propTypes = {
    match: PropTypes.shape({
        companyAvatar: string,
        companyName: string,
        endDate: string,
        startDate: string,
        totalMatched: string,
    }),
    t: func,
};

export default withTranslation('groupProfile')(MatchingHistoryCard);
