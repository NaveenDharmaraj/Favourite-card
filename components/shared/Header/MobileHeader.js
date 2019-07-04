import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  Header,
  Icon,
  Accordion,
  Image,
  Menu,
  Responsive,
  Sidebar,
  Dropdown,
  Segment,
  Visibility,
} from 'semantic-ui-react'
//import logo from './logo.png';
class MobileHeader extends Component {

  render() {

    const {
      handleSidebarHide,
      sidebarOpened,
      handleClick,
      activeIndex
    } = this.props;
    return (
      <Sidebar
        as={Menu}
        animation='push'
        onHide={handleSidebarHide}
        vertical
        visible={sidebarOpened}
        direction='right'
      >
        <Menu.Item>
          <Button as="a" color="blue" fluid style={{ marginBottom: '5px' }}>Sign up</Button>
          <Button as="a" basic color="blue" fluid >Login</Button>
        </Menu.Item>
        <Menu.Item as='a' active>
          Home
        </Menu.Item>
        <Accordion as={Menu} vertical>
          <Menu.Item>
            <Accordion.Title
              active={activeIndex === 0}
              content='Features'
              index={0}
              onClick={handleClick}
            />
            <Accordion.Content as="a" active={activeIndex === 0}>
              Fundraising
            </Accordion.Content>
            <Accordion.Content as="a" active={activeIndex === 0}>
              Ways to give
            </Accordion.Content>
            <Accordion.Content as="a" active={activeIndex === 0}>
              Community
            </Accordion.Content>
            <Accordion.Content as="a" active={activeIndex === 0}>
              Accounts
            </Accordion.Content>
          </Menu.Item>

          <Menu.Item>
            <Accordion.Title
              active={activeIndex === 1}
              content='Colors'
              index={1}
              onClick={handleClick}
            />
            <Accordion.Content active={activeIndex === 1}>
              Hi2
            </Accordion.Content>
            <Accordion.Content as="a" active={activeIndex === 1}>
              Fundraising
            </Accordion.Content>
            <Accordion.Content as="a" active={activeIndex === 1}>
              Ways to give
            </Accordion.Content>
            <Accordion.Content as="a" active={activeIndex === 1}>
              Community
            </Accordion.Content>
            <Accordion.Content as="a" active={activeIndex === 1}>
              Accounts
            </Accordion.Content>
          </Menu.Item>
        </Accordion>
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
    )
  }
}
export default MobileHeader
