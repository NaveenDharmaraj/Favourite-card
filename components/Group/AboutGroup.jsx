import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    string,
    PropTypes,
    func,
} from 'prop-types';
import {
    Grid,
    Header,
    Divider,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../i18n';
import ImageGallery from '../shared/ImageGallery';

import GroupNoDataState from './GroupNoDataState';

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
        t: formatMessage,
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
    let showNoData = false;
    if (_isEmpty(imageArray) && !formattedShort && !videoPlayerLink && !formattedImpact
        && !formattedHelping && !formattedAbout) {
        showNoData = true;
    }
    return (
        <Fragment>
            {(!showNoData)
                ? (
                    <Fragment>
                        <Grid.Row>
                            <Grid.Column width={16} className="ch_paragraph">
                                <div className=" AboutProfile">
                                    {formattedShort
                                            && (
                                                ReactHtmlParser(formattedShort)
                                            )}
                                </div>
                                <Divider className="mb-2 mobile_btm" />
                            </Grid.Column>
                        </Grid.Row>
                        <div className="MyGallery">
                            <Grid.Row>
                                {videoPlayerLink
                                    && (
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
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </div>
                                    )}
                                {formattedImpact
                                && (
                                    <div className="GroupPurpose">
                                        <Header as="h3">{formatMessage('groupProfile:groupPurpose')}</Header>
                                        <p>
                                            {ReactHtmlParser(formattedImpact)}
                                        </p>
                                    </div>
                                )}
                                {formattedHelping
                                && (
                                    <div className="GroupPurpose">
                                        <Header as="h3">{formatMessage('groupProfile:groupHelpText')}</Header>
                                        <p>
                                            { ReactHtmlParser(formattedHelping) }
                                        </p>
                                    </div>
                                )}
                                {formattedAbout
                                && (
                                    <div className="GroupPurpose">
                                        <Header as="h3">{formatMessage('groupProfile:groupAboutOrg')}</Header>
                                        <p>
                                            { ReactHtmlParser(formattedAbout) }
                                        </p>
                                    </div>
                                )}
                                {!_isEmpty(imageArray)
                                && (
                                    <div className="fullwidth_v_G">
                                        <div className="GalleryWrapper">
                                            <Grid className="fullwidth_gallery">
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
                                    </div>
                                )}
                            </Grid.Row>
                        </div>
                    </Fragment>
                ) : (
                    <Grid.Row>
                        <GroupNoDataState
                            type="common"
                        />
                    </Grid.Row>
                )}
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
    t: () => {},
};

AboutGroup.propTypes = {
    galleryImages: PropTypes.arrayOf(
        PropTypes.shape({}),
    ),
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            formattedAbout: string,
            formattedHelping: string,
            formattedImpact: string,
            formattedShort: string,
            videoPlayerLink: string,
        }),
    }),
    t: func,
};

function mapStateToProps(state) {
    return {
        galleryImages: state.group.galleryImageData,
        groupDetails: state.group.groupDetails,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(AboutGroup));
export {
    connectedComponent as default,
    AboutGroup,
    mapStateToProps,
};
