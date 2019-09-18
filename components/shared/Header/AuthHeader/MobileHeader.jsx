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
    let accountUrl = `/user/profile`;
    let isExternal = false;
    if (accountType === 'company') {
        accountSettingsText = formatMessage('companyAccountSettings');
        accountUrl = `${RAILS_APP_URL_ORIGIN}/companies/${slug}/edit`;
        isExternal = true;
    } else if (accountType === 'charity') {
        accountUrl = `${RAILS_APP_URL_ORIGIN}/beneficiaries/${slug}/info`;
        isExternal = true;
    }
    console.log('isExternam ->>>>', isExternal);
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
                                    {formatMessage('name', {
                                                name,
                                    })}
                                </div>
                                <div className="iconWraper smo-d-none">
                                    <a href="#" className="new"><Image src={notificationIcon}/></a>
                                    <a className="settingsIcon"><Image src={messageIcon}/></a>
                                </div>
                            </List.Content>
                        </List.Item>
                    </List>
                </Menu.Item>
                <Link route='/search'>
                    <Menu.Item as="a">
                        Explore
                    </Menu.Item>
                </Link>
                {menuLinks.map((item) => <MainNavItem {...item} />)}
                {
                    (!isExternal) ? (
                        <Link route={accountUrl}>
                            <Menu.Item as='a'><span className="mobMenuLeftIcon"><Image src={settingsIcon}/></span>{accountSettingsText}</Menu.Item>
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
                <Menu secondary>
                    <Menu.Item>
                        <Button className="blue-btn-rounded-def c-small">Give</Button>
                    </Menu.Item>
                    <Menu.Item className="logoImg">
                        <Image src={logo} />
                    </Menu.Item>

                    <Menu.Menu position="right">
                        <Popup
                            position="bottom right"
                            basic
                            on='click'
                            className="notification-popup"
                            trigger={
                                (<Menu.Item className="xs-d-none">
                                <Image src={notificationIcon}/>
                              </Menu.Item>
                              )
                              }
                        >
                            <Popup.Header>
                                Notification <a className="settingsIcon"><Icon name="setting"/></a>
                            </Popup.Header>
                            <Popup.Content>
                                <List divided verticalAlign='top'>
                                    <List.Item className="new">
                                        <List.Content>
                                            This notification is now removed. <a>Undo</a>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item className="new">
                                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' />
                                        <List.Content>
                                            <b>Sophia Yakisoba</b> is waiting for you to accept their invitation. 
                                            <div className="time">4 hours ago</div>
                                            <span className="more-btn">
                                                <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item text='Delete this notification' />
                                                        <Dropdown.Item text='Stop recieving notifications like this' />
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </span>
                                            <Button className="blue-btn-rounded-def c-small">Accept</Button>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item className="new">
                                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' />
                                        <List.Content>
                                            <b>Pablo Jorge</b> just met his Giving Goal!
                                            <div className="time">4 hours ago</div>
                                            <span className="more-btn">
                                                <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item text='Delete this notification' />
                                                        <Dropdown.Item text='Stop recieving notifications like this' />
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </span>
                                            <Button className="blue-bordr-btn-round-def c-small">View profile</Button>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item className="new">
                                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' />
                                        <List.Content>
                                            <b>Kholde Brew </b> and you are now friends.
                        
                                            <div className="time">Sunday</div>
                                            <span className="more-btn">
                                                <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item text='Delete this notification' />
                                                        <Dropdown.Item text='Stop recieving notifications like this' />
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </span>
                                            <Button className="blue-btn-rounded-def c-small">Accept</Button>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' />
                                        <List.Content>
                                            <b>CHIMP </b> just introduced a new way of giving to maximize your donation.
                        
                                            <div className="time">Jan 13</div>
                                            <span className="more-btn">
                                                <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item text='Delete this notification' />
                                                        <Dropdown.Item text='Stop recieving notifications like this' />
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </span>
                                            <Button className="blue-btn-rounded-def c-small">Accept</Button>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Popup.Content>
                            <div className="popup-footer text-center">
                                <a href="">See all activity</a>
                            </div>
                        </Popup>
                        <Menu.Item className="xs-d-none">
                          <Image src={messageIcon}/>
                        </Menu.Item>
                        <Menu.Item>
                          <Image src={searchIcon}/>
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
        >
            {children}
        </NavBarMobile>
    );
  }
}

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
});

export default withTranslation('authHeader')(connect(mapStateToProps)(MobileHeader));