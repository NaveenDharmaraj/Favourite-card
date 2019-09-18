import React, { cloneElement } from 'react';
import {
    Card,
    Header,
    Image,
} from 'semantic-ui-react';

import noDataImg from '../../../static/images/noresults.png';

// eslint-disable-next-line react/prefer-stateless-function
class NoTaxReceipts extends React.Component {
    render() {
        return (
            <Card fluid className="noDataCard rightImg">
                <Card.Content>
                    <Image
                        floated="right"
                        src={noDataImg}
                    />
                    <Card.Header className="font-s-14">
                        <Header as="h4">
                            <Header.Content>
                        No tax receipts yet
                                <Header.Subheader>When you add money to your Impact Account, it’s considered a donation. Tax receipts for donations will appear here.</Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Card.Header>
                </Card.Content>
            </Card>
        );
    }
}

export default NoTaxReceipts;
