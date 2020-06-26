import React, { Component } from "react";
import {
    Icon,
    Image,
    Menu,
    Sidebar,
    Button,
    Responsive,
    Popup,
    List,
    Dropdown,
    Grid,
    Accordion,
} from "semantic-ui-react";
import {
  connect,
} from 'react-redux';
import getConfig from 'next/config';

import { withTranslation } from '../../../../i18n';
import logo from '../../../../static/images/CharitableImpact.svg';
import searchIcon from '../../../../static/images/icons/icon-search.svg';
import notificationIcon from '../../../../static/images/icons/icon-notification.svg';
import messageIcon from '../../../../static/images/icons/icon-message.svg';
import logoutIcon from '../../../../static/images/icons/logout.svg';
import settingsIcon from '../../../../static/images/icons/icon-account_settings.svg';
import MainNavItem from './MainNavItem';
import { getMainNavItems } from '../../../../helpers/utils';
import { Link } from '../../../../routes';
import Notifications from './Notifications';
import Chat from './Chat';
import Give from './Give';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const NavBarMobile = ({
  children,
  onPusherClick,
  onToggle,
  visible,
  currentAccount,
  formatMessage,
  notificationUpdate,
  handleClick,
  activeIndex,
}) => {
    const {
        accountType,
        avatar,
        name,
        slug,
    } = currentAccount;
    const menuLinks = getMainNavItems(accountType, slug);
    let accountSettingsText = formatMessage('accountSettings');
    let accountUrl = `/user/profile/basic`;
    let logoUrl = `/dashboard`;
    let isExternal = false;
    if (accountType === 'company') {
        accountSettingsText = formatMessage('companyAccountSettings');
        accountUrl = `${RAILS_APP_URL_ORIGIN}/companies/${slug}/edit`;
        logoUrl = `${RAILS_APP_URL_ORIGIN}/companies/${slug}`;
        isExternal = true;
    } else if (accountType === 'charity') {
        accountUrl = `${RAILS_APP_URL_ORIGIN}/beneficiaries/${slug}/info`;
        logoUrl = `${RAILS_APP_URL_ORIGIN}/admin/beneficiaries/${slug}`;
        isExternal = true;
    }
    return (
        <Sidebar.Pushable className="c-m-login-header">
            <Sidebar
                as={Menu}
                animation="overlay"
                vertical
                visible={visible}
                direction="right"
            >
                <Menu.Item className="userPrifileHeader">
                    <List verticalAlign='middle'>
                        <List.Item>
                            <Image avatar src={avatar}/>
                            <List.Content>
                                <div className="name">
                                    {name}
                                </div>
                                <div className="iconWraper smo-d-none">
                                    <Link route='/notifications/all'>
                                        <a className={`${notificationUpdate ? ' new' : ''}`}>
                                            <Image src={notificationIcon}/>
                                        </a>
                                    </Link>
                                    <Link route='/chats/all'>
                                        <a>
                                            <Image src={messageIcon}/>
                                        </a>
                                    </Link>
                                </div>
                            </List.Content>
                        </List.Item>
                    </List>
                </Menu.Item>
                <Link route={logoUrl}>
                    <Menu.Item
                        as="a"
                        onClick={onPusherClick}
                    >
                        Dashboard
                    </Menu.Item>
                </Link>
                <Link route='/search'>
                    <Menu.Item
                        as="a"
                        onClick={onPusherClick}
                    >
                        Explore
                    </Menu.Item>
                </Link>
                {menuLinks.map((item) => <MainNavItem {...item} onPusherClick={onPusherClick} />)}
                {
                    (!isExternal) ? (
                        <Link route={accountUrl}>
                            <Menu.Item as='a'><span className="mobMenuLeftIcon settingsIcon"><Image src={settingsIcon}/></span>{accountSettingsText}</Menu.Item>
                        </Link>
                    ) : (
                        <a href={accountUrl}>
                            <Menu.Item as='a'><span className="mobMenuLeftIcon"><Image src={settingsIcon}/></span>{accountSettingsText}</Menu.Item>
                        </a>
                    )
                }
                <Link route='/users/logout'>
                    <Menu.Item as='a'><span className="mobMenuLeftIcon"><Image src={logoutIcon}/></span>Log out</Menu.Item>
                </Link>
            </Sidebar>
            <Sidebar.Pusher
                dimmed={false}
                onClick={onPusherClick}
            >
                <Menu secondary className="header_Responsive">
                    <Give />
                    <Menu.Item className="logoImg">
                        <Link route={logoUrl}>
                            <Image src={logo} />
                        </Link>
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Notifications />
                        <Chat />
                        <Menu.Item className="mobSearchIcon">
                            <Link route="/search">
                                <Image src={searchIcon}/>
                            </Link>
                        </Menu.Item>
                        <Menu.Item onClick={onToggle}>
                            <div class="nav-icon3">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            </div>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                {children}
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
}

class MobileHeader extends Component {
  state = {
    visible: false
  };
  state = { activeIndex: -1 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const {
        children,
        currentAccount,
        notificationUpdate,
    } = this.props;
    const formatMessage = this.props.t;
    const { visible } = this.state;
    const { activeIndex } = this.state
    return (
        <NavBarMobile
        onPusherClick={this.handlePusher}
        onToggle={this.handleToggle}
        handleClick={this.handleClick}
        visible={visible}
        currentAccount={currentAccount}
        formatMessage={formatMessage}
        activeIndex={activeIndex}
        notificationUpdate={notificationUpdate}
        >
            {children}
        </NavBarMobile>
    );
  }
}

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
    notificationUpdate: state.firebase.notificationUpdate,
});

export default withTranslation('authHeader')(connect(mapStateToProps)(MobileHeader));