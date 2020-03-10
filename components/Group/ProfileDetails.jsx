import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    string,
    bool,
    arrayOf,
    PropTypes,
} from 'prop-types';
import {
    Container,
    Tab,
    Grid,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import ReactHtmlParser from 'react-html-parser';

import ImageGallery from '../shared/ImageGallery';

import Activity from './Activity';
import Members from './Members';
import CharitySupport from './CharitySupport';
import TransactionDetails from './TransactionDetails';
import GroupNoDataState from './GroupNoDataState';

const ProfileDetails = (props) => {
    const {
        isAUthenticated,
        groupDetails: {
            id,
        },
    } = props;
    let panes = [
        {
            id: 'About',
            menuItem: 'About',
            render: () => {
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
                    <Tab.Pane attached={false}>
                        {
                            (_isEmpty(imageArray) && !formattedShort && !videoPlayerLink && !formattedImpact && !formattedHelping && !formattedAbout) ? (
                                <Grid>
                                    <GroupNoDataState
                                        type="common"
                                    />
                                </Grid>
                            ) : (
                                <Fragment>
                                    {formattedShort
                                    && (
                                        <div className="mb-3">
                                            { ReactHtmlParser(formattedShort) }
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
                                    {formattedImpact
                                        && (
                                            <p className="clear-fix mb-3">
                                                <div className="mb-1 bold">The Group's Purpose</div>
                                                <p>{ ReactHtmlParser(formattedImpact) }</p>
                                            </p>
                                        )}
                                    {formattedHelping
                                        && (
                                            <p className="clear-fix mb-3">
                                                <div className="mb-1 bold">How to Help</div>
                                                <p>{ ReactHtmlParser(formattedHelping) }</p>
                                            </p>
                                        )}
                                    {formattedAbout
                                        && (
                                            <p className="clear-fix mb-3">
                                                <div className="mb-1 bold">About the Organizers</div>
                                                <p>{ ReactHtmlParser(formattedAbout) }</p>
                                            </p>
                                        )}
                                </Fragment>
                            )
                        }
                    </Tab.Pane>
                );
            },
        },
    ];

    if (isAUthenticated) {
        panes = panes.concat(
            {
                id: 'Activity',
                menuItem: 'Activity',
                render: () => (
                    <Tab.Pane attached={false}>
                        <Activity
                            id={id}
                        />
                    </Tab.Pane>
                ),
            },
            {
                id: 'Members',
                menuItem: 'Members',
                render: () => (
                    <Tab.Pane attached={false}>
                        {(isAUthenticated)
                        && (
                            <Members />
                        )}
                    </Tab.Pane>
                ),
            },
            {
                id: 'Transactions',
                menuItem: 'Transactions',
                render: () => (
                    <Tab.Pane attached={false}>
                        {(isAUthenticated)
                            && (
                                <TransactionDetails
                                    id={id}
                                />
                            )}
                    </Tab.Pane>
                ),
            },
            {
                id: 'supports',
                menuItem: 'Charities this group supports',
                render: () => (
                    <Tab.Pane attached={false}>
                        {(isAUthenticated)
                        && (
                            <CharitySupport
                                id={id}
                            />
                        )}
                    </Tab.Pane>
                ),
            },
        );
    }

    const activeIndexProp = (!isAUthenticated) ? { activeIndex: 0 } : {};

    return (
        <Container>
            <div className="charityTab">
                <Tab
                    {...activeIndexProp}
                    menu={{
                        pointing: true,
                        secondary: true,
                    }}
                    panes={panes}
                />
            </div>
        </Container>
    );
};


ProfileDetails.defaultProps = {
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
    isAUthenticated: false,
};

ProfileDetails.propTypes = {
    galleryImages: arrayOf(PropTypes.element),
    groupDetails: {
        attributes: {
            formattedAbout: string,
            formattedHelping: string,
            formattedImpact: string,
            formattedShort: string,
            videoPlayerLink: string,
        },
    },
    isAUthenticated: bool,
};

function mapStateToProps(state) {
    return {
        galleryImages: state.group.galleryImageData,
        groupDetails: state.group.groupDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(ProfileDetails);
