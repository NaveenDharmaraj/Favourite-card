/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import {
    Card,
    Container,
    Grid,
    Image,
    Header,
    Tab,
} from 'semantic-ui-react';

import ImageGallery from '../shared/ImageGallery';
import noDataImg from '../../static/images/noresults.png';

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
                            videoPlayerLink,
                            short,
                        },
                    },
                    campaignImageGallery,
                } = props;
                const imageArray = [];
                if (campaignImageGallery) {
                    campaignImageGallery.forEach((singleImage) => {
                        const singleImagePropObj = {};
                        singleImagePropObj.src = singleImage.attributes.originalUrl;
                        singleImagePropObj.thumbnail = singleImage.attributes.assetUrl;
                        singleImagePropObj.thumbnailHeight = 196;
                        singleImagePropObj.thumbnailWidth = 196;
                        imageArray.push(singleImagePropObj);
                    });
                }
                const noDataState = () => {
                    return (
                        <Card fluid className="noDataCard rightImg">
                            <Card.Content>
                                <Image
                                    floated="right"
                                    src={noDataImg}
                                />
                                <Card.Header className="font-s-14">
                                    <Header as="h4">
                                        <Header.Content>
                                        Please check back later
                                            <Header.Subheader>It looks like we haven’t yet received this information.</Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                </Card.Header>
                            </Card.Content>
                        </Card>
                    );
                };
                return (
                    <Tab.Pane attached={false}>
                        <Container>

                            {
                                (!videoPlayerLink && !about && imageArray.length === 0 ) ? (
                                    <Grid>
                                        {noDataState()}
                                    </Grid>
                                ) : (
                                    <Fragment>
                                        <Grid>
                                            { about }
                                        </Grid>
                                        <Grid>
                                            <div className="mt-1">
                                                <embed
                                                    title="video"
                                                    // width="50%"
                                                    // height="50%"
                                                    src={videoPlayerLink}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid>
                                            <ImageGallery
                                                imagesArray={imageArray}
                                                enableImageSelection={false}
                                            />
                                        </Grid>
                                    </Fragment>
                                )
                            }
                        </Container>

                    </Tab.Pane>
                );
            },
        },
    ];
    if (props.isAuthenticated) {
        panes.push({
            menuItem: 'Giving Groups supporting this Campaign',
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
