import React, {
    Fragment,
    useEffect,
} from 'react';
import {
    connect,
} from 'react-redux';
import _ from 'lodash';
import {
    Button,
    Container,
    Grid,
    Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { withTranslation } from '../../i18n';
import {
    formatCurrency,
    formatAmount,
    getNextAllocationMonth,
    percentage,
    setDateForRecurring,
    getDonationMatchedData,
} from '../../helpers/give/utils';
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
        donationMatchData,
        successData,
        t: formatMessage,
    } = props;
    //Since there is no succesdata from review page currently copying flowObject values to success data  temporarily
    Object.assign(successData, props.flowObject);

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
    const currency = 'USD';
    const {
        i18n: {
            language,
        },
    } = props;
    let linkToDashboardText = formatMessage('goToYourDashboard');// Go to your dashboard';
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
    let donationMatchedData = null;
    const recurringDay = (giftType.value === 1) ? `${giftType.value}st` : `${giftType.value}th`;
    const startsOn = setDateForRecurring(giftType.value, formatMessage);
    // donationmatch value exists it get added to displayamount
    if (!_.isEmpty(donationMatch) && donationMatch.value > 0) {
        donationMatchedData = getDonationMatchedData(donationMatch.id, donationAmount, donationMatchData);
        displayAmount += Number(donationMatchedData.amount);
    }

    //currently we are not receiving processor,truncatedPaymentId, name from credit card instead text give all three data which affects during translation
    const creditCardMessage = formatMessage('creditCardMessage', {
        cardType: _.capitalize(creditCard.processor),
        lastFourDigitCardNo: creditCard.truncatedPaymentId,
        name: creditCard.text,
    });
    // `${creditCard.name}'s ${_.capitalize(creditCard.processor)} ending with
    // ${creditCard.truncatedPaymentId} was used to complete this transaction, which will appear on
    // your credit card statement as "CHIMP FDN * DONATION".`;
    const recurringCreditCardMessage = formatMessage('recurringCreditCardMessage', {
        name: creditCard.text,
        cardType: _.capitalize(creditCard.processor),
        lastFourDigitCardNo: creditCard.truncatedPaymentId,
        amount: formatCurrency(formatAmount(donationAmount), language, currency),
        recurringDay: recurringDay,
        recurringDate: startsOn,
    });
    // `${creditCard.displayName}'s ${_.capitalize(creditCard.processor)} ending with ${creditCard.truncatedPaymentId} will be charged ${displayAmount} on the ${recurringDay} of each month, starting on ${startsOn}.`;

    let amount = null;
    let total = null;
    const fromName = giveFrom.name;
    const {
        eftEnabled,
    } = giveTo;
    const donationDetails = {
        amount: formatCurrency(formatAmount(displayAmount), language, currency),
        name: 'demo',
    };

    // Quazi status message
    if (quaziSuccessStatus) {
        firstParagraph = type !== 'donations' ? formatMessage('quaziDonationMessageForAllocations', { name: donationDetails.name }) // `Apologies,${donationDetails.name}. To send your gift,please wait for a confirmation email from us."`
            : formatMessage('quaziDonationSuccessMessage', {
                name: donationDetails.name,
                amount: formatCurrency(formatAmount(donationDetails.amount), language, currency),
            });
        // `Thank you, ${donationDetails.name}. We're processing your transcation and will add ${formatAmount(donationDetails.amount)} to your Chimp Account shortly."`;
        secondParagraph = type !== 'donations' ? formatMessage('quaziDonationSuccessMessageTwo') // 'We\'ll send you an email within 24 hours confirming that the amount has been added.'
            : formatMessage('quaziSuccessSecondMessageforAllocation', { amount: formatCurrency(formatAmount(donationAmount), language, currency) }); // `It's taking us a little longer than expected to process the ${formatAmount(donationAmount)} top up that's needed to send your gift. We're still working on it and will send you an email within 24 hours confirming that the amount has been added to your CHIMP Account.`;

        const recipientList = (type !== 'donations' && type !== p2pLink) ? giveTo.name
            : separateByComma(recipients);
        thirdParagraph = formatMessage('quaziSuccessThirdMessageforAllocation', { recipient: recipientList });// `When you get the email from us, please come back to your CHIMP Account to send your gift to ${recipientList}.`;
    } else if (giftType.value === 0) {
        // This flow is based on giftType(recurring)..
        if (giveTo.type === 'companies') {
            taxProfileLink = `/companies/${giveTo.slug}/tax-receipts`;
            dashboardLink = `/companies/${giveTo.slug}`;
            linkToDashboardText = formatMessage('goToCompanyDashboard', { companyName: giveTo.name });// `go to the ${giveTo.name} Dashboard`;
            firstParagraph = formatMessage('companyAddMoney', {
                name: donationDetails.name,
                amount: formatCurrency((donationDetails.amount), language, currency),
                companyName: giveTo.name,
            });// `"Nicely done, ${donationDetails.name}. You add ${donationDetails.amount} to the ${giveTo.name} CHIMP Account."`;
        }
        if (giveTo.type === 'user') {
            firstParagraph = formatMessage('addMoney', {
                name: donationDetails.name,
                amount: donationDetails.amount,
            });// `Nicely done, ${donationDetails.name}. You added ${donationDetails.amount} to your CHIMP Account.`;
        }
        if (type === 'donations' && !_.isEmpty(creditCard)) {
            secondParagraph = creditCardMessage;
        }
        fourthButton = (
            <Button
                // as={GeminiLink}
                color="blue"
                content={formatMessage('seeYourTaxReceipt')}
                id="taxReceiptsLink"
                path={taxProfileLink}
            />
        );
        // the check is to differentiate donation and allocation dashboardlink
        dashboardLink = (giveFrom && giveFrom.type !== 'user')
            ? `/${giveFrom.type}/${giveFrom.slug}` : dashboardLink;
        // Allocation
        const month = getNextAllocationMonth(formatMessage, eftEnabled);

        if (coverFees) {
            // Based on cover fees first paragraph gets changed.
            firstParagraph = (giveFrom.type === 'user') ? formatMessage('userSingleCoverFeesAllocation', {
                name: donationDetails.name,
                amount: formatCurrency((formatAmount(giveAmount), language, currency)),
                coverFeesAmount,
                to: giveTo.text,
            }) // `Thank you, ${donationDetails.name}. You gave ${formatAmount(giveAmount)} (plus ${coverFeesAmount} in covered third-party processing fees) to ${giveTo.text}.`
                : formatMessage('nonUserSingleCoverFeesAllocation', {
                    name: donationDetails.name,
                    amount: formatCurrency(formatAmount(giveAmount), language, currency),
                    coverFeesAmount,
                    fromName,
                    to: giveTo.text,
                });// `Thank you, ${donationDetails.name}. You gave ${formatAmount(giveAmount)} (plus ${coverFeesAmount} in fees) from ${fromName}'s CHIMP Account to ${giveTo.text}.`;
        }
        // Should not enter the condition if type is donation
        else if (type !== p2pLink && type !== 'donations') {
            firstParagraph = (giveFrom.type === 'user') ? formatMessage('userSingleAllocation', {
                name: donationDetails.name,
                amount: formatCurrency(formatAmount(giveAmount), language, currency),
                to: giveTo.text
            }) : formatMessage('nonUserSingleAllocation', {
                name: donationDetails.name,
                amount: formatCurrency(formatAmount(giveAmount), language, currency),
                fromName,
                to: giveTo.text
            });
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
                    amount = formatCurrency(
                        p2pGiveAmount,
                        language, 
                        currency
                    );
                    total = formatCurrency(p2pTotalGiveAmount,language, currency);
                    firstParagraph = formatMessage('fromToMultipleRecipient', {
                        name: donationDetails.name,
                        number: numberOfRecipient,
                        amount: amount,
                        total: total,
                    }); // `Nice work, ${donationDetails.name}. You gave ${numberOfRecipient} gifts of ${amount} for a total of ${total} sent.`;
                } else {
                    amount = formatCurrency(p2pGiveAmount,language, currency);
                    firstParagraph = formatMessage('fromToSingleRecipient', {
                        name: donationDetails.name,
                        amount: amount,
                        emailAddress: recipientEmail,
                    }); // `Nice work, ${donationDetails.name}. You gave ${amount} to ${recipientEmail}.`;
                }
            }
        }
        if (creditCard.value > 0) {
            secondParagraph = formatMessage('nonrecurringCCAllocationDetails', {
                creditCard: creditCard.text,
            }); // `${creditCard.text} was used to complete this transaction, which will appear on the credit card statement as "CHIMP FDN * DONATION".`;
        }
        if (donationMatch.value > 0 && !_.isEmpty(donationMatchedData)) {
            const donationMessage = formatMessage('nonrecurringDonationDetails', {
                amount: donationMatchedData.amount,
                matchingParty: giveTo.name,
                to: donationDetails.name,
            }); // `In addition, ${amount} was matched by ${giveTo.name} and added to ${donationDetails.name}'s CHIMP Account.`;
            secondParagraph = `${secondParagraph} ${donationMessage}`;
        }
        thirdParagraph = (type === charityLink)
            ? formatMessage('timeForSendingCharity', { month: month, }) : null;// `Your gift will be sent to the recipient at the beginning of ${month}.` : null;
        if (!_.isEmpty(thirdParagraph)) {
            needLearnmore = true;
        }
    } else if (giftType.value > 0) {
        // Allocation
        if (type !== 'donations') {
            firstParagraph = (giveFrom.type === 'user')
                ? formatMessage('userRecurringAllocation', {
                    name: donationDetails.name,
                    amount: formatCurrency(formatAmount(giveAmount), language, currency),
                    to: giveTo.text,
                }) // `Thank you, ${donationDetails.name}. You scheduled a monthly gift of ${formatAmount(giveAmount)} to go to ${giveTo.text}.`
                : formatMessage('nonUserRecurringAllocation', {
                    name: donationDetails.name,
                    amount: formatCurrency(formatAmount(giveAmount), language, currency),
                    fromName: fromName,
                    to: giveTo.text,
                }); // `Thank you, ${donationDetails.name}. You scheduled a monthly gift of ${formatAmount(giveAmount)} by ${fromName} to ${giveTo.text}.`;
            secondParagraph = formatMessage('recurringAllocationDetails', {
                fromName: fromName,
                dayOfMonth: recurringDay,
                startsOn: startsOn,
            });// `This gift will be made from ${fromName}'s CHIMP Account on the ${recurringDay} of each month, starting on ${startsOn}.`;
            thirdParagraph = formatMessage('recurringAllocationNotes', {
                creditCard: creditCard.text,
            });// `If there isn't enough money in this CHIMP Account to cover the gift, we'll charge ${creditCard.text}. A new tax receipt will be issued and the charge will appear on the credit card statement as "CHIMP FDN * DONATION".`;
        } else if (giveTo.type === 'companies') {
            firstParagraph = formatMessage('companyRecurringDonation', {
                name: donationDetails.name,
                amount: donationDetails.amount,
                companyName: giveTo.name,
            });// `Nicely done, ${donationDetails.name}. You add ${donationDetails.amount} to the ${giveTo.name} CHIMP Account each month.`;
            thirdParagraph = formatMessage('companyRecurringTaxReceiptMessage', { companyName: giveTo.name});// `Each time, a tax receipt will be automatically posted to the ${giveTo.name} CHIMP Account and the transaction will appear on the credit card statement as "CHIMP FDN * DONATION".`;
            recurringDonationsLink = `/companies/${giveTo.slug}/recurring-donations`;
        } else if (giveTo.type === 'user') {
            firstParagraph = formatMessage('recurringDonation', {
                name: donationDetails.name,
                amount: donationDetails.amount,
            }); // `Nicely done, ${donationDetails.name}. You scheduled ${donationDetails.amount} to be added to your CHIMP Account each month.`;
            thirdParagraph = formatMessage('recurringTaxReceiptMessage');// `Each time, a tax receipt will automatically be posted to your CHIMP Account and the transaction will appear on your credit card statement as 'CHIMP FDN * DONATION'.`;
        }
        if (type === 'donations' && !_.isEmpty(creditCard)) {
            secondParagraph = recurringCreditCardMessage;
        }
        fourthButton = (
            <Button
                // as={GeminiLink}
                color="blue"
                content={formatMessage('recurringTransactions')}
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
    donationMatchData: PropTypes.arrayOf,
    successData: PropTypes.shape({
        giveData: PropTypes.shape({
            giveFrom: PropTypes.shape({
                type: PropTypes.string,
            }),
            giveTo: PropTypes.shape({
                type: PropTypes.string,
            }),
        }),
        quaziSuccessStatus: PropTypes.bool,
        recipientLists: PropTypes.arrayOf,
        type: PropTypes.string,
    }),
    t: PropTypes.func,
};
Success.defaultProps = {
    donationMatchData: [],
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
                type: null,
                value: null,
            },
            newCreditCardId: null,
            noteToSelf: '',
            userInteracted: false,
        },
        quaziSuccessStatus: false,
        stepsCompleted: false,
        type: null,
    },
    t: _.noop,
};

const mapStateToProps = (state) => ({
    donationMatchData: state.user.donationMatchData,
    successData: state.give.successData,
});
export default withTranslation(['success'])(connect(mapStateToProps)(Success));
