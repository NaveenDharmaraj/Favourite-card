import React from 'react';
import {
    Modal,
    Grid,
    Image,
    Item,
    Responsive,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import {
    Link,
} from '../../routes';
import '../../static/less/giveFlows.less';
import { withTranslation } from '../../i18n';
import leftmodelimg from '../../static/images/icons/leftmodelimg.png';
import leftcampaigngroup from '../../static/images/givinggroup_banner.png';
import modelimg1 from '../../static/images/icons/rightmodelimg1.png';
import modelimg2 from '../../static/images/illustration-find-friends.png';
import modelimg3 from '../../static/images/icons/rightmodelimg3.png';
import PlaceholderGrid from '../shared/PlaceHolder';

const GiveFromGroupModal = (props) => {
    const {
        toggleGiveFromGroupModal,
        groupsWithMemberships,
        beneficiariesCount,
        groupDetails: {
            attributes: {
                campaignSlug: slug,
            },
        },
        groupName,
        groupId,
        fundId,
        hasCampaignAccess,
        isGiveFromModalOpen,
        t: formatMessage,
    } = props;
    const divTextForCharity = formatMessage('groupProfile:divTextForCharity');
    const divTextForCampaign = formatMessage('groupProfile:divTextForCampaign');
    let modalLeftSectionDouble;
    let giveUrl = `/give/to/charity/new?group_id=${groupId}`;
    let imgClass;
    let bgImage;
    let divText;
    let divClassName;
    let disabledDivText;
    const relatedGroupsRoute = (groupsWithMemberships && groupsWithMemberships.data && groupsWithMemberships.data.length > 0) ? (`/give/to/group/new?group_id=${groupId}`) : '';
    if (!_isEmpty(beneficiariesCount) && hasCampaignAccess) {
        modalLeftSectionDouble = (
            <Grid.Column mobile={16} tablet={16} computer={6}>
                <div className="ModeLeftBoxTwo">
                    <Link route={`/give/to/charity/new?group_id=${groupId}`}>
                        <div className="ModelLeftBoxTop ">
                            <Image src={leftmodelimg} />
                            <div className="descriptiontext">
                                {divTextForCharity}
                            </div>
                        </div>
                    </Link>
                    <Link route={`/give/to/group/${slug}/new?groupCampaign_id=${groupId}`}>
                        <div className="ModelLeftBoxBottom ">
                            <Image src={leftcampaigngroup} />
                            <div className="descriptiontext">
                                {divTextForCampaign}
                            </div>
                        </div>
                    </Link>
                </div>
            </Grid.Column>
        );
    } else if (!_isEmpty(beneficiariesCount) && !hasCampaignAccess) {
        giveUrl = `/give/to/charity/new?group_id=${groupId}`;
        bgImage = leftmodelimg;
        imgClass = "charityImg";
        divText = divTextForCharity;
        divClassName = 'ModelLeftBox';
    } else if (_isEmpty(beneficiariesCount) && hasCampaignAccess) {
        giveUrl = `/give/to/group/${slug}/new`;
        imgClass = "grpImg";
        bgImage = leftcampaigngroup;
        divText = divTextForCampaign;
        divClassName = 'Givegroupimg ModelLeftBox';
    } else if (_isEmpty(beneficiariesCount) && !hasCampaignAccess) {
        bgImage = leftmodelimg;
        divText = divTextForCharity;
        imgClass = "charityImg";
        divClassName = 'ModelLeftBox graybox isDisabled';
        disabledDivText = formatMessage('groupProfile:disabledDivText');
    }
    const modalLeftSectionSingle = (
        <Grid.Column mobile={16} tablet={16} computer={6}>
            <Link route={giveUrl}>
                <div className={divClassName}>
                    <div className="center-content">
                        <Image src={bgImage} className={imgClass}/>
                        <div className="descriptiontext">
                            {divText}
                            {((disabledDivText) && (
                                <p className="disabled-text">{disabledDivText}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
        </Grid.Column>
    );
    return (
        <Modal
            className="chimp-modal likeToGiveModal"
            closeIcon
            size="small"
            open={isGiveFromModalOpen}
            onClose={toggleGiveFromGroupModal}
            centered
            dimmer="inverted"
        >
            <Modal.Header>
                {formatMessage('groupProfile:giveFrom')}
                {groupName}
            </Modal.Header>
            <Modal.Content className="scrollContent">
                <div className="giveingGropPopupHeading">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={16} computer={6}>
                                <div className="giveboxheding">
                                    <p>{formatMessage('groupProfile:giveTo')}</p>
                                </div>
                            </Grid.Column>
                            <Responsive minWidth={992} maxWidth={2559}>
                                <Grid.Column mobile={16} tablet={16} computer={10}>
                                    <div className="giveboxheding">
                                        <p className="rightTop">{formatMessage('groupProfile:giveboxheadingOne')}</p>
                                    </div>
                                </Grid.Column>
                            </Responsive>
                        </Grid.Row>
                    </Grid>
                </div>
                {(beneficiariesCount !== undefined) ? (
                    
                    <Grid className="giveingGropPopup">
                        <Grid.Row stretched>
                            {(!_isEmpty(beneficiariesCount) && hasCampaignAccess) ? modalLeftSectionDouble : modalLeftSectionSingle}

                            <Responsive minWidth={320} maxWidth={991}>
                                <div className="giveingGropPopupHeading">
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column mobile={16} tablet={16} computer={10}>
                                                <div className="giveboxheding">
                                                    <p className="rightbottom"> 
                                                        {formatMessage('groupProfile:giveboxheadingTwo')} 
                                                    </p>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </div>
                            </Responsive>
                            <Grid.Column mobile={16} tablet={16} computer={10}>
                                <div className="rightBoxs">
                                    <Item.Group>
                                        <Link route={`/give/to/group/new?group_id=${groupId}`}>
                                            <Item className={(relatedGroupsRoute) ? '' : 'graybox isDisabled'}>
                                                <Image src={modelimg1} />
                                                <Item.Content verticalAlign='middle'>
                                                    <Item.Description>
                                                        <p>{formatMessage('groupProfile:givingGroupMemberText')}</p>
                                                        {(!relatedGroupsRoute && (
                                                            <p className="disabled-text">{formatMessage('groupProfile:givingGroupNotMemberText')}</p>
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
                                        <Link route={`/give/to/friend/new?group_id=${groupId}`}>
                                            <Item>
                                                <Image src={modelimg2} />
                                                <Item.Content verticalAlign='middle'>
                                                    <Item.Description>
                                                        <p>{formatMessage('groupProfile:friendText')}</p>
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
                                                        <p>{formatMessage('groupProfile:searchText')}</p>
                                                    </Item.Description>
                                                </Item.Content>
                                            </Item>
                                        </Link>
                                    </Item.Group>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
                    : (
                        <PlaceholderGrid
                            column={2}
                        />
                    )
                }
            </Modal.Content>
        </Modal>
    );
};
function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        groupsWithMemberships: state.user.groupsWithMemberships,

    };
}
export default withTranslation('groupProfile')(connect(mapStateToProps)(GiveFromGroupModal));

