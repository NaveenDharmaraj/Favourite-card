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
        about,
        videoPlayerLink,
        formattedShort,
        formattedImpact,
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
                <Divider className="mobHideDivider mb-0 mt-4" />
                <Grid.Column width={16} className="ch_paragraph AboutProfile" >
                    <p>{about}</p>
                </Grid.Column>
            </Grid.Row>
            <div className="MyGallery">
            <Grid.Row>
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
                                    {ReactHtmlParser(formattedShort)}
                                </Grid.Column>
                                <Grid.Column width={16}>
                                    {ReactHtmlParser(formattedImpact)}
                                </Grid.Column>
                                <div className="fullwidth_v_G">
                                <div className="GalleryWrapper">
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
                                </div>
                                <div className="videoWrapperfull">
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
                                            <Divider className="mobHideDivider" />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                </div>
                                </div>
                            </Fragment>
                        )
                }
            </Grid.Row>
            </div>
        </div>
    );
}

export default withTranslation('claimProfile')(ProfileDetails);
