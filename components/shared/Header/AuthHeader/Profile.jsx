import React, {
    Fragment,
} from 'react';
import {
    connect,
} from 'react-redux';
import {
    Divider,
    Image,
    Menu,
    List,
    Popup,
    Table,
} from 'semantic-ui-react';
import _noop from 'lodash/noop';
import _isEmpty from 'lodash/isEmpty';
import {
    string,
    func,
    bool,
} from 'prop-types';
import { withRouter } from 'next/router';
import getConfig from 'next/config';

import {
    getUserAllDetails,
} from '../../../../actions/user';
import { withTranslation } from '../../../../i18n';
import { Link } from '../../../../routes';
import IconIndividual from '../../../../static/images/no-data-avatar-user-profile.png';

import SwitchAccountModal from './SwitchAccountModal';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            popupOpen: false,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
            userInfo: {
                attributes: {
                    roles,
                },
                id,
            },
        } = this.props;
        getUserAllDetails(dispatch, id, roles);
    }

    openModal() {
        this.setState({
            open: true,
            popupOpen: false,
        });
    }

    closeModal() {
        this.setState({
            open: false,
        });
    }

    render() {
        const {
            currentAccount: {
                accountType,
                avatar,
                name,
                slug,
            },
            CurrentUserId,
            isAdmin,
            otherAccounts,
            router,
            t,
        } = this.props;
        const formatMessage = t;
        let accountSettingsText = formatMessage('accountSettings');
        let accountUrl = `/user/profile/basic`;
        if (accountType === 'company') {
            accountSettingsText = formatMessage('companyAccountSettings');
            accountUrl = `${RAILS_APP_URL_ORIGIN}/companies/${slug}/edit`;
        } else if (accountType === 'charity') {
            accountUrl = `${RAILS_APP_URL_ORIGIN}/admin/beneficiaries/${slug}/info`;
        }
        return (
            <Fragment>
                
                <Popup
                    basic
                    on="click"
                    wide
                    className="account-popup"
                    position="bottom right"
                    open={this.state.popupOpen}
                    onOpen={() => { this.setState({popupOpen: !this.state.popupOpen}); }}
                    onClose={() => { this.setState({popupOpen: !this.state.popupOpen}); }}
                    trigger={(
                        <Menu.Item as="a" className={router.asPath.search('/user/profile') !== -1 ? 'user-img active' : 'user-img'}>
                            <Image src={avatar || IconIndividual} style={{ width: '35px' }} circular />
                        </Menu.Item>
                    )}
                >
                    <Popup.Header>
                        <Table>
                            <Link route={`/users/profile/myprofile`}>
                                <Table.Row>
                                    <Table.Cell><Image src={avatar || IconIndividual} style={{ width: '80px' }} circular /></Table.Cell>
                                    <Table.Cell>
                                        {name}
                                    </Table.Cell>
                                </Table.Row>
                            </Link>
                        </Table>

                    </Popup.Header>
                    <Popup.Content>
                        <List divided link>
                            <Link route={'/user/favourites'}>
                                <List.Item as="a">
                                    <List.Icon name='heart' />
                                    <List.Content>
                                        Favourites
                                    </List.Content>
                                </List.Item>
                            </Link>
                            <Link route={accountUrl}>
                                <List.Item as="a">
                                    <List.Icon name='settings' />
                                    <List.Content>
                                        {accountSettingsText}
                                    </List.Content>
                                </List.Item>
                            </Link>
                            {
                                !_isEmpty(otherAccounts) && (
                                    <Fragment>
                                        <List.Item as="a" onClick={() => { this.openModal(); }}>
                                            <List.Icon name='switchAcc' />
                                            <List.Content>
                                                {formatMessage('switchAccounts')}
                                            </List.Content>
                                        </List.Item>
                                    </Fragment>

                                )
                            }
                            {
                                (isAdmin) && (
                                    <Fragment>
                                        <Link href={`${RAILS_APP_URL_ORIGIN}/chimp-admin/users`}>
                                            <List.Item as="a">
                                                <List.Icon name='admin' />
                                                <List.Content>
                                                    {formatMessage('chimpAdmin')}
                                                </List.Content>
                                            </List.Item>
                                        </Link>
                                    </Fragment>
                                )
                            }

                            <Link route="/users/logout">
                                <List.Item as="a">
                                    <List.Icon name='logout' />
                                    <List.Content>
                                        {formatMessage('logout')}
                                    </List.Content>
                                </List.Item>
                            </Link>
                        </List>
                    </Popup.Content>
                </Popup>
                {
                    this.state.open && (
                        <SwitchAccountModal
                            accounts={otherAccounts}
                            close={this.closeModal}
                            open={this.state.open}
                        />
                    )
                }
            </Fragment>

        );
    }
}

Profile.defaultProps = {
    currentAccount: {
        avatar: IconIndividual,
        name: '',
    },
    CurrentUserId: '',
    dispatch: _noop,
    isAdmin: false,
    router: {
        asPath: '',
    },
    t: _noop,
    userInfo: {
        id: '',
    },
};

Profile.propTypes = {
    currentAccount: {
        avatar: string,
        name: string,
    },
    CurrentUserId: string,
    dispatch: func,
    isAdmin: bool,
    router: {
        asPath: string,
    },
    t: func,
    userInfo: {
        id: string,
    },
};

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
    CurrentUserId: state.user.info.id,
    isAdmin: state.user.isAdmin,
    otherAccounts: state.user.otherAccounts,
    userInfo: state.user.info,
});

export default withRouter(withTranslation('authHeader')(connect(mapStateToProps)(Profile)));
