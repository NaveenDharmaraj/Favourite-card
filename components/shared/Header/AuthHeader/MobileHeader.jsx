import React, { Component } from "react";
import {
    Icon,
    Image,
    Menu,
    Sidebar,
    Button,
} from "semantic-ui-react";

import logo from '../../../../static/images/CharitableImpact.png';

const NavBarMobile = ({
  children,
  onPusherClick,
  onToggle,
  visible
}) => (
  <Sidebar.Pushable className="c-m-login-header">
    <Sidebar
      as={Menu}
      animation="overlay"
      vertical
      visible={visible}
    >
    <Menu.Item>
      <Button as="a" color="blue" fluid style={{ marginBottom: '5px' }}>Sign up</Button>
      <Button as="a" basic color="blue" fluid >Login</Button>
    </Menu.Item>
    <Menu.Item as='a' active>
      Home
    </Menu.Item>

    <Menu.Item as='a'>Work</Menu.Item>
    <Menu.Item as='a'>Company</Menu.Item>
    <Menu.Item as='a'>Careers</Menu.Item>
    <Menu.Item className="sidebar-social">
      <Button className='transparent' icon='twitter' />
      <Button className='transparent' icon='facebook' />
      <Button className='transparent' icon='instagram' />
      <Button className='transparent' icon='vimeo v' />
    </Menu.Item>
    </Sidebar>
    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: "100vh" }}
    >
      <Menu secondary>
        <Menu.Item>
          <Image size="mini" src={logo} />
        </Menu.Item>
        <Menu.Item onClick={onToggle}>
          <Icon name="sidebar" />
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item as="a" to="https://github.com">
            Blog
          </Menu.Item>
          <Menu.Item as="a" to="https://github.com">
            Blog
          </Menu.Item>
          <Menu.Item as="a" to="https://github.com">
            Blog
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

class MobileHeader extends Component {
  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { children } = this.props;
    const { visible } = this.state;

    return (
      
        <NavBarMobile
        onPusherClick={this.handlePusher}
        onToggle={this.handleToggle}
        visible={visible}
        >
            {children}
        </NavBarMobile>
    );
  }
}


export default MobileHeader;
