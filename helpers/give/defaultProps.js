export const donationDefaultProps = {
    flowObject: {
        currency: 'USD',
        giveData: {
            creditCard: {
                value: null,
            },
            donationAmount: '',
            donationMatch: {
                value: null,
            },
            giftType: {
                value: 0,
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
        nextSteptoProceed: {},
        selectedTaxReceiptProfile: {},
        sourceAccountHolderId: null,
        stepsCompleted: false,
        taxReceiptProfileAction: 'no_change',
        type: 'donations',
    },
};