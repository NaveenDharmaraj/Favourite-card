import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  Header,
  Icon,
  Image,
  Menu,
  Responsive,
  Dropdown,
  Segment,
  Transition,
  Input,
  Visibility,
} from 'semantic-ui-react'
//import logo from './logo.png';
class DesktopHeader extends Component {
  state = {}
  state = { visible: false }

  toggleVisibility = () => this.setState(prevState => ({ visible: !prevState.visible }))
  render() {
    const { children } = this.props
    const { fixed } = this.state
    const { visible } = this.state
    return (
      <Segment

        textAlign='center'
        vertical
        className='c-def-header'
      >
      <Menu
        pointing={!fixed}
        secondary={!fixed}
        size='large'
      >
        <Container>
        <Menu.Item className="brand">
          <Image className="c-logo-m" src='' />

        </Menu.Item>
        <div className="flexbox-wraper w-100">
          <Dropdown item text='Features'>
            <Dropdown.Menu>
              <Dropdown.Item href="https://github.com" text='Fundraising' />
              <Dropdown.Item text='Ways to give'/>
              <Dropdown.Item text='Community'/>
              <Dropdown.Item text='Accounts'/>
              <Dropdown.Item text='Fees' />
              <Dropdown.Item text='Trust' />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text='Solutions'>
            <Dropdown.Menu>
              <Dropdown.Item text='Individuals' />
              <Dropdown.Item text='Groups' />
              <Dropdown.Item text='Workplace' />
              <Dropdown.Item text='Philanthropists' />
              <Dropdown.Item text='Education' />
              <Dropdown.Item text='Sports' />
              <Dropdown.Item text='Funding'/>
              <Dropdown.Item text='Organizations'/>
              <Dropdown.Item text='Charities'/>
              <Dropdown.Item text='Events' />
              <Dropdown.Item text='Families' />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text='About'>
            <Dropdown.Menu>
              <Dropdown.Item text='About Us' />
              <Dropdown.Item text='Our Story'/>
              <Dropdown.Item text='Team'/>
              <Dropdown.Item text='Press'/>
              <Dropdown.Item text='Charitable Impact ' />
              <Dropdown.Item text='Careers' />
              <Dropdown.Item text='Foundation' />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text='Support' >
            <Dropdown.Menu>
              <Dropdown.Item text='Contact Us' />
              <Dropdown.Item text='Help Centre'/>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item as="a" to="https://github.com">
            Blog
          </Menu.Item>
          <Menu.Item className="item-search" position='right'>
            <Button as='a' className='transparentBtn' onClick={this.toggleVisibility}>
              <Icon name='search' /> Search
            </Button>
          </Menu.Item>
          <Transition visible={visible} animation='scale' duration={500}>
            <div className="searchWraper">
              <Input fluid icon='search' iconPosition='left' placeholder='Search...' action={<Button icon='close' onClick={this.toggleVisibility}/>}/>
            </div>
          </Transition>
        </div>
        <Menu.Item position='right'>
          <Button as='a' basic color="blue" style={{ marginLeft: '0.5em' }}>
            Log in
          </Button>
          <Button as='a' color="blue" style={{ marginLeft: '0.5em' }}>
            Sign Up
          </Button>
        </Menu.Item>
        </Container>
      </Menu>
    </Segment>
)
}
}
export default DesktopHeader
