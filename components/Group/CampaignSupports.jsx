import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    string,
} from 'prop-types';
import {
    Grid,
    List,
    Image,
    Header,
    Popup,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import PlaceholderGrid from '../shared/PlaceHolder';
import placeholder from '../../static/images/no-data-avatar-giving-group-profile.png';
import { Link } from '../../routes';

const CampaignSupports = (props) => {
    const {
        groupDetails: {
            attributes: {
                campaignAvatar: avatar,
                campaignCity: city,
                campaignName: name,
                campaignSlug: slug,
                hasCampaignAccess,
            },
        },
    } = props;
    const imgUrl = !_isEmpty(avatar) ? avatar : placeholder;
    const campaignDetails = (
        <Fragment>
            <Image src={imgUrl} />
            <List.Content>
                <List.Header>{name}</List.Header>
                <List.Description>
                    {city}
                </List.Description>
            </List.Content>
        </Fragment>
    );
    return (
        <Grid.Column mobile={16} tablet={16} computer={5}>
            {!_isEmpty(name)
                ? (
                    <div className="profile-social-wraper groupSupportsWraper">
                        <div className="groupSupports">
                            <Header as="h3">Campaign this group supports</Header>
                            <List relaxed verticalAlign="middle" className="groupSupportsList">
                                {(!hasCampaignAccess)
                                    ? (
                                        <Popup
                                            position="bottom center"
                                            basic
                                            content="This group is private, you need an invitation to join."
                                            trigger={
                                                (
                                                    <List.Item>
                                                        {campaignDetails}
                                                    </List.Item>
                                                )
                                            }
                                        />
                                    ) : (
                                        <Link route={`/campaigns/${slug}`}>
                                            <List.Item as="a">
                                                {campaignDetails}
                                            </List.Item>
                                        </Link>
                                    )
                                }
                            </List>
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
        groupDetails: state.group.groupDetails,
    };
}

export default connect(mapStateToProps)(CampaignSupports);
