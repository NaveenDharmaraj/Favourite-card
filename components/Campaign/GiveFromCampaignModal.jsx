import React, { Fragment } from 'react';
import {
    Button,
    Modal,
    Grid,
    Image,
    Item,
    Responsive,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    Link,
} from '../../routes';
import '../../static/less/giveFlows.less';
import leftmodelimg from '../../static/images/icons/leftmodelimg.png';
import modelimg1 from '../../static/images/icons/rightmodelimg1.png';
import modelimg2 from '../../static/images/illustration-find-friends.png';
import modelimg3 from '../../static/images/icons/rightmodelimg3.png';
import PlaceholderGrid from '../shared/PlaceHolder';

class GiveFromCampaignModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isGiveFromModalOpen: false,
        };
        this.toggleGiveFromModal = this.toggleGiveFromModal.bind(this);
    }

    toggleGiveFromModal() {
        const {
            isGiveFromModalOpen,
        } = this.state;
        this.setState({
            isGiveFromModalOpen: !isGiveFromModalOpen,
        });
    }

    render() {
        const {
            groupsWithMemberships,
            campaignId,
            campaignName,
            campaignRelatedBeneficiariesCount,
            fundId,
        } = this.props;
        const {
            isGiveFromModalOpen,
        } = this.state;
        const relatedBeneficiaryRoute = (campaignRelatedBeneficiariesCount) ? (`/give/to/charity/new?campaign_id=${campaignId}`) : '';
        const relatedGroupsRoute = (groupsWithMemberships && groupsWithMemberships.data && groupsWithMemberships.data.length > 0) ? (`/give/to/group/new?campaign_id=${campaignId}`) : '';
        return (
            <Fragment>
                <Button
                    className="blue-bordr-btn-round"
                    onClick={this.toggleGiveFromModal}
                >
                    Give from this Campaign
                </Button>
                <Modal
                    className="chimp-modal likeToGiveModal"
                    closeIcon
                    size="small"
                    open={isGiveFromModalOpen}
                    centered
                    onClose={this.toggleGiveFromModal}
                    dimmer="inverted"
                >
                    <Modal.Header>Give from: {campaignName}</Modal.Header>
                    <Modal.Content className="scrollContent">
                        { (groupsWithMemberships !== undefined || campaignRelatedBeneficiariesCount !== undefined) ? (
                            <Fragment>
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
                                <Grid className="giveingGropPopup">
                                    <Grid.Row stretched>
                                        <Grid.Column mobile={16} tablet={16} computer={6}>
                                            <Link route={relatedBeneficiaryRoute}>
                                                <div className={(relatedBeneficiaryRoute) ? 'ModelLeftBox' : 'ModelLeftBox graybox'}>
                                                    <Image src={leftmodelimg} />
                                                    <div className="descriptiontext">
                                                        A charity your Campaign supports
                                                        {(!relatedBeneficiaryRoute && (
                                                            <p className="disabled-text">Your Campaign hasn't yet set charities to support</p>
                                                        ))
                                                        }
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
                                                                    <p>A Giving Group that you're a member of </p>
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
    }
}
function mapStateToProps(state) {
    return {
        campaignRelatedBeneficiariesCount: state.profile.campaignRelatedBeneficiariesCount,
        groupsWithMemberships: state.user.groupsWithMemberships,
    };
}
export default connect(mapStateToProps)(GiveFromCampaignModal);
