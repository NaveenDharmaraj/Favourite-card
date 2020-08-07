import React from 'react';
import {
    Grid,
    Button,
    Header,
    Image,
} from 'semantic-ui-react';

import {
    formatCurrency,
} from '../../../helpers/give/utils';
import placeHolderImage from '../../../static/images/no-data-avatar-giving-group-profile.png';

const ActiveMatchBlock = (props) => {
    const {
        activeMatch: {
            balance,
            company,
            companyId,
            matchClose,
            matchPercent,
            maxMatchAmount,
            totalMatch,
        },
        type,
    } = props;
    const currency = 'USD';
    const language = 'en';
    const formattedBalance = formatCurrency(balance, language, currency);
    const formattedmaxMatchAmount = formatCurrency(maxMatchAmount, language, currency);
    const formattedtotalMatch = formatCurrency(totalMatch, language, currency);
    const matchExpired = (balance === '0'); // TODO check matching expired or not
    const headingText = matchExpired ? 'Thank you for your support!' : 'Your gift will be matched!';
    return (
        <div className="charityInfowrap fullwidth lightGreenBg">
            <div className="charityInfo">
                <Header as="h4">{headingText}</Header>
                <p>
                    For every $1.00 you give to this group,
                    <b>{company}</b>
                    &nbsp;will match your gift with $1.00 up to&nbsp;
                    <b>{formattedmaxMatchAmount}</b>
                    &nbsp;per gift.
                </p>
                <div className="matchingFundsWapper">
                    <div className="matchingFundsGraff">
                        <div className="Progresswapper">
                            <div className="customProgress">
                                <div className="bar" style={{ height: `${matchPercent}%` }} />
                            </div>
                        </div>
                    </div>
                    <div className="matchingFundsText">
                        <Header as="h3">{formattedBalance}</Header>
                        <Header as="h5"> matching funds remaining</Header>
                        <div className="total">
                            <p>
                                {` of ${formattedtotalMatch} provided by ${company}`}
                            </p>
                        </div>
                    </div>
                </div>
                <Grid.Row className="MatchingPartnerWapper">
                    <Grid>
                        <Grid.Column mobile={3} tablet={4} computer={4} className="pr-0">
                            <div className="h_profileMatching borderprofile">
                                <Image src={placeHolderImage} />
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={13} tablet={12} computer={12}>
                            <div className="MatchingPartner">
                                <Header as="h3">{company}</Header>
                                <p>Matching partner</p>
                            </div>
                        </Grid.Column>
                    </Grid>
                </Grid.Row>
                <Button className="white-btn-rounded-def goalbtn">
                    {` Expires ${matchClose}`}
                </Button>
                {((type === 'groups') && !matchExpired)
                && (
                    <p className="blueHistory">View matching history</p>
                )}
            </div>
        </div>
    );
};
export default ActiveMatchBlock;
