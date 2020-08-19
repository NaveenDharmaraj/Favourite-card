import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    string,
    PropTypes,
} from 'prop-types';
import {
    Grid,
    Header,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import _isEmpty from 'lodash/isEmpty';

import ImageGallery from '../shared/ImageGallery';

const AboutGroup = (props) => {
    const {
        galleryImages,
        groupDetails: {
            attributes: {
                formattedShort,
                videoPlayerLink,
                formattedImpact,
                formattedHelping,
                formattedAbout,
            },
        },
    } = props;
    const imageArray = [];
    if (!_isEmpty(galleryImages)) {
        galleryImages.forEach((singleImage) => {
            const singleImagePropObj = {};
            singleImagePropObj.src = singleImage.attributes.originalUrl;
            singleImagePropObj.thumbnail = singleImage.attributes.assetUrl;
            singleImagePropObj.thumbnailHeight = 196;
            singleImagePropObj.thumbnailWidth = 196;
            imageArray.push(singleImagePropObj);
        });
    }
    return (
        <Fragment>
            <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={16} className="ch_paragraph">
                    {formattedShort
                    && (
                        <div className="GroupPurposeTop">
                            <p>
                                {ReactHtmlParser(formattedShort)}
                            </p>
                        </div>
                    )}
                    {videoPlayerLink
                        && (
                            <div className="mb-3 videoWrapper text-center">
                                <embed
                                    title="video"
                                    src={videoPlayerLink}
                                    className="responsiveVideo"
                                />
                            </div>
                        )}
                    {formattedImpact
                    && (
                        <div className="GroupPurpose">
                            <Header as="h3">The Group’s Purpose</Header>
                            <p>
                                {ReactHtmlParser(formattedImpact)}
                            </p>
                        </div>
                    )}
                    {formattedHelping
                    && (
                        <div className="GroupPurpose">
                            <Header as="h3">How to Help</Header>
                            <p>
                                { ReactHtmlParser(formattedHelping) }
                            </p>
                        </div>
                    )}
                    {formattedAbout
                    && (
                        <div className="GroupPurpose">
                            <Header as="h3">About the Organizers</Header>
                            <p>
                                { ReactHtmlParser(formattedAbout) }
                            </p>
                        </div>
                    )}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={16} className="OneGrProfileImg">
                    {!_isEmpty(imageArray)
                                        && (
                                            <div className="clear-fix mb-3">
                                                <div className="mb-1">
                                                    <ImageGallery
                                                        imagesArray={imageArray}
                                                        enableImageSelection={false}
                                                    />
                                                </div>
                                            </div>
                                        )}
                </Grid.Column>
            </Grid.Row>
        </Fragment>
    );
};

AboutGroup.defaultProps = {
    galleryImages: [],
    groupDetails: {
        attributes: {
            formattedAbout: '',
            formattedHelping: '',
            formattedImpact: '',
            formattedShort: '',
            videoPlayerLink: '',
        },
    },
};

AboutGroup.propTypes = {
    galleryImages: PropTypes.arrayOf(
        PropTypes.shape({}),
    ),
    groupDetails: {
        attributes: {
            formattedAbout: string,
            formattedHelping: string,
            formattedImpact: string,
            formattedShort: string,
            videoPlayerLink: string,
        },
    },
};

function mapStateToProps(state) {
    return {
        galleryImages: state.group.galleryImageData,
        groupDetails: state.group.groupDetails,
    };
}

export default connect(mapStateToProps)(AboutGroup);
