import React, { Fragment } from 'react';
import {
    Modal,
    Grid,
    Image,
    Item,
    Responsive,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
    PropTypes,
} from 'prop-types';

import {
    Link,
} from '../../routes';
import '../../static/less/giveFlows.less';
import leftmodelimg from '../../static/images/icons/leftmodelimg.png';
import modelimg1 from '../../static/images/icons/rightmodelimg1.png';
import modelimg2 from '../../static/images/illustration-find-friends.png';
import modelimg3 from '../../static/images/icons/rightmodelimg3.png';
import PlaceholderGrid from '../shared/PlaceHolder';
import { withTranslation } from '../../i18n';

const GiveFromCampaignModal = (props) => {
    const {
        groupsWithMemberships,
        campaignId,
        campaignName,
        campaignRelatedBeneficiariesCount,
        fundId,
        isGiveFromModalOpen,
        toggleGiveFromGroupModal,
        t: formatMessage,
    } = props;
    const relatedBeneficiaryRoute = (campaignRelatedBeneficiariesCount) ? (`/give/to/charity/new?campaign_id=${campaignId}`) : '';
    const relatedGroupsRoute = (groupsWithMemberships && groupsWithMemberships.data && groupsWithMemberships.data.length > 0) ? (`/give/to/group/new?campaign_id=${campaignId}`) : '';
    return (
        <Fragment>
            <Modal
                className="chimp-modal likeToGiveModal"
                closeIcon
                size="small"
                open={isGiveFromModalOpen}
                centered
                onClose={toggleGiveFromGroupModal}
                dimmer="inverted"
            >
                <Modal.Header>
                    {formatMessage('campaignProfile:giveFrom')}
                    {campaignName}
                </Modal.Header>
                <Modal.Content className="scrollContent">
                    { (groupsWithMemberships !== undefined || campaignRelatedBeneficiariesCount !== undefined) ? (
                        <Fragment>
                            <div className="giveingGropPopupHeading">
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={6}>
                                            <div className="giveboxheding">
                                                <p>{formatMessage('campaignProfile:giveTo')}</p>
                                            </div>
                                        </Grid.Column>
                                        <Responsive minWidth={992} maxWidth={2559}>
                                            <Grid.Column mobile={16} tablet={16} computer={10}>
                                                <div className="giveboxheding">
                                                    <p className="rightTop">{formatMessage('campaignProfile:giveboxheading')}</p>
                                                </div>
                                            </Grid.Column>
                                        </Responsive>
                                    </Grid.Row>
                                </Grid>
                            </div>
                            <Grid className="giveingGropPopup">
                                <Grid.Row stretched>
                                    <Grid.Column mobile={16} tablet={16} computer={6}>
                                        <Link route={`/give/to/charity/new?campaign_id=${campaignId}`} >
                                            <div className={(relatedBeneficiaryRoute) ? 'ModelLeftBox' : 'ModelLeftBox graybox isDisabled'}>
                                                <div className="center-content">
                                                    <Image src={leftmodelimg} className="charityImg" />
                                                    <div className="descriptiontext">
                                                        {formatMessage('campaignProfile:charityDescriptiontext')}
                                                        {(!relatedBeneficiaryRoute && (
                                                            <p className="disabled-text">{formatMessage('campaignProfile:charityDescriptionInnertext')}</p>
                                                        ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </Grid.Column>
                                    <Responsive  minWidth={320} maxWidth={991}>
                                        <div className="giveingGropPopupHeading">
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={16} computer={10}>
                                                        <div className="giveboxheding">
                                                            <p className="rightbottom">{formatMessage('campaignProfile:giveboxheadingText')}</p>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </div>
                                    </Responsive>
                                    <Grid.Column mobile={16} tablet={16} computer={10}>
                                        <div className="rightBoxs">
                                            <Item.Group>
                                                <Link route={`/give/to/group/new?campaign_id=${campaignId}`}>
                                                    <Item className={(relatedGroupsRoute) ? '' : 'graybox isDisabled'}>
                                                        <Image src={modelimg1} />
                                                        <Item.Content verticalAlign="middle">
                                                            <Item.Description>
                                                                <p>{formatMessage('campaignProfile:givingGroupMemberText')}</p>
                                                                {(!relatedGroupsRoute && (
                                                                    <p className="disabled-text">{formatMessage('campaignProfile:givingGroupNotaMemberText')}</p>
                                                                ))
                                                                }
                                                            </Item.Description>
                                                        </Item.Content>
                                                    </Item>
                                                </Link>
                                            </Item.Group>
                                        </div>
                                        <div className="rightBoxs">
                                            <Item.Group>
                                                <Link route={`/give/to/friend/new?campaign_id=${campaignId}`}>
                                                    <Item>
                                                        <Image src={modelimg2} />
                                                        <Item.Content verticalAlign='middle'>
                                                            <Item.Description>
                                                                <p>{formatMessage('campaignProfile:friendText')}</p>
                                                            </Item.Description>
                                                        </Item.Content>
                                                    </Item>
                                                </Link>
                                            </Item.Group>
                                        </div>
                                        <div className="rightBoxs">
                                            <Item.Group>
                                                <Link route='/search'>
                                                    <Item>
                                                        <Image src={modelimg3} />
                                                        <Item.Content verticalAlign='middle'>
                                                            <Item.Description>
                                                                <p>{formatMessage('campaignProfile:searchText')}</p>
                                                            </Item.Description>
                                                        </Item.Content>
                                                    </Item>
                                                </Link>
                                            </Item.Group>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Fragment>
                    )
                        : (
                            <PlaceholderGrid
                                column={2}
                            />
                        )
                    }
                </Modal.Content>
            </Modal>
        </Fragment>
    );
};
function mapStateToProps(state) {
    return {
        campaignRelatedBeneficiariesCount: state.profile.campaignRelatedBeneficiariesCount,
        groupsWithMemberships: state.user.groupsWithMemberships,
    };
}

GiveFromCampaignModal.defaultProps = {
    campaignId: '',
    campaignName: '',
    campaignRelatedBeneficiariesCount: null,
    fundId: null,
    groupsWithMemberships: {},  
    isGiveFromModalOpen: false,
    toggleGiveFromGroupModal: () => { },
}

// eslint-disable-next-line react/no-typos
GiveFromCampaignModal.PropTypes = {
    campaignId: PropTypes.string,
    campaignName: PropTypes.string,
    campaignRelatedBeneficiariesCount: PropTypes.number,
    fundId: PropTypes.number,
    groupsWithMemberships: PropTypes.object,
    isGiveFromModalOpen: PropTypes.bool,
    toggleGiveFromGroupModal: PropTypes.func,
}

export default withTranslation('campaignProfile')(connect(mapStateToProps)(GiveFromCampaignModal));
