import React, { useState, useRef, useEffect } from 'react';
import {
    Container,
    Header,
    Button,
    Image,
    Form,
    Input,
    Icon,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';

import { createGivingGroupBreadCrum, CreateGivingGroupFlowSteps, generateBreadCrum, getBase64, intializeCreateGivingGroup, youTubeVimeoValidator } from '../../../helpers/createGrouputils';
import { Router } from '../../../routes';
import { withTranslation } from '../../../i18n';
import '../../../static/less/create_manage_group.less';
import groupImg from '../../../static/images/no-data-avatar-giving-group-profile.png';
import { updateCreateGivingGroupObj } from '../../../actions/createGivingGroup';
const ImageGallery = dynamic(() => import('../../../components/shared/ImageGallery'), {
    ssr: false
});

const CreateGivingGroupPicsVideo = ({ createGivingGroupStoreFlowObject, dispatch, t }) => {
    const currentActiveStepCompleted = [1, 2, 3];
    const formatMessage = t;
    const breakCrumArray = createGivingGroupBreadCrum(formatMessage);
    const initalizeObject = _isEmpty(createGivingGroupStoreFlowObject) ? intializeCreateGivingGroup : createGivingGroupStoreFlowObject;
    const [createGivingGroupObject, setCreateGivingGroupObject] = useState(initalizeObject);
    const uploadLogoImageRef = useRef(null);
    const uploadGalleryImageRef = useRef(null);

    const [validateVideoUrl, setValidateVideoUrl] = useState(false);
    const {
        attributes: {
            logo,
            videoUrl,
        },
        galleryImages,
    } = createGivingGroupObject;
    const [videoUrlState, setVidoeUrlState] = useState(videoUrl);
    useEffect(() => {
        return () => {
            !Object.values(CreateGivingGroupFlowSteps).includes(Router.router.asPath) &&
                dispatch(updateCreateGivingGroupObj(intializeCreateGivingGroup));
        }
    }, [])
    const handleOnChange = (event, data) => {
        let {
            name,
            value,
        } = data || event.target;
        if (name === 'videoUrl') {
            setVidoeUrlState(value);
            setValidateVideoUrl(false);
        }
    };

    /**
    * handle saving of video link to createGivingGroupObject
    * @param {stirng} mode mode tells whether adding or removing of video.
    * @returns {void} set the value of createGivingGroupObject state video url attribute .
    */
    const handleOnVideoClick = (mode = '') => {
        if (mode === 'add' && videoUrlState !== '' && !youTubeVimeoValidator(videoUrlState)) {
            setValidateVideoUrl(true);
            return;
        };
        setCreateGivingGroupObject({
            ...createGivingGroupObject,
            attributes: {
                ...createGivingGroupObject.attributes,
                'videoUrl': mode === 'add' ? videoUrlState : ''
            },
        });
    }
    const handleRemoveImage = (event, type = '', id = '') => {
        event.stopPropagation();
        if (type === 'gallery') {
            let index;
            galleryImages.find((item, i) => {
                if (item.id === id) {
                    index = i;
                }
            });
            galleryImages.splice(index, 1);
        }
        setCreateGivingGroupObject({
            ...createGivingGroupObject,
            attributes: {
                ...createGivingGroupObject.attributes,
                ...(type == 'logo') && { 'logo': '' },
            },
            ...(type == 'gallery') && { galleryImages: [...galleryImages] },
        });
    }
    const handleUpload = async (event, type = '') => {
        try {
            if (type === 'logo') {
                getBase64(event.target.files[0], (result) => {
                    setCreateGivingGroupObject({
                        ...createGivingGroupObject,
                        attributes: {
                            ...createGivingGroupObject.attributes,
                            'logo': result
                        },
                    });
                });
            } else if (type === 'gallery') {
                for (let i = 0; i < event.target.files.length; i++) {
                    getBase64(event.target.files[i], (result) => {
                        if (galleryImages.length < 10) {
                            const id = `${Math.floor(Math.random() * 100)}` + `${galleryImages.length}`;
                            const galleryImageObject = {
                                id,
                                src: result,
                                thumbnail: result,
                                nano: result,
                                thumbnailWidth: 80,
                                thumbnailHeight: 80,
                                customOverlay: <Icon
                                    className='remove'
                                    onClick={(event) => handleRemoveImage(event, 'gallery', id)}
                                />,
                            }
                            galleryImages.push(galleryImageObject);
                            setCreateGivingGroupObject({
                                ...createGivingGroupObject,
                                attributes: {
                                    ...createGivingGroupObject.attributes,
                                },
                                galleryImages: [...galleryImages],
                            });
                        }
                    });
                }
            }
        }
        catch (err) {
            handleRemoveImage(event, 'logo', '')
        }
    };

    const handlePicsVideoOnContinue = () => {
        if (videoUrl !== '' && !youTubeVimeoValidator(videoUrl)) {
            setValidateVideoUrl(true);
            return;
        };
        dispatch(updateCreateGivingGroupObj(createGivingGroupObject));
        Router.pushRoute(CreateGivingGroupFlowSteps.stepFour);
    }
    const profilePicture = _isEmpty(logo) ? groupImg : logo;

    return (
        <Container>
            <div className='createNewGroupWrap'>
                <div className='createNewGrpheader'>
                    <Header as='h2'>{formatMessage('createGivingGroupHeader')}</Header>
                    {generateBreadCrum(breakCrumArray, currentActiveStepCompleted)}
                </div>
                <div className='mainContent'>
                    <div className='pics-video'>
                        <Header className='titleHeader'>{formatMessage('createGivingGroupPicsVideo.header')}</Header>
                        <Form>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'>{formatMessage('createGivingGroupPicsVideo.pictureHeader')}
                                    <span className='optional'>&nbsp;{formatMessage('optional')}</span>
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
                            <div className='createnewSec'>
                                <Header className='sectionHeader'>{formatMessage('createGivingGroupPicsVideo.uploadVideo')}
                                    <span className='optional'>&nbsp;{formatMessage('optional')}</span>
                                </Header>
                                <p>{formatMessage('createGivingGroupPicsVideo.uploadVideoDescription')}</p>
                                <div className='field videoLink'>
                                    <label>{formatMessage('createGivingGroupPicsVideo.uploadVideoLabel')}</label>
                                    <div className='inline'>
                                        <Form.Field
                                            control={Input}
                                            onChange={handleOnChange}
                                            value={videoUrlState}
                                            name='videoUrl'
                                            error={validateVideoUrl}
                                        />
                                        <Button
                                            className='success-btn-rounded-def'
                                            onClick={() => { handleOnVideoClick('add') }}
                                        >
                                            {formatMessage('createGivingGroupPicsVideo.uploadVideoButton')}
                                        </Button>
                                    </div>
                                </div>
                                {(videoUrl !== '' && videoUrl === videoUrlState && !validateVideoUrl) &&
                                    <div className='videoWrap'>
                                        <Icon
                                            className='remove'
                                            onClick={() => { handleOnVideoClick('remove') }}
                                        />
                                        <iframe width="100%" height="415"
                                            src={videoUrl}>
                                        </iframe>
                                    </div>
                                }
                                {validateVideoUrl &&
                                    <p className="error-message">
                                        <Icon name="exclamation circle" />
                                        Enter a valid url
                                    </p>
                                }
                            </div>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'> {formatMessage('createGivingGroupPicsVideo.photoGallery')}
                                    <span className='optional'>&nbsp;{formatMessage('optional')}</span>
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
                                >
                                    <Icon className='upload' />
                                    {formatMessage('createGivingGroupPicsVideo.photoGalleryUploadButton')}
                                </Button>
                                {galleryImages.length > 0 && <ImageGallery
                                    imagesArray={galleryImages}
                                    enableImageSelection={false}
                                    rowHeight={80}
                                />
                                }
                                < p > {formatMessage('createGivingGroupPicsVideo.photoGalleryCountDesc1')} {10 - galleryImages.length} {formatMessage('createGivingGroupPicsVideo.photoGalleryCountDesc2')}</p>
                            </div>
                        </Form>
                        <div className='buttonsWrap'>
                            <Button
                                className='blue-bordr-btn-round-def'
                                onClick={() => {
                                    dispatch(updateCreateGivingGroupObj(createGivingGroupObject));
                                    Router.pushRoute(CreateGivingGroupFlowSteps.stepTwo)
                                }}
                            >
                                {formatMessage('backButton')}
                            </Button>
                            <Button
                                className='blue-btn-rounded-def'
                                disabled={validateVideoUrl}
                                onClick={handlePicsVideoOnContinue}
                            >
                                {formatMessage('continueButton')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container >
    );
}

CreateGivingGroupPicsVideo.defaultProps = {
    createGivingGroupStoreFlowObject: intializeCreateGivingGroup,
    dispatch: () => { },
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
        groupDescriptions: PropTypes.array,
        beneficiaryIds: PropTypes.array,
        galleryImages: PropTypes.array,
    }),
    dispatch: PropTypes.func
};
export default withTranslation('givingGroup')(CreateGivingGroupPicsVideo);
