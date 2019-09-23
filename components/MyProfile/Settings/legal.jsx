import React from 'react';
import {
    Header,
} from 'semantic-ui-react';

import { Link } from '../../../routes';

// eslint-disable-next-line react/prefer-stateless-function
class Legal extends React.Component {
    render() {
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper heading brdr-btm pb-1">
                        <Header as="h4">Legal </Header>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Terms and conditions</p>
                        <p>
                        See our
                            <span className="link border">
                                <a href="https://chimp.net/terms" target="_blank">
                                    {' '}
                                Terms and Conditions.
                                </a>
                            </span>
                        </p>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Privacy policy</p>
                        <p>
                        See our
                            <span className="link border">
                                <a href="https://chimp.net/privacy" target="_blank">
                                    {' '}
                                    Privacy Policy.
                                </a>
                            </span>
                        </p>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Account Agreement</p>
                        <p>
                        See our
                            <span className="link border">
                                <a href="https://chimp.net/chimp-account-agreement" target="_blank">
                                    {' '}
                                    Account Agreement.
                                </a>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Legal;
