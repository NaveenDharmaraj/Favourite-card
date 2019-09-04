export const donationDefaultProps = {
    flowObject: {
        cardHolderName: '',
        currency: 'USD',
        giveData: {
            automaticDonation: false,
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
            giveTo: {
                value: null,
            },
            newCreditCardId: null,
            noteToSelf: '',
            userInteracted: false,
        },
        selectedTaxReceiptProfile: {},
        stepsCompleted: false,
        stripeCreditCard: {},
        taxReceiptProfileAction: 'no_change',
        type: 'donations',
    },
};


export const beneficiaryDefaultProps = {
    flowObject: {
        currency: 'USD',
        giveData: {
            coverFees: false,
            coverFeesAmount: null,
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
            infoToShare: {
                value: 'anonymous',
            },
            newCreditCardId: null,
            noteToCharity: '',
            noteToSelf: '',
            userInteracted: false,
        },
        groupFromUrl: false,
        groupId: null,
        nextSteptoProceed: {},
        selectedTaxReceiptProfile: {},
        sourceAccountHolderId: null,
        stepsCompleted: false,
        taxReceiptProfileAction: 'no_change',
        type: 'give/to/charity',
    },
};

export const groupDefaultProps = {
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
            infoToShare: {
                value: null,
            },
            noteToCharity: '',
            noteToSelf: '',
            privacyShareAddress: false,
            privacyShareAmount: false,
            privacyShareEmail: false,
            privacyShareName: false,
            userInteracted: false,
        },
        groupFromUrl: false,
        groupIndex: 0,
        nextSteptoProceed: {},
        selectedTaxReceiptProfile: {},
        slugValue: null,
        sourceAccountHolderId: null,
        stepsCompleted: false,
        taxReceiptProfileAction: 'no_change',
        type: 'give/to/group',
    },
};

export const p2pDefaultProps = {
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
            // P2P gift type is always 0
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
            infoToShare: {
                value: 'anonymous',
            },
            newCreditCardId: null,
            noteToRecipients: '',
            noteToSelf: '',
            recipients: [],
            totalP2pGiveAmount: 0,
            userInteracted: false,
        },
        nextSteptoProceed: {},
        selectedTaxReceiptProfile: {},
        stepsCompleted: false,
        taxReceiptProfileAction: 'no_change',
        type: 'give/to/friend',
    },
};
