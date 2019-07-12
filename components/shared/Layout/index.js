import React, { Fragment } from 'react';
import Head from 'next/head';
import { Responsive, Container, Segment } from 'semantic-ui-react';

import Header from '../Header';
import Footer from '../Footer';

// import MobileHeader from '../Header/MobileHeader';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

const getWidth = () => {
    const isSSR = typeof window === 'undefined'
  
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const Layout = (props) => {
// class Layout extends React.Component {
    return (
        <Responsive getWidth={getWidth}>
            <Head>
                <title>
                    Charitable Impact
                </title>
                <link
                    rel="stylesheet"
                    href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"
                />
            </Head>
            <Fragment>
                <DesktopContainer>
                    <Container
                        style={{minHeight: 500}}
                    >
                        {props.children}
                    </Container>
                    <Footer/>
                </DesktopContainer>
                <MobileContainer>
                    <Container>
                        {props.children}
                    </Container>
                    <Footer/>
                </MobileContainer>
            </Fragment>
        </Responsive>
    )
}

export default Layout;
