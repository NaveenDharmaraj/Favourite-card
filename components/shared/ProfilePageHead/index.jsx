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
                },
            },
            pageDetails,
            isAuthenticated,
            t: formatMessage,
        } = this.props;
        const {
            isGiveFromModalOpen,
        } = this.state;
        let buttonLink = null;
        let profileType = '';
        let linkAddress;
        let profileButtonText = '';
        const currency = 'USD';
        const language = 'en';
        if (type === 'beneficiaries') {
            profileType = 'charity';
        } else if (type === 'groups') {
            profileType = 'group';
            linkAddress = `${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit`;
            profileButtonText = formatMessage('campaignProfile:groupButtonText');
        } else if (type === 'campaigns') {
            profileType = 'group';
            linkAddress = `${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/manage-basics`;
            profileButtonText = formatMessage('campaignProfile:campaignButtonText');
        }
        if (pageDetails.attributes) {
            if (isAuthenticated) {
                if ((type === 'groups' || type === 'campaigns') && isAdmin) {
                    buttonLink = (
                        <span className="btn_wrapperTop">
                            <a href={(linkAddress)}>
                                <Button className={`blue-bordr-btn-round-def CampaignBtn ${(type === 'campaigns') ? 'campaign_btn_padding' : ''}`}>
                                    <span>
                                        <i aria-hidden="true" className="edit icon" />
                                    </span>
                                    {`${formatMessage('campaignProfile:editBtn')} ${profileButtonText}`}
                                </Button>
                            </a>
                            {balance > 0 && !hasActiveMatch
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
                                            content={hasActiveMatch ? formatMessage('campaignProfile:popupMatchingText', {
                                                Profiletype: profileButtonText.toLowerCase(),
                                            }) : formatMessage('campaignProfile:popupCurrentBalanceText', {
                                                balance: formatCurrency(balance, language, currency),
                                                Profiletype: profileButtonText.toLowerCase(),
                                            })}
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
                    <GroupJoin />
                )}
            </Fragment>
        );
    }
}

ProfilePageHead.defaultProps = {
    beneficiariesCount: null,
    dispatch: () => {},
    isAuthenticated: false,
    pageDetails: {
        attributes: {
            balance: '',
            fundId: 0,
            hasCampaignAccess: false,
            isAdmin: false,
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
    isAuthenticated: bool,
    pageDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            balance: string,
            fundId: number,
            hasCampaignAccess: bool,
            isAdmin: bool,
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
