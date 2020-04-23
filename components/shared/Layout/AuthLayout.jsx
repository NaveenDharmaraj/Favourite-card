import React from 'react';
import Head from 'next/head';
import {
    Segment,
    Responsive,
} from 'semantic-ui-react';

import Header from '../Header';
import Footer from '../Footer';

const getWidth = () => {
    const isSSR = typeof window === 'undefined';
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
};

const AuthLayout = (props) => {
    const {
        children,
    } = props;
    return (
        <Responsive getWidth={getWidth}>
            <Head>
                <title>
                    Charitable Impact
                </title>
                <link
                    rel="stylesheet"
                    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
                />
                <script defer type="text/javascript" src="/static/branchio.js" />
            </Head>
            <div>
                {/** Segment is used to support Routes, routes does not work without segment */}
                <Segment className="loadingSegment">
                    {children}
                </Segment>
            </div>
        </Responsive>
    );
};

export default AuthLayout;
