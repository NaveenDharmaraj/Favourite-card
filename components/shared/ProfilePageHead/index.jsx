import React, { Fragment } from 'react';
import _ from 'lodash';
import {
    Grid,
    Container,
    Image,
    Button,
    Header,
    Dropdown,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import {
    resetFlowObject,
} from '../../../actions/give';
import { Link } from '../../../routes';
import GiveFromCampaignModal from '../../Campaign/GiveFromCampaignModal';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class ProfilePageHead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropDownClicked: false,
        };
        this.onOpenDropdown = this.onOpenDropdown.bind(this);
        this.onCloseDropdown = this.onCloseDropdown.bind(this);
    }

    onOpenDropdown() {
        this.setState({
            isDropDownClicked: true,
        });
    }

    onCloseDropdown() {
        this.setState({
            isDropDownClicked: false,
        });
    }

    render() {
        const {
            pageDetails,
            isAuthenticated,
            dispatch,
        } = this.props;
        const {
            isDropDownClicked,
        } = this.state;
        let buttonLink = null;
        let getCauses = null;
        let profileType = pageDetails.type;
        if (pageDetails.type === 'beneficiaries') {
            profileType = 'charity';
        } else if (pageDetails.type === 'campaigns') {
            profileType = 'group';
        }
        if (pageDetails.attributes) {
            if (isAuthenticated) {
                buttonLink = (
                    <Fragment>
                        <Link route={(`/give/to/${profileType}/${pageDetails.attributes.slug}/new`)}>
                            <Button primary onClick={() => { resetFlowObject('group', dispatch); }} className="blue-btn-rounded btn_first">Give</Button>
                        </Link>
                        { pageDetails.attributes.isAdmin && (
                            <GiveFromCampaignModal
                                campaignId={pageDetails.id}
                                campaignName={pageDetails.attributes.name}
                                fundId={pageDetails.attributes.fundId}
                            />
                        )
                        }
                        <div className={`gpRightButtons Iconbtnright ${isDropDownClicked ? 'icon_bg' : ''}`}>
                            <Dropdown
                                floating
                                icon="setting Iconsetting"
                                onOpen={this.onOpenDropdown}
                                onClose={this.onCloseDropdown}
                            >
                                <Dropdown.Menu className="give_group_menu">
                                    {pageDetails.attributes.isAdmin
                                        && (
                                            <Dropdown.Item
                                                tag="a"
                                                text="Edit campaign"
                                                href={(`${RAILS_APP_URL_ORIGIN}/campaigns/${pageDetails.attributes.slug}/manage-basics`)}
                                            />
                                        )}
                                    <Dropdown.Item
                                        text="Create group"
                                        href={`${RAILS_APP_URL_ORIGIN}/campaigns/${pageDetails.attributes.slug}/step/one`}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Fragment>
                );
            } else {
                buttonLink = (
                    <Fragment>
                        <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/${profileType}/${pageDetails.attributes.slug}`)}>
                            <Button primary className="blue-btn-rounded">Give</Button>
                        </a>
                        <a href={`${RAILS_APP_URL_ORIGIN}/campaigns/${pageDetails.attributes.slug}/step/one`}>
                            <Button className="blue-bordr-btn-round">Create Group</Button>
                        </a>
                    </Fragment>
                );
            }
        }
        if (!_.isEmpty(pageDetails.attributes.causes)) {
            getCauses = pageDetails.attributes.causes.map((cause) => (
                <span className="badge">
                    {cause.display_name}
                </span>
            ));
        }
        return (
            <div className="profile-header">
                <Container>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={3} computer={2} largeScreen={2}>
                                <div className="profile-img-rounded">
                                    <div className="pro-pic-wraper">
                                        <Image
                                            circular
                                            src={pageDetails.attributes.avatar}
                                        />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={13} computer={6} largeScreen={7}>
                                <div className="ProfileHeaderWraper">
                                    <Header as="h3">
                                        {pageDetails.attributes.name}
                                        <Header.Subheader>
                                            {pageDetails.attributes.location}
                                        </Header.Subheader>
                                    </Header>
                                    <div className="badge-group">
                                        {getCauses}
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={16} computer={8} largeScreen={7}>
                                <div className="buttonWraper campaignBtns text-center-sm">
                                    {buttonLink}
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}
export default ProfilePageHead;
