import React from 'react';
import { connect } from 'react-redux';
import {
    string,
} from 'prop-types';
import {
    Grid,
    List,
    Image,
    Header,
    Placeholder,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import { Router } from '../../routes';
import PlaceholderGrid from '../shared/PlaceHolder';
import placeholder from '../../static/images/no-data-avatar-giving-group-profile.png';
// import { Link } from '../../routes';

const redirectToCampaign = (props) => {
    const {
        groupDetails: {
            attributes: {
                campaignSlug,
                isCampaignPrivate,
            },
        },
    } = props;
    if (!isCampaignPrivate) {
        Router.pushRoute(`/campaigns/${campaignSlug}`);
    } // else {
    //     Router.pushRoute('/dashboard');
    // }
};

const CampaignSupports = (props) => {
    const {
        groupDetails: {
            attributes: {
                campaignAvatar: avatar,
                campaignCity: city,
                campaignName: name,
                campaignSlug: slug,
                isCampaignPrivate,
            },
        },
    } = props;
    const imgUrl = !_isEmpty(avatar) ? avatar : placeholder;
    return (
        <Grid.Column mobile={16} tablet={16} computer={5}>
            {!_isEmpty(name)
                ? (
                    <div className="profile-social-wraper groupSupportsWraper">
                        <div className="groupSupports">
                            <Header as="h3">Campaign this group supports</Header>
                            <div role="link" tabIndex="0" onKeyDown={() => redirectToCampaign(props)} onClick={() => redirectToCampaign(props)}>
                                <List relaxed verticalAlign="middle" className="groupSupportsList">
                                    <List.Item as="a">
                                        <Image src={imgUrl} />
                                        <List.Content>
                                            <List.Header>{name}</List.Header>
                                            <List.Description>
                                                {city}
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </div>
                        </div>
                    </div>
                ) : (<PlaceholderGrid row={1} column={1} placeholderType="singleCard" />)
            }
        </Grid.Column>
    );
};

CampaignSupports.defaultProps = {
    groupDetails: {
        attributes: {
            campaignAvatar: '',
            campaignCity: '',
            name: '',
        },
    },
};

CampaignSupports.propTypes = {
    groupDetails: {
        attributes: {
            campaignAvatar: string,
            campaignCity: string,
            name: string,
        },
    },
};

function mapStateToProps(state) {
    return {
        // campaignSupporting: state.group.campaignSupporting,
        groupDetails: state.group.groupDetails,
    };
}

export default connect(mapStateToProps)(CampaignSupports);
