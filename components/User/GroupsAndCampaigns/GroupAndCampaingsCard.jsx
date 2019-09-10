import React from 'react';
import {
    Image,
    Header,
    Grid,
    Button,
    Card,
    Dropdown
} from 'semantic-ui-react'
import { Link } from '../../../routes';
import placeholder from '../../../static/images/no-data-avatar-giving-group-profile.png';
import LeaveModal from './LeaveModal';

class GroupsAndCampaignsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.openModal = this.openModal.bind(this);
        this.close = this.close.bind(this);
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
        return(
            <Grid.Column>
                <Card className="left-img-card" fluid>
                    <Card.Header>
                        <Grid verticalAlign="middle">
                            <Grid.Column width={6}>
                                <Image src={displayAvatar} />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Grid columns="2">
                                    <Grid.Row style={{padding:'0.5rem 0rem'}}>
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
                                                                    <Dropdown.Item text="Leave Group" onClick={()=>{this.openModal()}}/>
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
                                                                />
                                                            )
                                                        }
                                                    </Header.Subheader>
                                                </Header.Content>
                                            </Header>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <Header as="h4" style={{margin:'0rem 0rem .5rem'}}>
                                    <Header.Content>
                                        {name}
                                        <br />
                                        {location}
                                    </Header.Content>
                                </Header>
                                <Link className="lnkChange" route={`/${urlType}/${slug}`}>
                                    <Button className="btn-small-white-border">View</Button>
                                </Link>
                            </Grid.Column>
                        </Grid>
                    </Card.Header>
                </Card>
            </Grid.Column>
        );
    }
}

export default GroupsAndCampaignsCard;
