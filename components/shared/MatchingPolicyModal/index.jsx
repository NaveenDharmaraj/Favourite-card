import React, { Fragment, useState } from 'react';
import {
    Modal,
    Header,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { formatCurrency } from '../../../helpers/give/utils';

const MatchingPolicyModal = ({
    giveGroupDetails,
    isCampaign,
    matchingPolicyDetails,
}) => {
    const {
        attributes: {
            activeMatch: {
                balance,
                company,
                maxMatchAmount,
                matchClose,
                matchPercent,
                totalMatch,
            }
        }
    } = giveGroupDetails;
    const {
        isValidMatchPolicy,
        matchPolicyTitle,
    } = matchingPolicyDetails;
    const currency = 'USD';
    const language = 'en';
    const formattedBalance = formatCurrency(balance, language, currency);
    const formattedmaxMatchAmount = formatCurrency(maxMatchAmount, language, currency);
    const formattedtotalMatch = formatCurrency(totalMatch, language, currency);
    //setting state for modal open and close
    const [isMatchingPolicyModalOpen, setIsMatchingPolicyModalOpen] = useState(false);

    //Toogle function for modal open and close
    const toggleMatchingPolicyModal = () => {
        setIsMatchingPolicyModalOpen(!isMatchingPolicyModalOpen);
    };
    return (
        <Fragment>
            <div className={`noteDefault ${isValidMatchPolicy ? 'info' : ''} mt-2`}>
                <div className="noteWraper">
                    <span className="leftImg">
                        <span className="notifyDefaultIcon" />
                    </span>
                    <span className="noteContent">
                        {matchPolicyTitle}
                        <span className="hyperLinks-style" onClick={toggleMatchingPolicyModal}> Learn more.</span>
                    </span>
                </div>
            </div>
            <Modal
                className="chimp-modal matching-fund-modal"
                closeIcon
                size="tiny"
                open={isMatchingPolicyModalOpen}
                centered
                onClose={toggleMatchingPolicyModal}
                dimmer="inverted"
            >
                <Modal.Header>Your gift will be matched!</Modal.Header>
                <Modal.Content>
                    <p>
                        For every $1.00 you give to this {isCampaign ? 'campaign' : 'group'},
                <span className="bold">&nbsp;{company}&nbsp;</span>
                        will match your gift with $1.00 up to
                <span className="bold">&nbsp;{formattedmaxMatchAmount}&nbsp;</span>
                        per gift, until the matching funds run out or expire.
            </p>
                    <div className="matching-fund-modal-wrapper">
                        <div className="matching-fund-modal-inner-wrapper">
                            <div className="matching-progress-wrapper">
                                <div className="matching-progress">
                                    <span className="progress-inner" style={{ height: `${matchPercent}%` }} />
                                </div>
                            </div>
                            <div className="matching-fund-details">
                                <Header as="h4">
                                    {formattedBalance}
                                    <Header.Subheader>
                                        matching funds remaining
                            </Header.Subheader>
                                </Header>
                                <p>
                                    of {formattedtotalMatch}
                                    <br />
                                    provided by {company}
                                </p>
                            </div>
                        </div>
                        {((matchClose) && (
                            <div className="matching-fund-expire">
                                <span className="expire-date">
                                    Expires
                                    {matchClose}
                                </span>
                            </div>
                        ))}

                    </div>
                </Modal.Content>
            </Modal>
        </Fragment>
    )
};

MatchingPolicyModal.defaultProps = {
    giveGroupDetails: {
        attributes: {
            activeMatch: {
                balance: '',
                company: '',
                matchClose: '',
                matchPercent: null,
                maxMatchAmount: null,
                totalMatch: '',

            }
        },
    },
    isCampaign: false,
    isMatchingPolicyModalOpen: false,
};

MatchingPolicyModal.propTypes = {
    giveGroupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            activeMatch: PropTypes.shape({
                balance: PropTypes.string,
                company: PropTypes.string,
                matchClose: PropTypes.string,
                matchPercent: PropTypes.number,
                maxMatchAmount: PropTypes.number,
                totalMatch: PropTypes.string,
            }),
        }),
    }),
};

export default MatchingPolicyModal;
