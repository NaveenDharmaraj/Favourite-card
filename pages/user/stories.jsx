import {
    Breadcrumb,
    Container,
} from 'semantic-ui-react';

import Layout from '../../components/shared/Layout';
import StoriesAllList from '../../components/User/StoriesAllList';

function Stories() {
    return (
        <Layout authRequired>
            <div className="charityTab n-border">
                <div className="top-breadcrumb">
                    <Container>
                        <Breadcrumb className="c-breadcrumb">
                            <Breadcrumb.Section link>Home</Breadcrumb.Section>
                            <Breadcrumb.Divider icon="caret right" />
                            <Breadcrumb.Section active>Recommended for you</Breadcrumb.Section>
                        </Breadcrumb>
                    </Container>
                </div>
                <StoriesAllList />
            </div>
        </Layout>
    );
}

export default Stories;
