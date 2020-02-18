import React from 'react';
import {
    Button,
    Header,
    Image,
    Grid,
    Card,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { Link } from '../../../routes';
import { renderTextByCharacter } from '../../../helpers/utils';

const LeftImageCard = (props) => {
    const {
        entityName,
        location,
        placeholder,
        typeClass,
        type,
        url,
    } = props;
    const entityShortName = renderTextByCharacter(entityName, 25);
    return (
        <Grid.Column>
            <Card className="left-img-card" fluid>
                <Card.Header>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Image src={placeholder} />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <div style={{padding:'1rem 0rem 0.2rem'}}>
                                    <Header as="h4">
                                        <Header.Content>
                                            <Header.Subheader
                                                className={typeClass}
                                            >
                                                {type}
                                            </Header.Subheader>
                                            {entityShortName}
                                            <br />
                                            <span className="location">
                                                {location}
                                            </span>
                                        </Header.Content>
                                    </Header>
                                    <Link className="lnkChange" route={url} passHref>
                                        <Button className="btn-small-white-border">View</Button>
                                    </Link>
                                </div>
                                
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Header>
            </Card>
        </Grid.Column>
    );
};

LeftImageCard.propTypes = {
    entityName: PropTypes.string,
    location: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    typeClass: PropTypes.string,
    url: PropTypes.string,
};

LeftImageCard.defaultProps = {
    entityName: '',
    location: '',
    placeholder: '',
    type: '',
    typeClass: '',
    url: '',
};


export default LeftImageCard;
