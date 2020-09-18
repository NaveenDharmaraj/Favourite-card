import React, {
    Fragment,
} from 'react';
import {
    List,
    Header,
    Image,
    Icon,
    Grid,
    Button,
    Dropdown,
    Modal,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import {
    getLocation,
} from '../../../helpers/profiles/utils';
import { withTranslation } from '../../../i18n';

const FriendListCard = (props) => {
    const {
        currentUser: {
            id: UserId,
        },
        data: {
            avatar,
            city,
            first_name,
            last_name,
            province,
            status,
            user_id,
        },
        type,
    } = props;
    const isMyProfile = (user_id === Number(UserId));
    const isInviteRequest = (status === 'PENDING_IN');
    let buttonText = '';
    let buttonClass = 'blue-btn-rounded-def';
    switch (status) {
        case 'ACCEPTED':
            buttonText = 'Message';
            break;
        case 'PENDING_IN':
            buttonText = 'Accept';
            buttonClass = 'blue-bordr-btn-round-def';
            break;
        default:
            buttonText = 'Add friend';
            break;
    }
    return (
        <List.Item>
            <Image avatar src={avatar} />
            <List.Content>
                <List.Header as="a">{`${first_name} ${last_name}`}</List.Header>
                <List.Description>{getLocation(city, province)}</List.Description>
            </List.Content>
            {!isMyProfile
            && (
                <List.Content floated="right">
                    <Button
                        className={`${buttonClass} c-small`}
                    >
                        {buttonText}
                    </Button>
                    {(type === 'invitation')
                    && (
                        <Icon className="trash alternate outline" />
                    )}
                </List.Content>
            )}
        </List.Item>
    );
};

FriendListCard.defaultProps = {
    currentUser: {
        id: '',
    },
    data: {
        avatar: '',
        city: '',
        first_name: '',
        last_name: '',
        province: '',
        status: '',
    },
};

FriendListCard.propTypes = {
    currentUser: PropTypes.shape({
        id: string,
    }),
    data: PropTypes.shape({
        avatar: string,
        city: string,
        first_name: string,
        last_name: string,
        province: string,
        status: string,
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(FriendListCard));
export {
    connectedComponent as default,
    FriendListCard,
    mapStateToProps,
};