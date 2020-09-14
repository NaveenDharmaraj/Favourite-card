import {
    populateDonationReviewPage,
    populateGiveReviewPage,
    populateP2pReviewPage,
} from '../../../helpers/give/utils';

import * as riviewPageData from './Data/review_data';

describe('Testing giving flows util functions', () => {
    const currency = 'USD';
    const formatMessage = (key) => (key);
    const language = 'en';
    describe('Testing Review screen util functions', () => {
        const {
            reviewGiveData,
            companiesAccountsData,
            donationMatchData,
            selectedTaxReceiptProfile,
            donationReviewData,
            giveGroupDetails,
            giveToReviewData,
            P2PReviewData,
            recepientData,
        } = riviewPageData;
        describe('Testing donation flow', () => {
            it('Should NOT show data if transaction info is empty', () => {
                const modifiedData = {
                    ...reviewGiveData,
                    giveTo: {},
                };
                const data = {
                    companiesAccountsData,
                    donationMatchData,
                    selectedTaxReceiptProfile,
                };
                expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language))
                    .toEqual(undefined);
            });
            describe('Testing account details section', () => {
                it('Should show "To Impact Account" at account details section for adding money to user account', () => {
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    expect(populateDonationReviewPage(reviewGiveData, data, currency, formatMessage, language).accountType)
                        .toEqual('user');
                    expect(populateDonationReviewPage(reviewGiveData, data, currency, formatMessage, language).mainDisplayText)
                        .toEqual('To Impact Account');
                });
                it('Should show Company account at account details section for adding money to company account', () => {
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    const modifiedData = {
                        ...reviewGiveData,
                        giveTo: {
                            ...reviewGiveData.giveTo,
                            id: '15',
                            type: 'companies',
                        },
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).accountType)
                        .toEqual('company');
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).mainDisplayText)
                        .toEqual('Nike\'s Impact Account');
                });
            });
            describe('Testing "Frequency" section', () => {
                it('Should show "Add once" at frequency section if "Frequency" is selected as "Add Once"', () => {
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    const modifiedData = {
                        ...reviewGiveData,
                        giftType: {
                            value: 0,
                        },
                    };
                    const expectedresult = {
                        name: 'reviewFrequency',
                        value: [
                            'reviewAddOnce',
                        ],
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[0])
                        .toEqual(expectedresult);
                });
                it('Should show "Add monthly 1st of every month" at frequency section if "Frequency" is selected as "Add monthly 1st of every month"', () => {
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    const modifiedData = {
                        ...reviewGiveData,
                        giftType: {
                            value: 1,
                        },
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[0].value[0])
                        .toEqual('reviewAddMonthly ');
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[0].value[2])
                        .toEqual(' onFirstMessage');
                });
                it('Should show "Add monthly 15th of every month" at frequency section if "Frequency" is selected as "Add monthly 15th of every month"', () => {
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    const modifiedData = {
                        ...reviewGiveData,
                        giftType: {
                            value: 15,
                        },
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[0].name)
                        .toEqual('reviewFrequency');
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[0].value[0])
                        .toEqual('reviewAddMonthly ');
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[0].value[2])
                        .toEqual(' onFifteenthMessage');
                });
            });
            describe('Testing "Payment method" section', () => {
                it('Should show "Payment method" section if credit card value is greter than 0', () => {
                    const modifiedData = {
                        ...reviewGiveData,
                        creditCard: {
                            ...reviewGiveData.creditCard,
                            text: 'ch\'s Visa ending with 4242',
                            value: '999176',
                        },
                    };
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[1].name)
                        .toEqual('reviewPaymentMethod');
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[1].value)
                        .toEqual('ch\'s Visa ending with 4242');
                });
                it('Should NOT show "Payment method" section if credit card value is less than or equal to 0', () => {
                    const modifiedData = {
                        ...reviewGiveData,
                        creditCard: {
                            ...reviewGiveData.creditCard,
                            text: 'ch\'s Visa ending with 4242',
                            value: '0',
                        },
                    };
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[1].name)
                        .not.toEqual('reviewPaymentMethod');
                });
            });
            describe('Testing "Tax receipt recipient" section', () => {
                it('Should show address field at "Tax receipt recipient" section if address is not empty', () => {
                    const modifiedData = {
                        ...selectedTaxReceiptProfile,
                        attributes: {
                            ...selectedTaxReceiptProfile.attributes,
                            addressOne: '98567 Altenwerth Spring',
                            addressTwo: 'street 006',
                        },
                    };
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile: modifiedData,
                    };
                    expect(populateDonationReviewPage(reviewGiveData, data, currency, formatMessage, language).listingData[2].name)
                        .toEqual('reviewTaxReceipt');
                    expect(populateDonationReviewPage(reviewGiveData, data, currency, formatMessage, language).listingData[2].value[2])
                        .toEqual(' 98567 Altenwerth Spring  street 006 ');
                });
                it('Should show only "address one" field at "Tax receipt recipient" section if address two is empty', () => {
                    const modifiedData = {
                        ...selectedTaxReceiptProfile,
                        attributes: {
                            ...selectedTaxReceiptProfile.attributes,
                            addressOne: '98567 Altenwerth Spring',
                            addressTwo: null,
                        },
                    };
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile: modifiedData,
                    };
                    expect(populateDonationReviewPage(reviewGiveData, data, currency, formatMessage, language).listingData[2].name)
                        .toEqual('reviewTaxReceipt');
                    expect(populateDonationReviewPage(reviewGiveData, data, currency, formatMessage, language).listingData[2].value[2])
                        .toEqual(' 98567 Altenwerth Spring   ');
                });
            });
            describe('testing "Matching partner" section', () => {
                it('Should show "No matching partner available" if there is no donation match', () => {
                    const modifiedData = {
                        ...reviewGiveData,
                        donationMatch: {
                            ...reviewGiveData.donationMatch,
                            value: 0,
                        },
                    };
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[3].name)
                        .toEqual('reviewMatchingPartner');
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[3].value)
                        .toEqual('reviewNoMatchingDetails');
                });
                it('Should show Matching partner details if there is a donation match', () => {
                    const modifiedData = {
                        ...reviewGiveData,
                        donationMatch: {
                            ...reviewGiveData.donationMatch,
                            value: 3055,
                        },
                    };
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[3].name)
                        .toEqual('reviewMatchingPartner');
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[3].value)
                        .toEqual('reviewMatchingDetails');
                });
            });
            describe('Testing "Note to self" section', () => {
                it('Should show "No note added" if there is Note to self is empty', () => {
                    const modifiedData = {
                        ...reviewGiveData,
                        noteToSelf: '',
                    };
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[4].name)
                        .toEqual('reviewNoteToSelf');
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[4].value)
                        .toEqual('reviewEmptyNoteToSelf');
                });
                it('Should show note if there is Note to self', () => {
                    const modifiedData = {
                        ...reviewGiveData,
                        noteToSelf: 'test note',
                    };
                    const data = {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    };
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[4].name)
                        .toEqual('reviewNoteToSelf');
                    expect(populateDonationReviewPage(modifiedData, data, currency, formatMessage, language).listingData[4].value)
                        .toEqual('test note');
                });
            });
        });
        describe('Testing give to flow', () => {
            it('Should NOT show transaction details section if give from data is empty', () => {
                const modifiedData = {
                    ...giveToReviewData,
                    giveFrom: {},
                };
                const data = {
                    giveGroupDetails,
                    toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                    type: 'give/to/group',
                };
                expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData)
                    .toEqual([]);
            });
            describe('Testing Frequency section', () => {
                it('Should show "Add Once" at "Frequency" section if gift type is selected as "Add Once"', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giftType: {
                            value: 0,
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[0].name)
                        .toEqual('reviewFrequency');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[0].value[0])
                        .toEqual('reviewSendOnce');
                });
                it('Should show "Send monthly 1st of every month" at "Frequency" section if gift type is selected as "1st of every month"', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giftType: {
                            value: 1,
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[0].name)
                        .toEqual('reviewFrequency');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[0].value[0])
                        .toEqual('reviewSendMonthly ');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[0].value[2])
                        .toEqual(' onFirstMessage');
                });
                it('Should show "Send monthly 15th of every month" at "Frequency" section if gift type is selected as "15th of every month"', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giftType: {
                            value: 15,
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[0].name)
                        .toEqual('reviewFrequency');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[0].value[0])
                        .toEqual('reviewSendMonthly ');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[0].value[2])
                        .toEqual(' onFifteenthMessage');
                });
            });
            describe('Testing Match section', () => {
                it('Should show "Match" section if group has match enabled', () => {
                    const modifiedData = {
                        ...giveGroupDetails,
                        attributes: {
                            ...giveGroupDetails.attributes,
                            activeMatch: {
                                balance: '44664.0',
                                company: 'Eva Co',
                                companyId: 699,
                                matchPercent: 25,
                                maxMatchAmount: 10,
                                totalMatch: '59087.0',
                            },
                            hasActiveMatch: true,
                        },
                    };
                    const data = {
                        giveGroupDetails: modifiedData,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(giveToReviewData, data, currency, formatMessage, language, false).listingData[2].name)
                        .toEqual('giftToGroupMatchedBy');
                    expect(populateGiveReviewPage(giveToReviewData, data, currency, formatMessage, language, false).listingData[2].value)
                        .toEqual('Eva Co: $10.00');
                });
                it('Should NOT show "Match" section if group does not has match enabled', () => {
                    const modifiedData = {
                        ...giveGroupDetails,
                        attributes: {
                            ...giveGroupDetails.attributes,
                            activeMatch: {},
                            hasActiveMatch: false,
                        },
                    };
                    const data = {
                        giveGroupDetails: modifiedData,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(giveToReviewData, data, currency, formatMessage, language, false).listingData[2].name)
                        .not.toEqual('giftToGroupMatchedBy');
                });
            });
            describe('Testing "Info to share with the charity" section in give to charity flow', () => {
                it('Should show "Give Anonymously" at "Info to share with the charity" section if Info to share with the charity is anonymous', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        infoToShare: {
                            value: 'anonymous',
                        },
                    };
                    const data = {
                        giveGroupDetails: undefined,
                        toURL: '/give/to/charity/the-children-s-hospital-foundation-of-manitoba-inc/gift/new',
                        type: 'give/to/charity',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].name)
                        .toEqual('reviewInfoToCharity');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].value)
                        .toEqual('reviewGiveAnonymously');
                });
                it('Should show give from information at "Info to share with the charity" section if Info to share with the charity is not ananymous', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        infoToShare: {
                            text: 'Dwarf Rabbit Disaster Recovery',
                            value: 'name',
                        },
                    };
                    const data = {
                        giveGroupDetails: undefined,
                        toURL: '/give/to/charity/the-children-s-hospital-foundation-of-manitoba-inc/gift/new',
                        type: 'give/to/charity',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].name)
                        .toEqual('reviewInfoToCharity');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].value)
                        .toEqual('Dwarf Rabbit Disaster Recovery');
                });
            });
            describe('Testing "Info to share with the Giving Group members" section in give to group flow', () => {
                it('Should show "Give Anonymously" at "Info to share with the Giving Group members" section if Info to share with the Giving Group members is selected Anonymous', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        nameToShare: {
                            value: 0,
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].name)
                        .toEqual('privacyShareGivingGroupLabel');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].value[0])
                        .toEqual('reviewGiveAnonymously');
                });
                it('Should show share details at "Info to share with the Giving Group members" section if Info to share with the Giving Group members has value selected', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        nameToShare: {
                            text: 'Mishel David',
                            value: 1,
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].name)
                        .toEqual('privacyShareGivingGroupLabel');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].value[0])
                        .toEqual('Mishel David');
                });
                describe('Testing "Gift amount" at "Info to share with the Giving Group members" section', () => {
                    it('Should show share details with Gift amount at "Info to share with the Giving Group members" section if "Share my gift amount" is selected', () => {
                        const modifiedData = {
                            ...giveToReviewData,
                            giveAmount: '100.00',
                            nameToShare: {
                                text: 'Mishel David',
                                value: 1,
                            },
                            privacyShareAmount: true,
                        };
                        const data = {
                            ...giveGroupDetails,
                            toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                            type: 'give/to/group',
                        };
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].name)
                            .toEqual('privacyShareGivingGroupLabel');
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].value[0])
                            .toEqual('Mishel David ');
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].value[2])
                            .toEqual(' reviewGiftAmount $100.00');
                    });
                    it('Should show share details without Gift amount at "Info to share with the Giving Group members" section if "Share my gift amount" is not selected', () => {
                        const modifiedData = {
                            ...giveToReviewData,
                            giveAmount: '100.00',
                            nameToShare: {
                                text: 'Mishel David',
                                value: 1,
                            },
                            privacyShareAmount: false,
                        };
                        const data = {
                            ...giveGroupDetails,
                            toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                            type: 'give/to/group',
                        };
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].name)
                            .toEqual('privacyShareGivingGroupLabel');
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].value[0])
                            .toEqual('Mishel David');
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].value[2])
                            .not.toEqual(' reviewGiftAmount $100.00');
                    });
                });
            });
            describe('Testing Info to share with the Giving Group admins', () => {
                it('Should show N/A at "Info to share with the Giving Group admins" section if give from account is not user account', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveFrom: {
                            ...giveToReviewData.giveFrom,
                            type: 'groups',
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[3].name)
                        .toEqual('privacyShareOrganizersGroupLabel');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[3].value)
                        .toEqual('notApplicable');
                });
                it('Should show "Give Anonymously" at "Info to share with the Giving Group admins" section if Info to share value is selected Give Anonymously', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        infoToShare: {
                            value: 'anonymous',
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[3].name)
                        .toEqual('privacyShareOrganizersGroupLabel');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[3].value)
                        .toEqual('reviewGiveAnonymously');
                });
                it('Should show user details at "Info to share with the Giving Group admins" section if Info to share has value', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        infoToShare: {
                            text: 'Mishel David',
                            value: 'name_email',
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[3].name)
                        .toEqual('privacyShareOrganizersGroupLabel');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[3].value)
                        .toEqual('Mishel David');
                });
            });
            describe('Testing give to campaign flow', () => {
                it('Should show "Info to share with the Campaign members" for give to campaign flow', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveTo: {
                            ...giveToReviewData.giveTo,
                            isCampaign: true,
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[2].name)
                        .toEqual('privacyShareGivingCampaignLabel');
                });
                it('Should show "Info to share with the Campaign admins" for give to campaign flow', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveTo: {
                            ...giveToReviewData.giveTo,
                            isCampaign: true,
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[3].name)
                        .toEqual('privacyShareOrganizersCampaignLabel');
                });
                describe('Testing "Message for Campaign Admins" section', () => {
                    it('Should show "No message added" at "Message for Campaign Admins" section if there is no message added', () => {
                        const modifiedData = {
                            ...giveToReviewData,
                            giveTo: {
                                ...giveToReviewData.giveTo,
                                isCampaign: true,
                            },
                            noteToCharity: '',
                        };
                        const data = {
                            ...giveGroupDetails,
                            toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                            type: 'give/to/group',
                        };
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].name)
                            .toEqual('reviewMessageToLabelCampaign');
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].value)
                            .toEqual('reviewDefaultMessage');
                    });
                    it('Should show message added at "Message for Campaign Admins" section if there is message added', () => {
                        const modifiedData = {
                            ...giveToReviewData,
                            giveTo: {
                                ...giveToReviewData.giveTo,
                                isCampaign: true,
                            },
                            noteToCharity: 'Test Message',
                        };
                        const data = {
                            ...giveGroupDetails,
                            toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                            type: 'give/to/group',
                        };
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].name)
                            .toEqual('reviewMessageToLabelCampaign');
                        expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].value)
                            .toEqual('Test Message');
                    });
                });
            });
            describe('Testing "Dedicate this gift" section', () => {
                it('Should show "No gift dedication" if "Dedicate this gift" is not selected', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        dedicateGift: {
                            dedicateType: '',
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[4].name)
                        .toEqual('reviewGiftDedication');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[4].value)
                        .toEqual('reviewNoGift');
                });
                it('Should show "In honour of" content at "Dedicate this gift" section if "In honour of" has value', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        dedicateGift: {
                            dedicateType: 'inHonorOf',
                            dedicateValue: 'Test',
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[4].name)
                        .toEqual('reviewGiftDedication');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[4].value)
                        .toEqual('In honour of Test');
                });
                it('Should show "In memory of" content at "Dedicate this gift" section if "In memory of" has value', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        dedicateGift: {
                            dedicateType: 'inMemoryOf',
                            dedicateValue: 'Test',
                        },
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[4].name)
                        .toEqual('reviewGiftDedication');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[4].value)
                        .toEqual('In memory of Test');
                });
            });
            describe('Testing "Message for the Giving Group" section', () => {
                it('Should show "No message added" at "Message for the Giving Group" section if there is no message added', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        noteToCharity: '',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].name)
                        .toEqual('reviewMessageToLabelGroup');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].value)
                        .toEqual('reviewDefaultMessage');
                });
                it('Should show message added at "Message for the Giving Group" section if there is message added', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        noteToCharity: 'Test Message',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].name)
                        .toEqual('reviewMessageToLabelGroup');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].value)
                        .toEqual('Test Message');
                });
            });
            describe('Testing "Message for the Campaign admins" section for give to campaign flow', () => {
                it('Should show "No message added" at "Message for the Campaign admins" section if there is no message added', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveTo: {
                            ...giveToReviewData.giveTo,
                            isCampaign: true,
                        },
                        noteToCharity: '',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].name)
                        .toEqual('reviewMessageToLabelCampaign');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].value)
                        .toEqual('reviewDefaultMessage');
                });
                it('Should show message added at "Message for the Campaign admins" section if there is message added', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveTo: {
                            ...giveToReviewData.giveTo,
                            isCampaign: true,
                        },
                        noteToCharity: 'Test Message',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].name)
                        .toEqual('reviewMessageToLabelCampaign');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[5].value)
                        .toEqual('Test Message');
                });
            });
            describe('Testing "Note to group" section if give from account is group account', () => {
                it('Should show "No note added" if Note to group is empty', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveFrom: {
                            ...giveToReviewData.giveFrom,
                            type: 'groups',
                        },
                        noteToSelf: '',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].name)
                        .toEqual('reviewNoteToSelfgroups');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].value)
                        .toEqual('reviewEmptyNoteToSelf');
                });
                it('Should show message if Note to group has value', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveFrom: {
                            ...giveToReviewData.giveFrom,
                            type: 'groups',
                        },
                        noteToSelf: 'Test note',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].name)
                        .toEqual('reviewNoteToSelfgroups');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].value)
                        .toEqual('Test note');
                });
            });
            describe('Testing "Note to campaign" section if give from account is campaign account', () => {
                it('Should show "No note added" if Note to campaign is empty', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveFrom: {
                            ...giveToReviewData.giveFrom,
                            type: 'campaigns',
                        },
                        noteToSelf: '',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].name)
                        .toEqual('reviewNoteToSelfcampaigns');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].value)
                        .toEqual('reviewEmptyNoteToSelf');
                });
                it('Should show message if Note to campaign has value', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveFrom: {
                            ...giveToReviewData.giveFrom,
                            type: 'campaigns',
                        },
                        noteToSelf: 'Test note',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].name)
                        .toEqual('reviewNoteToSelfcampaigns');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].value)
                        .toEqual('Test note');
                });
            });
            describe('Testing "Note to company" section if give from account is company account', () => {
                it('Should show "No note added" if Note to company is empty', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveFrom: {
                            ...giveToReviewData.giveFrom,
                            type: 'companies',
                        },
                        noteToSelf: '',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].name)
                        .toEqual('reviewNoteToSelfcompanies');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].value)
                        .toEqual('reviewEmptyNoteToSelf');
                });
                it('Should show message if Note to company has value', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveFrom: {
                            ...giveToReviewData.giveFrom,
                            type: 'companies',
                        },
                        noteToSelf: 'Test note',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].name)
                        .toEqual('reviewNoteToSelfcompanies');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].value)
                        .toEqual('Test note');
                });
            });
            describe('Testing "Note to self" section if give from account is user account', () => {
                it('Should show "No note added" if Note to self is empty', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveFrom: {
                            ...giveToReviewData.giveFrom,
                            type: 'user',
                        },
                        noteToSelf: '',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].name)
                        .toEqual('reviewNoteToSelfuser');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].value)
                        .toEqual('reviewEmptyNoteToSelf');
                });
                it('Should show message if Note to self has value', () => {
                    const modifiedData = {
                        ...giveToReviewData,
                        giveFrom: {
                            ...giveToReviewData.giveFrom,
                            type: 'user',
                        },
                        noteToSelf: 'Test note',
                    };
                    const data = {
                        ...giveGroupDetails,
                        toURL: '/give/to/group/dwarf-rabbit-disaster-recovery/new',
                        type: 'give/to/group',
                    };
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].name)
                        .toEqual('reviewNoteToSelfuser');
                    expect(populateGiveReviewPage(modifiedData, data, currency, formatMessage, language, false).listingData[6].value)
                        .toEqual('Test note');
                });
            });
        });
        describe('Testing P2P flow', () => {
            it('Should show user profile image at profile image section if user has profile image', () => {
                const modifiedData = {
                    ...P2PReviewData,
                    recipientImage: 'test.png',
                    recipients: [
                        'a@b.com',
                    ],
                    selectedFriendsList: [],
                };
                const data = {
                    toURL: '/give/to/friend/new',
                    type: 'give/to/friend',
                };
                expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).mainDisplayImage)
                    .toEqual('test.png');
            });
            // TODO check image Placeholder
            // it('Should show default profile image at profile image section if user does not have profile image', () => {
            //     const modifiedData = {
            //         ...P2PReviewData,
            //         recipientImage: '',
            //         recipients: [
            //             'a@b.com',
            //         ],
            //         selectedFriendsList: [],
            //     };
            //     const data = {
            //         toURL: '/give/to/friend/new',
            //         type: 'give/to/friend',
            //     };
            //     expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).mainDisplayImage)
            //         .toEqual('test.png');
            // });

            it('Should show user name below profile image section for single user P2P from dashboard', () => {
                const modifiedData = {
                    ...P2PReviewData,
                    recipientImage: 'test.png',
                    recipientName: 'test_user',
                    recipients: [
                        'a@b.com',
                    ],
                    selectedFriendsList: [],
                };
                const data = {
                    toURL: '/give/to/friend/new',
                    type: 'give/to/friend',
                };
                expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).mainDisplayText)
                    .toEqual('reviewGiveToText test_user');
            });
            describe('Testing "Give to" section', () => {
                it('Should show email address below profile image section for single email transaction', () => {
                    const modifiedData = {
                        ...P2PReviewData,
                        recipientImage: 'test.png',
                        recipientName: '',
                        recipients: [
                            'a@b.com',
                        ],
                        selectedFriendsList: [],
                    };
                    const data = {
                        toURL: '/give/to/friend/new',
                        type: 'give/to/friend',
                    };
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).mainDisplayText)
                        .toEqual('reviewGiveToText a@b.com');
                });
                it('Should show friend profile image at profile image section if selected friend has profile image', () => {
                    const modifiedData = {
                        ...P2PReviewData,
                        recipientImage: '',
                        recipientName: '',
                        recipients: [],
                        selectedFriendsList: [
                            {
                                avatar: 'https://lab-monkey.herokuapp.com/assets/avatars/chimp-icon-individual-6d2a6f44ac40c214255806622b808ce56f41b5bd841ae9738a1d64cba8e5098d.png',
                                displayName: 'Jason',
                                email: 'jason.proulx@chimp.net',
                                type: 'users',
                                userId: 31,
                            },
                        ],
                    };
                    const data = {
                        toURL: '/give/to/friend/new',
                        type: 'give/to/friend',
                    };
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).mainDisplayImage)
                        .toEqual('https://lab-monkey.herokuapp.com/assets/avatars/chimp-icon-individual-6d2a6f44ac40c214255806622b808ce56f41b5bd841ae9738a1d64cba8e5098d.png');
                });
                it('Should show friend profile name below profile image section for single friend transaction', () => {
                    const modifiedData = {
                        ...P2PReviewData,
                        recipientImage: '',
                        recipientName: '',
                        recipients: [],
                        selectedFriendsList: [
                            {
                                avatar: 'https://lab-monkey.herokuapp.com/assets/avatars/chimp-icon-individual-6d2a6f44ac40c214255806622b808ce56f41b5bd841ae9738a1d64cba8e5098d.png',
                                displayName: 'Jason',
                                email: 'jason.proulx@chimp.net',
                                type: 'users',
                                userId: 31,
                            },
                        ],
                    };
                    const data = {
                        toURL: '/give/to/friend/new',
                        type: 'give/to/friend',
                    };
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).mainDisplayText)
                        .toEqual('reviewGiveToText Jason');
                });
                it('Should show user list at "Give To" section if multiple email and friends selected', () => {
                    const modifiedData = {
                        ...P2PReviewData,
                        recipients: [
                            'a@b.com',
                            'c@d.com',
                        ],
                        selectedFriendsList: [
                            {
                                avatar: 'https://lab-monkey.herokuapp.com/assets/avatars/chimp-icon-individual-6d2a6f44ac40c214255806622b808ce56f41b5bd841ae9738a1d64cba8e5098d.png',
                                displayName: 'Jason',
                                email: 'jason.proulx@chimp.net',
                                type: 'users',
                                userId: 31,
                            },
                            {
                                avatar: 'https://lab-monkey.herokuapp.com/assets/avatars/chimp-icon-individual-6d2a6f44ac40c214255806622b808ce56f41b5bd841ae9738a1d64cba8e5098d.png',
                                displayName: 'Friend_two',
                                email: 'friend_two@chimp.net',
                                type: 'users',
                                userId: 32,
                            },
                        ],
                    };
                    const data = {
                        toURL: '/give/to/friend/new',
                        type: 'give/to/friend',
                    };
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).recipients)
                        .toEqual(recepientData);
                });
            });
            describe('Testing "Message" section', () => {
                it('Should show "No message added" at "Message" section if there is no Message added', () => {
                    const modifiedData = {
                        ...P2PReviewData,
                        noteToRecipients: '',
                        
                    };
                    const data = {
                        toURL: '/give/to/friend/new',
                        type: 'give/to/friend',
                    };
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).listingData[1].name)
                        .toEqual('reviewP2pMessage');
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).listingData[1].value)
                        .toEqual('reviewDefaultMessage');
                });
                it('Should show message at "Message" section if there is a Message added', () => {
                    const modifiedData = {
                        ...P2PReviewData,
                        noteToRecipients: 'test Message',
                        
                    };
                    const data = {
                        toURL: '/give/to/friend/new',
                        type: 'give/to/friend',
                    };
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).listingData[1].name)
                        .toEqual('reviewP2pMessage');
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).listingData[1].value)
                        .toEqual('test Message');
                });
            });
            describe('Testing "Note to self" section', () => {
                it('Should show "No note added" at "Note to self" section if there is no note added', () => {
                    const modifiedData = {
                        ...P2PReviewData,
                        noteToSelf: '',
                        
                    };
                    const data = {
                        toURL: '/give/to/friend/new',
                        type: 'give/to/friend',
                    };
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).listingData[2].name)
                        .toEqual('reviewNoteToSelf');
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).listingData[2].value)
                        .toEqual('reviewEmptyNoteToSelf');
                });
                it('Should show note at "Note to self" section if there is a note added', () => {
                    const modifiedData = {
                        ...P2PReviewData,
                        noteToSelf: 'test note',
                        
                    };
                    const data = {
                        toURL: '/give/to/friend/new',
                        type: 'give/to/friend',
                    };
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).listingData[2].name)
                        .toEqual('reviewNoteToSelf');
                    expect(populateP2pReviewPage(modifiedData, data, currency, formatMessage, language).listingData[2].value)
                        .toEqual('test note');
                });
            });
        });
    });
});
