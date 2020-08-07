import React from 'react';
import {
    Header,
    Progress,
    Button,
    Divider,
} from 'semantic-ui-react';

import {
    formatCurrency,
} from '../../helpers/give/utils';
import {
    distanceOfTimeInWords,
} from '../../helpers/utils';

const TotalRaised = (props) => {
    const {
        balance,
        lastDonationAt,
    } = props;
    const currency = 'USD';
    const language = 'en';
    const formattedBalance = formatCurrency(balance, language, currency);
    let lastDonationDay = '';
    if (lastDonationAt !== null) {
        lastDonationDay = distanceOfTimeInWords(lastDonationAt);
    }
    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header as="h4">Total raised</Header>
                <Header as="h1">{formattedBalance}</Header>
                {(balance && parseInt(balance, 10) > 0)
                && (
                    <div className="lastGiftWapper">
                        <p className="lastGiftText">
                            {`Last gift received ${lastDonationDay}`}
                        </p>
                    </div>
                )}
                <Divider />
                <Button className="blue-btn-rounded-def mt-1">Give</Button>
            </div>
        </div>
    );
};

export default TotalRaised;
