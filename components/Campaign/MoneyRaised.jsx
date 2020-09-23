
import React from 'react';
import { Header, Button, Responsive } from 'semantic-ui-react';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';

import { Link } from '../../routes';
import { withTranslation } from '../../i18n';
import { formatCurrency } from '../../helpers/give/utils';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const MoneyRaised = (props) => {
    const {
        amountRaised,
        slug,
        isAuthenticated,
        t: formatMessage,
    } = props;
    const currency = 'USD';
    const language = 'en';
    const formattedAmount = formatCurrency(amountRaised, language, currency);
    const giveButton = <Button primary className="blue-btn-rounded-def">{formatMessage('campaignProfile:give')}</Button>;
    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header as="h4">{formatMessage('campaignProfile:totalMoneyRaised')}</Header>
                <Header as="h2">{formattedAmount}</Header>
                <Responsive minWidth={768}>
                    {!_isEmpty(isAuthenticated) && isAuthenticated ?
                        (
                            <Link route={(`/give/to/group/${slug}/new`)}>
                                {giveButton}
                            </Link>
                        )
                        :
                        (
                            <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/group/${slug}`)}>
                                {giveButton}
                            </a>
                        )
                    }
                </Responsive>
            </div>
        </div>
    );
}

export default withTranslation('campaignProfile')(MoneyRaised);
