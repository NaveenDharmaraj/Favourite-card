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
import _ from 'lodash';
import '../../../static/less/header.less';
import '../../../static/less/style.less';

const { publicRuntimeConfig } = getConfig();

const {
    APPLOZIC_WS_URL,
    APPLOZIC_APP_KEY,
    HELP_SCOUT_KEY
} = publicRuntimeConfig;

const getWidth = () => {
    const isSSR = typeof window === 'undefined';
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
};


class Layout extends React.Component {
    async componentDidMount() {
        const {
            dispatch,
            authRequired,
            currentUser,
            isAuthenticated,
            userInfo
        } = this.props;
        if (authRequired && !isAuthenticated) {
            let nextPathname;
            let searchQuery;
            if(typeof window !== 'undefined'){
                 nextPathname = window.location.pathname;
                 searchQuery = window.location.search;
            }
            let pathname = (nextPathname) ?
            `/users/login?returnTo=${nextPathname}${searchQuery}` : '/users/login';
            Router.pushRoute(pathname);
        } else {
            await NotificationHelper.getMessages(userInfo, dispatch, 1);
        }
        !function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});

        if(window && window.Beacon) {
            window.Beacon('init', HELP_SCOUT_KEY);
            if(currentUser){
                Beacon("identify", {
                    name: currentUser.attributes.displayName,
                    email: currentUser.attributes.email,
                  });
            }               
        }
        window.scrollTo(0, 0);
    };

    renderLayout = (authRequired, children, isAuthenticated, onBoarding, dispatch, appErrors, isLogin) => {
        if (authRequired && !isAuthenticated) {
            return null;
        }
        const userEmail = this.props.userInfo ? this.props.userInfo.attributes.email : "";
        const userAvatar = this.props.userInfo ? this.props.userInfo.attributes.avatar : "";
        const userDisplayName = this.props.userInfo ? this.props.userInfo.attributes.displayName : "";
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
                    <link
                        rel="stylesheet"
                        href="/static/fonts/proximanova/font.css"
                    />
                    <script id="stripe-js" src="https://js.stripe.com/v3/" />
                    <script type="text/javascript" src="https://cdn.applozic.com/applozic/applozic.chat-5.6.1.min.js"></script>
                    <script type="text/javascript">
                        window.APPLOZIC_WS_URL= "{APPLOZIC_WS_URL}";
                        window.APPLOZIC_APP_KEY="{APPLOZIC_APP_KEY}";
                        window.userEmail = "{userEmail}";
                        window.userAvatar = "{userAvatar}";
                        window.userDisplayName = "{userDisplayName}";
                    </script>
                    {isAuthenticated ? <script type="text/javascript" src="/static/initApplozic.js"></script> : ""}
                    {/* <script type="text/javascript" src="https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js"></script> */}
                </Head>
                <div>
                    <ErrorBoundary> 
                        <Responsive minWidth={320} maxWidth={991}>
                            <MobileHeader isAuthenticated={isAuthenticated} onBoarding={onBoarding} isLogin={isLogin}>
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
                            </MobileHeader>
                        </Responsive>
                        <Responsive minWidth={992}>
                            <Header isAuthenticated={isAuthenticated} onBoarding={onBoarding} isLogin={isLogin} />
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
                                <div style={{minHeight:'60vh'}}>
                                {children}
                                </div>
                        </Responsive>
                        <Footer isAuthenticated={isAuthenticated}/>
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
            isLogin,
            dispatch,
            onBoarding,
        } = this.props;
        return (
            this.renderLayout(authRequired, children, isAuthenticated, onBoarding, dispatch, appErrors, isLogin)
        );
    }
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        userInfo: state.user.info,
        appErrors: state.app.errors,
        currentUser: state.user.info,
    };
}

export default connect(mapStateToProps)(Layout);
