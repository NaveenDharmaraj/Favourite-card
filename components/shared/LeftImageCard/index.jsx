import React from 'react';
import {
    Button,
    Header,
    Image,
    Grid,
    Card,
} from 'semantic-ui-react';

import { Link } from '../../../routes';

const LeftImageCard = (props) => {
    const {
        entityName,
        placeholder,
        typeClass,
        type,
        url,
    } = props;
    return (
        <Grid.Column>
            <Card className="left-img-card" fluid>
                <Card.Header>
                    <Grid verticalAlign="middle">
                        <Grid.Column width={6}>
                            <Image src={placeholder} />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Header as="h4">
                                <Header.Content>
                                    <Header.Subheader className={typeClass}>{type}</Header.Subheader>
                                    {entityName}
                                </Header.Content>
                            </Header>
                            <Link className="lnkChange" route={url}>
                                <Button className="btn-small-white-border">View</Button>
                            </Link>
                        </Grid.Column>
                    </Grid>
                </Card.Header>
            </Card>
        </Grid.Column>
    );
};

export default LeftImageCard;
