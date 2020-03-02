import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import getConfig from 'next/config';
import {
    Container,
    Responsive,
} from 'semantic-ui-react';
import {
    boolean,
    string,
} from 'prop-types';

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
    APPLOZIC_BASE_URL,
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
            addCauses,
            authRequired,
            currentUser,
            isAuthenticated,
            userInfo
        } = this.props;

        // if the user didnt setup any causes then redirect to causes selection page
        if  (!_.isEmpty(userInfo) && !addCauses) {
            const {
                attributes: {
                    causes,
                }
            } = userInfo;

            if (_.isEmpty(causes)) {
                Router.pushRoute('/user/causes');
            }
        }
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
            // await NotificationHelper.getMessages(userInfo, dispatch, 1);
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
            Beacon('session-data', {
                'currentPage': window.location.href,
            })
            if(document){
                Beacon('event', {
                    type: 'page-viewed',
                    url: window.location.href,
                    title: document.title,
                })
            }
              
                
            Beacon('config', {
                "labels": {
                    "suggestedForYou": "Answers to common questions",
                    "responseTime": "One of our team members will get back to you shortly.",
                    "messageSubmitLabel": "Send message"
                  }
            });
        }
        window.scrollTo(0, 0);
    };

    renderLayout = (authRequired, children, isAuthenticated, onBoarding, dispatch, appErrors, isLogin, showHeader) => {
        if (authRequired && !isAuthenticated) {
            return null;
        }
        const{
            title,
            description,
        } = this.props;
        const userEmail = this.props.userInfo ? this.props.userInfo.attributes.email : "";
        const userAvatar = this.props.userInfo ? this.props.userInfo.attributes.avatar : "";
        const userDisplayName = this.props.userInfo ? this.props.userInfo.attributes.displayName : "";
        const userFirstName = this.props.userInfo ? this.props.userInfo.attributes.firstName : "";
        const userLastName = this.props.userInfo ? this.props.userInfo.attributes.lastName : "";
        return (
            <Responsive getWidth={getWidth}>
                <Head>
                    <title>
                       {title}
                    </title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <meta name="description" content={description}/>
                    <link rel="icon" type="image/x-icon" href="https://d1wjn4fmcgu4dn.cloudfront.net/web/favicon.ico" />
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
                    <script type="text/javascript" defer  src="https://cdn.applozic.com/applozic/applozic.chat-5.6.1.min.js"></script>
                    <script type="text/javascript" defer>
                        window.APPLOZIC_BASE_URL= "{APPLOZIC_BASE_URL}";
                        window.APPLOZIC_WS_URL= "{APPLOZIC_WS_URL}";
                        window.APPLOZIC_APP_KEY="{APPLOZIC_APP_KEY}";
                        window.userEmail = "{userEmail}";
                        window.userAvatar = "{userAvatar}";
                        window.userDisplayName = "{userDisplayName}";
                        window.userFirstName = "{userFirstName}";
                        window.userLastName = "{userLastName}";
                    </script>
                    {isAuthenticated ? <script defer  type="text/javascript" src="/static/initApplozic.js"></script> : ""}
                    {/* <script type="text/javascript" src="https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js"></script> */}
                </Head>
                <div>
                    <ErrorBoundary>
                        <Responsive minWidth={320} maxWidth={991}>
                            <MobileHeader isAuthenticated={isAuthenticated} onBoarding={onBoarding} isLogin={isLogin} showHeader={showHeader}>
                                <div style={{minHeight:'60vh'}}>
                                    {children}
                                </div>
                                <Footer isAuthenticated={isAuthenticated}/>
                            </MobileHeader>
                            {!_.isEmpty(appErrors) &&
                                <Container
                                    className="app-status-messages"
                                >
                                    <div className="statusMsgWraper">
                                    {_.map(appErrors, (err) => (
                                        <StatusMessage
                                            key={err.heading}
                                            error={err}
                                            dispatch={dispatch}
                                            {...err}
                                        />
                                    ))}
                                    </div>
                                </Container>
                            }
                        </Responsive>
                        <Responsive minWidth={992}>
                            <Header isAuthenticated={isAuthenticated} onBoarding={onBoarding} isLogin={isLogin} showHeader={showHeader}/>
                                {!_.isEmpty(appErrors) &&
                                    <Container
                                        className="app-status-messages"
                                    >
                                        <div className="statusMsgWraper">
                                        {_.map(appErrors, (err) => (
                                            <StatusMessage
                                                key={err.heading}
                                                error={err}
                                                dispatch={dispatch}
                                                {...err}
                                            />
                                        ))}
                                        </div>
                                    </Container>
                                }
                                <div style={{minHeight:'60vh'}}>
                                {children}
                                </div>
                                <Footer isAuthenticated={isAuthenticated}/>
                        </Responsive>
                    </ErrorBoundary>
                </div>
            </Responsive>
        );
    }

    render() {
        const {
            addCauses,
            appErrors,
            authRequired,
            children,
            isAuthenticated,
            isLogin,
            dispatch,
            onBoarding,
        } = this.props;

        const showHeader = !addCauses;
        return (
            this.renderLayout(authRequired, children, isAuthenticated, onBoarding, dispatch, appErrors, isLogin, showHeader)
        );
    }
};

Layout.defaultProps = {
    addCauses: false,
    description : ' Charitable Impact',
    title: ' Charitable Impact',
};

Layout.propTypes = {
    addCauses: boolean,
    description: string,
    title: string,
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
