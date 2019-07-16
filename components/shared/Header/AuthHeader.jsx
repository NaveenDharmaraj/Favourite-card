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
  Divider,
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

const NavBarDesktop = () => (
  <Segment textAlign='center'
  vertical
  className='c-login-header'>
    <Container>
      <Menu secondary>
        <Menu.Item>
          <Image  style={{width:'131px'}} src={logo} />
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item as="a" to="https://github.com">
            Explore
          </Menu.Item>
          <Menu.Item as="a" to="https://github.com">
            Giving Groups & Campaign
          </Menu.Item>
          <Menu.Item as="a" to="https://github.com">
            Favorites
          </Menu.Item>
          <Menu.Item as="a" to="https://github.com">
            Tools
          </Menu.Item>
          <Menu.Item as="a" to="https://github.com">
            Tax receipts
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
        <Popup position='bottom center' pinned className="notification-popup"
            trigger={
          <Menu.Item as="a">
            <Label color='red' floating circular>
              12
            </Label>
            <Icon name="bell outline"/>
          </Menu.Item>
          } flowing hoverable>
              
          <Popup.Header>Notification <a style={{float:'right'}}><Icon name="setting"/></a></Popup.Header>
          <Popup.Content>
            <List relaxed='very'>
              <List.Item>
                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                <List.Content>
                  <List.Header><a>Daniel Louise</a> Started followed you</List.Header>
                  <List.Description>
                    4 hours ago
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/stevie.jpg' />
                <List.Content>
                  <List.Header as='a'>Stevie Feliciano</List.Header>
                  <List.Description>
                    Last seen watching{' '}
                    <a>
                      <b>Bob's Burgers</b>
                    </a>{' '}
                    10 hours ago.
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                <List.Content>
                  <List.Header as='a'>Elliot Fu</List.Header>
                  <List.Description>
                    Last seen watching{' '}
                    <a>
                      <b>The Godfather Part 2</b>
                    </a>{' '}
                    yesterday.
                  </List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Popup.Content>
          <div className="popup-footer text-center">
            <a href="">See all activity</a>
          </div>
        </Popup>
              <Menu.Item as="a">
              <Label color='red' floating circular>
                3
              </Label>
              <Icon name='chat' />
              </Menu.Item>
            
          <Menu.Item as="a" className="user-img">
            
              <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png'style={{width:'35px'}} circular />
            
          </Menu.Item>
          <Menu.Item className="user-img give-btn">
            <Button primary>Give</Button>
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
