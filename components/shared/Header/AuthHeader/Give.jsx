import React, { Component } from 'react';
import {
    Button,
    Grid,
    Menu,
    Popup,
    Accordion,
} from 'semantic-ui-react';

import { withTranslation } from '../../../../i18n';
import { Link } from '../../../../routes';

class Give extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            activeIndex: -1,
        classForMargin:'give-popup' }
    }
    
    componentDidMount() {
        window.addEventListener('scroll', () => {
            let classForSticky = 'give-popup';
            if (window.scrollY >= 57) {
                classForSticky = 'give-popup sticky-dropdown';
            }
            this.setState({
                classForMargin: classForSticky,
            });
        });
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render() {
        const { activeIndex, classForMargin } = this.state
        return (
            <Popup
                basic
                on="click"
                wide
                className={classForMargin}
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
                                    Give to a charity or Giving Group
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
                                    Give to registered charities in Canada. Or, give to a Giving Group, which are groups of people supporting charities together.
                                    </p>
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
                                    Give charitable dollars to a friend
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
                                        Send friends charitable dollars that they can give away.
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
