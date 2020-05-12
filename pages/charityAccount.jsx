import React from 'react';
import {
    Container,
    Header,
    Grid,
    Button,
    Image,
    Segment,
} from 'semantic-ui-react';

import accessingleft from '../static/images/accessing2.png';
import accessingfull from '../static/images/accessing1.png';

import Layout from '../components/shared/Layout';
import '../static/less/claimcharity.less';

function Accessing() {
    return (
        <Layout>
            <div className="AccessingtopBanner">
                <Container>
                    <div className="lefttopicon"></div>
                    <div className="bannerHeading">
                        <Header as='h3'> Display_name, you’ve claimed your charity </Header>
                        <p>Now you have access to your charity charity_name’s account.</p>
                        <Button className=" primary blue-btn-rounded mt-1"><b>Go to my Charity Account</b></Button>
                    </div>
                </Container>
            </div>
            <div className="Accessing">
                <Container>
                    <div className="Accessingheading">
                        <Header as='h3'>Accessing your Charity Account</Header>
                    </div>
                    <div className="Accessingfullwidth">
                        <Grid>
                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column mobile={16} tablet={16} computer={7}>
                                    <div className="accessingleft">
                                        <Header as='h3'>One login for both accounts</Header>
                                        <p>Your personal Impact Account and Charity Account are linked together. You can use the same email and password to access both accounts.</p>
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={16} computer={9}>
                                    <div className="accessingrigghtImg">
                                        <Image src={accessingleft} />
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                </Container>
                <div className="accountseasily">
                    <Container>
                        <div className="accountseasilyheading">
                            <Header as='h3'>Switch between accounts easily</Header>
                            <p>When you’re logged in, select your profile photo. Then choose “Switch account” to go between your personal Impact Account and Charity Account.</p>
                        </div>
                    </Container>
                    <div className="accountfullimg">
                        <Image src={accessingfull} />
                    </div>
                </div>
            </div>
            <div className="startCustomizing">
                <Container>
                    <div className="startCustomizingheading">
                        <Header as='h3'>Start customizing your Charity Account</Header>
                        <Button className="white-btn-round textBlack">Go to my Charity Account</Button>
                    </div>
                </Container>
            </div>
        </Layout>
    );
}

export default Accessing;
