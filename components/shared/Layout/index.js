import React from 'react'
import Head from 'next/head';
import Header from '../Header';
import { Responsive, Container } from 'semantic-ui-react';

const getWidth = () => {
    const isSSR = typeof window === 'undefined'
  
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class Layout extends React.Component {
    render () {
        return (
            <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
                <Head>
                    <title>
                        Charitable Impact
                    </title>
                    <link
                        rel="stylesheet"
                        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"
                    />
                    <script type="text/javascript" src="https://js.stripe.com/v3/"></script>
                </Head>
                <Header />
                <Container>
                    {this.props.children}
                </Container>
            </Responsive>
        )
    }
}

export default Layout;
