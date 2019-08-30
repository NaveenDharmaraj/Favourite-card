import React, {
    Fragment,
} from 'react';
import {
    Menu,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import _noop from 'lodash/noop';
import {
    string,
    func,
} from 'prop-types';

import { Link } from '../../../../routes';
import { withTranslation } from '../../../../i18n';

const MainNavItem = (props) => {
    const {
        isExternal,
        location,
        name,
    } = props;
    if(isExternal) {
        return (
            <Link href={location}>
                <Menu.Item as="a">
                    {name}
                </Menu.Item>
            </Link>
        );
    }
    return (
        <Link route={location}>
            <Menu.Item as="a">
                {name}
            </Menu.Item>
        </Link>
    );
};

const MainNav = (props) => {
    const {
        currentAccount: {
            accountType,
            slug,
        },
    } = props;
    const formatMessage = props.t;
    const menuLinks = [];
    if (accountType === 'company') {
        menuLinks.push({
            location: `/companies/${slug}`,
            name: 'Dashboard',
            isExternal: true,
        });
        menuLinks.push({
            location: `/companies/${slug}/match-requests/new`,
            name: 'Match Requests',
            isExternal: true,
        });
        menuLinks.push({
            location: `/companies/${slug}/employees`,
            name: 'Manage Employees',
            isExternal: true,
        });
    } else if (accountType === 'charity') {
        menuLinks.push({
            location: `/admin/beneficiaries/${slug}`,
            name: 'Dashboard',
            isExternal: true,
        });
        menuLinks.push({
            location: `/admin/beneficiaries/${slug}/eft`,
            name: 'Direct Deposit',
            isExternal: true,
        });
        menuLinks.push({
            location: `/admin/beneficiaries/${slug}/tool`,
            name: 'Take Donations Online',
            isExternal: true,
        });
        menuLinks.push({
            location: `/admin/beneficiaries/${slug}/members`,
            name: 'Manage Admins',
            isExternal: true,
        });
    } else {
        menuLinks.push({
            location: '/user/groups',
            name: 'Giving Groups & Campaigns',
            isExternal: false,
        });
        menuLinks.push({
            location: '/user/favorites',
            name: 'Favorites',
            isExternal: false,
        });
        menuLinks.push({
            location: '/user/recurring-donations',
            name: 'Tools',
            isExternal: false,
        });
        menuLinks.push({
            location: '/user/tax-receipts',
            name: 'Tax receipts',
            isExternal: false,
        });
    }

    return (
        <Menu.Menu position="right">
            <Link route='/search'>
                <Menu.Item as="a">
                    Explore
                </Menu.Item>
            </Link>
            {menuLinks.map((item) => <MainNavItem {...item} />)}
        </Menu.Menu>
    );
};

MainNav.defaultProps = {
    currentAccount: {
        avatar: '',
        name: '',
    },
    t: _noop,
};

MainNav.propTypes = {
    currentAccount: {
        avatar: string,
        name: string,
    },
    t: func,
};

const mapStateToProps = (state) => ({
    currentAccount: state.user.currentAccount,
});

export default withTranslation('authHeader')(connect(mapStateToProps)(MainNav));
