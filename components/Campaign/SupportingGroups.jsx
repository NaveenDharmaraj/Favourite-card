
import React, { Fragment } from 'react';
import {
    Grid,
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
                    type="Giving Groups"
                    url={`/${subGroup.type}/${subGroup.attributes.slug}`}
                />);
            });
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
