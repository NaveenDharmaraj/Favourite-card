import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    number,
    string,
    func,
} from 'prop-types';
import {
    List,
    Header,
    Popup,
    Icon,
} from 'semantic-ui-react';

import { withTranslation } from '../../i18n';
import {
    formatCurrency,
    formatDateForGivingTools,
} from '../../helpers/give/utils';

const DonationDetails = (props) => {
    const {
        currency,
        language,
        groupDetails: {
            attributes: {
                createdAt,
                totalMoneyRaised,
                totalMoneyGiven,
                balance,
                fundraisingDaysRemaining,
                goalAmountRaised,
            },
        },
        t: formatMessage,
    } = props;
    const formattedCreated = formatDateForGivingTools(createdAt);
    return (
        <div className="tabWapper">
            <div className="groupcreated">
                <List verticalAlign="middle">
                    <List.Item>
                        <i aria-hidden="true" className="calendar icon" />
                        <List.Content>
                            <List.Header>
                                {`${formatMessage('groupProfile:groupCreated')} ${formattedCreated}.`}
                            </List.Header>
                        </List.Content>
                    </List.Item>
                </List>
            </div>
            {(fundraisingDaysRemaining !== 0)
            && (
                <div className="boxGroup">
                    <div className="Currentbox">
                        <Header as="h3">{formatCurrency(goalAmountRaised, language, currency)}</Header>
                        <p>{formatMessage('groupProfile:totalRaisedGoal')}</p>
                    </div>
                </div>
            )}
            <div className="duringCurrent">
                <div className="boxGroup">
                    <div className="Currentbox">
                        <Header as="h3">{formatCurrency(totalMoneyRaised, language, currency)}</Header>
                        <p>{formatMessage('groupProfile:totalMoneyRaised')}</p>
                    </div>
                    <div className="Currentboxpop">
                        <Popup
                            trigger={<Icon name="question circle" />}
                            content={formatMessage('groupProfile:totalMoneyPopup')}
                            position="top right"
                            inverted
                        />
                    </div>
                </div>
                <div className="icon-boxGroup"><p>-</p></div>
                <div className="boxGroup">
                    <div className="Currentbox">
                        <Header as="h3">{formatCurrency(totalMoneyGiven, language, currency)}</Header>
                        <p>{formatMessage('groupProfile:totalGiven')}</p>
                    </div>
                    <div className="Currentboxpop">
                        <Popup
                            trigger={<Icon name="question circle" />}
                            content={formatMessage('groupProfile:totalGivenPopup')}
                            position="top right"
                            inverted
                        />
                    </div>
                </div>
                <div className="icon-boxGroup"><p>=</p></div>
                <div className="boxGroup">
                    <div className="Currentbox">
                        <Header as="h3" className="green">{formatCurrency(balance, language, currency)}</Header>
                        <p>{formatMessage('groupProfile:totalBalance')}</p>
                    </div>
                    <div className="Currentboxpop">
                        <Popup
                            trigger={<Icon name="question circle" />}
                            content={formatMessage('groupProfile:totalBalancePopup')}
                            position="top right"
                            inverted
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

DonationDetails.defaultProps = {
    currency: 'USD',
    groupDetails: {
        attributes: {
            balance: null,
            createdAt: '',
            fundraisingDaysRemaining: null,
            goalAmountRaised: '',
            totalMoneyGiven: null,
            totalMoneyRaised: null,
        },
    },
    language: 'en',
    t: () => {},
};

DonationDetails.propTypes = {
    currency: string,
    groupDetails: {
        attributes: {
            balance: number,
            createdAt: string,
            fundraisingDaysRemaining: number,
            goalAmountRaised: string,
            totalMoneyGiven: number,
            totalMoneyRaised: number,
        },
    },
    language: string,
    t: func,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(DonationDetails));
export {
    connectedComponent as default,
    DonationDetails,
    mapStateToProps,
};
