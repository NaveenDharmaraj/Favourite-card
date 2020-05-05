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
                            <Link route="/terms">
                                <span className="link border rmLnk"> Terms and Conditions.</span>
                            </Link>
                        </p>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Privacy policy</p>
                        <p>
                        See our
                            <Link route="/privacy">
                                <span className="link border rmLnk"> Privacy Policy.</span>
                            </Link>
                        </p>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Account agreement</p>
                        <p>
                        See our
                            <Link route="/account-agreement">
                                <span className="link border rmLnk"> Account Agreement.</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Legal;
