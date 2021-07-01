import React, { Fragment } from 'react';
import {
    Button,
    Dropdown,
    Icon,
    Menu,
    Image,
} from 'semantic-ui-react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { Link } from '../../../../routes';
import searchIcon from '../../../../static/images/icons/icon-search.svg';

const { publicRuntimeConfig } = getConfig();

const {
    CORP_DOMAIN,
    HELP_CENTRE_URL,
} = publicRuntimeConfig;

const NonAuthHeader = () => {
    const router = useRouter();
    const {
        query: {
            step,
        },
    } = router;
    const loginUrl = step ? `/users/login?invitationType=groupInvite&sourceId=${step}` : `/users/login`;
    return (
        <Fragment>
            <Menu.Menu className="left-menu">
                <Menu.Item as="a" href={`${CORP_DOMAIN}/how-it-works/`}>
                    How it works
                </Menu.Item>
                <Dropdown item text="About">
                    <Dropdown.Menu>
                        <Dropdown.Item as="a" href={`${CORP_DOMAIN}/who-we-are/`} text="Who we are"/>
                        <Dropdown.Item as="a" href={`${CORP_DOMAIN}/foundation/`} text="Charitable Impact Foundation" />
                        <Dropdown.Item as="a" href={`${CORP_DOMAIN}/fees/`} text="Fees" />
                        <Dropdown.Item as="a" href={`${CORP_DOMAIN}/careers/`} text="Careers" />
                        <Dropdown.Item as="a" href={`${CORP_DOMAIN}/press/`} text="Press" />
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown item text="Solutions">
                    <Dropdown.Menu>
                        <Dropdown.Item as="a" href={`${CORP_DOMAIN}/advisors/`} text="For Advisors"/>
                        <Dropdown.Item as="a" href={`${CORP_DOMAIN}/charities/`} text="For Charities" />
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown item text="Support">
                    <Dropdown.Menu>
                        <Dropdown.Item as="a" href={`${HELP_CENTRE_URL}`} text="Help Centre"/>
                        <Dropdown.Item as="a" href={`${CORP_DOMAIN}/contact/`} text="Contact us" />
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item as="a" href={`${CORP_DOMAIN}/blog/`}>
                    Blog
                </Menu.Item>
            </Menu.Menu>
            <Menu.Menu position="right btn-wraper">
                <Link route="/search">
                    <Menu.Item as="a" to="" className="login-btn searchImg">
                        <Image src={searchIcon} />
                    </Menu.Item>
                </Link>
                <Link route={loginUrl}>
                    <Menu.Item as="a" to="" className="login-btn">
                        Login
                    </Menu.Item>
                </Link>
                <Link route="/users/new">
                    <Menu.Item className="signup">
                        <Button primary>Sign Up</Button>
                    </Menu.Item>
                </Link>
            </Menu.Menu>
        </Fragment>
    );
};

export default NonAuthHeader;
