import React from 'react';
import {
    Container,
    Header,
    Button,
    Image,
    Breadcrumb,
    Form,
    Input,
    Icon,
} from 'semantic-ui-react';
import { generateBreadCrum } from '../../../helpers/createGrouputils';
import ImageGallery from '../../../components/shared/ImageGallery';

import { Link } from '../../../routes';
import '../../../static/less/create_manage_group.less';

const CreateGivingGroupPicsVideo = () => {
    const breakCrumArray = ['Basic settings', 'About the group', 'Pics & video', 'Charities and goal'];
    const currentActiveStepCompleted = [1, 2, 3];
    const removeImage = (
        <Icon className='remove' onClick={() => alert('Delete photo')} />
    );
    const imageArray = [{
                            src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
                            thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
                            thumbnailWidth: 80,
                            thumbnailHeight: 80,
                            customOverlay: removeImage
                        },
                        {
                            src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
                            thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
                            thumbnailWidth: 80,
                            thumbnailHeight: 80,
                            customOverlay: removeImage
                        }]
    return (
        <Container>
            <div className='createNewGroupWrap'>
                <div className='createNewGrpheader'>
                    <Header as='h2'>Create a new Giving Group</Header>
                    {generateBreadCrum(breakCrumArray, currentActiveStepCompleted)}
                </div>
                <div className='mainContent'>
                    <div className='pics-video'>
                        <Header className='titleHeader'>Pics & video</Header>
                        <Form>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'>Giving Group picture <span className='optional'>(optional)</span></Header>
                                <p>Add a logo, photo, or any kind of visual that represents the group.</p>
                                <div className='groupPrflWrap'>
                                    <div className='grpPrflimgWrap'>
                                        <Icon className='remove' />
                                        <div className='groupPrflImage'>
                                            <Image src='../../static/images/no-data-avatar-giving-group-profile.png' />
                                        </div>
                                    </div>
                                    <Button className='success-btn-rounded-def uploadBtn'><Icon className='upload' />Upload picture</Button>
                                </div>
                            </div>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'>Include a video <span className='optional'>(optional)</span></Header>
                                <p>Paste a link from YouTube or Vimeo to add a video to your group profile.</p>
                                <div className='field videoLink'>
                                    <label>Video link</label>
                                    <div className='inline'>
                                        <Form.Field
                                            control={Input}
                                        />
                                        <Button className='success-btn-rounded-def'>Insert video</Button>
                                    </div>
                                </div>
                                <div className='videoWrap'>
                                    <Icon className='remove' />
                                    <iframe width="100%" height="415"
                                        src="https://www.youtube.com/embed/tgbNymZ7vqY">
                                    </iframe>
                                </div>
                            </div>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'>Photo gallery <span className='optional'>(optional)</span></Header>
                                <p>You can add up to 10 photos to your group's gallery. <span>
                                    These photos will appear on your group profile.</span></p>
                                <Button className='success-btn-rounded-def uploadBtn'><Icon className='upload' />Upload photos</Button>
                                
                                <ImageGallery
                                    imagesArray={imageArray}
                                    enableImageSelection={false}
                                    rowHeight={80}
                                />
                                 
                                <p>You can still add {10 - imageArray.length} more photos.</p>
                            </div>
                        </Form>
                        <div className='buttonsWrap'>
                            <Link route='/giving-groups/create-group/about'>
                                <Button className='blue-bordr-btn-round-def'>Back</Button>
                            </Link>
                            <Link route='/giving-groups/create-group/giving-goal'>
                                <Button className='blue-btn-rounded-def'>Continue</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default CreateGivingGroupPicsVideo;
