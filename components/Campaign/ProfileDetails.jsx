/* eslint-disable react/prop-types */
import React from 'react';
import {
    Container,
    Grid,
    Tab,
} from 'semantic-ui-react';

import ImageGallery from '../shared/ImageGallery';

import SupportingGroups from './SupportingGroups';

function ProfileDetails(props) {
    const panes = [
        {
            menuItem: 'About',
            render: () => {
                const {
                    campaignDetails: {
                        attributes: {
                            about,
                            videoDirectLink,
                            short,
                        },
                    },
                    campaignImageGallery,
                } = props;
                const imageArray = [];
                if (campaignImageGallery) {
                    campaignImageGallery.forEach((singleImage) => {
                        const singleImagePropObj = {};
                        singleImagePropObj.src = singleImage.attributes.assetUrl;
                        singleImagePropObj.thumbnail = singleImage.attributes.assetUrl;
                        singleImagePropObj.thumbnailHeight = 174;
                        singleImagePropObj.thumbnailWidth = 320;
                        imageArray.push(singleImagePropObj);
                    });
                }
                return (
                    <Tab.Pane attached={false}>
                        <Container>
                            <Grid>
                                {short}
                            </Grid>
                            <Grid>
                                <div className="mt-1">
                                    <embed
                                        title="video"
                                        // width="50%"
                                        // height="50%"
                                        src={videoDirectLink}
                                    />
                                </div>
                            </Grid>
                            <Grid>
                                {/* <div className="mt-1"> */}
                                <ImageGallery
                                    imagesArray={imageArray}
                                    enableImageSelection={false}
                                />
                                {/* </div> */}
                                
                            </Grid>
                        </Container>

                    </Tab.Pane>
                );
            },
        },
    ];
    if (props.isAuthenticated) {
        panes.push({
            menuItem: 'Givign Groups supporting this Campaign',
            render: () => {
                const {
                    campaignSubGroupDetails,
                    campaignSubGroupsShowMoreUrl,
                    seeMoreLoaderStatus,
                    subGroupListLoader,
                    viewMoreFn,
                } = props;
                return (
                    <Tab.Pane attached={false}>
                        <SupportingGroups
                            campaignSubGroupDetails={campaignSubGroupDetails}
                            campaignSubGroupsShowMoreUrl={campaignSubGroupsShowMoreUrl}
                            seeMoreLoaderStatus={seeMoreLoaderStatus}
                            subGroupListLoader={subGroupListLoader}
                            viewMoreFn={viewMoreFn}
                        />
                    </Tab.Pane>
                );
            },
        });
    }
    return (
        <Container>
            <div className="charityTab">
                <Tab
                    menu={{
                        pointing: true,
                        secondary: true,
                    }}
                    panes={panes}
                />
            </div>
        </Container>
    );
}

export default ProfileDetails;
