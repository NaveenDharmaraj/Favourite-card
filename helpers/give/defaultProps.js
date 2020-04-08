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
            formatedDonationAmount: '',
            giftType: {
                value: 0,
            },
            giveAmount: '',
            giveTo: {
                value: null,
            },
            newCreditCardId: null,
            noteToSelf: '',
            taxReceipt: {
                value: null,
            },
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
            dedicateGift: {
                dedicateType: '',
                dedicateValue: '',
            },
            donationAmount: '',
            donationMatch: {
                value: null,
            },
            formatedCharityAmount: '',
            formatedDonationAmount: '',
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
            dedicateGift: {
                dedicateType: '',
                dedicateValue: '',
            },
            donationAmount: '',
            donationMatch: {
                value: null,
            },
            formatedDonationAmount: '',
            formatedGroupAmount: '',
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
            formatedDonationAmount: '',
            formatedP2PAmount: '',
            friendsList: [],
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
            emailMasked: false,
            recipientName: '',
            recipientImage: '',
            selectedFriendsList: [],
        },
        nextSteptoProceed: {},
        selectedTaxReceiptProfile: {},
        stepsCompleted: false,
        taxReceiptProfileAction: 'no_change',
        type: 'give/to/friend',
    },
};
