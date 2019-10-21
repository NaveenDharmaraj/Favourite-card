import React from 'react';
import {
    Button,
    Container,
    Header,
    Grid,
} from 'semantic-ui-react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const {
    HELP_CENTRE_URL,
} = publicRuntimeConfig;

// eslint-disable-next-line react/prefer-stateless-function
class HelpCenter extends React.Component {
    render() {
        return (
            <div className="footer-help">
                <Container>
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={12} tablet={6} computer={6} className="helpImg">
                                <div />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={6} computer={6}>
                                <Header as="h2" className="f-normal">
                                    <span className="bold">Find answers to common questions.</span>
                                    <Header.Subheader>Visit the Help Centre. </Header.Subheader>
                                </Header>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={4} computer={4} className="text-md-right">
                                <Button
                                    className="white-btn-round"
                                >
                                    <a href={HELP_CENTRE_URL} target="_blank">
                                        Help Centre
                                    </a>
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default HelpCenter;
