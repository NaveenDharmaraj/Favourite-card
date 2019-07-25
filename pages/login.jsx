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
  TextArea,
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
                                                <Header as="h3">Sign in to Charitable Impact</Header>
                                                <Header as="h4">Enter your details below</Header>
                                            </div>
                                            <Form>
                                                <Form.Field>
                                                    <label>Email address</label>
                                                    <input />
                                                </Form.Field>
                                                <Form.Field>
                                                <label>Password<a style={{float:'right'}} className="forgot-link">Forgot Password?</a></label>
                                                    <input type='password'/>
                                                </Form.Field>
                                                <div className="reg-btn-wraper">
                                                    <Button type='submit' primary disabled>Continue</Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>

                            </Grid>
                        </div>
                    </Container>
                </div>
            </Layout>
        );
    }

}

export default Login
