import React, {Fragment} from 'react';
import {
    Button,
    Container,
    Header,
    Image,
    Form,
    Input,
    Grid,
    List,
} from 'semantic-ui-react';
import getConfig from 'next/config';
import {
    bool,
} from 'prop-types';
import HubspotForm from 'react-hubspot-form';

import { Link } from '../../../routes';
import '../../../static/less/footer.less';
import flogo from '../../../static/images/CharitableImpact.svg';
import appimg from '../../../static/images/app_img.png';
import facebook from '../../../static/images/icons/facebook.png';
import instagram from '../../../static/images/icons/instagram.png';
import linkedin from '../../../static/images/icons/linkedin.png';
import twitter from '../../../static/images/icons/twitter.png';

const { publicRuntimeConfig } = getConfig();

const {
    CORP_DOMAIN,
    HELP_CENTRE_URL,
    HUBSPOT_PORTAL_ID,
    HUBSPOT_FORM_ID,
} = publicRuntimeConfig;
const ERRORMESSAGES = {
    en: {
        invalidEmail: "Please enter a valid email address",
        invalidEmailFormat: "Please enter a valid email address",
        required: "Please enter a valid email address",
    },
};
const Footer = ({ isAuthenticated }) => (
    <div>
        <div className="my-footer">
            <Container>
                <div className="footer-search">
                    <Grid verticalAlign="middle" columns={2} centered>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <h3 className="best_news">
                                Get our best news, stories, and tips for making an impact
                                </h3>
                                <h3 className="subscribe">
                                Subscribe to the newsletter
                                </h3>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <Form floated="right" className="footer-subscribe">
                                    <Form.Field inline>
                                        <HubspotForm
                                            portalId={HUBSPOT_PORTAL_ID}
                                            formId={HUBSPOT_FORM_ID}
                                            loading={<div>Loading...</div>}
                                            translations={ERRORMESSAGES}
                                        />
                                    </Form.Field>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="footer-middle">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={4} computer={4}>
                                <Image
                                    src={flogo}
                                />
                                <div className="footer-adderss">
                                    <p>
                                        Charitable Impact <br/>
                                        #1250 - 1500 W Georgia St <br/>
                                        Vancouver, BC V6G 2Z6 Canada
                                    </p>
                                </div>
                                
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={12} computer={12}>
                                <Grid>
                                    <Grid.Row columns={4}>
                                        <Grid.Column mobile={16} tablet={4} computer={4}>
                                            <div className="footer-main-links">
                                                <Header as="h4"><a href={`${CORP_DOMAIN}/how-it-works/`}>How it works</a></Header>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={4} computer={4}>
                                            <Header as="h4" content="About" />
                                            <List link>
                                                <List.Item as="a" href={`${CORP_DOMAIN}/who-we-are/`}>Who we are</List.Item>
                                                <List.Item as="a" href={`${CORP_DOMAIN}/foundation/`}>Charitable Impact Foundation</List.Item>
                                                <List.Item as="a" href={`${CORP_DOMAIN}/fees/`}>Fees</List.Item>
                                                <List.Item as="a" href={`${CORP_DOMAIN}/careers/`}>Careers</List.Item>
                                                <List.Item as="a" href={`${CORP_DOMAIN}/press/`}>Press</List.Item>
                                                <List.Item as="a" href={`${CORP_DOMAIN}/blog/`}>Blog</List.Item>
                                            </List>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={4} computer={4}>
                                            <Header as="h4" content="Support" />
                                            <List link>
                                                <List.Item as="a" href={`${HELP_CENTRE_URL}`}>Help Centre</List.Item>
                                                <List.Item as="a" href={`${CORP_DOMAIN}/contact/`}>Contact us</List.Item>
                                                { isAuthenticated && (
                                                    <Fragment>
                                                        <Link 
                                                            route='/privacy'
                                                        >
                                                            <List.Item as="a">Privacy </List.Item>
                                                        </Link>
                                                        <Link 
                                                            route='/terms'
                                                        >
                                                            <List.Item as="a">Terms</List.Item>
                                                        </Link>
                                                        <Link
                                                            route='/account-agreement'
                                                        >
                                                            <List.Item as="a">Account Agreement</List.Item>
                                                        </Link>
                                                    </Fragment>
                                                )}
                                                { !isAuthenticated && (
                                                    <Fragment>
                                                        <List.Item as="a" href={`${CORP_DOMAIN}/privacy/`}>Privacy </List.Item>
                                                        <List.Item as="a" href={`${CORP_DOMAIN}/terms/`}>Terms</List.Item>
                                                        <List.Item as="a" href={`${CORP_DOMAIN}/account-agreement/`}>Account Agreement</List.Item>
                                                    </Fragment>
                                                )}
                                            </List>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={4} computer={4}>
                                            <Header as="h4"><a href={`${CORP_DOMAIN}/charities/`}>Charitable Impact for charities</a></Header>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="copy-right">
                    <List horizontal>
                        <List.Item disabled className="copyright-text" href="#">
                        &copy; Copyright 2019 CHIMP Technology Inc. - All Rights Reserved.
                        </List.Item>
                    </List>
                    <List horizontal floated="right" className="social">
                        <List.Item href="https://go.charitableimpact.com/facebook"><Image src={facebook} /></List.Item>
                        <List.Item href="https://go.charitableimpact.com/linkedin"><Image src={linkedin} /></List.Item>
                        <List.Item href="https://go.charitableimpact.com/twitter"><Image src={twitter} /></List.Item>
                        <List.Item href="https://go.charitableimpact.com/instagram"><Image src={instagram} /></List.Item>
                    </List>
                </div>
            </Container>
        </div>
    </div>
);

Footer.propTypes = {
    isAuthenticated: bool,
};

Footer.defaultProps = {
    isAuthenticated: false,
};

export default Footer;
