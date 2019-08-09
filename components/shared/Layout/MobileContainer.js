import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Accordion,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Transition,
  Input,
  Responsive,
  Dropdown,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react'
import MobileHeader from '../Header/MobileHeader';

const getWidth = () => {
  const isSSR = typeof window === 'undefined'

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class MobileContainer extends Component {
  state = {}
  state = { visible: false }
  handleSidebarHide = () => this.setState({ sidebarOpened: false })
  toggleVisibility = () => this.setState(prevState => ({ visible: !prevState.visible }))
  handleToggle = () => this.setState({ sidebarOpened: true })
  state = { activeIndex: -1 }
  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }
  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state
    const { visible } = this.state
    const { activeIndex } = this.state
    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
        className='c-m-def-header'
      >

        <MobileHeader
          handleSidebarHide={this.handleSidebarHide}
          handleClick={this.handleClick}
          sidebarOpened={sidebarOpened}
          activeIndex={activeIndex}
        />
        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign='center'
            style={{ minHeight: 350, padding: '1em 0em' }}
            vertical
          >
            <Container>
              <div className="relativeWraper">
              <Transition visible={visible} animation='scale' duration={500}>
                <div className="searchWraper">
                  <Input fluid icon='search' iconPosition='left' placeholder='Search...' action={<Button icon='close' onClick={this.toggleVisibility}/>}/>
                </div>
              </Transition>
                <Menu pointing secondary size='large'>
                  <Menu.Item position='right'>
                    <Button as='a' className="transparent" onClick={this.toggleVisibility}>
                      <Icon name='search' /> Search
                    </Button>
                    <Button as='a' color="blue" style={{ marginLeft: '0.5em' }}>
                      Sign Up
                    </Button>
                  </Menu.Item>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name='sidebar' />
                  </Menu.Item>
                </Menu>

              </div>
            </Container>

          </Segment>

          {children}
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

export default MobileContainer
