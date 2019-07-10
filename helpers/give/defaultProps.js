export const donationDefaultProps = {
    flowObject: {
        currency: 'USD',
        giveData: {
            automaticDonation: false,
            creditCard: {
                value: null,
            },
            donationAmount: '',
            donationMatch: {
                value: null
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
        slugValue: null,
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
            privacyShareAmount: true,
            privacyShareEmail: false,
            privacyShareName: true,
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
