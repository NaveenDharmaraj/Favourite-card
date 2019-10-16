import React, { Component } from 'react';
import {
    Button,
    Grid,
    Menu,
    Popup,
    Accordion,
} from 'semantic-ui-react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

import { withTranslation } from '../../../../i18n';
import { Link } from '../../../../routes';

class Give extends Component {
    constructor(props) {
        super(props);
        this.state = { activeIndex: -1 }
    }
    
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render() {
        const { activeIndex } = this.state
        return (
            <Popup
                basic
                on="click"
                wide
                className="give-popup"
                position="bottom right"
                trigger={(
                    <Menu.Item className="user-img give-btn">
                        <Button className="blue-btn-rounded-def w-120">Give</Button>
                    </Menu.Item>
                )}
            >
                <Popup.Header>
                    How would you like to give?
                </Popup.Header>
                <Popup.Content>
                    <div className="give-popup-inner">
                        <Grid verticalAlign="middle">
                            <Grid.Row columns={2}>
                                <Grid.Column mobile={16} tablet={10} computer={10}>
                                Send chairty dollars to a charity or Giving Group
                                    <br />
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={6} computer={6}>
                                    <Link route="/give">
                                        <Button fluid className="blue-bordr-btn-round-def" content="Give" />
                                    </Link>
                                </Grid.Column>
                            </Grid.Row>
                            <div className="give-description">
                                <Accordion>
                                    <Accordion.Title
                                    active={activeIndex === 0}
                                    index={0}
                                    onClick={this.handleClick}
                                    >
                                    <a>What is this?</a>
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0}>
                                    <p>
                                        Give to any Canadian charity through CHIMP—either directly, or via a Giving Group. A Giving Group is where people pool or raise money together for the charities of their choice.
                                    </p>
                                    <a href={`${RAILS_APP_URL_ORIGIN}/groups/new`}>
                                        <Button className="blue-bordr-btn-round-def" content="Start your own group" />
                                    </a>
                                    </Accordion.Content>
                                </Accordion>
                            </div>
                        </Grid>
                    </div>
                </Popup.Content>
                <Popup.Content>
                    <div className="give-popup-inner">
                        <Grid verticalAlign="middle">
                            <Grid.Row columns={2}>
                                <Grid.Column mobile={16} tablet={10} computer={10}>
                                    Send charity dollars to other people
                                    <br />
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={6} computer={6}>
                                    <Link route="/give/to/friend/new">
                                        <Button fluid className="blue-bordr-btn-round-def" content="Give" />
                                    </Link>
                                </Grid.Column>
                            </Grid.Row>
                            <div className="give-description">
                                <Accordion>
                                    <Accordion.Title
                                    active={activeIndex === 1}
                                    index={1}
                                    onClick={this.handleClick}
                                    >
                                    <a>What is this?</a>
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 1}>
                                    <p>
                                        Send more meaningful gifts, and empower your friends, family, and wider circles to give wherever and whenever they want.
                                    </p>
                                    </Accordion.Content>
                                </Accordion>
                            </div>
                        </Grid>
                    </div>
                </Popup.Content>
            </Popup>
        )
    }
}
export default withTranslation('authHeader')(Give);
