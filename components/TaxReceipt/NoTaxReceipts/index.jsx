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
                                No recipients yet
                                <Header.Subheader>When you add tax receipt recipients to your account, you’ll be able to manage them here.</Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Card.Header>
                </Card.Content>
            </Card>
        );
    }
}

export default NoTaxReceipts;
