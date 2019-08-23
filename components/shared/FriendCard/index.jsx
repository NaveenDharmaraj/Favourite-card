import React from 'react';
import {
    Button,
    Image,
    Grid,
    Card,
} from 'semantic-ui-react';
import Link from 'next/link';
import {
    string,
    bool,
} from 'prop-types';

const FriendCard = (props) => {
    const {
        avatar,
        name,
        button,
    } = props;
    return (
        <Grid.Column>
            <Card>
                <Image src={avatar} circular />
                <Card.Content>
                    <Card.Header>{name}</Card.Header>
                    {button
                        && (
                            <Link className="lnkChange">
                                <Button className="give-frnds-btn">Give</Button>
                            </Link>
                        )}
                </Card.Content>
            </Card>
        </Grid.Column>
    );
};

FriendCard.defaultProps = {
    avatar: '',
    button: false,
    name: '',
};

FriendCard.propTypes = {
    avatar: string,
    button: bool,
    name: string,
};
export default FriendCard;
