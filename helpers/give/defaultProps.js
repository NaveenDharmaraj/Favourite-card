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

export const reloadDefaultProps = {
    reloadObject: {
        cardHolderName: '',
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
            giftType: {
                value: 0,
            },
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
        stripeCreditCard: {},
        type: 'donations',
    },
};

export const beneficiaryDefaultProps = {
    flowObject: {
        benificiaryIndex: 0,
        currency: 'USD',
        giveData: {
            coverFees: false,
            coverFeesAmount: null,
            dedicateGift: {
                dedicateType: '',
                dedicateValue: '',
            },
            formatedCharityAmount: '',
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
                privacyData: null,
                privacySetting: 'anonymous',
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
        stepsCompleted: false,
        type: 'give/to/charity',
    },
};

export const groupDefaultProps = {
    flowObject: {
        currency: 'USD',
        giveData: {
            dedicateGift: {
                dedicateType: '',
                dedicateValue: '',
            },
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
                privacyData: null,
                privacySetting: 'anonymous',
                value: 'anonymous',
            },
            matchingPolicyDetails: {
                hasMatchingPolicy: false,
                isValidMatchPolicy : false,
                matchPolicyTitle: '',
            },
            infoToShareList: [],
            nameToShare: {
                value: 'anonymous',
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
        slugValue: null,
        stepsCompleted: false,
        type: 'give/to/group',
    },
};

export const p2pDefaultProps = {
    flowObject: {
        currency: 'USD',
        giveData: {
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
        stepsCompleted: false,
        type: 'give/to/friend',
    },
};
