import {
    Breadcrumb,
    Container,
} from 'semantic-ui-react';

import Layout from '../../components/shared/Layout';
import Favorites from '../../components/User/Favorites';

function Recommendations() {
    return (
        <Layout authRequired>
            <Favorites/>
        </Layout>
    );
}

export default Recommendations;
