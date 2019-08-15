import React, { useEffect } from 'react';
import {
    Grid,
    Icon,
    Button,
} from 'semantic-ui-react';

import { reInitNextStep } from '../../actions/give';
import { Link } from '../../routes';
import { withTranslation } from '../../i18n';

const Error = (props) => {
    useEffect(() => {
        const {
            dispatch, flowObject,
        } = props;
        if (flowObject) {
            reInitNextStep(dispatch, flowObject);
        }
    }, []);
    const formatMessage = props.t;
    return (
        <div>
            <Grid
                className="u-margin-bottom-lg u-margin-top-lg"
                container
                centered
                columns={2}
            >
                <Grid.Column
                    mobile={16}
                    computer={12}
                >
                    <Grid>
                        <Grid.Row
                            textAlign="center"
                        >
                            <Grid.Column>
                                <Icon color="red" size="big" name="exclamation triangle" />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row
                            textAlign="center"
                        >
                            <Grid.Column>
                                <p
                                    className="error-heading"
                                >
                                    {formatMessage('errorHeading')}
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row
                            textAlign="center"
                        >
                            <Grid.Column>
                                <div
                                    className="error-message"
                                >
                                    <p>
                                        {formatMessage('errorMessage1', {
                                            email: 'hello@chimp.net',
                                            telephone: '+1 (877) 531-0580.',
                                        })}
                                    </p>
                                    <p>
                                        {formatMessage('errorMessage2')}
                                    </p>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row
                            textAlign="center"
                        >
                            <Grid.Column
                                className="error-message"
                            >
                                <Link route="/dashboard">
                                    <Button
                                        color="blue"
                                        primary
                                        className="blue-btn-rounded"
                                        content={formatMessage('errorGoToDashboard')}
                                    />
                                </Link>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid>
        </div>
    );
};

export default withTranslation('error')(Error);
