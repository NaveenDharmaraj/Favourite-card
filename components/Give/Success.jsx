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
    populateCardData,
    setDateForRecurring,
    getDonationMatchedData,
    calculateP2pTotalGiveAmount,
} from '../../helpers/give/utils';
import { reInitNextStep } from '../../actions/give';

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
        currentUser: {
            attributes: {
                displayName,
            },
        },
        donationMatchData,
        successData,
        t: formatMessage,
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
        quaziSuccessStatus,
        type,
    } = successData;
    const currency = 'USD';
    const {
        i18n: {
            language,
        },
    } = props;
    let linkToDashboardText = formatMessage('goToYourDashboard');
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
    let creditcardData = null;
    let ccText = null;
    let creditCardMessage = null;
    let recurringCreditCardMessage = null;
    if (!_.isEmpty(creditCard && creditCard.text)) {
        creditcardData = populateCardData(creditCard.text, null);
        ccText = formatMessage('withoutAmountCard', {
            displayName: creditcardData.displayName,
            processor: _.capitalize(creditcardData.processor),
            truncatedPaymentId: creditcardData.truncatedPaymentId,
        });
        creditCardMessage = formatMessage('creditCardMessage', {
            cardType: _.capitalize(creditcardData.processor),
            lastFourDigitCardNo: creditcardData.truncatedPaymentId,
            name: creditcardData.displayName,
        });
        recurringCreditCardMessage = formatMessage('recurringCreditCardMessage', {
            amount: formatCurrency(formatAmount(donationAmount), language, currency),
            cardType: _.capitalize(creditcardData.processor),
            lastFourDigitCardNo: creditcardData.truncatedPaymentId,
            name: creditcardData.displayName,
            recurringDate: startsOn,
            recurringDay,
        });
    }
    // donationmatch value exists it get added to displayamount
    if (!_.isEmpty(donationMatch) && donationMatch.value > 0) {
        donationMatchedData = getDonationMatchedData(
            donationMatch.id,
            donationAmount,
            donationMatchData,
        );
        displayAmount += Number(donationMatchedData.amount);
    }

    let amount = null;
    let total = null;
    const fromName = giveFrom.name;
    const {
        eftEnabled,
    } = giveTo;
    const donationDetails = {
        amount: formatCurrency(formatAmount(displayAmount), language, currency),
        name: displayName,
    };

    // Quazi status message
    if (quaziSuccessStatus) {
        firstParagraph = type !== 'donations' ? formatMessage('quaziDonationMessageForAllocations', { name: donationDetails.name })
            : formatMessage('quaziDonationSuccessMessage', {
                amount: formatCurrency(formatAmount(donationDetails.amount), language, currency),
                name: donationDetails.name,
            });
        secondParagraph = type !== 'donations' ? formatMessage('quaziDonationSuccessMessageTwo')
            : formatMessage('quaziSuccessSecondMessageforAllocation', { amount: formatCurrency(formatAmount(donationAmount), language, currency) });

        const recipientList = (type !== 'donations' && type !== p2pLink) ? giveTo.name
            : separateByComma(recipients);
        thirdParagraph = formatMessage('quaziSuccessThirdMessageforAllocation', { recipient: recipientList });
    } else if (giftType.value === 0) {
        // This flow is based on giftType(recurring)..
        if (giveTo.type === 'companies') {
            taxProfileLink = `/companies/${giveTo.slug}/tax-receipts`;
            dashboardLink = `/companies/${giveTo.slug}`;
            linkToDashboardText = formatMessage('goToCompanyDashboard', { companyName: giveTo.name });
            firstParagraph = formatMessage('companyAddMoney', {
                amount: formatCurrency((donationDetails.amount), language, currency),
                companyName: giveTo.name,
                name: donationDetails.name,
            });
        }
        if (giveTo.type === 'user') {
            firstParagraph = formatMessage('addMoney', {
                amount: donationDetails.amount,
                name: donationDetails.name,
            });
        }
        if (type === 'donations') {
            secondParagraph = creditCardMessage;
            fourthButton = (
                <Button
                    // as={GeminiLink}
                    color="blue"
                    content={formatMessage('seeYourTaxReceipt')}
                    id="taxReceiptsLink"
                    path={taxProfileLink}
                />
            );
        } else if (!_.isEmpty(creditCard) && creditCard.value > 0) {
            taxProfileLink = (giveFrom.type !== 'user')
                ? `/${giveFrom.type}/${giveFrom.slug}/tax-receipts` : taxProfileLink;
            fourthButton = (
                <Button
                    as={GeminiLink}
                    color="blue"
                    content={formatMessage({ id: 'giving.donations.success.seeYourTaxReceipt' })}
                    id="taxReceiptsLink"
                    path={taxProfileLink}
                />
            );
        }
        // the check is to differentiate donation and allocation dashboardlink
        dashboardLink = (giveFrom && giveFrom.type !== 'user')
            ? `/${giveFrom.type}/${giveFrom.slug}` : dashboardLink;
        // Allocation
        const month = getNextAllocationMonth(formatMessage, eftEnabled);

        if (coverFees) {
            // Based on cover fees first paragraph gets changed.
            firstParagraph = (giveFrom.type === 'user') ? formatMessage('userSingleCoverFeesAllocation', {
                amount: formatCurrency(formatAmount(giveAmount), language, currency),
                coverFeesAmount,
                name: donationDetails.name,
                to: giveTo.text,
            })
                : formatMessage('nonUserSingleCoverFeesAllocation', {
                    amount: formatCurrency(formatAmount(giveAmount), language, currency),
                    coverFeesAmount,
                    fromName,
                    name: donationDetails.name,
                    to: giveTo.text,
                });
        } else if (type !== p2pLink && type !== 'donations') { // Should not enter the condition if type is donation
            firstParagraph = (giveFrom.type === 'user') ? formatMessage('userSingleAllocation', {
                amount: formatCurrency(formatAmount(giveAmount), language, currency),
                name: donationDetails.name,
                to: giveTo.text,
            }) : formatMessage('nonUserSingleAllocation', {
                amount: formatCurrency(formatAmount(giveAmount), language, currency),
                fromName,
                name: donationDetails.name,
                to: giveTo.text,
            });
        } else {
            // This condition is used to check  recipients array is present
            // eslint-disable-next-line no-lonely-if
            if (successData && recipients && recipients.length > 0) {
                const p2pTotalGiveAmount = calculateP2pTotalGiveAmount(recipients.length, successData.giveData.giveAmount);
                const numberOfRecipient = recipients.length;
                const p2pGiveAmount = successData.giveData.giveAmount;
                const recipientEmail = successData.giveData.recipients[0];

                if (numberOfRecipient > 1) {
                    amount = formatCurrency(
                        p2pGiveAmount,
                        language,
                        currency,
                    );
                    total = formatCurrency(p2pTotalGiveAmount, language, currency);
                    firstParagraph = formatMessage('fromToMultipleRecipient', {
                        amount,
                        name: donationDetails.name,
                        number: numberOfRecipient,
                        total,
                    });
                } else {
                    amount = formatCurrency(p2pGiveAmount, language, currency);
                    firstParagraph = formatMessage('fromToSingleRecipient', {
                        amount,
                        emailAddress: recipientEmail,
                        name: donationDetails.name,
                    });
                }
            }
        }
        if (creditCard.value > 0 && type !== 'doantions') {
            secondParagraph = formatMessage('nonrecurringCCAllocationDetails',
                {
                    creditCard: ccText,
                });
        }
        if (donationMatch.value > 0 && !_.isEmpty(donationMatchedData)) {
            const donationMessage = formatMessage('nonrecurringDonationDetails', {
                amount: donationMatchedData.amount,
                matchingParty: giveTo.name,
                to: donationDetails.name,
            });
            secondParagraph = `${secondParagraph} ${donationMessage}`;
        }
        thirdParagraph = (type === charityLink)
            ? formatMessage('timeForSendingCharity', { month }) : null;
        if (!_.isEmpty(thirdParagraph)) {
            needLearnmore = true;
        }
    } else if (giftType.value > 0) {
        // Allocation
        if (type !== 'donations') {
            firstParagraph = (giveFrom.type === 'user')
                ? formatMessage('userRecurringAllocation', {
                    amount: formatCurrency(formatAmount(giveAmount), language, currency),
                    name: donationDetails.name,
                    to: giveTo.text,
                })
                : formatMessage('nonUserRecurringAllocation', {
                    amount: formatCurrency(formatAmount(giveAmount), language, currency),
                    fromName,
                    name: donationDetails.name,
                    to: giveTo.text,
                });
            secondParagraph = formatMessage('recurringAllocationDetails', {
                dayOfMonth: recurringDay,
                fromName,
                startsOn,
            });
            thirdParagraph = formatMessage('recurringAllocationNotes', {
                creditCard: creditCard.text,
            });
        } else if (giveTo.type === 'companies') {
            firstParagraph = formatMessage('companyRecurringDonation', {
                amount: donationDetails.amount,
                companyName: giveTo.name,
                name: donationDetails.name,
            });
            thirdParagraph = formatMessage('companyRecurringTaxReceiptMessage', { companyName: giveTo.name});
            recurringDonationsLink = `/companies/${giveTo.slug}/recurring-donations`;
        } else if (giveTo.type === 'user') {
            firstParagraph = formatMessage('recurringDonation', {
                amount: donationDetails.amount,
                name: donationDetails.name,
            });
            thirdParagraph = formatMessage('recurringTaxReceiptMessage');
        }
        if (type === 'donations') {
            secondParagraph = recurringCreditCardMessage;
            fourthButton = (
                <Button
                    // as={GeminiLink}
                    color="blue"
                    content={formatMessage('recurringTransactions')}
                    path={recurringDonationsLink}
                />
            );
        } else if (!_.isEmpty(creditCard) && creditCard.value > 0) {
            taxProfileLink = (giveFrom.type !== 'user')
                ? `/${giveFrom.type}/${giveFrom.slug}/tax-receipts` : taxProfileLink;
            fourthButton = (
                <Button
                    //as={GeminiLink}
                    color="blue"
                    content={formatMessage({ id: 'giving.donations.success.seeYourTaxReceipt' })}
                    id="taxReceiptsLink"
                    path={taxProfileLink}
                />
            );
        }
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
    currentUser: PropTypes.shape({
        attributes: PropTypes.shape({
            displayName: PropTypes.string,
        }),
    }),
    donationMatchData: PropTypes.arrayOf,
    i18n: PropTypes.shape({
        language: PropTypes.string,
    }),
    successData: PropTypes.shape({
        giveData: PropTypes.shape({
            coverFees: PropTypes.bool,
            coverFeesAmount: PropTypes.string,
            creditCard: PropTypes.shape({
                text: PropTypes.string,
                value: PropTypes.any,
            }),
            donationAmount: PropTypes.string,
            donationMatch: PropTypes.shape({
                id: PropTypes.any,
                value: PropTypes.string,
            }),
            giftType: PropTypes.shape({
                value: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),
            }),
            giveAmount: PropTypes.string,
            giveFrom: PropTypes.shape({
                name: PropTypes.string,
                slug: PropTypes.string,
                type: PropTypes.string,
            }),
            giveTo: PropTypes.shape({
                eftEnabled: PropTypes.bool,
                name: PropTypes.string,
                slug: PropTypes.string,
                text: PropTypes.string,
                type: PropTypes.string,
                value: PropTypes.string,
            }),
            recipients: PropTypes.arrayOf(PropTypes.element),
        }),
        quaziSuccessStatus: PropTypes.bool,
        type: PropTypes.string,
    }),
    t: PropTypes.func,
};
Success.defaultProps = {
    currentUser: {
        attributes: {
            displayName: '',
        },
    },
    donationMatchData: [],
    i18n: {
        language: 'en',
    },
    successData: {
        giveData: {
            coverFees: false,
            coverFeesAmount: '',
            creditCard: {
                text: null,
                value: null,
            },
            donationAmount: '',
            donationMatch: {
                id: null,
                value: null,
            },
            giftType: {
                value: null,
            },
            giveAmount: '',
            giveFrom: {
                name: '',
                slug: '',
                value: '',
            },
            giveTo: {
                eftEnabled: false,
                name: '',
                slug: '',
                text: '',
                type: '',
                value: null,
            },
            recipients: [],
        },
        quaziSuccessStatus: false,
        stepsCompleted: false,
        type: null,
    },
    t: _.noop,
};

const mapStateToProps = (state) => ({
    currentUser: state.user.info,
    donationMatchData: state.user.donationMatchData,
    successData: state.give.successData,
});
export default withTranslation('success')(connect(mapStateToProps)(Success));
