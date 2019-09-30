import React from 'react';
import {
    Button,
    Image,
    Grid,
    Card,
} from 'semantic-ui-react';
import {
    string,
    bool,
} from 'prop-types';

import {
    Link,
} from '../../../routes';

const FriendCard = (props) => {
    const {
        avatar,
        name,
        id: userId,
    } = props;
    return (
        <Grid.Column>
            <Link route={(`/users/profile/${userId}`)}>
                <Card>
                    <Image src={avatar} circular />
                    <Card.Content>
                        <Card.Header>{name}</Card.Header>
                    </Card.Content>
                </Card>
            </Link>
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
