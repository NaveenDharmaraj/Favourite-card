import React from 'react';
import {
    Button,
    Grid,
    Menu,
    Popup,
} from 'semantic-ui-react';
import { withTranslation } from '../../../../i18n';
import { Link } from '../../../../routes';

const Give = () => (
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
                                <Button fluid basic content="Give" />
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <div className="give-description">
                        <a> What is this?</a>
                        {/* <br />
                        <div>
                            Give to any Canadian charity through CHIMP—either directly, or via a Giving Group. A Giving Group is where people pool or raise money together for the charities of their choice.
                            <br />
                            <br />
                            <Button basic content="Start your own group" />
                            <br />
                        </div> */}
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
                                <Button fluid basic content="Give" />
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <div className="give-description">
                        <a>What is this?</a>
                        <br />
                        {/* <div>
                            Give to any Canadian charity through CHIMP—either directly, or via a Giving Group. A Giving Group is where people pool or raise money together for the charities of their choice.
                            <br />
                            <br />
                            <Button basic content="Start your own group" />
                            <br />
                        </div> */}
                    </div>
                </Grid>
            </div>
        </Popup.Content>
    </Popup>
);
export default withTranslation('authHeader')(Give);
