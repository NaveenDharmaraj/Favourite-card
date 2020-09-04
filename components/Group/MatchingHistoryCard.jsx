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
} from '../../helpers/give/utils';
import { withTranslation } from '../../i18n';

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
            <Grid.Row>
                <Grid>
                    <Grid.Column mobile={16} tablet={2} computer={2} className="MatchingPartnerWapper margingWapper">
                        <div className="h_profileMatching borderprofile">
                            <Image src={companyAvatar} />
                        </div>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                        <p>
                            {formatMessage('groupProfile:totalMatchText', {
                                totalMatched: formatCurrency(totalMatched, language, currency),
                            })}
                            <span className="textColor">
                                {` ${companyName}.`}
                            </span>
                        </p>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={6} computer={6} className="Messagestwapper">
                        <Button className="white-btn-rounded-def Messagestabbtn mt-1">
                            {
                                `${formatDateForGivingTools(startDate)}
                            – ${formatDateForGivingTools(endDate)}`}
                        </Button>
                    </Grid.Column>
                </Grid>
            </Grid.Row>
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
