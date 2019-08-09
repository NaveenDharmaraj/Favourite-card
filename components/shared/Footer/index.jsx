import React from 'react';
import {
    Button,
    Container,
    Header,
    Icon,
    Image,
    Form,
    Input,
    Divider,
    Segment,
    Grid,
    List,
} from 'semantic-ui-react';

import '../../../static/less/footer.less';
import flogo from '../../../static/images/footer_logo.png';
import appimg from '../../../static/images/app_img.png';

const Footer = () => (
    <Segment className="n-c-global-footer">
        <Container>
            <div className="footer-top">
                <Grid verticalAlign="middle" columns={2} centered>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={8} computer={8}>
                            <h3 className="">
                              Get the inside scoop.
                            </h3>
                            <h3 className="purple">
                              Join the community newsletter
                            </h3>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={8}>
                            <Form floated="right" className="footer-subscribe">
                                <Form.Field inline>
                                    <Input placeholder="Enter your email" className="rounded-input" />
                                    <Button className="white-btn-round">Subscribe</Button>
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
            <Divider hidden />
            <Divider hidden />
            <Divider />
            <Divider hidden />
            <Divider hidden />
            <div className="footer-middle">
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <Image
                                src={flogo}
                                style={{
                                    marginBottom: '15px',
                                    width: '162px',
                                }}
                            />
                            <List className="footer-social" horizontal link>
                                <List.Item as="a"><Icon name="twitter" /></List.Item>
                                <List.Item as="a"><Icon name="facebook" /></List.Item>
                                <List.Item as="a"><Icon name="instagram" /></List.Item>
                                <List.Item as="a"><Icon name="vimeo v" /></List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={11} computer={11}>
                            <Grid>
                                <Grid.Row columns={4}>
                                    <Grid.Column mobile={16} tablet={4} computer={4}>
                                        <div className="footer-main-links">
                                            <Header as="h4"><a href="">How it works</a></Header>
                                            <Header as="h4"><a href="">About</a></Header>
                                            <Header as="h4"><a href="">Support</a></Header>
                                            <Header as="h4"><a href="">Blog</a></Header>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={4} computer={4}>
                                        <Header as="h4" content="CHIMP FOR" />
                                        <List link>
                                            <List.Item as="a">Advisors</List.Item>
                                            <List.Item as="a">Charities</List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={4} computer={4}>
                                        <Header as="h4" content="CONTACT" />
                                        <List link>
                                            <List.Item as="a">1-877-531-0580</List.Item>
                                            <List.Item as="a">hello@chimp.net</List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={4} computer={4}>
                                        <Image src={appimg} />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
            <Divider hidden />
            <Divider hidden />
            <Divider />
            <div className="copy-right">
                <List horizontal>
                    <List.Item disabled href="#">
                      &copy; Copyright 2019 CHIMP Technology Inc. - All Rights Reserved.
                    </List.Item>
                </List>
                <List horizontal floated="right">
                    <List.Item href="#">Privacy</List.Item>
                    <List.Item href="#">Terms</List.Item>
                    <List.Item href="#">Account Agreement</List.Item>
                </List>
            </div>
        </Container>
    </Segment>
);

export default Footer;
