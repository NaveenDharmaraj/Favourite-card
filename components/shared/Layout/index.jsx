import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import getConfig from 'next/config';
import {
    Container,
    Responsive,
} from 'semantic-ui-react';

import Header from '../Header';
import Footer from '../Footer';
import MobileHeader from '../Header/MobileHeader';
import { Router } from '../../../routes';
import ManiFestFile from '../../../static/Manifest.json';
import { NotificationHelper } from "../../../Firebase/NotificationHelper";
import ErrorBoundary from '../ErrorBoundary';
import StatusMessage from '../StatusMessage';

import '../../../static/less/header.less';
import '../../../static/less/style.less';

const { publicRuntimeConfig } = getConfig();

const {
    APPLOZIC_WS_URL,
    APPLOZIC_APP_KEY
} = publicRuntimeConfig;

const getWidth = () => {
    const isSSR = typeof window === 'undefined';
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
};

// const Layout = (props) => {
class Layout extends React.Component {
    async componentDidMount() {
        const {
            dispatch,
            authRequired,
            isAuthenticated,
            userInfo
        } = this.props;
        if (authRequired && !isAuthenticated) {
            Router.pushRoute('/users/login');
        } else {
            await NotificationHelper.getMessages(userInfo, dispatch);
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
                    <link rel="manifest" href="/static/Manifest.json" />
                    <link
                        rel="stylesheet"
                        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
                    />
                    <script id="stripe-js" src="https://js.stripe.com/v3/" />
                    <script type="text/javascript" src="https://cdn.applozic.com/applozic/applozic.chat-5.6.1.min.js"></script>
                    <script type="text/javascript">
                        window.APPLOZIC_WS_URL= "{APPLOZIC_WS_URL}";
                        window.APPLOZIC_APP_KEY="{APPLOZIC_APP_KEY}";
                    </script>
                    {isAuthenticated ? <script type="text/javascript" src="/static/initApplozic.js"></script> : ""}
                    {/* <script type="text/javascript" src="https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js"></script> */}
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
        userInfo: state.user.info,
        appErrors: state.app.errors,
    };
}

export default connect(mapStateToProps)(Layout);
