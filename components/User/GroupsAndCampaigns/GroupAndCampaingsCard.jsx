import React from 'react';
import {
    Image,
    Header,
    Grid,
    Button,
    Card,
    Dropdown
} from 'semantic-ui-react';
import _ from 'lodash';

import { Link } from '../../../routes';
import placeholder from '../../../static/images/no-data-avatar-giving-group-profile.png';

import LeaveModal from '../../shared/LeaveModal';
import { renderText } from '../../../helpers/utils';

class GroupsAndCampaignsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.openModal = this.openModal.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props, prevProps)) {
            if (this.props.closeLeaveModal === true) {
                this.setState({
                    open: false,
                });
            }
        }
    }

    openModal() {
        this.setState({
            open: true,
        });
    }

    close() {
        this.setState({
            open: false,
        });
    }

    render() {
        const {
            listingType,
            data,
            errorMessage,
            leaveButtonLoader,
            closeLeaveModal,
        } = this.props;
        const {
            dropDownOpen,
        } = this.state;
        const {
            attributes:{
                avatar,
                name,
                location,
                slug,
            },
            id,
        } = data;
        const shortName = renderText(name, 3);
        const urlType = (listingType === 'administeredCampaigns') ? 'campaigns' : 'groups';
        const editLink = (listingType === 'administeredCampaigns') ? `/campaigns/${slug}/manage-basics` : `/groups/${slug}/edit`;
        let showError = false;
        let showMangeGroups = false;
        if (!_.isEmpty(errorMessage) && errorMessage.id === id) {
            showError = true;
            if (errorMessage.adminError) {
                showMangeGroups = true;
            }
        }
        const displayAvatar = (!_.isEmpty(avatar)) ? avatar : placeholder;
        return (
            <Grid.Column>
                <Card className="left-img-card" fluid>
                    <Card.Header>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={6}>
                                    <Image src={displayAvatar} />
                                </Grid.Column>
                                <Grid.Column width={10} className="ml-0">
                                    <Grid columns="2">
                                        <Grid.Row style={{padding:'1.7rem 0rem 0.2rem'}}>
                                            <Grid.Column>
                                                <Header as="h4">
                                                    <Header.Content>
                                                        <Header.Subheader className="chimp-lbl group">giving group</Header.Subheader>
                                                    </Header.Content>
                                                </Header>
                                            </Grid.Column>
                                            <Grid.Column textAlign="right">
                                                <Header as="h4">
                                                    <Header.Content>
                                                        <Header.Subheader>
                                                            <Dropdown
                                                                className="rightBottom"
                                                                icon="ellipsis horizontal"
                                                                closeOnBlur
                                                            >
                                                                <Dropdown.Menu>
                                                                    {
                                                                        (listingType !== 'groupsWithMemberships')
                                                                        && (
                                                                            <Link route={editLink}>
                                                                                <Dropdown.Item text="Edit Group"/>
                                                                            </Link>
                                                                        )
                                                                    }
                                                                    {
                                                                        (listingType !== 'administeredCampaigns') &&
                                                                        <Dropdown.Item text="Leave Group" onClick={() => { this.openModal(); }} />
                                                                    }
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                            {
                                                                this.state.open && (
                                                                    <LeaveModal
                                                                        showError={showError}
                                                                        showMangeGroups={showMangeGroups}
                                                                        slug={slug}
                                                                        name={name}
                                                                        id={id}
                                                                        callLeaveGroup={this.props.parentLeaveGroup}
                                                                        close={this.close}
                                                                        open={this.state.open}
                                                                        errorMessage={errorMessage}
                                                                        leaveButtonLoader={leaveButtonLoader}
                                                                    />
                                                                )
                                                            }
                                                        </Header.Subheader>
                                                    </Header.Content>
                                                </Header>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                    <Header as="h4" style={{margin:'0rem 0.5rem .5rem 0rem'}}>
                                        <Header.Content>
                                            {shortName}
                                            <br />
                                            {location}
                                        </Header.Content>
                                    </Header>
                                    <Link className="lnkChange" route={`/${urlType}/${slug}`}>
                                        <Button className="btn-small-white-border">View</Button>
                                    </Link>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Header>
                </Card>
            </Grid.Column>
        );
    }
}

export default GroupsAndCampaignsCard;
