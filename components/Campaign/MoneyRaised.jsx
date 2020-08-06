
import React from 'react';
import { Header } from 'semantic-ui-react';

import { formatCurrency } from '../../helpers/give/utils';
import ProfilePageHead from '../../components/shared/ProfilePageHead';

const MoneyRaised = (props) => {
    const {
        moneyDetails,
        moneyDetails: {
            attributes: {
                amountRaised,
            }
        }
    } = props;
    const currency = 'USD';
    const language = 'en';
    const formattedAmount = formatCurrency(amountRaised, language, currency);
    return (
        <div className='charityInfowrap fullwidth'>
            <div className='charityInfo'>
                <Header as='h4'>Total money raised</Header>
                <Header as='h2'>{formattedAmount.slice(0, -3)}</Header>
                <ProfilePageHead
                    pageDetails={moneyDetails}
                    blockButtonType="give"
                />
            </div>
        </div>
    );
}

export default MoneyRaised;
