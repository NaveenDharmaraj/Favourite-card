import React from 'react';
import {
    Button,
    Modal,
    Grid,
    Image,
    Item,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import {
    Link,
} from '../../routes';
import '../../static/less/giveFlows.less';
import leftmodelimg from '../../static/images/icons/leftmodelimg.png';
import leftcampaigngroup from '../../static/images/icons/leftmodelimg2.png';
import modelimg1 from '../../static/images/icons/rightmodelimg1.png';
import modelimg2 from '../../static/images/icons/rightmodelimg2.png';
import modelimg3 from '../../static/images/icons/rightmodelimg3.png';

const GiveFromGroupModal = (props) => {
    const {
        administeredGroups,
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
    } = props;
    let leftBox;
    const relatedGroupsRoute = (administeredGroups && administeredGroups.data && administeredGroups.data.length > 0) ? (`/give/to/group/new?group_id=${groupId}&source_account_holder_id=${fundId}`) : '';
    if (!_isEmpty(beneficiariesCount) && hasCampaignAccess) {
        leftBox = (
            <Grid.Column mobile={16} tablet={16} computer={6}>
                <div className="twogivebox">
                    <Link 
                        route={`/give/to/charity/new?group_id=${groupId}&source_account_holder_id=${fundId}`}
                    >
                        <div className="firstgivebox">
                            <Image src={leftmodelimg} />
                            <div className="Givegroup">
                                <b>A charity your group supports</b>
                            </div>
                        </div>
                    </Link>
                    <Link route={`/give/to/group/${slug}/new`}>
                        <div className="secondgivebox">
                            <Image src={leftcampaigngroup} />
                            <div className="Givegroup">
                                <b>The campaign your group supports</b>
                            </div>
                        </div>
                    </Link>
                </div>
            </Grid.Column>
        );
    } else if (!_isEmpty(beneficiariesCount) && !hasCampaignAccess) {
        leftBox = (
            <Grid.Column mobile={16} tablet={16} computer={6}>
                <Link 
                    route={`/give/to/charity/new?group_id=${groupId}&source_account_holder_id=${fundId}`}
                >
                    <div className="ModelLeftBox">
                        <Image src={leftmodelimg} />
                        <div className="descriptiontext">
                            <b>A charity your group supports</b>
                        </div>
                    </div>
                </Link>
            </Grid.Column>
        );
    } else if (_isEmpty(beneficiariesCount) && hasCampaignAccess) {
        leftBox = (
            <Grid.Column mobile={16} tablet={16} computer={6}>
                <div className="giveboxheding">
                    <p>Give to:</p>
                </div>
                <div className="Givegroupimg">
                    <Image src={leftcampaigngroup} />
                    <div className="Givegroup">
                    The campaign your group supports
                    </div>
                </div>
            </Grid.Column>
        );
    } else if (_isEmpty(beneficiariesCount) && !hasCampaignAccess) {
        leftBox = (
            <Grid.Column mobile={16} tablet={16} computer={6}>
                <div className="ModelLeftBox graybox">
                    <Image src={leftmodelimg} />
                    <div className="descriptiontext">
                        <b>A charity your group supports</b>
                    Your group hasn't yes set any charities to support
                    </div>
                </div>
                
            </Grid.Column>
        );
    }
    return (
        <Modal
            className="chimp-modal likeToGiveModal"
            closeIcon
            size="small"
            trigger={<Button className="blue-bordr-btn-round">Give from this Group</Button>}
            centered
            dimmer="inverted"
        >
            <Modal.Header>Give from: {groupName}</Modal.Header>
            <Modal.Content className="scrollContent">
                <Grid divided className="fullboxmodelgiv">
                    <Grid.Row>
                        {leftBox}
                        <Grid.Column mobile={16} tablet={16} computer={10}>
                            <div className="rightbox">
                                <Item.Group>
                                    <Link route={relatedGroupsRoute}>
                                        <Item className={relatedGroupsRoute ? '' : 'graybox'}>
                                            <Image src={modelimg1} />
                                            <Item.Content verticalAlign='middle'>
                                                <Item.Description>
                                                    <p>Another Giving Group that you're a member of </p>
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>
                                    </Link>
                                    <Link route='/give/to/friend/new'>
                                        <Item>
                                            <Image src={modelimg2} />
                                            <Item.Content verticalAlign='middle'>
                                                <Item.Description>
                                                    <p> One of your friends on Charitable Impact</p>
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>
                                    </Link>
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
            </Modal.Content>
        </Modal>
    );
};
function mapStateToProps(state) {
    return {
        administeredGroups: state.user.administeredGroups,
        groupDetails: state.group.groupDetails,

    };
}
export default connect(mapStateToProps)(GiveFromGroupModal);

