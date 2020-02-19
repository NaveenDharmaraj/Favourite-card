import React, { cloneElement } from 'react';
import {
  Button,
  Container,
  Header,
  Form,
  Grid,
  Card,
  Image,
} from 'semantic-ui-react';
import Layout from '../components/shared/Layout';
import browserMsgImg from '../static/images/browser-msg-img.png';
import chrome from '../static/images/chrome.png';
import edge from '../static/images/edge.png';
import firefox from '../static/images/firefox.png';
import safari from '../static/images/safari.png';
import '../static/less/browserSupport.less';

class Login extends React.Component {
    render() {
        return (
            <Layout>
                <div className="browserSupport">
                    <Container>
                        <Grid centered>
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={14} computer={13}>
                                    <div className="browserSupportWraper">
                                        <div className="browserLeftContent">
                                            <Header as='h2'>
                                                It looks like your browser version isn't supported. 
                                                <Header.Subheader>
                                                We built Charitable Impact using the latest technology to give you a secure and reliable experience. This means some older browser versions aren't able to display our website.
                                                </Header.Subheader>
                                            </Header>
                                            <p>Not to worry, you can access your account by downloading the latest browser version of your choice:</p>
                                            <ul className="browsersList">
                                                <li>
                                                    <a href="#">
                                                        <Image src={chrome}/>
                                                        Google Chrome
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <Image src={edge}/>
                                                        Microsoft Edge
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <Image src={firefox}/>
                                                        Mozilla Firefox
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <Image src={safari}/>
                                                        Safari
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="browserRightImage">
                                            <Image src={browserMsgImg}/>
                                        </div>
                                    </div>
                                    <p className="browserHelp">If you need assistance, <a href="#">we’re here to help</a>.</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>
            </Layout>
        );
    }
}

export default Login;
