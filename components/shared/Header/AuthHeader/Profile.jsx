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

import { withTranslation } from '../../../../i18n';
import { Link } from '../../../../routes';
import IconIndividual from '../../../../static/images/chimp-icon-individual.png';
import SwitchAccountModal from './SwitchAccountModal';


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

    openModal() {
        this.setState({
            open: true,
            popupOpen : false,
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
            isAdmin,
        } = this.props;
        const formatMessage = this.props.t;
        let accountSettingsText = formatMessage('accountSettings');
        let accountUrl = `/user/profile`;
        if (accountType === 'company') {
            accountSettingsText = formatMessage('companyAccountSettings');
            accountUrl = `companies/${slug}/edit`;
        } else if (accountType === 'charity') {
            accountUrl = `/beneficiaries/${slug}/info`;
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
                        <Menu.Item as="a" className="user-img">
                            <Image src={avatar} style={{ width: '35px' }} circular />
                        </Menu.Item>
                    )}
                >
                    <Popup.Header>
                        <Table>
                            <Table.Row>
                                <Table.Cell><Image src={avatar} style={{ width: '80px' }} circular /></Table.Cell>
                                <Table.Cell>
                                    {formatMessage('name', {
                                        name,
                                    })}
                                    <List link>
                                        <Link route={accountUrl}>
                                            <List.Item as="a">
                                                {accountSettingsText}
                                            </List.Item>
                                        </Link>
                                    </List>
                                </Table.Cell>
                            </Table.Row>
                        </Table>

                    </Popup.Header>
                    <Popup.Content>
                        <List link>
                            {
                                !_isEmpty(this.props.otherAccounts) && (
                                    <Fragment>
                                        <List.Item as="a" onClick={() => { this.openModal(); }}>
                                            {formatMessage('switchAccounts')}
                                        </List.Item>
                                        <Divider />
                                    </Fragment>

                                )
                            }
                            {
                                (isAdmin) && (
                                    <Fragment>
                                        <Link href="/chimp-admin/users">
                                            <List.Item as="a">
                                                {formatMessage('chimpAdmin')}
                                            </List.Item>
                                        </Link>
                                        <Divider />
                                    </Fragment>
                                )
                            }

                            <Link route="/users/logout">
                                <List.Item as="a">
                                    {formatMessage('logout')}
                                </List.Item>
                            </Link>
                        </List>
                    </Popup.Content>
                </Popup>
                {
                    this.state.open && (
                        <SwitchAccountModal
                            accounts={this.props.otherAccounts}
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
    isAdmin: false,
    t: _noop,
};

Profile.propTypes = {
    currentAccount: {
        avatar: string,
        name: string,
    },
    isAdmin: bool,
    t: func,
};

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
    isAdmin: state.user.isAdmin,
    otherAccounts: state.user.otherAccounts,
});

export default withTranslation('authHeader')(connect(mapStateToProps)(Profile));
