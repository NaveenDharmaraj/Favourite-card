import { withRouter } from 'next/router';
import React, {
    Children,
    cloneElement,
} from 'react';

import { Link } from '../../routes';

const ActiveLink = ({
    router, children, ...props
}) => {
    const child = Children.only(children);

    let className = child.props.className || '';
    const toolsArr = ['/user/recurring-gifts', '/user/giving-goals'];
    if (child.props.children === 'Tools' && toolsArr.includes(router.pathname)) {
        className = 'active';
    }
    if (router.pathname === (props.href || props.route) && props.activeClassName) {
        className = `${className} ${props.activeClassName}`.trim();
    }

    delete props.activeClassName;

    return <Link {...props}>{cloneElement(child, { className })}</Link>;
};

export default withRouter(ActiveLink);
