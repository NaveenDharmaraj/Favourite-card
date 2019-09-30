import React from 'react';

import Layout from '../../components/shared/Layout';
import LandingPageTaxReceipt from '../../components/TaxReceipt/LandingPageTaxReceipt';

const TaxReceipt = () => (
    <Layout authRequired>
        <LandingPageTaxReceipt />
    </Layout>
);

export default TaxReceipt;
