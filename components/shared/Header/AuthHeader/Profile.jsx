import React from 'react';
import {
    connect,
} from 'react-redux';
import {
    Divider,
    Image,
    Menu,
    List,
    Popup,
} from 'semantic-ui-react';
import _noop from 'lodash/noop';
import {
    string,
    func,
} from 'prop-types';

import { withTranslation } from '../../../../i18n';
import IconIndividual from '../../../../static/images/chimp-icon-individual.png';

const Profile = (props) => {
    const {
        currentUser: {
            attributes: {
                avatar,
                displayName,
            },
        },
    } = props;
    const formatMessage = props.t;

    return (
        <Popup
            basic
            on="click"
            wide
            className="account-popup"
            position="bottom right"
            trigger={(
                <Menu.Item as="a" className="user-img">
                    <Image src={avatar} style={{ width: '35px' }} circular />
                </Menu.Item>
            )}
        >
            <Popup.Header>
                {formatMessage('displayName', {
                    displayName,
                })}
            </Popup.Header>
            <Popup.Content>
                <List link>
                    <List.Item active as="a" href="/user/profile">
                        My Profile
                    </List.Item>
                    <List.Item as="a" href="/users/profile">
                        Friend Profile
                    </List.Item>
                    <List.Item as="a" href="/user/edit">
                        {formatMessage('accountSettings')}
                    </List.Item>
                    <List.Item as="a">
                        {formatMessage('switchAccounts')}
                    </List.Item>
                    <Divider />
                    <List.Item as="a" href="/users/logout">
                        {formatMessage('logout')}
                    </List.Item>
                </List>
            </Popup.Content>
        </Popup>
    );
};

Profile.defaultProps = {
    currentUser: {
        attributes: {
            avatar: IconIndividual,
            displayName: '',
        },
    },
    t: _noop,
};

Profile.propTypes = {
    currentUser: {
        attributes: {
            avatar: string,
            displayName: string,
        },
    },
    t: func,
};

const mapStateToProps = (state) => ({
    currentUser: state.user.info,
});

export default withTranslation('authHeader')(connect(mapStateToProps)(Profile));
