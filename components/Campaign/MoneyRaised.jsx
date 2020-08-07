
import React from 'react';
import { Header, Button, Link } from 'semantic-ui-react';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../i18n';
import { formatCurrency } from '../../helpers/give/utils';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const MoneyRaised = (props) => {
    const {
        moneyDetails: {
            type,
            attributes: {
                amountRaised,
                slug,
            }
        },
        t: formatMessage,
        isAuthenticated,
    } = props;
    const currency = 'USD';
    const language = 'en';
    let profileType = '';
    if (type === 'campaigns') {
        profileType = 'group';
    }
    const formattedAmount = formatCurrency(amountRaised, language, currency);
    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header as="h4">{formatMessage('campaignProfile:totalMoneyRaised')}</Header>
                <Header as="h2">{formattedAmount.slice(0, -3)}</Header>
                {!_isEmpty(isAuthenticated) && isAuthenticated ?
                    (
                        <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                            <Button primary className="blue-btn-rounded-def">{formatMessage('campaignProfile:give')}</Button>
                        </Link>
                    )
                    :
                    (
                        <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/${profileType}/${slug}`)}>
                            <Button primary className="blue-btn-rounded-def">{formatMessage('campaignProfile:give')}</Button>
                        </a>
                    )
                }
            </div>
        </div>
    );
}

export default withTranslation('campaignProfile')(MoneyRaised);
