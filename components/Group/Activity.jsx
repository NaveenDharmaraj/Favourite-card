import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    Button,
    Icon,
    Comment,
    Form,
    Input,
    Feed,
    Grid,
} from 'semantic-ui-react';
import {
    arrayOf,
    PropTypes,
    string,
} from 'prop-types';
import {
    connect,
} from 'react-redux';

class Activity extends React.Component {
    constructor(props) {
        super (props);
    }

    render() {
        const {
            dispatch,
        } = this.props;
        return (
            <Grid centered>
            <Grid.Row>
                <Grid.Column mobile={16} tablet={14} computer={14}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={14} computer={14}>
                                <div className="two-icon-brdr-btm-input">
                                    <Input type='text' placeholder='Write a post...' action fluid>
                                        <input />
                                        <Button icon><Icon name='at' /></Button>
                                        <Button icon><Icon name='smile outline' /></Button>
                                    </Input>
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={2} computer={2}>
                                <Button className="blue-bordr-btn-round-def c-small">Post</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <div className="c-comment">
                        <Comment.Group fluid>

                            <Comment>
                                <Feed.Meta className="cmntLike">
                                    <Feed.Like>
                                        <Icon name='heart' />
                                        4
                                    </Feed.Like>
                                </Feed.Meta>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Matt</Comment.Author>
                                    
                                    <Comment.Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                    </Comment.Text>
                                    
                                    
                                    <Comment.Actions>
                                        <Comment.Metadata>
                                        <div>Today at 5:42PM</div>
                                        </Comment.Metadata>
                                        <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                                
                            </Comment>

                            <Comment>
                                <Feed.Meta className="cmntLike">
                                    <Feed.Like>
                                        <Icon name='heart outline' />
                                        4
                                    </Feed.Like>
                                </Feed.Meta>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Matt</Comment.Author>
                                    
                                    <Comment.Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                    </Comment.Text>
                                    
                                    
                                    <Comment.Actions>
                                        <Comment.Metadata>
                                        <div>Today at 5:42PM</div>
                                        </Comment.Metadata>
                                        <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                                <Comment.Group>
                                    <Comment>
                                        <Feed.Meta className="cmntLike">
                                            <Feed.Like>
                                                <Icon name='heart outline' />
                                                4
                                            </Feed.Like>
                                        </Feed.Meta>
                                        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                        <Comment.Content>
                                            <Comment.Author as='a'>Matt</Comment.Author>
                                            
                                            <Comment.Text>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                            </Comment.Text>
                                            
                                            
                                            <Comment.Actions>
                                                <Comment.Metadata>
                                                <div>Today at 5:42PM</div>
                                                </Comment.Metadata>
                                                <Comment.Action>Reply</Comment.Action>
                                            </Comment.Actions>
                                        </Comment.Content>
                                    </Comment>
                                </Comment.Group>
                            </Comment>

                            <Comment>
                                
                                <Feed.Meta className="cmntLike">
                                    <Feed.Like>
                                        <Icon name='heart outline' />
                                        4
                                    </Feed.Like>
                                </Feed.Meta>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Matt</Comment.Author>
                                    
                                    <Comment.Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                    </Comment.Text>
                                    
                                    
                                    <Comment.Actions>
                                        <Comment.Metadata>
                                        <div>Today at 5:42PM</div>
                                        </Comment.Metadata>
                                        <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>

                            <Form reply>
                            <Form.TextArea />
                            <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                            </Form>
                        </Comment.Group>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        );
    }
}

export default Activity;
