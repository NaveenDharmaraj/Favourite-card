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
    } = props;
    const divTextForCharity = 'A charity your group supports';
    const divTextForCampaign = 'The campaign your group supports';
    let modalLeftSectionDouble;
    let giveUrl;
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
                    <Link route={`/give/to/group/${slug}/new`}>
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
        divText = divTextForCharity;
        divClassName = 'ModelLeftBox';
    } else if (_isEmpty(beneficiariesCount) && hasCampaignAccess) {
        giveUrl = `/give/to/group/${slug}/new`;
        bgImage = leftcampaigngroup;
        divText = divTextForCampaign;
        divClassName = 'Givegroupimg';
    } else if (_isEmpty(beneficiariesCount) && !hasCampaignAccess) {
        bgImage = leftmodelimg;
        divText = divTextForCharity;
        divClassName = 'ModelLeftBox graybox';
        disabledDivText = 'Your group hasn\'t yet set any charities to support';
    }
    const modalLeftSectionSingle = (
        <Grid.Column mobile={16} tablet={16} computer={6}>
            <Link route={giveUrl}>
                <div className={divClassName}>
                    <Image src={bgImage} />
                    <div className="descriptiontext">
                        {divText}
                        <p className="disabled-text">{disabledDivText}</p>
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
            <Modal.Header>Give from: {groupName}</Modal.Header>
            <Modal.Content className="scrollContent">
                <div className="giveingGropPopupHeading">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={16} computer={6}>
                                <div className="giveboxheding">
                                    <p>Give to:</p>
                                </div>
                            </Grid.Column>
                            <Responsive minWidth={992} maxWidth={2559}>
                                <Grid.Column mobile={16} tablet={16} computer={10}>
                                    <div className="giveboxheding">
                                        <p className="rightTop">Or, find someone else to give to:</p>
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

                            <Responsive  minWidth={320} maxWidth={991}>
                                <div className="giveingGropPopupHeading">
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column mobile={16} tablet={16} computer={10}>
                                                <div className="giveboxheding">
                                                    <p className="rightbottom"> Or, find someone else to give to: </p>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </div>
                            </Responsive>
                            <Grid.Column mobile={16} tablet={16} computer={10}>
                                <div className="rightBoxs">
                                    <Item.Group>
                                        <Link route={relatedGroupsRoute}>
                                            <Item className={(relatedGroupsRoute) ? '' : 'graybox'}>
                                                <Image src={modelimg1} />
                                                <Item.Content verticalAlign='middle'>
                                                    <Item.Description>
                                                        <p>Another Giving Group that you're a member of </p>
                                                        {(!relatedGroupsRoute && (
                                                            <p className="disabled-text">It looks like you're not yet a member of any other groups</p>
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
                                                        <p> One of your friends on Charitable Impact</p>
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
                                                        <p> A different charity, Giving Group, or Campaign that you want to search for</p>
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
export default connect(mapStateToProps)(GiveFromGroupModal);

