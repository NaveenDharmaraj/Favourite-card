import React, {
    Fragment,
    useEffect,
    useState,
} from 'react';
import { connect } from 'react-redux';
import {
    string,
    PropTypes,
    func,
    array,
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
    const [
        aboutValues,
        setaboutValues,
    ] = useState([]);
    const {
        galleryImages,
        groupDetails: {
            attributes: {
                formattedShort,
                videoPlayerLink,
                groupDescriptionsValues,
            },
        },
        t: formatMessage,
    } = props;
    const imageArray = [];

    useEffect(() => {
        const tempArr = [];
        if (!_isEmpty(groupDescriptionsValues)) {
            groupDescriptionsValues.map((data) => {
                tempArr.push(
                    <div className="GroupPurpose">
                        <Header as="h3">{data.purpose}</Header>
                        <p>
                            {ReactHtmlParser(data.description)}
                        </p>
                    </div>,
                );
            });
            setaboutValues(tempArr);
        }
    }, []);

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
    if (_isEmpty(imageArray) && !formattedShort && !videoPlayerLink && _isEmpty(aboutValues)) {
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
                                {!_isEmpty(aboutValues) && aboutValues}
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
                                                            renderSingleImage = {true}
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
            formattedShort: '',
            groupDescriptionsValues: [],
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
            formattedShort: string,
            groupDescriptionsValues: array,
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
