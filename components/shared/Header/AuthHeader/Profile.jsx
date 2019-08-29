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
import {
    string,
    func,
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
        } = this.props;
        const formatMessage = this.props.t;
        let accountSettingsText  = formatMessage('accountSettings');
        let accountUrl = `/user/edit`;
        if(accountType === 'company') {
            accountSettingsText = formatMessage('companyAccountSettings');
            accountUrl = `companies/${slug}/edit`;
        } else if(accountType === 'charity') {
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
                onOpen={()=>{this.setState({popupOpen: !this.state.popupOpen})}}
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
                        })}<br/>
                        <List.Item as="a" href={accountUrl}>
                            {accountSettingsText}
                        </List.Item>
                        </Table.Cell>
                    </Table.Row>
                    </Table>

                </Popup.Header>
                <Popup.Content>
                    <List link>
                        <List.Item as="a" onClick={()=>{this.openModal()}}>
                            {formatMessage('switchAccounts')}
                        </List.Item>
                        <Divider />
                        <Link route="/users/logout" >
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
    t: _noop,
};

Profile.propTypes = {
    currentAccount: {
        avatar: string,
        name: string,
    },
    t: func,
};

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
    otherAccounts: state.user.otherAccounts,
});

export default withTranslation('authHeader')(connect(mapStateToProps)(Profile));
