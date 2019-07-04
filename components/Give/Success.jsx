import React, {
    Fragment,
    useEffect,
} from 'react';
import _ from 'lodash';
import {
    Button,
    Container,
    Grid,
    Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
    formatAmount,
    getNextAllocationMonth,
    percentage,
    setDateForRecurring,
} from '../../components/helpers/utils';
import { reInitNextStep } from '../../actions/give';
/**
* Format number to corresponding currency
* @param {number} amount amount
* @param {string} currency Type of allocation
* @param {string} style IS it a group from url
* @return {string} amount with currency style
*/
const formatNumber = (amount, {
    currency, style,
}) => new Intl.NumberFormat('en', {
    currency,
    style,
}).format(amount);


// #region P2p Helpers
const calculateP2pTotalGiveAmount = (successData) => _.sumBy(
    successData.recipientLists,
    (recipientList) => Number(recipientList.data.attributes.amount),
);

const calculateGiveAmount = (successData) => Number(
    successData.recipientLists[0].data.attributes.amount,
);

const calculateRecipients = (successData) => successData.recipientLists.length;

const getFirstEmailRecipient = (successData) => successData.recipientLists[0].data.attributes.email;

const separateByComma = (recipients) => _.replace(_.toString(recipients), /,/g, ', ');

// #endregion

const Success = (props) => {
    useEffect(() => {
        const {
            dispatch, flowObject,
        } = props;
        if (flowObject) {
            reInitNextStep(dispatch, flowObject);
        }
    }, []);
    const {
        successData,
    } = props;
    const {
        giveData: {
            creditCard,
            donationAmount,
            donationMatch,
            giveTo,
            coverFeesAmount,
            coverFees,
            giveAmount,
            giveFrom,
            giftType,
            recipients,
        },
        recipientLists,
        quaziSuccessStatus,
        type,
    } = successData;
    let linkToDashboardText = 'Go to your dashboard';
    let taxProfileLink = (giveFrom.type !== 'user')
        ? `/${giveFrom.type}/${giveFrom.slug}/tax-receipts` : '/user/tax-receipts';
    let dashboardLink = '/dashboard';
    const p2pLink = 'give/to/friend';
    const charityLink = 'give/to/charity';
    let firstParagraph = null; // Thank-you message
    let secondParagraph = null; // credit card message
    let thirdParagraph = null; // Recurring, When your gift will be sent?
    let fourthButton = null; // CTA
    let needLearnmore = false;
    let recurringDonationsLink = '/user/recurring-donations';
    let displayAmount = Number(donationAmount);
    // donationmatch value exists it get added to displayamount
    if (donationMatch !== '' && donationMatch.value !== 0) {
        displayAmount += Number(donationMatch.value);
    }
    const donationMatchData = [];
    const creditCardMessage = `${creditCard.name}'s ${_.capitalize(creditCard.processor)} ending with ${creditCard.truncatedPaymentId} was used to complete this transaction, which will appear on your credit card statement as "CHIMP FDN * DONATION".`;
    const recurringDay = (giftType.value === 1) ? `${giftType.value}st` : `${giftType.value}th`;
    const startsOn = setDateForRecurring(giftType.value);
    const recurringCreditCardMessage = `${creditCard.displayName}'s ${_.capitalize(creditCard.processor)} ending with ${creditCard.truncatedPaymentId} will be charged ${displayAmount} on the ${recurringDay} of each month, starting on ${startsOn}.`;
    let amount = null;
    let total = null;
    const fromName = giveFrom.name;
    const {
        eftEnabled,
    } = giveTo;
    const donationDetails = {
        amount: formatAmount(displayAmount),
        name: 'demo',
    };

    // Quazi status message
    if (quaziSuccessStatus) {
        firstParagraph = type !== 'donations' ? `Apologies,${donationDetails.name}. To send your gift,please wait for a confirmation email from us."`
            : `Thank you, ${donationDetails.name}. We're processing your transcation and will add ${formatAmount(donationDetails.amount)} to your Chimp Account shortly."`;
        secondParagraph = type !== 'donations' ? 'We\'ll send you an email within 24 hours confirming that the amount has been added.'
            : `It's taking us a little longer than expected to process the ${formatAmount(donationAmount)} top up that's needed to send your gift. We're still working on it and will send you an email within 24 hours confirming that the amount has been added to your CHIMP Account.`;

        const recipientList = (type !== 'donations' && type !== p2pLink) ? giveTo.name
            : separateByComma(recipients);
        thirdParagraph = `When you get the email from us, please come back to your CHIMP Account to send your gift to ${recipientList}.`;
    } else if (giftType.value === 0) {
        // This flow is based on giftType(recurring)..
        if (giveTo.type === 'companies') {
            taxProfileLink = `/companies/${giveTo.slug}/tax-receipts`;
            dashboardLink = `/companies/${giveTo.slug}`;
            linkToDashboardText = `go to the ${giveTo.name} Dashboard`;
            firstParagraph = `"Nicely done, ${donationDetails.name}. You add ${donationDetails.amount} to the ${giveTo.name} CHIMP Account."`;
        }
        if (giveTo.type === 'user') {
            firstParagraph = `Nicely done, ${donationDetails.name}. You added ${donationDetails.amount} to your CHIMP Account.`;
        }
        secondParagraph = creditCardMessage;
        fourthButton = (
            <Button
                // as={GeminiLink}
                color="blue"
                content="See your tax receipt"
                id="taxReceiptsLink"
                path={taxProfileLink}
            />
        );
        // the check is to differentiate donation and allocation dashboardlink
        dashboardLink = (giveFrom && giveFrom.type !== 'user')
            ? `/${giveFrom.type}/${giveFrom.slug}` : dashboardLink;
        // Allocation
        const month = getNextAllocationMonth(eftEnabled);

        if (coverFees) {
            // Based on cover fees first paragraph gets changed.
            firstParagraph = (giveFrom.type === 'user') ? `Thank you, ${donationDetails.name}. You gave ${formatAmount(giveAmount)} (plus ${coverFeesAmount} in covered third-party processing fees) to ${giveTo.text}.`
                : `Thank you, ${donationDetails.name}. You gave ${formatAmount(giveAmount)} (plus ${coverFeesAmount} in fees) from ${fromName}'s CHIMP Account to ${giveTo.text}.`;
        }
        // Should not enter the condition if type is donation
        else if (type !== p2pLink && type !== 'donations') {
            firstParagraph = (giveFrom.type === 'user') ? `Thank you, ${donationDetails.name}. You gave ${formatAmount(giveAmount)} to ${giveTo.text}.`
                : `Thank you, ${donationDetails.name}. You gave ${formatAmount(giveAmount)} from ${fromName}'s CHIMP Account to ${giveTo.text}.`;
        } else {
            // This condition is used to check  recipients array is present
            // eslint-disable-next-line no-lonely-if
            if (successData && recipientLists
                        && recipientLists.length > 0) {
                const p2pTotalGiveAmount = calculateP2pTotalGiveAmount(props.successData);
                const numberOfRecipient = calculateRecipients(props.successData);
                const p2pGiveAmount = calculateGiveAmount(props.successData);
                const recipientEmail = getFirstEmailRecipient(props.successData);

                if (numberOfRecipient > 1) {
                    amount = formatNumber(
                        p2pGiveAmount,
                        {
                            currency: 'USD',
                            style: 'currency',
                        },
                    );
                    total = formatNumber(p2pTotalGiveAmount, {
                        currency: 'USD',
                        style: 'currency',
                    });
                    firstParagraph = `Nice work, ${donationDetails.name}. You gave ${numberOfRecipient} gifts of ${amount} for a total of ${total} sent.`;
                } else {
                    amount = formatNumber(
                        p2pGiveAmount, {
                            currency: 'USD',
                            style: 'currency',
                        },
                    );
                    firstParagraph = `Nice work, ${donationDetails.name}. You gave ${amount} to ${recipientEmail}.`;
                }
            }
        }
        if (creditCard.value > 0) {
            secondParagraph = `${creditCard.text} was used to complete this transaction, which will appear on the credit card statement as "CHIMP FDN * DONATION".`;
        }
        if (donationMatch.value > 0) {
            const donationMatchedData = _.find(donationMatchData, (item) => {
                return item.attributes.employeeRoleId === donationMatch.id;
            });
            if (!_.isEmpty(donationMatchedData)) {
                const {
                    attributes: {
                        policyMax,
                        policyPercentage,
                        totalMatched,
                    },
                } = donationMatchedData;
                const donationMatchedAmount = percentage({
                    donationAmount,
                    policyMax,
                    policyPercentage,
                    totalMatched,
                });
                amount = formatNumber(
                    donationMatchedAmount, {
                        currency: 'USD',
                        style: 'currency',
                    },
                );
                const donationMessage = `In addition, ${amount} was matched by ${giveTo.name} and added to ${donationDetails.name}'s CHIMP Account.`;
                secondParagraph = `${secondParagraph} ${donationMessage}`;
            }
        }
        thirdParagraph = (giveFrom.type === charityLink)
            ? `Your gift will be sent to the recipient at the beginning of ${month}.` : null;
        if (!_.isEmpty(thirdParagraph)) {
            needLearnmore = true;
        }
    } else if (giftType.value > 0) {
        // Allocation
        if (type !== 'donations') {
            firstParagraph = (giveFrom.type === 'user')
                ? `Thank you, ${donationDetails.name}. You scheduled a monthly gift of ${formatAmount(giveAmount)} to go to ${giveTo.text}.`
                : `Thank you, ${donationDetails.name}. You scheduled a monthly gift of ${formatAmount(giveAmount)} by ${fromName} to ${giveTo.text}.`;
            secondParagraph = `This gift will be made from ${fromName}'s CHIMP Account on the ${recurringDay} of each month, starting on ${startsOn}.`;
            thirdParagraph = `If there isn't enough money in this CHIMP Account to cover the gift, we'll charge ${creditCard.text}. A new tax receipt will be issued and the charge will appear on the credit card statement as "CHIMP FDN * DONATION".`;
        } else if (giveTo.type === 'companies') {
            firstParagraph = `Nicely done, ${donationDetails.name}. You add ${donationDetails.amount} to the ${giveTo.name} CHIMP Account each month.`;
            thirdParagraph = `Each time, a tax receipt will be automatically posted to the ${giveTo.name} CHIMP Account and the transaction will appear on the credit card statement as "CHIMP FDN * DONATION".`;
            recurringDonationsLink = `/companies/${giveTo.slug}/recurring-donations`;
        } else if (giveTo.type === 'user') {
            firstParagraph = `Nicely done, ${donationDetails.name}. You scheduled ${donationDetails.amount} to be added to your CHIMP Account each month.`;
            thirdParagraph = `Each time, a tax receipt will automatically be posted to your CHIMP Account and the transaction will appear on your credit card statement as 'CHIMP FDN * DONATION'.`;
        }
        secondParagraph = recurringCreditCardMessage;
        fourthButton = (
            <Button
                // as={GeminiLink}
                color="blue"
                content="View your monthly transactions"
                path={recurringDonationsLink}
            />
        );
    }

    return (
        <Container className="v-donations">
            <Grid className="margin-btm-lg" columns={2}>
                <Grid.Column mobile={16} computer={16}>
                    <Grid className="grd-rt-lt-lg">
                        { (successData && !quaziSuccessStatus) && (
                            <Grid className="row">
                                <Grid.Row textAlign="center">
                                    <Grid.Column>
                                        <Icon
                                            name={quaziSuccessStatus ? 'clock outline' : 'checkmark'}
                                            color={quaziSuccessStatus ? '' : 'green'}
                                            size="huge"
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row textAlign="center">
                                    <Grid.Column>
                                        <p className="paragraph-first">
                                            { firstParagraph }
                                        </p>
                                    </Grid.Column>
                                </Grid.Row>
                                { !_.isEmpty(secondParagraph) && (
                                    <Grid.Row textAlign="center">
                                        <Grid.Column>
                                            <p className="paragraph-second">
                                                { secondParagraph }
                                            </p>
                                        </Grid.Column>
                                    </Grid.Row>
                                )}
                                { !_.isEmpty(thirdParagraph) && (
                                    <Grid.Row className={_.isEmpty(secondParagraph) ? 'row-margin-top' : ''} textAlign="center">
                                        <Grid.Column>
                                            <p className="paragraph-second">
                                                { thirdParagraph }
                                                {(!!needLearnmore) && (
                                                    <Fragment>
                                                  &nbsp;
                                                        <a
                                                            href="https://help.chimp.net/article/74-how-charities-receive-money"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                      Learn more
                                                        </a>
.
                                                    </Fragment>
                                                )}
                                            </p>
                                        </Grid.Column>
                                    </Grid.Row>
                                )}
                                <Grid.Row textAlign="center">
                                    <Grid.Column>
                                        { fourthButton }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        )
                        }
                        <Grid.Row textAlign="center" className="lnk-margin-btm">
                            <Grid.Column>
                                {(!!fourthButton && (
                                    <Fragment>
                                      or
                                        <div className="paragraph-third" path={dashboardLink}>
                                            {linkToDashboardText}
                                        </div>
                                    </Fragment>
                                ))}
                                {(!fourthButton
                                //   <GeminiLink className="paragraph-third" path={dashboardLink}>
                                //       { linkToDashboardText.charAt(0).toUpperCase() +
                                //  linkToDashboardText.slice(1) }
                                //   </GeminiLink>
                                && (
                                    <div className="paragraph-third" path={dashboardLink}>
                                        {
                                            linkToDashboardText.charAt(0).toUpperCase()
                                            + linkToDashboardText.slice(1)
                                        }
                                    </div>
                                )
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

Success.propTypes = {
    successData: PropTypes.shape({
        giveData: {
            giveFrom: {
                type: PropTypes.string,
            },
            giveTo: {
                type: PropTypes.string,
            },
        },
        quaziSuccessStatus: PropTypes.bool,
        recipientLists: PropTypes.arrayOf,
        type: PropTypes.string,
    }),
};
Success.defaultProps = {
    successData: {
        giveData: {
            creditCard: {
                value: null,
            },
            donationAmount: '',
            donationMatch: {
                value: null,
            },
            giftType: {
                value: null,
            },
            giveAmount: '',
            giveFrom: {
                value: '',
            },
            giveTo: {
                value: null,
            },
            newCreditCardId: null,
            noteToSelf: '',
            userInteracted: false,
        },
        quaziSuccessStatus: null,
        stepsCompleted: false,
        type: null,
    },
};

export default Success;
