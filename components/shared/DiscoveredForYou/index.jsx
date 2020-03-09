import React from 'react';
import {
    Button,
    Header,
    Container,
    Image,
} from 'semantic-ui-react';

import noDataTag from '../../../static/images/causes-no-data-img.png';
import {
    Link,
} from '../../../routes';

const DiscoveredForYou = () => {
    return (
        <div className="Discovered">
            <Container>
                <div className="Discovered-box">
                    <div className="OrderMobile">
                        <Header as="h4" className="mb-2">Select causes and topics to see charities and Giving Groups that might interest you.</Header>
                        <Link route={'/user/profile/charitableinterest'}>
                            <Button className="blue-bordr-btn-round-def">Select causes and topics</Button>
                        </Link>
                    </div>
                    <div className="discoverdNoDataImg">
                        <Image
                            floated="right"
                            src={noDataTag}
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
};
export default DiscoveredForYou;
