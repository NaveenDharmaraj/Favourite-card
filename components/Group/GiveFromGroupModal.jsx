import React from 'react';
import {
    Button,
    Modal,
    Grid,
    Image,
    Card,
} from 'semantic-ui-react';

import {
    Link,
} from '../../routes';
import noDataCharity from '../../static/images/no-data-avatar-charity-profile.png';
import noDataGroup from '../../static/images/no-data-avatar-giving-group-profile.png';

const GiveFromGroupModal = () => (
    <Modal
        className="chimp-modal likeToGiveModal"
        closeIcon
        size="tiny"
        trigger={<Button className="blue-bordr-btn-round">Give from this Group</Button>}
        centered
        dimmer="inverted"
    >
        <Modal.Header>
                    Who would you like to give to ?
        </Modal.Header>
        <Modal.Content>
            <Modal.Description className="likeToGive">
                <Grid stackable doubling centered columns={3}>
                    <Grid.Row stretched>
                        <Grid.Column>
                            <Link route='/search?result_type=Beneficiary'>
                                <Card className="likeToGiveCard">
                                    <Image src={noDataCharity} circular />
                                    <Card.Content>
                                        <Card.Header>Find a Charity or Giving Groups</Card.Header>
                                        <Card.Description>
                                            Search for any registered Charity or Giving Group.
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link route='/give/to/friend/new'>
                                <Card className="likeToGiveCard">
                                    <Image src={noDataCharity} circular />
                                    <Card.Content>
                                        <Card.Header>Your Friends and Family</Card.Header>
                                        <Card.Description>
                                            All you need is their email address.
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link route='/search?result_type=Group'>
                                <Card className="likeToGiveCard">
                                    <Image src={noDataGroup} circular />
                                    <Card.Content>
                                        <Card.Header>A Giving Group you belong to</Card.Header>
                                        <Card.Description>
                                            Give to one of the groups you belong to.
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Description>
        </Modal.Content>
    </Modal>
);

export default GiveFromGroupModal;
