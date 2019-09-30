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

import Link from '../../Link';
import { withTranslation } from '../../../../i18n';
import { getMainNavItems } from '../../../../helpers/utils';

import MainNavItem from './MainNavItem';


const MainNav = (props) => {
    const {
        currentAccount: {
            accountType,
            slug,
        },
    } = props;
    const formatMessage = props.t;
    const menuLinks = getMainNavItems(accountType, slug);

    return (
        <Menu.Menu position="right">
            <Link route='/search' activeClassName="active">
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
