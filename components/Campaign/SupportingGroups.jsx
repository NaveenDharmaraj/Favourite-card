
import React, { Fragment } from 'react';
import {
    Card,
    Grid,
    Header,
    Icon,
    Image,
    Input,
    Button,
} from 'semantic-ui-react';

import PlaceholderGrid from '../shared/PlaceHolder';
import placeholder from '../../static/images/no-data-avatar-giving-group-profile.png';
import LeftImageCard from '../shared/LeftImageCard';


function SupportingGroups(props) {
    const {
        campaignSubGroupDetails,
        campaignSubGroupsShowMoreUrl,
        seeMoreLoaderStatus,
        subGroupListLoader,
        viewMoreFn,
    } = props;
    const renderGroups = () => {
        const groupCards = [];
        if (typeof campaignSubGroupDetails === 'object') {
            campaignSubGroupDetails.map((subGroup) => {
                groupCards.push(<LeftImageCard
                    entityName={subGroup.attributes.name}
                    placeholder={placeholder}
                    typeClass="chimp-lbl group"
                    type={subGroup.type}
                    url={`/${subGroup.type}/${subGroup.attributes.slug}`}
                />);
            });
        }
        return groupCards;
    };
    return (
        <Fragment>
            <div className="search-wraper pb-2">
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={12} computer={11}>
                            <Input icon="search" placeholder='Search Giving Groups supporting this campaign' className="rounded-input" fluid size="big" />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                
            </div>
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
