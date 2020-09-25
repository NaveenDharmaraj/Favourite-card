import React from 'react';
import { connect } from 'react-redux';
import {
    Header,
    Image,
} from 'semantic-ui-react';
import {
    string,
    func,
    PropTypes,
    bool,
    number,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../i18n';
import {
    formatCurrency,
    formatDateForGivingTools,
} from '../../../helpers/give/utils';

const ExpiredMatchBlock = (props) => {
    const {
        isAuthenticated,
        matchHistory,
        t: formatMessage,
        type,
    } = props;
    const {
        companyAvatar,
        endDate,
        startDate,
        totalMatched,
        companyName,
        totalFund,
    } = matchHistory;
    const language = 'en';
    const currency = 'USD';
    let hasFundLeft = false;
    const formattedTotalMatch = formatCurrency(totalMatched, language, currency);
    const formattedTotalFund = formatCurrency(totalFund, language, currency);
    if (!_isEmpty(totalFund) && !_isEmpty(totalMatched)) {
        hasFundLeft = (parseInt(totalMatched, 10) < parseInt(totalFund, 10));
    }
    const updateIndex = () => {
        const {
            dispatch,
            scrollOffset,
        } = props;
        if (type === 'groups') {
            dispatch({
                payload: {
                    activeIndex: 3,
                },
                type: 'GET_GROUP_TAB_INDEX',
            });
        }
        window.scrollTo(0, scrollOffset);
    };

    return (
        <div className="charityInfowrap fullwidth lightGreenBg">
            <div className="charityInfo">
                <Header as="h4">{formatMessage('groupProfile:expiredMatchThankstext')}</Header>
                <p>
                    {formatMessage('groupProfile:matchingDaysBetweenText', {
                        endDate: formatDateForGivingTools(endDate),
                        startDate: formatDateForGivingTools(startDate),
                    })}
                    <b>
                        {companyName}
                    </b>
                    &nbsp;
                    {formatMessage('groupProfile:expiredMatchedText')}
                </p>
                <div className="matchingFundsWapper">
                    {hasFundLeft
                        ? (
                            <div className="matchingFundsText no_padding">
                                <Header as="h3">{formattedTotalMatch}</Header>
                                <div className="total">
                                    <p>
                                        {formatMessage('groupProfile:expiredMatchProvidedText', {
                                            formattedTotalFund,
                                        })}     &nbsp;
                                            {companyName}
                                    </p>
                                </div>
                            </div>
                        )
                        : (
                            <div className="matchingFundsText no_padding">
                                <Header as="h3">{formattedTotalMatch}</Header>
                                <div className="total">
                                    <p>
                                        {formatMessage('groupProfile:expireMatchedByText')} &nbsp;
                                            {companyName}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="MatchingPartnerWapper">
                    <div className="h_profileMatching borderprofile">
                        <Image src={companyAvatar} />
                    </div>
                    <div className="MatchingPartner">
                        <Header as="h3">{companyName}</Header>
                        <p>{formatMessage('groupProfile:matchingpartner')}</p>
                    </div>
                </div>
                {isAuthenticated
                && (
                    <p onClick={updateIndex} className="blueHistory">{formatMessage('groupProfile:viewMatchHistoryLink')}</p>
                )}
            </div>
        </div>
    );
};

ExpiredMatchBlock.defaultProps = {
    dispatch: () => {},
    isAuthenticated: false,
    matchHistory: {
        companyAvatar: '',
        companyName: '',
        endDate: '',
        startDate: '',
        totalFund: '',
        totalMatched: '',
    },
    scrollOffset: 0,
    t: () => {},
};

ExpiredMatchBlock.propTypes = {
    dispatch: func,
    isAuthenticated: bool,
    matchHistory: PropTypes.shape({
        companyAvatar: string,
        companyName: string,
        endDate: string,
        startDate: string,
        totalFund: string,
        totalMatched: string,
    }),
    scrollOffset: number,
    t: func,
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        scrollOffset: state.group.scrollOffset,
    };
}

const connectedComponent = withTranslation('groupProfile')(connect(mapStateToProps)(ExpiredMatchBlock));
export {
    connectedComponent as default,
    ExpiredMatchBlock,
    mapStateToProps,
};
