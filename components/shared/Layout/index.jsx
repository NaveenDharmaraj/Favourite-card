import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import {
    Container,
    Responsive,
} from 'semantic-ui-react';

import Header from '../Header';
import Footer from '../Footer';
import AuthMobileHeader from '../Header/AuthHeader/MobileHeader';
import { Router } from '../../../routes';

import '../../../static/less/header.less';
import '../../../static/less/style.less';

const getWidth = () => {
    const isSSR = typeof window === 'undefined';
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
};

// const Layout = (props) => {
class Layout extends React.Component {
    componentDidMount() {
        const {
            authRequired,
            isAuthenticated,
        } = this.props;
        if (authRequired && !isAuthenticated) {
            Router.pushRoute('/users/login');
        }
    };

    renderLayout = (authRequired, children, isAuthenticated) => {
        if (authRequired && !isAuthenticated) {
            return null;
        }
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
                    <script id="stripe-js" src="https://js.stripe.com/v3/" />
                </Head>
                <div>
                    <Responsive {...Responsive.onlyMobile}>
                        <AuthMobileHeader>
                            <Container><div className="pageWraper">{children}</div></Container>
                        </AuthMobileHeader>
                    </Responsive>
                    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                        <Header isAuthenticated={isAuthenticated} />
                         <Container><div className="pageWraper">{children}</div></Container>
                    </Responsive>
                    <Footer />
                </div>
            </Responsive>
        );
    }

    render() {
        const {
            authRequired,
            children,
            isAuthenticated,
        } = this.props;
        return (
            this.renderLayout(authRequired, children, isAuthenticated)
        );
    }
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(Layout);
