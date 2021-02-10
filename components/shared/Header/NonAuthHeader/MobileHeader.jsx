import React, { Component } from "react";
import {
    Accordion,
    Image,
    Menu,
    Sidebar,
    Button,
} from "semantic-ui-react";
import getConfig from 'next/config';
import storage from '../../../../helpers/storage';
import { Link } from '../../../../routes';
import logo from '../../../../static/images/CharitableImpact.png';
import searchIcon from '../../../../static/images/icons/icon-search.svg';

const { publicRuntimeConfig } = getConfig();

const {
    CORP_DOMAIN,
    HELP_CENTRE_URL,
} = publicRuntimeConfig;

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
        const { activeIndex } = this.state;
        let claimCharityAccessCode;
        if (typeof Storage !== 'undefined') {
            claimCharityAccessCode = storage.getLocalStorageWithExpiry('claimToken', 'local');
        }
        return (
            <Sidebar.Pushable className="c-m-default-header">
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    vertical
                    visible={visible}
                    direction="right"
                >
                    <Menu.Item className="twoBtnWraper" >
                        <Link route="/users/login" >
                            <Button as="a" basic color="blue" onClick={this.handleToggle}>Login</Button>
                        </Link>
                        <Link route={claimCharityAccessCode ? `/users/new?isClaimCharity=${true}` : '/users/new'}>
                            <Button as="a" color="blue"  onClick={this.handleToggle}>Sign up</Button>
                        </Link>
                    </Menu.Item>
                    <Menu.Item as='a' href={`${CORP_DOMAIN}/how-it-works/`}>
                        How it works
                    </Menu.Item>
                    <Accordion as={Menu} vertical>
                        <Menu.Item>
                            <Accordion.Title
                                active={activeIndex === 0}
                                index={0}
                                onClick={this.handleClick}
                            ><span>About</span></Accordion.Title>
                            <Accordion.Content as="a" active={activeIndex === 0} href={`${CORP_DOMAIN}/who-we-are/`}>
                                who we are
                            </Accordion.Content>
                            <Accordion.Content as="a" active={activeIndex === 0} href={`${CORP_DOMAIN}/foundation/`}>
                                Charitable Impact Foundation
                            </Accordion.Content>
                            <Accordion.Content as="a" active={activeIndex === 0} href={`${CORP_DOMAIN}/careers/`}>
                                Careers
                            </Accordion.Content>
                            <Accordion.Content as="a" active={activeIndex === 0} href={`${CORP_DOMAIN}/press/`}>
                                Press
                            </Accordion.Content>
                        </Menu.Item>
                        <Menu.Item>
                            <Accordion.Title
                                active={activeIndex === 1}
                                index={1}
                                onClick={this.handleClick}
                            >
                                <span>Solutions</span>
                            </Accordion.Title>
                            <Accordion.Content as="a" active={activeIndex === 1} href={`${CORP_DOMAIN}/advisors/`}>
                                For Advisors
                            </Accordion.Content>
                            <Accordion.Content as="a" active={activeIndex === 1} href={`${CORP_DOMAIN}/charities/`}>
                                For Charities
                            </Accordion.Content>
                        </Menu.Item>
                        <Menu.Item>
                            <Accordion.Title
                                active={activeIndex === 2}
                                index={2}
                                onClick={this.handleClick}
                            >
                                <span>Support</span>
                            </Accordion.Title>
                            <Accordion.Content as="a" active={activeIndex === 2} href={`${HELP_CENTRE_URL}`}>
                                Help Centre
                            </Accordion.Content>
                            <Accordion.Content as="a" active={activeIndex === 2} href={`${CORP_DOMAIN}/contact/`}>
                                Contact us
                            </Accordion.Content>
                        </Menu.Item>
                    </Accordion>
                    <Menu.Item as='a' href={`${CORP_DOMAIN}/blog/`}>Blog</Menu.Item>
                </Sidebar>
                <Sidebar.Pusher
                onClick={this.handlePusher}
                >
                    <Menu secondary className="fixed-header">
                        <Menu.Item className="brand">
                        <Image src={logo} />
                        </Menu.Item>
                        

                        <Menu.Menu position="right">
                            <Menu.Item className="searchIconWraper">
                                <Link route="/search">
                                    <Image src={searchIcon}/>
                                </Link>
                            </Menu.Item>
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