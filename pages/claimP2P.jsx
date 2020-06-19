import React from 'react';
import {
    Container,
    Header,
    Grid,
    Image,
    Divider,
    Responsive,
} from 'semantic-ui-react';

import Layout from '../components/shared/Layout';
import '../static/less/claimP2P.less';
import ClaimP2PSignUp from '../components/ClaimP2PSignUp';

function ClaimP2P() {
    return (
        <Layout>
            <div className="claimP2PScreen">
                <div className="claimp2pHeader">
                    
                    <Container>
                        <Grid centered padded>
                            <Grid.Column computer={6} tablet={6} mobile={16} textAlign="center">
                                <div className="claimp2pUserImage">
                                    <Image src="../static/images/no-data-avatar-giving-group-profile.png" />
                                </div>
                                <Header as="h2">Eva Sorokacova sent you $7.00 to give away to charity</Header>
                            </Grid.Column>
                        </Grid>
                        <p>“Thank you for helping with the bake sale the other day!”</p>
                    </Container>
                </div>
                <Container>
                    <Grid padded>
                        <Grid.Row className="pad-0">
                            <Grid.Column computer={16} tablet={16} mobile={16} className="claimp2pImpAct" >
                                <div className="claimp2pImpActWrap">
                                    <Header as="h2" textAlign="center">Claim your gift by opening an Impact Account</Header>
                                    <p className="subTtle_1"> It’s like an online bank account for charitable giving. </p>
                                    <p className="subTtle_2">You can add money and give to your favourite charities, all from one place. It’s free to open and we don’t charge sign-up or transaction fees for Impact Accounts. </p>
                                    <ClaimP2PSignUp />
                                </div>
                            </Grid.Column>
                            <Grid.Column computer={16} tablet={16} mobile={16} className="claimp2pHwItWrks">
                                <Header as="h2" textAlign="center">How it works</Header>
                                <Grid columns="equal" stackable>

                                    <Grid.Column>
                                        <div>
                                            <Image src="./static/images/Bitmap.png" />
                                        </div>
                                        <Header as="h2">Find charities</Header>
                                        <p>Find charities that match your interests. With our powerful search tool, you can choose from thousands of registered Canadian charities. </p>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div>
                                            <Image src="./static/images/dollerGroup.png" />
                                        </div>
                                        <Header as="h2" >Add money</Header>
                                        <p>Add to your account, then take as much time and space as you need to decide which charities to support.</p>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div>
                                            <Image src="./static/images/handFlower.png" />
                                        </div>
                                        <Header as="h2">Give</Header>
                                        <p>Give to your favourite charities from your account now, or save some of your charitable dollars and build your impact over time. </p>
                                    </Grid.Column>

                                </Grid>
                                <Divider />
                            </Grid.Column>
                            <Grid.Column computer={16} tablet={16} mobile={16} textAlign="center" className="claimp2pWhoWer">
                                <Header as="h2">Who we are </Header>
                                <span className="underline" />
                                <p>Charitable Impact was created to help you create the change you want to see in the world. We’re a public foundation that operates as a donor-advised fund. This means you can manage your charitable giving from a single account, which we call the Impact Account.</p>
                                <p>Our Impact Account comes with tools that help you plan the impact you want to make. We’re here for you no matter what causes you choose to support, how much you give, or how experienced you are with your charitable giving. </p>
                                <Responsive maxWidth={767}>
                                    <Divider />
                                </Responsive>
                            </Grid.Column>
                            <Grid.Column computer={16} tablet={16} mobile={16} className="claimp2pJoin">
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column computer={16} tablet={16} mobile={16} textAlign="center">
                                            <Header as="h2">Join the thousands of Canadians already on Charitable Impact</Header>
                                            <span className="underline" />
                                            <Grid columns="equal" stackable className="cliamp2pThreeColumn">

                                                <Grid.Column>
                                                    <Header as="h2">$530M+</Header>
                                                    <p>donated by the Charitable Impact community </p>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Header as="h2">9,000+</Header>
                                                    <p>have benefited from gifts sent by donors on Charitable Impact</p>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Header as="h2">110,000+</Header>
                                                    <p>Fpeople have given to the causes they care about using Charitable Impact</p>
                                                </Grid.Column>
                                            </Grid>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        </Layout>
    );
}

export default ClaimP2P;
