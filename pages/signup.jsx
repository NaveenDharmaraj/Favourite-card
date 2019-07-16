import React, { cloneElement } from 'react';
import Layout from '../components/shared/Layout';
import {
  Button,
  Container,
  Header,
  Icon,
  Image,
  Menu,
  Responsive,
  Form,
  Input,
  Dropdown,
  Divider,
  Segment,
  Visibility,
  Grid,
  List,
  Card,
  Breadcrumb,
} from 'semantic-ui-react'
class Login extends React.Component {

    render() {
        return (
            <Layout>
                <div className="pageWraper">
                    <Container>
                        <div className="linebg" >
                            <Grid columns={2} verticalAlign='middle'>
                                <Grid.Row>
                                    <Grid.Column className="left-bg"></Grid.Column>
                                    <Grid.Column>
                                        <div className="login-form-wraper">
                                            <div className="reg-header">
                                                <Header as="h3">Create the change you want to see in the world.</Header>
                                                <Header as="h4"> Tell us about yourself. </Header>
                                            </div>
                                            <Form>
                                                <Form.Field>
                                                    <label>First Name</label>
                                                    <input placeholder='Your first name' />
                                                </Form.Field>
                                                <Form.Field>
                                                    <label>Last Name<a style={{float:'right'}} className="forgot-link">Forgot Password?</a></label>
                                                    <input placeholder='Your last name' />
                                                </Form.Field>
                                                <div className="reg-btn-wraper">
                                                    <Button type='submit' primary disabled>Continue</Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>

                                



                                <Grid.Row>
                                    <Grid.Column className="left-bg"></Grid.Column>
                                    <Grid.Column>
                                        <div className="login-form-wraper">
                                            <div className="reg-header">
                                                <Header as="h3">Create your Impact account.</Header>
                                            </div>
                                            <Form>
                                                <Form.Field>
                                                    <label>Email</label>
                                                    <input placeholder='Enter your email' />
                                                </Form.Field>
                                                <Form.Field>
                                                    <label>Password</label>
                                                    <input placeholder='Choose your password' />
                                                </Form.Field>
                                                <p>
                                                    0/8 characters, lowercase letters (a-z), uppercase letters (A-Z),
special characters (e.g. !@#$%^&*)
                                                </p>
                                                <div className="reg-btn-wraper">
                                                    <Button type='submit' primary disabled>Continue</Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>






                            </Grid>
                            <Grid centered>
                                <Grid.Column mobile={16} tablet={14} computer={14} largeScreen={12}>
                                    <div className="prefered-wraper">
                                        <div className="prefered-img"></div>
                                        <div className="reg-header">
                                            <Header as="h3">What causes are important to you? </Header>
                                            <Header as="h4">Your answers help us personalize your experience. </Header>
                                        </div>
                                        <p>Choose 3 or more</p>
                                        <Grid className="select-btn-wraper">
                                            <Grid.Row>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Arts and culture</Button>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Health</Button>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Education and research</Button>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Religion and spirituality </Button>
                                                </Grid.Column>

                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Human rights</Button>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">International </Button>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Environment </Button>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Sports and recreation</Button>
                                                </Grid.Column>

                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Outreach and welfare</Button>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Animals </Button>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Community development </Button>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={8} computer={4}>
                                                    <Button basic fluid className="select-btn">Youth/children</Button>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                        <div className="reg-btn-wraper">
                                            <Button type='submit' primary disabled>Continue</Button>
                                        </div>
                                    </div>
                                    
                                </Grid.Column>
                            </Grid>
                        </div>
                    </Container>
                </div>

            </Layout>
        );
    }

}

export default Login
