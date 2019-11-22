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
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import placeholder from '../../static/images/no-data-avatar-giving-group-profile.png';

const CampaignSupports = (props) => {
    const {
        campaignSupporting: {
            attributes: {
                avatar,
                city,
                name,
            },
        },
    } = props;
    const imgUrl = !_isEmpty(avatar) ? avatar : placeholder;
    return (
        <Grid.Column mobile={16} tablet={16} computer={5}>
            <div className="profile-social-wraper groupSupportsWraper">
                <div className="groupSupports">
                    <Header as="h3">Campaign this group supports</Header>
                    <List relaxed verticalAlign="middle" className="groupSupportsList">
                        <List.Item>
                            <Image src={imgUrl} />
                            <List.Content>
                                <List.Header as="a">{name}</List.Header>
                                <List.Description>
                                    {city}
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </div>
            </div>
        </Grid.Column>
    );
};

CampaignSupports.defaultProps = {
    campaignSupporting: {
        attributes: {
            avatar: '',
            city: '',
            name: '',
        },
    },
};

CampaignSupports.propTypes = {
    campaignSupporting: {
        attributes: {
            avatar: string,
            city: string,
            name: string,
        },
    },
};

function mapStateToProps(state) {
    return {
        campaignSupporting: state.group.campaignSupporting,
    };
}

export default connect(mapStateToProps)(CampaignSupports);
