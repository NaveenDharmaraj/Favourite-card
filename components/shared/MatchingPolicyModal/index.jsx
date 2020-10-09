import React, { Fragment, useState } from 'react';
import {
    Modal,
    Header,
    Grid,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { formatCurrency } from '../../../helpers/give/utils';

const MatchingPolicyModal = ({
    matchingDetails,
    isCampaign,
    matchingPolicyDetails,
}) => {
    const {
        balance,
        company,
        maxMatchAmount,
        matchClose,
        matchPercent,
        totalMatch,
    } = matchingDetails;
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
    console.log()
    return (
        <Fragment>
            <div className={`noteDefault ${isValidMatchPolicy ? 'info' : ''} mt-2`}>
                <div className="noteWraper">
                    <span className="leftImg">
                        <span className="notifyDefaultIcon purpleIcon" />
                    </span>
                    <span className="noteContent">
                        {matchPolicyTitle}
                        {(isValidMatchPolicy && (
                            <span className="hyperLinks-style" onClick={toggleMatchingPolicyModal}> Learn more.</span>
                        ))}
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
                        When you give to this
                        {isCampaign ? ' Campaign' : ' group'}
                        ,
                        <span className="bold">
                            &nbsp;
                            {company}
                            &nbsp;
                        </span>
                        will match your gift $1.00 for $1.00.
                    </p>
                    <p>
                        Gifts to this
                        {isCampaign ? ' Campaign ' : ' group '}
                        will be matched up to a maximum of
                        <span className="bold">
                            &nbsp;
                            {formattedmaxMatchAmount}
                            &nbsp;
                        </span>
                            per donor until matching funds run out or expire.
                    </p>
                    <div className="matching-fund-modal-wrapper">                       
                        <Grid>
                            <Grid.Column computer={10} mobile={16} tablet={16}>
                                <div className="matching-fund-modal-inner-wrapper">
                                    <div className="matching-progress-wrapper">
                                        <div className="matching-progress">
                                            <div className="progress-inner-wrapper">
                                                <span className="progress-inner" style={{ height: `calc(100% - ${matchPercent}%)` }} />
                                            </div>
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
                            </Grid.Column>
                            <Grid.Column computer={6} mobile={16} tablet={16}>
                                {((matchClose) && (
                                    <div className="matching-fund-expire">
                                        <span className="expire-date">
                                            Expires&nbsp;
                                            {matchClose}
                                        </span>
                                    </div>
                                ))}
                            </Grid.Column>
                        </Grid>
                    </div>
                </Modal.Content>
            </Modal>
        </Fragment>
    )
};

MatchingPolicyModal.defaultProps = {

    matchingDetails: {
        balance: '',
        company: '',
        matchClose: '',
        matchPercent: null,
        maxMatchAmount: null,
        totalMatch: '',
    },
    isCampaign: false,
    isMatchingPolicyModalOpen: false,
};

MatchingPolicyModal.propTypes = {
    matchingDetails: PropTypes.shape({
        balance: PropTypes.string,
        company: PropTypes.string,
        matchClose: PropTypes.string,
        matchPercent: PropTypes.number,
        maxMatchAmount: PropTypes.number,
        totalMatch: PropTypes.string,
    }),
    isCampaign: PropTypes.bool,
    isMatchingPolicyModalOpen: PropTypes.bool,

};

export default MatchingPolicyModal;
