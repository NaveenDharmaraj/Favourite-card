import React, { useState, useRef, Fragment, useEffect } from 'react';
import {
    Container,
    Header,
    Button,
    Image,
    Form,
    Input,
    Icon,
    Dimmer,
    Loader,
    Responsive,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import dynamic from 'next/dynamic';

import {
    createGivingGroupBreadCrum,
    createGivingGroupFlowSteps,
    intializeCreateGivingGroup,
    youTubeVimeoValidator,
    parseVimeoUrl,
} from '../../../helpers/createGrouputils';
import { Router } from '../../../routes';
import { withTranslation } from '../../../i18n';
import '../../../static/less/create_manage_group.less';
import groupImg from '../../../static/images/no-data-avatar-giving-group-profile.png';
import {
    editGivingGroupApiCall,
    updateCreateGivingGroupObj,
    removeImage,
} from '../../../actions/createGivingGroup';
import { useDispatch, useSelector } from 'react-redux';
import CreateGivingGroupHeader from '../CreateGivingGroupHeader';
import { getBase64 } from '../../../helpers/chat/utils';
const ImageGallery = dynamic(() => import('../../../components/shared/ImageGallery'), {
    ssr: false
});

let loadOnce = true;
const CreateGivingGroupPicsVideo = ({ createGivingGroupStoreFlowObject, editGivingGroupStoreFlowObject, fromCreate, groupId, t }) => {
    const currentActiveStepCompleted = [1, 2, 3];
    const formatMessage = t;
    const editGivingGroupStoreFlowObjectClone = _cloneDeep(editGivingGroupStoreFlowObject);
    const breakCrumArray = createGivingGroupBreadCrum(formatMessage);
    const initalizeObject = _isEmpty(createGivingGroupStoreFlowObject) ? intializeCreateGivingGroup : createGivingGroupStoreFlowObject;
    const givingGroupObject = fromCreate ? initalizeObject : editGivingGroupStoreFlowObjectClone;
    const groupGalleryLoader = useSelector((state) => state.createGivingGroup.groupGalleryLoader);
    const uploadLogoImageRef = useRef(null);
    const uploadGalleryImageRef = useRef(null);
    const dispatch = useDispatch();

    const [createGivingGroupObject, setCreateGivingGroupObject] = useState(givingGroupObject);
    const {
        attributes: {
            logo,
            videoUrl,
        },
        galleryImages,
    } = createGivingGroupObject;

    const [videoUrlState, setVideoUrlState] = useState(videoUrl);
    const [validateVideoUrl, setValidateVideoUrl] = useState(true);
    const [insertStatus, setinsertStatus] = useState(false);
    const [initialButtonState, setinitialButtonState] = useState(true);
    const handleOnChange = (event, data) => {
        let {
            name,
            value,
        } = data || event.target;
        setVideoUrlState(value);
        setinsertStatus(false);
        setinitialButtonState(false);
    };

    const handleUrlOnBlur = () => {
        const isValidUrl = youTubeVimeoValidator(videoUrlState);
        if (isValidUrl) {
            let formattedUrl = videoUrlState;

            if (formattedUrl.startsWith("https://youtu.be")) {
                formattedUrl = formattedUrl.replace("https://youtu.be/", "https://www.youtube.com/embed/");
            }
            if (formattedUrl.startsWith("https://www.youtube.com")) {
                formattedUrl = formattedUrl.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
            }
            if (!_isEmpty(formattedUrl) && formattedUrl.includes("&t=")) {
                formattedUrl = formattedUrl.split("&t=")[0];
            }
            if (!_isEmpty(formattedUrl) && formattedUrl.includes("vimeo.com")) {
                formattedUrl = parseVimeoUrl(formattedUrl);
            }
            setVideoUrlState(formattedUrl);
        } else {
            fromCreate && setCreateGivingGroupObject({
                ...createGivingGroupObject,
                attributes: {
                    ...createGivingGroupObject.attributes,
                    'videoUrl': ''
                },
            });
        }
        setValidateVideoUrl(isValidUrl);
    };

    useEffect(() => {
        if (loadOnce) {
            window.scrollTo(0, 0);
            loadOnce = false;
        }
        if (!fromCreate && editGivingGroupStoreFlowObject) {
            setCreateGivingGroupObject({
                ...editGivingGroupStoreFlowObjectClone,
            });
            setVideoUrlState(editGivingGroupStoreFlowObjectClone.attributes.videoUrl);
        }
    }, [editGivingGroupStoreFlowObject])
    /**
    * handle saving of video link to createGivingGroupObject
    * @param {stirng} mode mode tells whether adding or removing of video.
    * @returns {void} set the value of createGivingGroupObject state video url attribute .
    */
    const handleOnVideoClick = (mode = '') => {
        if (mode === 'add' && videoUrlState !== '' && validateVideoUrl) {
            setinsertStatus(true);
            setinitialButtonState(true);
        } else if (mode === 'remove') {
            setVideoUrlState('');
            setinsertStatus(false);
        }
        fromCreate && setCreateGivingGroupObject({
            ...createGivingGroupObject,
            attributes: {
                ...createGivingGroupObject.attributes,
                'videoUrl': mode === 'add' ? videoUrlState : ''
            },
        });
        if (!fromCreate) {
            const editObject = {
                'attributes': {
                    'videoUrl': mode === 'add' ? videoUrlState : ''
                },
            }
            dispatch(editGivingGroupApiCall(editObject, groupId));
        }
    }
    const handleRemoveImage = (event, type = '', url = '') => {
        event.stopPropagation();
        if (type === 'gallery') {
            const index = galleryImages.find((item) => {
                if (!fromCreate) {
                    return item.assetId === url.assetId;
                } else {
                    return item === url;
                }
            });
            galleryImages.splice(galleryImages.indexOf(index), 1)
        }
        fromCreate && setCreateGivingGroupObject({
            ...createGivingGroupObject,
            attributes: {
                ...createGivingGroupObject.attributes,
                ...(type === 'logo') && { 'logo': '' },
            },
            ...(type === 'gallery') && { galleryImages: [...galleryImages] },
        });
        if (!fromCreate && type === 'gallery') {
            dispatch(removeImage(url.assetId, createGivingGroupObject));
        }
    }
    const handleUpload = async (event, type = '') => {
        try {
            if (type === 'logo') {
                if (event.target.files.length > 0) {
                    getBase64(event.target.files[0], (result) => {
                        setCreateGivingGroupObject({
                            ...createGivingGroupObject,
                            attributes: {
                                ...createGivingGroupObject.attributes,
                                'logo': result
                            },
                        });
                    });
                }
            } else if (type === 'gallery') {
                try {
                    const length = event.target.files.length;
                    const tempImgArr = [];
                    for (let i = 0; i < length; i++) {
                        getBase64(event.target.files[i], (result) => {
                            if (galleryImages.length < 10) {
                                tempImgArr.push(result);
                            }
                            //this condition make sure that only once the api call happens
                            if (i === length - 1) {
                                if (fromCreate) {
                                    setCreateGivingGroupObject({
                                        ...createGivingGroupObject,
                                        attributes: {
                                            ...createGivingGroupObject.attributes,
                                        },
                                        galleryImages: [...galleryImages, ...tempImgArr],
                                    })
                                } else {
                                    dispatch(editGivingGroupApiCall({ attributes: {}, galleryImages: tempImgArr }, groupId));
                                }
                            }
                        });
                        event.target.value = '';
                    }
                }
                catch (err) {

                }
            }
        }
        catch (err) {
            handleRemoveImage(event, 'logo', '')
        }
    };

    const handlePicsVideoOnContinue = () => {
        dispatch(updateCreateGivingGroupObj(createGivingGroupObject));
        Router.pushRoute(createGivingGroupFlowSteps.stepFour);
    }
    const profilePicture = _isEmpty(logo) ? groupImg : logo;
    const newGalleryImages = [];
    galleryImages && galleryImages.map((obj, i) => {
        const url = fromCreate ? obj : obj.display;
        if (i < 10) {
            const galleryImageObject = {
                src: url,
                thumbnail: url,
                nano: url,
                thumbnailWidth: 80,
                thumbnailHeight: 80,
                customOverlay: <Icon
                    className='remove'
                    onClick={(event) => handleRemoveImage(event, 'gallery', obj)}
                />,
            }
            newGalleryImages.push(galleryImageObject);
        }
    });

    const resetPageViewStatus = () => {
        dispatch({
            payload: {
                pageStatus: {
                    menuView: true,
                    pageView: false,
                },
            },
            type: 'SET_MANAGE_PAGE_STATUS',
        });
    };
    return (
        <Container>
            <div className={fromCreate ? 'createNewGroupWrap' : 'manageGroupWrap createNewGroupWrap'}>
                {fromCreate && <CreateGivingGroupHeader
                    breakCrumArray={breakCrumArray}
                    currentActiveStepCompleted={currentActiveStepCompleted}
                    header={formatMessage('createGivingGroupHeader')}
                />
                }
                <div className='mainContent'>
                    <div className='pics-video'>
                        <Header className="titleHeader">
                            {!fromCreate
                            && (
                                <Responsive minWidth={320} maxWidth={767}>
                                    <span>
                                        <i
                                            aria-hidden="true"
                                            className="back_to_menu icon"
                                            onClick={resetPageViewStatus}
                                        />
                                    </span>
                                </Responsive>
                            )}
                            {formatMessage('createGivingGroupPicsVideo.header')}
                        </Header>
                        <p>If you'd like, you can add photos and video to your group page.</p>
                        <Form>
                            {fromCreate &&
                                <div className='createnewSec'>
                                    <Header className='sectionHeader'>{formatMessage('createGivingGroupPicsVideo.pictureHeader')}
                                    </Header>
                                    <p>{formatMessage('createGivingGroupPicsVideo.pictureDescription')}</p>
                                    <div className='groupPrflWrap'>
                                        <div className='grpPrflimgWrap'>
                                            {logo && <Icon
                                                className='remove'
                                                onClick={(event) => { handleRemoveImage(event, 'logo', '') }}
                                            />
                                            }
                                            <div className='groupPrflImage'>
                                                <Image src={profilePicture} />
                                            </div>
                                        </div>
                                        <input
                                            id="myInput"
                                            accept="image/png, image/jpeg, image/jpg"
                                            type="file"
                                            ref={uploadLogoImageRef}
                                            style={{ display: 'none' }}
                                            onChange={(event) => handleUpload(event, 'logo')}
                                        />
                                        <Button
                                            className='success-btn-rounded-def uploadBtn'
                                            onClick={() => uploadLogoImageRef.current.click()}
                                        >
                                            <Icon className='upload' />
                                            {formatMessage('createGivingGroupPicsVideo.uploadPictureButton')}
                                        </Button>
                                    </div>
                                </div>
                            }
                            <div className="createnewSec bottom_space">
                                <Header className='sectionHeader'>{formatMessage('createGivingGroupPicsVideo.uploadVideo')}
                                </Header>
                                <p>{formatMessage('createGivingGroupPicsVideo.uploadVideoDescription')}</p>
                                <div className='field videoLink'>
                                    <label>{formatMessage('createGivingGroupPicsVideo.uploadVideoLabel')}</label>
                                    <div className='inline'>
                                        <Form.Field
                                            control={Input}
                                            onChange={handleOnChange}
                                            onBlur={handleUrlOnBlur}
                                            value={videoUrlState || ''}
                                            name='videoUrl'
                                            error={!validateVideoUrl}
                                        />
                                        <Button
                                            className='success-btn-rounded-def'
                                            onClick={() => { handleOnVideoClick('add') }}
                                            disabled={_isEmpty(videoUrlState) || !validateVideoUrl || initialButtonState}
                                        >
                                            {formatMessage('createGivingGroupPicsVideo.uploadVideoButton')}
                                        </Button>
                                    </div>
                                    {((fromCreate && !_isEmpty(videoUrlState) && insertStatus)
                                    || (!_isEmpty(videoUrl) && videoUrl === videoUrlState ))
                                && (
                                    <div className='videoWrap'>
                                        <Icon
                                            className='remove'
                                            onClick={() => { handleOnVideoClick('remove') }}
                                        />
                                        <iframe width="100%" height="415"
                                            src={videoUrlState}>
                                        </iframe>
                                    </div>
                                    )}
                                    {!validateVideoUrl &&
                                        <p className="error-message mt-1">
                                            <Icon name="exclamation circle" />
                                            Enter a valid url
                                        </p>
                                    }
                                </div>
                            </div>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'> {formatMessage('createGivingGroupPicsVideo.photoGallery')}
                                </Header>
                                <p>
                                    {formatMessage('createGivingGroupPicsVideo.photoGallerydesc1')}
                                    <span> {formatMessage('createGivingGroupPicsVideo.photoGallerydesc2')}</span>
                                </p>
                                <input
                                    id="myInput"
                                    accept="image/png, image/jpeg, image/jpg"
                                    type="file"
                                    ref={uploadGalleryImageRef}
                                    style={{ display: 'none' }}
                                    multiple
                                    onChange={(event) => handleUpload(event, 'gallery')}
                                />
                                <Button
                                    className='success-btn-rounded-def uploadBtn'
                                    onClick={() => uploadGalleryImageRef.current.click()}
                                    disabled={newGalleryImages.length >= 10}
                                >
                                    <Icon className='upload' />
                                    {formatMessage('createGivingGroupPicsVideo.photoGalleryUploadButton')}
                                </Button>
                                {(!_isEmpty(newGalleryImages) && newGalleryImages.length > 0 && newGalleryImages[0].src)
                                        && (
                                            <div className="manage_group_image_loader">
                                                {groupGalleryLoader
                                                ? (
                                                    <Dimmer className="charity_support_loader" active inverted>
                                                        <Loader />
                                                    </Dimmer>
                                                ) :
                                                (
                                                    <Fragment>
                                                        <ImageGallery
                                                            imagesArray={newGalleryImages}
                                                            enableImageSelection={false}
                                                            rowHeight={80}
                                                            renderSingleImage={false}
                                                        />
                                                        {newGalleryImages.length < 10
                                                            && (
                                                                <p> {`You can still add ${10 - newGalleryImages.length} more ${newGalleryImages.length === 1 ? 'photo.' : 'photos.'}`}</p>
                                                            )}
                                                    </Fragment>
                                                )}
                                                </div>
                                )}
                            </div>
                        </Form>
                        {fromCreate &&
                            <div className='buttonsWrap'>
                                <Button
                                    className='blue-bordr-btn-round-def'
                                    onClick={() => {
                                        dispatch(updateCreateGivingGroupObj(createGivingGroupObject));
                                        Router.pushRoute(createGivingGroupFlowSteps.stepTwo)
                                    }}
                                >
                                    {formatMessage('backButton')}
                                </Button>
                                <Button
                                    className='blue-btn-rounded-def'
                                    onClick={handlePicsVideoOnContinue}
                                >
                                    {formatMessage('continueButton')}
                                </Button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Container >
    );
}

CreateGivingGroupPicsVideo.defaultProps = {
    createGivingGroupStoreFlowObject: intializeCreateGivingGroup,
    dispatch: () => { },
    fromCreate: true,
    editGivingGroupStoreFlowObject: intializeCreateGivingGroup,
    groupId: ''

};

CreateGivingGroupPicsVideo.prototype = {
    createGivingGroupStoreFlowObject: PropTypes.shape({
        type: PropTypes.string,
        attributes: PropTypes.shape({
            name: PropTypes.string.isRequired,
            prefersInviteOnly: PropTypes.string,
            prefersRecurringEnabled: PropTypes.string,
            city: PropTypes.string,
            province: PropTypes.string,
            short: PropTypes.string.isRequired,
            fundraisingGoal: PropTypes.string,
            fundraisingDate: PropTypes.string,
            fundraisingCreated: PropTypes.string,
            logo: PropTypes.string,
            videoUrl: PropTypes.string,
        }),
        groupPurposeDescriptions: PropTypes.array,
        beneficiaryItems: PropTypes.array,
        galleryImages: PropTypes.array,
    }),
    fromCreate: PropTypes.bool,
    dispatch: PropTypes.func
};
export default withTranslation('givingGroup')(CreateGivingGroupPicsVideo);
