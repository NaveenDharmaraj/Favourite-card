/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import {
    Card,
    Grid,
    Image,
    Header,
    Divider,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

import { withTranslation } from '../../i18n';
import ImageGallery from '../shared/ImageGallery';
import noDataImg from '../../static/images/noresults.png';

import SupportingGroups from './SupportingGroups';

const noDataState = (formatMessage) => {
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
                            {formatMessage('campaignProfile:profileNoDataContent')}
                            <Header.Subheader>{formatMessage('campaignProfile:profileNoDataSubHeader')}</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Card.Header>
            </Card.Content>
        </Card>
    );
};

function ProfileDetails(props) {
    const {
        campaignDetails: {
            attributes: {
                about,
                videoPlayerLink,
                formattedShort,
                formattedImpact,
            },
        },
        campaignDetails,
        campaignSubGroupDetails,
        campaignSubGroupsShowMoreUrl,
        seeMoreLoaderStatus,
        subGroupListLoader,
        viewMoreFn,
        campaignImageGallery,
        t: formatMessage,
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
    };
    return (
        <div>
            <Grid.Row>
                <Divider className="mobHideDivider mt-4" />
                <Grid.Column width={16} className="ch_paragraph mt-2 mb-1" >
                    <p>{about}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="MyGallery">
                {
                    (!videoPlayerLink && !formattedShort && !formattedImpact && imageArray.length === 0) ? (
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    {noDataState(formatMessage)}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    ) :
                        (
                            <Fragment>
                                <Grid.Column width={16}>
                                    <p>{ReactHtmlParser(formattedShort)}</p>
                                </Grid.Column>
                                <Grid.Column width={16}>
                                    <p>{ReactHtmlParser(formattedImpact)}</p>
                                </Grid.Column>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <ImageGallery
                                                imagesArray={imageArray}
                                                enableImageSelection={false}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <div className="videoWrapper">
                                                <embed
                                                    title="video"
                                                    src={videoPlayerLink}
                                                    className="responsiveVideo"
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Fragment>
                        )
                }
                <Divider />
            </Grid.Row>
            <SupportingGroups
                campaignDetails={campaignDetails}
                campaignSubGroupDetails={campaignSubGroupDetails}
                campaignSubGroupsShowMoreUrl={campaignSubGroupsShowMoreUrl}
                seeMoreLoaderStatus={seeMoreLoaderStatus}
                subGroupListLoader={subGroupListLoader}
                viewMoreFn={viewMoreFn}
            />
        </div>
    );
}

export default withTranslation('claimProfile')(ProfileDetails);
