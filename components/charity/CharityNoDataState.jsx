import React from 'react';
import {
    Card,
    Image,
    Header,
    Table,
} from 'semantic-ui-react';

import noDataImg from '../../static/images/noresults.png';

const CharityNoDataState = () => (
    <Table basic className="ch_profileNodata">
        <Table.Body>
            <Card fluid className="noData rightImg noHeader">
                <Card.Content>
                    <Image
                        floated="right"
                        src={noDataImg}
                    />
                    <Card.Header className="font-s-14">
                        <Header as="h4">
                            Please check back later
                            <Header.Subheader>
                                <Header.Content>
                                    It looks like we haven't yet received this information from the Canada Revenue Agency.
                                </Header.Content>
                            </Header.Subheader>
                        </Header>
                    </Card.Header>
                </Card.Content>
            </Card>
        </Table.Body>
    </Table>
);

export default CharityNoDataState;
