import React from 'react';
import {
    Button,
    Header,
    Image,
} from 'semantic-ui-react';
import {
    number,
    string,
    bool,
    PropTypes,
    func,
} from 'prop-types';
import { connect } from 'react-redux';

import { withTranslation } from '../../../i18n';
import {
    formatCurrency,
} from '../../../helpers/give/utils';

const ActiveMatchBlock = (props) => {
    const {
        activeMatch: {
            balance,
            company,
            companyAvatar,
            matchClose,
            matchPercent,
            maxMatchAmount,
            totalMatch,
        },
        type,
        hasActiveMatch,
        hasMatchingHistory,
        isAuthenticated,
        t: formatMessage,
    } = props;
    if (hasActiveMatch) {
        const currency = 'USD';
        const language = 'en';
        const formattedBalance = formatCurrency(balance, language, currency);
        const formattedmaxMatchAmount = formatCurrency(maxMatchAmount, language, currency);
        const formattedtotalMatch = formatCurrency(totalMatch, language, currency);
        const canSeeMatchingHistory = (isAuthenticated && (type === 'groups') && hasMatchingHistory);
        const updateIndex = () => {
            const {
                dispatch,
                scrollOffset,
            } = props;

            dispatch({
                payload: {
                    activeIndex: 3,
                },
                type: 'GET_GROUP_TAB_INDEX',
            });
            window.scrollTo(0, scrollOffset);
        };

        return (
            <div className="charityInfowrap fullwidth lightGreenBg">
                <div className="charityInfo">
                    <Header as="h4">{formatMessage('groupProfile:matchTextHeading')}</Header>
                    <p>
                        {formatMessage('groupProfile:matchGiveGroupText')}
                        <b>
                            &nbsp;
                            {company}
                            &nbsp;
                        </b>
                        {formatMessage('groupProfile:matchGiftText')}
                        <p>
                            {formatMessage('groupProfile:matchMaxMatchText',
                                {
                                    formattedmaxMatchAmount,
                                })}
                        </p>
                    </p>
                    <div className="matchingFundsWapper">
                        <div className="matchingFundsGraff">
                            <div className="Progresswapper">
                                <div className="customProgress">
                                    <div className="bar">
                                    <span className="progress-inner" style={{ height: `calc(100% - ${matchPercent}%)` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="matchingFundsText">
                            <Header as="h3">{formattedBalance}</Header>
                            <Header as="h5">
                                {formatMessage('groupProfile:matchFundRemaining')}
                            </Header>
                            <div className="total">
                                <p>
                                    {formatMessage('groupProfile:matchProvidedText',
                                        {
                                            company,
                                            formattedtotalMatch,
                                        })}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="MatchingPartnerWapper">
                        <div className="h_profileMatching borderprofile">
                            <Image src={companyAvatar} />
                        </div>
                        <div className="MatchingPartner">
                            <Header as="h3">{company}</Header>
                            <p>{formatMessage('groupProfile:matchingPartner')}</p>
                        </div>
                    </div>
                    {matchClose
                    && (
                        <Button className="white-btn-rounded-def goalbtn">
                            {` ${formatMessage('groupProfile:matchExpires')} ${matchClose}`}
                        </Button>
                    )}
                    {canSeeMatchingHistory
                    && (
                        <p onClick={updateIndex} className="blueHistory">{formatMessage('groupProfile:viewMatchHistoryLink')}</p>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

ActiveMatchBlock.defaultProps = {
    activeMatch: {
        balance: '',
        company: '',
        companyAvatar: '',
        companyId: null,
        matchClose: '',
        matchPercent: null,
        maxMatchAmount: null,
        totalMatch: '',
    },
    dispatch: () => {},
    hasActiveMatch: false,
    hasMatchingHistory: false,
    isAuthenticated: false,
    scrollOffset: 0,
    t: () => {},
    type: '',
};

ActiveMatchBlock.propTypes = {
    activeMatch: PropTypes.shape({
        balance: string,
        company: string,
        companyAvatar: string,
        companyId: number,
        matchClose: string,
        matchPercent: number,
        maxMatchAmount: number,
        totalMatch: string,
    }),
    dispatch: func,
    hasActiveMatch: bool,
    hasMatchingHistory: bool,
    isAuthenticated: bool,
    scrollOffset: number,
    t: func,
    type: string,
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        scrollOffset: state.group.scrollOffset,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(ActiveMatchBlock));
export {
    connectedComponent as default,
    ActiveMatchBlock,
    mapStateToProps,
};
