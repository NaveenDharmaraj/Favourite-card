import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import getConfig from 'next/config';
import {
    bool,
    number,
    PropTypes,
    string,
    func,
} from 'prop-types';
import {
    Button,
    Popup,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import {
    resetFlowObject,
} from '../../../actions/give';
import { Link } from '../../../routes';
import GiveFromCampaignModal from '../../Campaign/GiveFromCampaignModal';
import GiveFromGroupModal from '../../Group/GiveFromGroupModal';
import {
    formatCurrency,
} from '../../../helpers/give/utils';
import { withTranslation } from '../../../i18n';
import GroupJoin from '../../Group/GroupJoin';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

// function ProfilePageHead(props) {
class ProfilePageHead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isGiveFromModalOpen: false,
        };
        this.toggleGiveFromGroupModal = this.toggleGiveFromGroupModal.bind(this);
    }

    toggleGiveFromGroupModal() {
        const {
            isGiveFromModalOpen,
        } = this.state;
        const {
            dispatch,
        } = this.props;
        resetFlowObject('group', dispatch);
        this.setState({ isGiveFromModalOpen: !isGiveFromModalOpen });
    }

    render() {
        const {
            hasActiveMatch,
            beneficiariesCount,
            dispatch,
            pageDetails: {
                type,
                id,
                attributes: {
                    fundId,
                    hasCampaignAccess,
                    isAdmin,
                    name,
                    slug,
                    balance,
                    moneyManage,
                },
            },
            pageDetails,
            isAuthenticated,
            t: formatMessage,
            inviteToken,
        } = this.props;
        const {
            isGiveFromModalOpen,
        } = this.state;
        let buttonLink = null;
        let buttonText = null;
        let profileType = '';
        let linkAddress;
        let profileButtonText = '';
        let profileTooltipText = '';
        const currency = 'USD';
        const language = 'en';
        if (type === 'beneficiaries') {
            profileType = 'charity';
        } else if (type === 'groups') {
            profileType = 'group';
            linkAddress = `/groups/${slug}/edit`;
            profileButtonText = formatMessage('campaignProfile:groupButtonText');
            profileTooltipText = formatMessage('campaignProfile:givingGroupText');
        } else if (type === 'campaigns') {
            profileType = 'group';
            linkAddress = `${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/manage-basics`;
            profileButtonText = formatMessage('campaignProfile:campaignButtonText');
            profileTooltipText = formatMessage('campaignProfile:campaignButtonText');
        }
        let popUpContent = '';
        if (hasActiveMatch) {
            popUpContent = formatMessage('campaignProfile:popupMatchingText', {
                Profile: profileButtonText,
                Profiletype: profileTooltipText,
            });
        } else if (!_isEmpty(moneyManage) && moneyManage === 'Campaign Admin') {
            popUpContent = formatMessage('campaignProfile:popupMoneyManageText')
        } else if (balance <= 0) {
            popUpContent = formatMessage('campaignProfile:popupCurrentBalanceText', {
                balance: formatCurrency(balance, language, currency),
                Profiletype: profileButtonText,
            });
        }
        if (pageDetails.attributes) {
            if (isAuthenticated) {
                if ((type === 'groups' || type === 'campaigns') && isAdmin) {
                    buttonText = (
                        <Button className={`blue-bordr-btn-round-def CampaignBtn ${(type === 'campaigns') ? 'campaign_btn_padding' : ''}`}>
                            <span>
                                <i aria-hidden="true" className="edit icon" />
                            </span>
                            {`${formatMessage('campaignProfile:editBtn')} ${profileButtonText}`}
                        </Button>
                    );
                    buttonLink = (
                        <span className="btn_wrapperTop">
                            {(type === 'groups')
                                ? (
                                    <Link route={linkAddress}>
                                        {buttonText}
                                    </Link>
                                ) : (
                                    <a href={(linkAddress)}>
                                        {buttonText}
                                    </a>
                                )}
                            {balance > 0 && !hasActiveMatch && (_isEmpty(moneyManage) || (!_isEmpty(moneyManage) && moneyManage === 'Group Admin'))
                                ? (
                                    // <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                                    //     {/* TODO need to add  functionality for givefromgroup and givefromcampaign */}
                                    //     <Button
                                    //         onClick={() => { resetFlowObject('group', dispatch); }}
                                    //         className="blue-bordr-btn-round-def CampaignBtn">
                                    //         <span>
                                    //             <i aria-hidden="true" className="bell icon" />
                                    //         </span>
                                    //         {`${formatMessage('campaignProfile:giveFromBtn')} ${profileButtonText}`}
                                    //     </Button>
                                    // </Link>
                                    <Fragment>
                                        <Button
                                            onClick={this.toggleGiveFromGroupModal}
                                            className={`blue-bordr-btn-round-def CampaignBtn ${(type === 'campaigns') ? 'campaign_btn_padding' : ''}`}>
                                            <span>
                                                <i aria-hidden="true" className="bell icon" />
                                            </span>
                                            {`${formatMessage('campaignProfile:giveFromBtn')} ${profileButtonText}`}
                                        </Button>
                                        {(type === 'groups')
                                            ? (
                                                <GiveFromGroupModal
                                                    beneficiariesCount={beneficiariesCount}
                                                    groupName={name}
                                                    fundId={fundId}
                                                    groupId={pageDetails.id}
                                                    hasCampaignAccess={hasCampaignAccess}
                                                    isGiveFromModalOpen={isGiveFromModalOpen}
                                                    toggleGiveFromGroupModal={this.toggleGiveFromGroupModal}
                                                />
                                            ) : (
                                                <GiveFromCampaignModal
                                                    campaignId={pageDetails.id}
                                                    campaignName={name}
                                                    fundId={fundId}
                                                    isGiveFromModalOpen={isGiveFromModalOpen}
                                                    toggleGiveFromGroupModal={this.toggleGiveFromGroupModal}
                                                />
                                            )
                                        }
                                    </Fragment>

                                ) : (
                                    <Link route={(`/give/to/${profileType}/${slug}/new`)}>
                                        <Popup
                                            disabled={false}
                                            position="bottom center"
                                            inverted
                                            content={popUpContent}
                                            trigger={
                                                (
                                                    <Button className={`blue-bordr-btn-round-def CampaignBtn hover_disabled ${(type === 'campaigns') ? 'campaign_btn_padding' : ''}`}>
                                                        <span>
                                                            <i aria-hidden="true" className="bell icon" />
                                                        </span>
                                                        {`${formatMessage('campaignProfile:giveFromBtn')} ${profileButtonText}`}
                                                    </Button>
                                                )
                                            }
                                        />
                                    </Link>
                                )
                            }
                        </span>
                    );
                }
            }
        }
        return (
            <Fragment>
                {buttonLink}
                {(type === 'groups' && !isAdmin)
                && (
                    <GroupJoin
                        inviteToken={inviteToken}
                    />
                )}
            </Fragment>
        );
    }
}

ProfilePageHead.defaultProps = {
    beneficiariesCount: null,
    dispatch: () => {},
    inviteToken: '',
    isAuthenticated: false,
    pageDetails: {
        attributes: {
            balance: '',
            fundId: 0,
            hasCampaignAccess: false,
            isAdmin: false,
            moneyManage: '',
            name: '',
            slug: '',
        },
        id: '',
        type: '',
    },
    t: () => {},
};

ProfilePageHead.propTypes = {
    dispatch: func,
    inviteToken: string,
    isAuthenticated: bool,
    pageDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            balance: string,
            fundId: number,
            hasCampaignAccess: bool,
            isAdmin: bool,
            moneyManage: string,
            name: string,
            slug: string,
        }),
        id: string,
        type: string,
    }),
    t: func,
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default withTranslation('campaignProfile')(connect(mapStateToProps)(ProfilePageHead));
