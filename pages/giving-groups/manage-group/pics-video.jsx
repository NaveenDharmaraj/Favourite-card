import React, { Fragment } from 'react';
import {
    Container,
    Header,
    Button,
    Image,
    Breadcrumb,
    Form,
    Input,
    Icon,
    Checkbox,
} from 'semantic-ui-react';

import { Link } from '../../../routes';
import '../../../static/less/create_manage_group.less';

function PicsVideo() {

    
    return (
        
        <div className='pics-video'>
                            <Header className='titleHeader'>Pics & video</Header>
                            <Form>
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
                                        <Icon className='remove'/>
                                        <iframe width="100%" height="415"
                                            src="https://www.youtube.com/embed/tgbNymZ7vqY">
                                        </iframe>
                                    </div>
                                </div>
                                <div className='createnewSec'>
                                    <Header className='sectionHeader'>Photo gallery <span className='optional'>(optional)</span></Header>
                                    <p>You can add up to 10 photos to your group's gallery. <span>
                                    These photos will appear on your group profile.</span></p>
                                    <Button className='success-btn-rounded-def uploadBtn'><Icon className='upload'/>Upload photos</Button>
                                    <div className='photosWrap'>
                                        <div className="photos">
                                            <Icon className='remove'/>
                                            <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                        </div>
                                        <div className="photos">
                                            <Icon className='remove'/>
                                            <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                        </div>
                                        <div className="photos">
                                            <Icon className='remove'/>
                                            <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                        </div>
                                        <div className="photos">
                                            <Icon className='remove'/>
                                            <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                        </div>
                                        <div className="photos">
                                            <Icon className='remove'/>
                                            <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                        </div>
                                        <div className="photos">
                                            <Icon className='remove'/>
                                            <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                        </div>
                                        <div className="photos">
                                            <Icon className='remove'/>
                                            <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                        </div>
                                        <div className="photos">
                                            <Icon className='remove'/>
                                            <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                        </div>
                                    </div>
                                    <p>You can still add 0 more photos.</p>
                                </div>
                            </Form>
                        </div>    
       
    );
}

export default PicsVideo;
