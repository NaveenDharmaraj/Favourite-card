import React from 'react';
import {
    Button,
    Header,
    Container,
} from 'semantic-ui-react';

import {
    Link,
} from '../../../routes';

const DiscoveredForYou = () => {
    return (
        <div className="Discovered">
            <Container>
                <div className="Discovered-box">
                    <Header as="h4" className="mb-2">Select causes you care about to see charities and Giving Groups that might interest you.</Header>
                    <Link route={'/user/profile/charitableinterest'}>
                        <Button className="blue-bordr-btn-round-def">Select your causes</Button>
                    </Link>
                    <div className="dots" />
                    <div className="img_Discovered" />
                </div>
            </Container>
        </div>
    );
};
export default DiscoveredForYou;
