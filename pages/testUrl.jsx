import React from 'react';
import Bowser from 'bowser';

class TestUrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            browserAgent: {},
            userAgent: null,
        };
    }

    componentDidMount() {
        console.log('window Navigator', window.navigator);
        if (window && window.navigator.userAgent) {
            this.setState({
                browserAgent: Bowser.getParser(window.navigator.userAgent),
                userAgent: window.navigator.userAgent,
            });
        }
    }

    render() {
        console.log('browserAgent', this.state.browserAgent);
        console.log('userAgent', this.state.userAgent);
        let platform = null; let currentBrowser = null; let
            os = null;
        if (this.state.browserAgent.parsedResult) {
            platform = this.state.browserAgent.parsedResult.platform.type;
            currentBrowser = this.state.browserAgent.parsedResult.browser.name;
            os = this.state.browserAgent.parsedResult.os.name;
        }
        return (
            <React.Fragment>
                <div>
                    {this.state.browserAgent && JSON.stringify(this.state.browserAgent)}
                </div>
                <hr />
                <div>
                    {this.state.browserAgent && JSON.stringify(this.state.userAgent)}
                </div>
                <hr />
                <div>
                    {`platform: ${platform}`}
                </div>
                <div>
                    {`currentBrowser: ${currentBrowser}`}
                </div>
                <div>
                    {`os: ${os}`}
                </div>
            </React.Fragment>
        );
    }
}

export default TestUrl;
