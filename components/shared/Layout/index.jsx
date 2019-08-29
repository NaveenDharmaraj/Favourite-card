import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import {
    Container,
    Responsive,
} from 'semantic-ui-react';

import Header from '../Header';
import Footer from '../Footer';
import MobileHeader from '../Header/MobileHeader';
import { Router } from '../../../routes';
import ErrorBoundary from '../ErrorBoundary';
import StatusMessage from '../StatusMessage';

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

    renderLayout = (authRequired, children, isAuthenticated, onBoarding, dispatch, appErrors) => {
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
                        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
                    />
                    <script id="stripe-js" src="https://js.stripe.com/v3/" />
                </Head>
                <div>
                    <ErrorBoundary>
                        <Responsive {...Responsive.onlyMobile}>
                            <MobileHeader isAuthenticated={isAuthenticated} onBoarding={onBoarding} >
                                <Container>
                                    <div className="pageWraper">
                                        {!_.isEmpty(appErrors) &&
                                            <Container
                                                className="app-status-messages"
                                            >
                                                {_.map(appErrors, (err) => (
                                                    <StatusMessage
                                                        key={err.heading}
                                                        error={err}
                                                        dispatch={dispatch}
                                                        {...err}
                                                    />
                                                ))}
                                            </Container>
                                        }
                                        {children}
                                    </div>
                                </Container>
                            </MobileHeader>
                        </Responsive>
                        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                            <Header isAuthenticated={isAuthenticated} onBoarding={onBoarding} />
                                {!_.isEmpty(appErrors) &&
                                    <Container
                                        className="app-status-messages"
                                    >
                                        {_.map(appErrors, (err) => (
                                            <StatusMessage
                                                key={err.heading}
                                                error={err}
                                                dispatch={dispatch}
                                                {...err}
                                            />
                                        ))}
                                    </Container>
                                }
                                {children}
                        </Responsive>
                        <Footer />
                    </ErrorBoundary>
                </div>
            </Responsive>
        );
    }

    render() {
        const {
            appErrors,
            authRequired,
            children,
            isAuthenticated,
            dispatch,
            onBoarding,
        } = this.props;
        return (
            this.renderLayout(authRequired, children, isAuthenticated, onBoarding, dispatch, appErrors)
        );
    }
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        appErrors: state.app.errors,
    };
}

export default connect(mapStateToProps)(Layout);
