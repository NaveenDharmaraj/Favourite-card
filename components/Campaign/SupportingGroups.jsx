
import React, { Fragment } from 'react';
import {
    Grid,
    Header,
    Image,
    Button,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import PlaceholderGrid from '../shared/PlaceHolder';
import placeholder from '../../static/images/no-data-avatar-giving-group-profile.png';
import LeftImageCard from '../shared/LeftImageCard';
import noDataImgCampain from '../../static/images/campaignprofile_nodata_illustration.png';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

function SupportingGroups(props) {
    const {
        campaignDetails,
        campaignSubGroupDetails,
        campaignSubGroupsShowMoreUrl,
        seeMoreLoaderStatus,
        subGroupListLoader,
        viewMoreFn,
    } = props;
    const noDataSupportingGroups = () => {
        return (
            <Grid.Column width={16} className="c-w-100">
                <div className="givingGroup noData mt-1 mb-2">
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <Image src={noDataImgCampain} className="noDataLeftImg" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <div className="givingGroupNoDataContent">
                                    <Header as="h4">
                                        <Header.Content>
                                        Support this Campaign by creating a Giving Group
                                            <Header.Subheader>
                                        A Giving Group is like a fundraising page where multiple people can combine forces, pool or raise money, and support causes together.
                                            </Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                    <div>
                                        <a href={`${RAILS_APP_URL_ORIGIN}/campaigns/${campaignDetails.attributes.slug}/step/one`}>
                                            <Button className="success-btn-rounded-def">Create a Giving Group</Button>
                                        </a>
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Grid.Column>
        );
    };

    const renderGroups = () => {
        let groupCards = [];
        if ((typeof campaignSubGroupDetails === 'object') && (campaignSubGroupDetails.length > 0)) {
            campaignSubGroupDetails.map((subGroup) => {
                const groupImg = subGroup.attributes.avatar;
                groupCards.push(<LeftImageCard
                    entityName={subGroup.attributes.name}
                    placeholder={(groupImg) || placeholder}
                    location=""
                    typeClass="chimp-lbl group"
                    type="Giving Groups"
                    url={`/${subGroup.type}/${subGroup.attributes.slug}`}
                />);
            });
        } else {
            groupCards = noDataSupportingGroups();
        }
        return groupCards;
    };
    return (
        <Fragment>
            { subGroupListLoader ? <PlaceholderGrid row={2} column={3} /> : (
                <Grid stackable doubling columns={3}>
                    <Grid.Row>
                        {renderGroups()}
                    </Grid.Row>
                </Grid>
            )
            }
            { (campaignSubGroupsShowMoreUrl) ? (
                <div className="text-center mb-1 mt-1">
                    <Button
                        className="blue-bordr-btn-round-def"
                        onClick={viewMoreFn}
                        loading={!!seeMoreLoaderStatus}
                        disabled={!!seeMoreLoaderStatus}
                        content="View More"
                    />
                </div>
            ) : ''
            }
        </Fragment>
    );
}

export default SupportingGroups;
