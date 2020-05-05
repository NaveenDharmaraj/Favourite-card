import {
    arrayOf,
    func,
    number,
    oneOf,
    oneOfType,
    shape,
    string,
} from 'prop-types';
import _ from 'lodash';
import React, {
    Fragment,
} from 'react';
import {
    List,
    Icon,
    Image,
} from 'semantic-ui-react';

const i18n = {
    applePay: 'giveAccounts_applePay',
    beneficiary: 'giveAccounts_beneficiary',
    card: 'giveAccounts_creditCard',
    community: 'giveAccounts_community',
    company: 'giveAccounts_company',
    crypto: 'giveAccounts_crypto',
    donationMatch: 'giveAccounts_donationMatch',
    email: 'giveAccounts_email',
    googlePay: 'giveAccounts_googlePay',
    group: 'giveAccounts_group',
    paypal: 'giveAccounts_paypal',
    recipientUser: 'giveAccounts_recipientUser',
    user: 'giveAccounts_user',
    withoutAmountAccount: 'giveAccounts_withoutAmountAccount',
    withoutAmountCard: 'giveAccounts_withoutAmountCard',
};

const cardProcessors = {
    amex: 'amex',
    discover: 'discover',
    mastercard: 'cc mastercard',
    stripe: 'stripe',
    visa: 'cc visa',
};

const accountTypes = [
    'beneficiary',
    'community',
    'company',
    'donationMatch',
    'email',
    'group',
    'user',
];

/**
 * Display an icon representing the provided payment type.
 * @param  {string} [props.avatar] url for the avatar.
 * @param  {string} [props.processor] If the payment type is a credit card, the processing agent.
 * @param  {string} props.type        The payment type.
 * @return {JSX}
 */

const PaymentIcon = ({
    avatar,
    processor,
    type,
}) => {
    if (avatar) {
        return (
            <Image
                className="review_avatar"
                src={avatar}
            />
        );
    }

    if (_.includes(accountTypes, type)) {
        const iconData = {
            color: '',
            icon: '',
        };
        switch (type) {
            case 'beneficiary':
                iconData.color = 'blue';
                iconData.icon = 'heart';
                break;
            case 'community':
                iconData.color = 'teal';
                iconData.icon = 'group';
                break;
            case 'company':
                iconData.color = 'teal';
                iconData.icon = 'briefcase';
                break;
            case 'donationMatch':
                iconData.color = 'teal';
                iconData.icon = 'briefcase';
                break;
            case 'email':
                iconData.color = 'grey';
                iconData.icon = 'envelope';
                break;
            case 'group':
                iconData.color = 'blue';
                iconData.icon = 'group';
                break;
            case 'user':
                iconData.color = 'orange';
                iconData.icon = 'user';
                break;
            default:
                break;
        }

        return (
            <Icon
                color={iconData.color}
                name={iconData.icon}
            />
        );
    }

    let name = '';

    switch (type) {
        case 'applePay':
            name = 'apple pay';
            break;
        case 'card':
            name = (processor in cardProcessors)
                ? cardProcessors[processor]
                : 'credit card alternative';
            break;
        case 'crypto':
            name = 'btc';
            break;
        case 'email':
            name = 'mail square';
            break;
        case 'googlePay':
            name = 'google wallet';
            break;
        case 'paypal':
            name = 'paypal';
            break;
        default:
            break;
    }
    return (
        <Icon name={name} />
    );
};
/* eslint-disable react/require-default-props */
// these are all optional, so defining `undefined` in defaultProps is stupid
PaymentIcon.propTypes = {
    avatar: string,
    processor: oneOf(cardProcessors),
    type: string.isRequired,
};

const i18nMessage = (account, formatMessage) => {
    let i18nKey = account.type;
    if (!account.amount || account.amount === null) {
        i18nKey = (account.type === 'card') ? 'withoutAmountCard' : 'withoutAmountAccount';
    }
    return formatMessage(
        i18n[i18nKey],
        {
            ...account,
            processor: _.capitalize(account.processor),
        },
    );
};

const GiveAccounts = ({
    accounts,
    formatMessage,
}) => {
    if (accounts.length === 1) {
        const [
            account,
        ] = accounts;

        return (
            <Fragment>
                <List className="review-list single" celled>
                    <List.Item>
                        <List.Content className="list-img">
                            <PaymentIcon
                                {...account}
                            />
                        </List.Content>
                        <List.Content>
                            {i18nMessage(account, formatMessage)}
                        </List.Content>
                    </List.Item>
                </List>
            </Fragment>
        );
    }
    return (
        <Fragment>
            <div className="review-list-wraper">
                <List className="review-list" celled>
                    {_.map(accounts, (account, i) => (
                        <List.Item key={i}>
                            <List.Content className="list-img">
                                {/* <Icon name="credit card outline" /> */}
                                <PaymentIcon
                                    {...account}
                                />
                            </List.Content>
                            <List.Content>
                                {i18nMessage(account, formatMessage)}
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            </div>
        </Fragment>
    );
};
GiveAccounts.propTypes = {
    accounts: arrayOf(shape({
        amount: oneOfType([
            number,
            string,
        ]),
        avatar: string,
        displayName: string.isRequired,
        processor: string,
        type: string.isRequired,
    })).isRequired,
    formatMessage: func.isRequired,
};

export default GiveAccounts;
