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
import PlaceholderGrid from '../shared/PlaceHolder';

const GiveFromGroupModal = (props) => {
    const {
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
    } = props;
    const divTextForCharity = 'A charity your group supports';
    const divTextForCampaign = 'The campaign your group supports';
    let modalLeftSectionDouble;
    let giveUrl;
    let bgImage;
    let divText;
    let divClassName;
    let disabledDivText;
    const relatedGroupsRoute = (groupsWithMemberships && groupsWithMemberships.data && groupsWithMemberships.data.length > 0) ? (`/give/to/group/new?group_id=${groupId}&source_account_holder_id=${fundId}`) : '';
    if (!_isEmpty(beneficiariesCount) && hasCampaignAccess) {
        modalLeftSectionDouble = (
            <Grid.Column mobile={16} tablet={16} computer={6}>
                <div className="twogivebox">
                    <Link 
                        route={`/give/to/charity/new?group_id=${groupId}&source_account_holder_id=${fundId}`}
                    >
                        <div className="firstgivebox">
                            <Image src={leftmodelimg} />
                            <div className="Givegroup">
                                <b>
                                    {divTextForCharity}
                                </b>
                            </div>
                        </div>
                    </Link>
                    <Link route={`/give/to/group/${slug}/new`}>
                        <div className="secondgivebox">
                            <Image src={leftcampaigngroup} />
                            <div className="Givegroup">
                                <b>
                                    {divTextForCampaign}
                                </b>
                            </div>
                        </div>
                    </Link>
                </div>
            </Grid.Column>
        );
    } else if (!_isEmpty(beneficiariesCount) && !hasCampaignAccess) {
        giveUrl = `/give/to/charity/new?group_id=${groupId}&source_account_holder_id=${fundId}`;
        bgImage = leftmodelimg;
        divText = divTextForCharity;
        divClassName = 'ModelLeftBox';
    } else if (_isEmpty(beneficiariesCount) && hasCampaignAccess) {
        giveUrl = `/give/to/group/new?group_id=${groupId}&source_account_holder_id=${fundId}`;
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
            <Link 
                route={giveUrl}
            >
                <div className={divClassName}>
                    <Image src={bgImage} />
                    <div className="descriptiontext">
                        <b>{divText}</b><br/>
                        {disabledDivText}
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
            trigger={<Button className="blue-bordr-btn-round">Give from this Group</Button>}
            centered
            dimmer="inverted"
        >
            <Modal.Header>Give from: {groupName}</Modal.Header>
            <Modal.Content className="scrollContent">
                {(beneficiariesCount !== undefined) ? (
                    <Grid divided className="fullboxmodelgiv">
                        <Grid.Row>
                            {(!_isEmpty(beneficiariesCount) && hasCampaignAccess) ? modalLeftSectionDouble : modalLeftSectionSingle}
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

