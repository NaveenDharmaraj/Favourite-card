import React, { Component } from "react";
import { render } from "react-dom";
import {
  Container,
  Icon,
  Image,
  Menu,
  Sidebar,
  Responsive,
  Button,
  Accordion,
  Segment,
  Label,
  Popup,
  List
} from "semantic-ui-react";
import logo from '../../../static/images/CharitableImpact.png';
const NavBarMobile = ({
  state,
  children,
  leftItems,
  onPusherClick,
  onToggle,
  rightItems,
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
          <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
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

const NavBarDesktop = () => (
  <Segment textAlign='center'
  vertical
  className='c-logout-header'>
    <Container>
      <Menu secondary>
        <Menu.Item>
          <Image src={logo} style={{width:'131px'}}/>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            Already have an account?
          </Menu.Item>
          <Menu.Item>
            <Button basic  className="outline-btn">Sign in</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Container>
  </Segment>
);

const NavBarChildren = ({ children }) => (
  <Container>{children}</Container>
);

class NavBar extends Component {
  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { children, leftItems, rightItems } = this.props;
    const { visible } = this.state;

    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            leftItems={leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            rightItems={rightItems}
            visible={visible}
          >
            <NavBarChildren>{children}</NavBarChildren>
          </NavBarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
          <NavBarChildren>{children}</NavBarChildren>
        </Responsive>
      </div>
    );
  }
}


export default NavBar;
