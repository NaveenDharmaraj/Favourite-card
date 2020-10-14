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
import { isValidBrowser } from '../../../helpers/utils';
import registerAppLozic from '../../../helpers/initApplozic';
import { getParamStoreConfig } from '../../../actions/user';
import configObj from '../../../helpers/configEnv';

const { publicRuntimeConfig } = getConfig();

const {
    BRANCH_IO_KEY,
    HELP_SCOUT_KEY,
    NEWRELIC_ENV,
} = publicRuntimeConfig;

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
        //re-route the app to /browser if browser version is unsupported
        if (window && isValidBrowser(window.navigator.userAgent)) {
            Router.pushRoute('/browser');
        }
        if (typeof branch !== 'undefined') {
            branch.init(BRANCH_IO_KEY);
        }
        // if the user didnt setup any causes then redirect to causes selection page
        if (!_.isEmpty(userInfo) && !addCauses) {
            const {
                attributes: {
                    skipCauseSelection,
                }
            } = userInfo;
            if (!skipCauseSelection || skipCauseSelection === null) {
                Router.pushRoute('/user/causes');
            }
        }

        //SetAppLogicRegister is used for initializing  registerAppLozic once.
        if (window !== 'undefined' && window.SetAppLogicRegister === undefined && isAuthenticated) {
            window.SetAppLogicRegister = 'SetAppLogicRegister';
            let id = currentUser && currentUser.id ? currentUser.id : '';
            const userEmail = this.props.userInfo ? this.props.userInfo.attributes.email : "";
            const userAvatar = this.props.userInfo ? this.props.userInfo.attributes.avatar : "";
            const userDisplayName = this.props.userInfo ? this.props.userInfo.attributes.displayName : "";
            const userFirstName = this.props.userInfo ? this.props.userInfo.attributes.firstName : "";
            const userLastName = this.props.userInfo ? this.props.userInfo.attributes.lastName : "";
            window.userEmail = userEmail
            window.userAvatar = userAvatar
            window.userDisplayName = userDisplayName
            window.userFirstName = userFirstName
            window.userLastName = userLastName;
            try {
                const applozicConfig = await dispatch(getParamStoreConfig(["APPLOZIC_APP_KEY", "APPLOZIC_BASE_URL", "APPLOZIC_WS_URL"]))
                configObj.envVariable = applozicConfig;
                window.APPLOZIC_BASE_URL = applozicConfig['APPLOZIC_BASE_URL']
                window.APPLOZIC_WS_URL = applozicConfig['APPLOZIC_WS_URL']
                window.APPLOZIC_APP_KEY = applozicConfig['APPLOZIC_APP_KEY'];
                registerAppLozic(id);
            }
            catch (err) { }
        }
        if (authRequired && !isAuthenticated) {
            let nextPathname;
            let searchQuery;
            if (typeof window !== 'undefined') {
                nextPathname = window.location.pathname;
                searchQuery = window.location.search;
            }
            const encodedUrl = encodeURIComponent(`${nextPathname}${searchQuery}`);
            let pathname = (nextPathname) ?
                `/users/login?returnTo=${encodedUrl}` : '/users/login';
            Router.pushRoute(pathname);
        } else {
            // await NotificationHelper.getMessages(userInfo, dispatch, 1);
        }
        if (window && window.Beacon) {
            window.Beacon('init', HELP_SCOUT_KEY);
            if (currentUser) {
                Beacon("identify", {
                    name: currentUser.attributes.displayName,
                    email: currentUser.attributes.email,
                });
            }
            Beacon('session-data', {
                'currentPage': window.location.href,
            })
            if (document) {
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

    getDeviceWidth = () => {
        const {
            isMobile
        } = this.props;
        const isSSR = typeof window === 'undefined';
        const ssrWidth = isMobile ? 990 : 1000;
        return isSSR ? ssrWidth : window.innerWidth;
    }

    renderLayout = (authRequired, children, isAuthenticated, onBoarding, dispatch, appErrors, isLogin, showHeader) => {
        if (authRequired && !isAuthenticated) {
            return null;
        }
        const {
            avatar,
            title,
            description,
            isMobile,
            keywords,
            url,
            disableMinHeight,
            isProfilePage,
            stripe
        } = this.props;

        // const widthProp = (!isMobile) ? {getWidth: getWidth(isMobile)} : {};
        const widthProp = { getWidth: this.getDeviceWidth };

        return (
            <Responsive getWidth={this.getDeviceWidth}>
                <Head>
                    <title>
                        {title}
                    </title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="description" content={description.substring(0, 150)} />
                    <meta name="keywords" content={keywords} />
                    <meta property="og:title" content={title} />
                    <meta property="og:url" content={url} />
                    <meta property="og:image" content={avatar} />
                    <meta property="og:description" content={description.substring(0, 150)} />
                    <link rel="icon" type="image/x-icon" href="https://d1wjn4fmcgu4dn.cloudfront.net/web/favicon.ico" />
                    <link rel="manifest" href="/static/Manifest.json" />
                    <link
                        async
                        rel="stylesheet"
                        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
                    />
                    <link
                        async
                        rel="stylesheet"
                        href="https://d2zw5visq7ucgf.cloudfront.net/static/fonts/proximanova/font.css"
                    />
                    <link rel="preconnect" href="https://logs.logdna.com" />
                    <link rel="preconnect" href="https://chat-ca.kommunicate.io:15675" />
                    {stripe && <script defer id="stripe-js" src="https://js.stripe.com/v3/" />}
                    <script type="text/javascript" defer src="https://cdn.applozic.com/applozic/applozic.chat-5.6.1.min.js"></script>
                    <script defer type="text/javascript" src='/static/branchio.js'></script>
                    {isAuthenticated ? <script defer type="text/javascript" src="/static/initApplozic.js"></script> : ""}
                    {/* <script type="text/javascript" src="https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js"></script> */}
                    <script defer type="text/javascript" src='/static/beacon.js'></script>
                    {!_.isEmpty(NEWRELIC_ENV) ? <script defer type="text/javascript" src={`/static/newrelic-${NEWRELIC_ENV}.js`}></script> : ""}

                </Head>
                <div>
                    <ErrorBoundary>
                        <Responsive {...widthProp} minWidth={320} maxWidth={991}>
                            <MobileHeader isAuthenticated={isAuthenticated} onBoarding={onBoarding} isLogin={isLogin} showHeader={showHeader}>
                                <div className={disableMinHeight ? "" : "chimpLayout"}>
                                    {children}
                                </div>
                                <Footer isAuthenticated={isAuthenticated} isProfilePage={isProfilePage} />
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
                        <Responsive {...widthProp} minWidth={992}>
                            <Header isAuthenticated={isAuthenticated} onBoarding={onBoarding} isLogin={isLogin} showHeader={showHeader} />
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
                            <div className={disableMinHeight ? "" : "chimpLayout"}>
                                {children}
                            </div>
                            <Footer isAuthenticated={isAuthenticated} />
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
    description: ' Charitable Impact',
    title: ' Charitable Impact',
    stripe: false
};

Layout.propTypes = {
    addCauses: boolean,
    description: string,
    title: string,
    stripe: boolean,
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isMobile: state.app.isMobile,
        userInfo: state.user.info,
        appErrors: state.app.errors,
        currentUser: state.user.info,
    };
}

export default connect(mapStateToProps)(Layout);
