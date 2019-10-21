import React from 'react';
import {
    Card,
    Image,
    Header,
} from 'semantic-ui-react';

import noDataImg from '../../static/images/noresults.png';

const CharityNoDataState = () => (
    <Card fluid className="noDataCard rightImg">
        <Card.Content>
            <Image
                floated="right"
                src={noDataImg}
            />
            <Card.Header className="font-s-14">
                <Header as="h4">
                    <Header.Content>
                    Please check back later
                        <Header.Subheader> It looks like we haven't yet received this information from the Canada Revenue Agency.</Header.Subheader>
                    </Header.Content>
                </Header>
            </Card.Header>
        </Card.Content>
    </Card>
);

export default CharityNoDataState;
