/* eslint-disable import/exports-last */
import {
    callApiAndGetData,
    updateTaxReceiptProfile
} from './user';
import _ from 'lodash';

import coreApi from '../services/coreApi';
import realtypeof from '../helpers/realtypeof';
import {
    getDonationMatchAndPaymentInstruments,
    savePaymentInstrument
} from './user';

import {
    beneficiaryDefaultProps,
    donationDefaultProps,
    groupDefaultProps,
} from '../helpers/give/defaultProps';

export const actionTypes = {
    COVER_FEES: 'COVER_FEES',
    GET_BENEFICIARY_FROM_SLUG: 'GET_BENEFICIARY_FROM_SLUG',
    GET_BENIFICIARY_FOR_GROUP: 'GET_BENIFICIARY_FOR_GROUP',
    GET_COMPANY_PAYMENT_AND_TAXRECEIPT: 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT',
    GET_COMPANY_TAXRECEIPTS: 'GET_COMPANY_TAXRECEIPTS',
    GET_UPCOMING_TRANSACTIONS: 'GET_UPCOMING_TRANSACTIONS',
    SAVE_FLOW_OBJECT: 'SAVE_FLOW_OBJECT',
    SAVE_SUCCESS_DATA: 'SAVE_SUCCESS_DATA',
};

const setDonationData = (donation) => {
    const {
        giveData: {
            creditCard,
            donationAmount,
            donationMatch,
            giveTo,
        },
        selectedTaxReceiptProfile,
    } = donation;
    const donationData = {
        attributes: {
            amount: donationAmount,
        },
        relationships: {
            fund: {
                data: {
                    id: giveTo.value,
                    type: 'funds',
                },
            },
            paymentInstrument: {
                data: {
                    id: creditCard.value,
                    type: 'paymentInstruments',
                },
            },
            taxReceiptProfile: {
                data: {
                    id: selectedTaxReceiptProfile.id,
                    type: 'taxReceiptProfiles',
                },
            },
        },
        type: 'donations',
    };
    if (donationMatch.value > 0) {
        donationData.relationships.employeeRole = {
            data: {
                id: donationMatch.value,
                type: 'roles',
            },
        };
    }

    return donationData;
};

/**
 * @param {*} cardDetails
 * @param {*} cardHolderName
 */
const createToken = (cardDetails, cardHolderName) => new Promise((resolve, reject) => {
    cardDetails.createToken({ name: cardHolderName }).then((result) => {
        if (result.error) {
            return reject(result.error);
        }
        return resolve(result.token);
    });
});

const saveDonations = (donation) => {
    const {
        giveData: {
            automaticDonation,
            giftType,
            noteToSelf,
        },
    } = donation;
    let donationUrl = '/donations';
    const donationData = setDonationData(donation);
    donationData.attributes.reason = noteToSelf;
    if (automaticDonation) {
        donationData.attributes.dayOfMonth = giftType.value;
        donationData.type = 'recurringDonations';
        donationUrl = '/recurringDonations';
    }
    const result = coreApi.post(donationUrl, {
        data: donationData,
        // uxCritical: true,
    });
    return result;
};


const postAllocation = async (allocationData) => {
    const result = await coreApi.post(`/${allocationData.type}`, {
        data: allocationData,
        // uxCritical: true,
    });
    return result;
};

const initializeAndCallAllocation = (allocation, attributes, type) => {
    const {
        giveData,
        selectedTaxReceiptProfile,
    } = allocation;

    const {
        creditCard,
        donationAmount,
        donationMatch,
        giftType,
        giveFrom,
        giveTo,
    } = giveData;

    const allocationData = {
        attributes,
        relationships: {
            destinationFund: {
                data: {
                    id: giveTo.value,
                    type: 'accountHolders',
                },
            },
            fund: {
                data: {
                    id: giveFrom.value,
                    type: 'accountHolders',
                },
            },
        },
    }
    if (giftType.value === 0) {
        allocationData.type = (type === 'charity')
            ? 'allocations' : 'groupAllocations'
        if (donationAmount) {
            return saveDonations({
                selectedTaxReceiptProfile,
                giveData: {
                    automaticDonation: false,
                    creditCard,
                    donationAmount,
                    donationMatch,
                    giveTo : giveFrom,
                    noteToSelf: '',
                }
            }).then((result) => {
                allocationData.relationships.donation = {
                    data: {
                        id: result.data.id,
                        type: 'donations',
                    },
                };
                return postAllocation(allocationData);
            });
        }
    } else {
        allocationData.type = 'recurringAllocations';
        allocationData.type = (type === 'charity')
        ? 'recurringAllocations' : 'recurringGroupAllocations'
        allocationData.attributes.dayOfMonth = giftType.value;
        if (donationMatch.value > 0) {
            allocationData.relationships.employeeRole = {
                data: {
                    id: donationMatch.value,
                    type: 'roles',
                },
            };
        }
        allocationData.relationships.paymentInstrument = {
            data: {
                id: creditCard.value,
                type: 'paymentInstruments',
            },
        };
    }
    return postAllocation(allocationData);
}

const saveCharityAllocation = (allocation) => {
    const {
        giveData,
    } = allocation;

    const {
        coverFees,
        giveAmount,
        infoToShare,
        noteToCharity,
        noteToSelf,
    } = giveData;

    const attributes = {
        amount: giveAmount,
        coverFees,
        noteToCharity,
        noteToSelf,
        privacyData: (infoToShare.id) ? infoToShare.id : null,
        privacySetting: _.split(infoToShare.value, '|')[0],
    };
    return initializeAndCallAllocation(allocation, attributes, 'charity');
}

const saveGroupAllocation = (allocation) => {
    const {
        giveData,
    } = allocation;

    const {
        giveAmount,
        infoToShare,
        noteToCharity,
        noteToSelf,
        privacyShareAddress,
        privacyShareAmount,
        privacyShareEmail,
        privacyShareName,
    } = giveData;

    const attributes = {
        amount: giveAmount,
        noteToGroup: noteToCharity,
        noteToSelf,
        privacyShareAddress,
        privacyShareAmount,
        privacyShareEmail,
        privacyShareName,
        privacyTrpId: privacyShareAddress ? infoToShare.id : null,
    };
    return initializeAndCallAllocation(allocation, attributes, 'group');
};

const postP2pAllocations = async (allocations) => {
    const results = [];
    let parentAllocationId = null;
    for (const allocationData of allocations) {
        let data = {};
        if (parentAllocationId) {
            const parent = {
                relationships: {
                    parentAllocation: {
                        data: {
                          type: 'fundAllocations',
                          id: parentAllocationId ,
                        },
                    },
                },
            }
            data = _.merge({}, allocationData, parent)
        } else {
            data = allocationData;
        }

        const params = {
            data: data,
        };

        const result = await comms.post(`/${allocationData.type}`, {
            data: params,
        });

        if  (result && result.data) {
            parentAllocationId = result.data.id;
        }
        results.push(result);
    };

    return results;
};

const initializeP2pAllocations = (
    recipients,
    giveAmount,
    noteToRecipients,
    noteToSelf,
    giveFrom,
    donationId,
) => {
    const allocations = [];
    _.each(recipients, (recipient) => {
        const allocationData = {
            attributes: {
                amount: giveAmount,
                email: _.replace(recipient, /[\n\r\t ]+/g, ''),
                noteToRecipient: noteToRecipients,
                noteToSelf,
                suppressEmail: false,
            },
            relationships: {
                sourceFund: {
                    data: {
                        id: giveFrom.value,
                        type: 'accountHolders',
                    },
                },
            },
        };

        if (donationId > 0) {
            allocationData.relationships.donation = {
                data: {
                    id: donationId,
                    type: 'donations',
                },
            };
        }
        allocationData.type = 'fundAllocations';
        allocations.push(allocationData);
    });

    return allocations;
};

/**
 * We want to be able to send multiple P2ps at once
 * @param {object} allocation The allocation object
 */
const saveP2pAllocations = (allocation) => {
    const {
        giveData: {
            creditCard,
            donationAmount,
            donationMatch,
            giveAmount,
            giveFrom,
            noteToRecipients,
            noteToSelf,
            recipients,
        },
        selectedTaxReceiptProfile,
    } = allocation;

    if (donationAmount) {
        return saveDonations({
            selectedTaxReceiptProfile,
            giveData: {
                automaticDonation: false,
                creditCard,
                donationAmount,
                donationMatch,
                giveTo : giveFrom,
                noteToSelf: '',
            }
        }).then((result) => {
            const allocations = initializeP2pAllocations(
                recipients,
                giveAmount,
                noteToRecipients,
                noteToSelf,
                giveFrom,
                result.data.id,
            );
            return postP2pAllocations(allocations);
        });
    }
    const allocations = initializeP2pAllocations(
        recipients,
        giveAmount,
        noteToRecipients,
        noteToSelf,
        giveFrom,
        0,
    );
    return postP2pAllocations(allocations);
};

/**
 * Check if it is a quazi success.
 * @param  {object} error error object.
 * @return {boolean} wether quazzi succes or not
 */
const checkForQuaziSuccess = (error) => {
    if (!_.isEmpty(error) && error.length === 1) {
        const checkQuaziSuccess = error[0];
        if (!_.isEmpty(checkQuaziSuccess.meta)
            && !_.isEmpty(checkQuaziSuccess.meta.recoverableState)
            && (checkQuaziSuccess.meta.recoverableState === 'true'
            || checkQuaziSuccess.meta.recoverableState === true)) {
            return true;
        }
    }
    return false;
};

const callApiAndDispatchData = (dispatch, account) => {
    if (account.type === 'user') {
        dispatch(getDonationMatchAndPaymentInstruments(account.id));
    } else {
        getCompanyPaymentAndTax(dispatch, Number(account.id));
    }
};

export const proceed = (flowObject, nextStep, stepIndex, lastStep = false) => {
    if (lastStep) {
        return (dispatch) => {
            let fn;
            let successData = {};
            let nextStepToProcced = nextStep;
            switch (flowObject.type) {
                case 'donations':
                    fn = saveDonations;
                    break;
                case 'give/to/charity':
                    fn = saveCharityAllocation;
                    break;
                case 'give/to/friend':
                    fn = saveP2pAllocations;
                    break;
                case 'give/to/group':
                    fn = saveGroupAllocation;
                    break;
                default:
                    break;
            }

            Promise.all(
                [
                    fn(flowObject),
                ],
            ).then((results) => {
                if (!_.isEmpty(results[0])) {
                    successData = _.merge({}, flowObject);
                    // For p2p, we create an array of arrays, I'm not to clear on the
                    // the correct syntax to make this more redable.
                    // if (type === 'give/to/friend') {
                    //     fsa.payload.allocation.allocationData = results[0];
                    // } else {
                    //     fsa.payload.allocation.allocationData = results[0].data;
                    // }
                }
            }).catch((err) => {
                // logger.error(err);
                if (checkForQuaziSuccess(err.errors)) {
                    successData.quaziSuccessStatus = true;
                } else {
                    successData.quaziSuccessStatus = false;
                    nextStepToProcced = 'error';
                }
            }).finally(() => {
                dispatch({
                    payload: {
                        successData,
                    },
                    type: actionTypes.SAVE_SUCCESS_DATA,
                });
                const defaultProps = {
                    'donations': donationDefaultProps,
                    'give/to/charity': beneficiaryDefaultProps,
                    'give/to/friend': p2pDefaultProps,
                    'give/to/group': groupDefaultProps,
                };
                const defaultPropsData = _.merge({}, defaultProps[flowObject.type]);
                const payload = {
                    ...defaultPropsData.flowObject,
                }
                payload.nextStep = nextStepToProcced;
                payload.stepsCompleted = true;
                const fsa = {
                    payload,
                    type: actionTypes.SAVE_FLOW_OBJECT,
                }
                dispatch(fsa);
                // fetchUser(userId);
            });
        };
    }
    return (dispatch) => {
        flowObject.nextStep = nextStep;
        const {
            giveData: {
                giveFrom,
                giveTo,
                creditCard,
            },
        } = flowObject;
        const accountDetails = {
            id: (flowObject.type === 'donations') ? giveTo.id : giveFrom.id,
            type: (flowObject.type === 'donations') ? giveTo.type : giveFrom.type,
        };
        if (flowObject.taxReceiptProfileAction !== 'no_change' && stepIndex === 1) {
            updateTaxReceiptProfile(
                flowObject.selectedTaxReceiptProfile,
                flowObject.taxReceiptProfileAction, dispatch,
            ).then((result) => {
                flowObject.selectedTaxReceiptProfile = result.data;
                dispatch({
                    payload: flowObject,
                    type: actionTypes.SAVE_FLOW_OBJECT,
                });
                callApiAndDispatchData(dispatch, accountDetails);
            }).catch((error) => {
                console.log(error);
            });
        } else if (creditCard.value === 0 && stepIndex === 0) {
            return createToken(flowObject.stripeCreditCard, flowObject.cardHolderName).then((token) => {
                const paymentInstrumentsData = {
                    attributes: {
                        stripeToken: token.id,
                    },
                    relationships: {
                        paymentable: {
                            data: {
                                id: accountDetails.id,
                                type: accountDetails.type,
                            },
                        },
                    },
                    type: 'paymentInstruments',
                };
                return savePaymentInstrument(paymentInstrumentsData);
            }).then((result) => {
                const {
                    data: {
                        attributes: {
                            description,
                        },
                        id,
                    },
                } = result;
                flowObject.giveData.creditCard.id = id;
                flowObject.giveData.creditCard.value = id;
                flowObject.giveData.creditCard.text = description;
                flowObject.giveData.newCreditCardId = id;
                dispatch({
                    payload: flowObject,
                    type: actionTypes.SAVE_FLOW_OBJECT,
                });
                callApiAndDispatchData(dispatch, accountDetails);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            dispatch({
                payload: flowObject,
                type: actionTypes.SAVE_FLOW_OBJECT,
            });
        }
    };
};

export const reInitNextStep = (dispatch, flowObject) => {
    flowObject.nextStep = null;
    return dispatch({
        payload: flowObject,
        type: actionTypes.SAVE_FLOW_OBJECT,
    });
};

/**
 * Send the allocation data to the relevant endpoint.
 * @param  {number} companyId Id of the company
 * @return {promise}     The promise returned by the Communications utility.
 */

export const getCompanyPaymentAndTax = (dispatch, companyId) => {
    const fsa = {
        payload: {
            companyDefaultTaxReceiptProfile: {},
            companyId,
            companyPaymentInstrumentsData: [],
            taxReceiptProfiles: [],
        },
        type: actionTypes.GET_COMPANY_PAYMENT_AND_TAXRECEIPT,
    };

    return coreApi.get(`/companies/${companyId}?include=defaultTaxReceiptProfile,activePaymentInstruments,taxReceiptProfiles`).then((result) => {
        const { data } = result;
        let defaultTaxReceiptId = null;
        if (!_.isEmpty(data.relationships.defaultTaxReceiptProfile.data)) {
            defaultTaxReceiptId = data.relationships.defaultTaxReceiptProfile.data.id;
        }
        if (!_.isEmpty(result.included)) {
            const { included } = result;
            included.map((item) => {
                const {
                    attributes,
                    id,
                    type,
                } = item;
                if (type === 'paymentInstruments') {
                    fsa.payload.companyPaymentInstrumentsData.push({
                        attributes,
                        id,
                        type,
                    });
                } else if (type === 'taxReceiptProfiles') {
                    if (id === defaultTaxReceiptId) {
                        fsa.payload.companyDefaultTaxReceiptProfile = {
                            attributes,
                            id,
                            type,
                        };
                    }
                    fsa.payload.taxReceiptProfiles.push({
                        attributes,
                        id,
                        type,
                    });
                }
            });
        }
        return dispatch(fsa);
    }).catch((error) => {
        console.log(error);
    });
};

export const getBeneficiariesForGroup = (dispatch, groupId) => {
    if (groupId !== null) {
        const fsa = {
            payload: {
                benificiaryDetails: [],
            },
            type: actionTypes.GET_BENIFICIARY_FOR_GROUP,
        };
        callApiAndGetData(`/groups/${groupId}/groupBeneficiaries`)
            .then(
                (result) => {
                    if (!_.isEmpty(result)) {
                        fsa.payload.benificiaryDetails = result;
                    }
                },
            ).catch(() => {
                //Router.pushRoutes('/error');
                console.log('error page');
            }).finally(() => {
                dispatch(fsa);
            });
    } else {
        //Router.pushRoutes('/dashboard');
        console.log('dashboard');
    }
};

export const getBeneficiaryFromSlug = (dispatch, slug) => {
    if (slug !== ':slug') {
        const fsa = {
            payload: {
                charityDetails: {},
            },
            type: actionTypes.GET_BENEFICIARY_FROM_SLUG,
        };
        coreApi.get(`/beneficiaries/find_by_slug`, {
            params: {
                slug: [
                    slug,
                ],
            },
        }).then(
            (result) => {
                if (result && !_.isEmpty(result.data)) {
                    fsa.payload.charityDetails = result.data;
                }
                return dispatch(fsa);
            },
        ).catch(() => {
            //redirect('/give/error');
            console.log('redirect to error');
        }).finally(() => {
            return dispatch(fsa);
        });
    } else {
        //redirect('/dashboard');
        console.log('dashboard');
    }
};
const getCoverFeesApi = async (amount, fundId) => {
    const params = {
        attributes: {
            amount: Number(amount),
        },
        relationships: {
            fund: {
                data: {
                    id: fundId,
                    type: 'funds',
                },
            },
        },
        type: 'allocationFees',
    };

    const giveAmountData = await coreApi.post(`/allocationFees`, {
        data: params,
        //uxCritical: true,
    });

    return giveAmountData;
};

export const getCoverFees = async (feeData, fundId, giveAmount, dispatch) => {
    const fsa = {
        payload: {
            coverFees: {},
        },
        type: actionTypes.COVER_FEES,
    };
    if (!_.isEmpty(feeData)) {
        fsa.payload.coverFees = { ...feeData.coverFees };
    }
    if (!_.isEmpty(giveAmount)) {
        fsa.payload.coverFees.giveAmount = giveAmount;
        fsa.payload.coverFees.giveAmountFees = 0;
        if (giveAmount >= 5) {
            await getCoverFeesApi(giveAmount, fundId).then((result) => {
                const {
                    data: {
                        attributes: {
                            feeAmount,
                        },
                    },
                } = result;
                fsa.payload.coverFees.giveAmountFees = feeAmount;
            });
        }
    }
    // GIVEB-1912 with recent updates given we don't need 2 versions of text
    // hence no need to fetch the fees for balance
    dispatch(fsa);
};
export const getCompanyTaxReceiptProfile = (dispatch, companyId) => {
    return callApiAndGetData(`/companies/${companyId}/taxReceiptProfiles?page[size]=50&sort=-id`).then((result) => {
        // return dispatch(setTaxReceiptProfile(result, type = ''));
        const fsa = {
            payload: {
                companyTaxReceiptProfiles: (!_.isEmpty(result)) ? result : [],
                taxReceiptGetApiStatus: true,
            },
            type: actionTypes.GET_COMPANY_TAXRECEIPTS,
        };
        return dispatch(fsa);
    }).catch((error) => {
        console.log(error);
    });
};

export const getUpcomingTransactions = (dispatch, url) => {
    return coreApi.get(url).then(
        (result) => {
            dispatch({
                payload:{
                    upcomingTransactions: result.data,
                    upcomingTransactionsMeta: result.meta,
            },
            type: actionTypes.GET_UPCOMING_TRANSACTIONS,
        })
    }
    ).catch((error) => {
        console.log(error);
        // Router.pushRoute('/give/error');
    })
}

export const deleteUpcomingTransaction = (dispatch, id, transactionType, activePage, userId) => {
    let url = null;
    switch(transactionType) {
        case 'RecurringAllocation':
            url=`recurringAllocations/${id}`
            break;
        case 'RecurringDonation':
            url=`recurringDonations/${id}`
            break;
        case 'RecurringFundAllocation':
            url=`recurringGroupAllocations/${id}`
            break;
        default:
            break;
    }
    debugger
    return coreApi.delete(url).then(
        (result) =>{
            console.log(result)
            let activepageUrl = `users/${userId}/upcomingTransactions?page[number]=${activePage}&page[size]=2`
            debugger
            getUpcomingTransactions(dispatch,activepageUrl)
            // let filtered = _.filter(upcomingTransactions, function(transaction){
            //     return transaction.id!==id;
            // });
            // dispatch({
            //         payload:{
            //             upcomingTransactions: filtered,
            //     },
            //     type: actionTypes.GET_UPCOMING_TRANSACTIONS,
            // })
            // if(_.isEmpty(result.data)){

            // }else{
            //     dispatch({
            //         paylo
            //     })
            // }
        }
    )
}
