import React, { Component } from "react";
import {
    Accordion,
    Image,
    Menu,
    Sidebar,
    Button,
} from "semantic-ui-react";

import logo from '../../../../static/images/CharitableImpact.png';

class MobileHeader extends React.Component {

    
      

    state = {
        activeIndex: -1,
        visible: false,
    }
  
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
        // onPusherClick,
        // onToggle,
        // visible
        } = this.props;
        const {
            visible,
        } = this.state;
        const { activeIndex } = this.state
        return (
            <Sidebar.Pushable className="c-m-default-header">
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    vertical
                    visible={visible}
                    direction="right"
                    style={{width:'100vw',marginTop:'80px'}}
                >
                    <Menu.Item>
                        <Button as="a" color="blue" fluid style={{ marginBottom: '5px' }}>Sign up</Button>
                        <Button as="a" basic color="blue" fluid >Login</Button>
                    </Menu.Item>
                    <Menu.Item as='a' active>
                        Home
                    </Menu.Item>
                    <Accordion as={Menu}>
                        <Menu.Item>
                            <Accordion.Title
                                active={activeIndex === 0}
                                content='About'
                                index={0}
                                onClick={this.handleClick}
                            />
                            <Accordion.Content as="a" active={activeIndex === 0}>
                                Who We Are
                            </Accordion.Content>
                            <Accordion.Content as="a" active={activeIndex === 0}>
                                CHIMP Foundation
                            </Accordion.Content>
                            <Accordion.Content as="a" active={activeIndex === 0}>
                                Careers
                            </Accordion.Content>
                            <Accordion.Content as="a" active={activeIndex === 0}>
                                Press
                            </Accordion.Content>
                        </Menu.Item>
                    </Accordion>
                    <Menu.Item as='a'>Support</Menu.Item>
                    <Menu.Item as='a'>Blog</Menu.Item>
                    <Menu.Item className="sidebar-social">
                        <Button className='transparent' icon='twitter' />
                        <Button className='transparent' icon='facebook' />
                        <Button className='transparent' icon='instagram' />
                        <Button className='transparent' icon='vimeo v' />
                    </Menu.Item>
                </Sidebar>
                <Sidebar.Pusher
                onClick={this.handlePusher}
                style={{ minHeight: "100vh" }}
                >
                    <Menu secondary>
                        <Menu.Item className="brand">
                        <Image src={logo} />
                        </Menu.Item>
                        

                        <Menu.Menu position="right">
                        <Menu.Item onClick={this.handleToggle}>
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
        )
    }
  
}

export default MobileHeader;
