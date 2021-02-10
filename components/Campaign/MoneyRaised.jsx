
import React from 'react';
import {
    Header, Button, Responsive,
} from 'semantic-ui-react';
import getConfig from 'next/config';
import {
    PropTypes,
} from 'prop-types';
import { useDispatch } from 'react-redux';

import { Link } from '../../routes';
import { withTranslation } from '../../i18n';
import { formatCurrency } from '../../helpers/give/utils';
import { resetFlowObject } from '../../actions/give';

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
    const dispatch = useDispatch();
    const formattedAmount = formatCurrency(amountRaised, language, currency);
    const giveButton = <Button onClick={() => { resetFlowObject('group', dispatch); }} primary className="blue-btn-rounded-def">{formatMessage('campaignProfile:give')}</Button>;
    return (
        <div className="charityInfowrap fullwidth">
            <div className="charityInfo">
                <Header as="h4">{formatMessage('campaignProfile:totalMoneyRaised')}</Header>
                <Header as="h2">{formattedAmount}</Header>
                <Responsive minWidth={768}>
                    {isAuthenticated
                        ? (
                            <Link route={(`/give/to/group/${slug}/new`)}>
                                {giveButton}
                            </Link>
                        )
                        : (
                            <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/group/${slug}`)}>
                                {giveButton}
                            </a>
                        )
                    }
                </Responsive>
            </div>
        </div>
    );
};

MoneyRaised.defaultProps = {
    amountRaised: '',
    dispatch: () => { },
    isAuthenticated: false,
    slug: '',
    t: () => { },
};

// eslint-disable-next-line react/no-typos
MoneyRaised.PropTypes = {
    amountRaised: PropTypes.string,
    dispatch: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    slug: PropTypes.string,
    t: PropTypes.func,
};

export default withTranslation('campaignProfile')(MoneyRaised);
