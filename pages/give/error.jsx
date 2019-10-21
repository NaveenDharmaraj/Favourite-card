import React from 'react';

import Layout from '../../components/shared/Layout';
import Error from '../../components/Give/Error';

const GiveError = () => (
    <Layout authRequired>
        <Error />
    </Layout>
);

export default GiveError;
