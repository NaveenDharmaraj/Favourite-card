import React from 'react';
import {
    Button,
    Modal,
    Grid,
    Image,
    Item,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    Link,
} from '../../routes';
import '../../static/less/giveFlows.less';
import leftmodelimg from '../../static/images/icons/leftmodelimg.png';
import modelimg1 from '../../static/images/icons/rightmodelimg1.png';
import modelimg2 from '../../static/images/icons/rightmodelimg2.png';
import modelimg3 from '../../static/images/icons/rightmodelimg3.png';

const GiveFromCampaignModal = (props) => {
    const {
        campaignName,
        campaignRelatedBeneficiaries,
        fundId,
    } = props;
    return (
        <Modal
            className="chimp-modal likeToGiveModal"
            closeIcon
            size="small"
            trigger={<Button className="blue-bordr-btn-round">Give from this Campaign</Button>}
            centered
            dimmer="inverted"
        >
            <Modal.Header>Give from: {campaignName}</Modal.Header>
            <Modal.Content className="scrollContent">
                <Grid divided className="fullboxmodel">
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={16} computer={6}>
                            <Link route={`/give/to/charity/new?source_account_holder_id=${fundId}`}>
                                {/* Should check for related beneficiary */}
                                <div className="ModelLeftBox">
                                    <Image src={leftmodelimg} />
                                    <div className="descriptiontext">
                                    A charity your campaign supports
                                    </div>
                                </div>
                            </Link>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={10}>
                            <div className="rightbox">
                                <Item.Group>
                                    <Link route={`/give/to/group/new?source_account_holder_id=${fundId}`}>
                                        <Item>
                                            <Image src={modelimg1} />
                                            <Item.Content verticalAlign='middle'>
                                                <Item.Description>
                                                    <p>A Giving Group that you're a member of </p>
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
        campaignRelatedBeneficiaries: state.profile.campaignRelatedBeneficiaries,
    };
}
export default connect(mapStateToProps)(GiveFromCampaignModal);
