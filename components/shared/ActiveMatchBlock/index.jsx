import React from 'react';
import {
    Message,
    Grid,
    Button,
} from 'semantic-ui-react';
import {
    formatAmount,
} from '../../../helpers/give/utils';

const ActiveMatchBlock = (props) => {
    const {
        entityDetails,
    } = props;
    const formattedBalance = formatAmount(entityDetails.attributes.activeMatch.balance);
    return (
        <div className="active-match-message mt-3">
            <Message>
                <Grid>
                    <Grid.Row>
                        <Grid.Column computer={13} tablet={12} mobile={8}>
                            <div className="active-match-heading mb-0 pb-0">
                                <h2 class="mb-0 pb-0">Your gift will be matched!</h2>
                            </div>
                        </Grid.Column>
                        {(entityDetails.attributes.activeMatch.matchClose) ?
                            (
                                <Grid.Column computer={3} tablet={4} mobile={8}>
                                    <div className="active-match-btn">
                                        <div className="btn-active-match">
                                            {`Expires ${entityDetails.attributes.activeMatch.matchClose}`}
                                        </div>
                                    </div>
                                </Grid.Column>
                            ) : null}
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column computer={13} tablet={12} mobile={16}> 
                            <div className="active-match-comments">
                                <p>
                                    {entityDetails.attributes.activeMatch.company} will match 100% for each $1.00 you give to this group, until matching funds run out or expire.
                                </p>
                                <p><span className="active-match-dollar"><b>${formattedBalance}</b></span> matching funds left.</p>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={3} tablet={4} mobile={0}>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Message>
        </div>
    );
};
export default ActiveMatchBlock;
