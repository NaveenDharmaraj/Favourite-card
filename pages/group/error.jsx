import React from 'react';
import {
    Container,
    Header,
    Grid,
    List,
    Image,

} from 'semantic-ui-react';
import getConfig from 'next/config';

import { Link } from '../../routes';
import AvailableImg from '../../static/images/noresults.png';
import Layout from '../../components/shared/Layout';

const { publicRuntimeConfig } = getConfig();
const {
    HELP_CENTRE_URL,
} = publicRuntimeConfig;

function ErrorPage() {
    return (
        <Layout disableMinHeight>
            <div className="NotAvailable">
                <Container>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={12} computer={10}>
                                <div className="AvailableText">
                                    <Header as="h1">This page isn't available</Header>
                                    <Header as="h4">The link you followed might have been archived, or the page you're trying to view may have been set to private.</Header>
                                    <List>
                                        <List.Item>
                                            {`You can try a fresh start on the `}
                                            <Link route={(`/dashboard`)}>
                                                homepage
                                            </Link>
                                            , or find answers and
                                            {` contact information in the `}
                                            <a href={HELP_CENTRE_URL}>
                                                Help Centre
                                            </a>
                                        . We’re here to help.
                                        </List.Item>
                                    </List>
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={4} computer={6}>
                                <div className="ImgAvailable">
                                    <Image src={AvailableImg} />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        </Layout>
    );
}

export default ErrorPage;
