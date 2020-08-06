import React, { Fragment } from 'react';
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
    // const {
    //     entityDetails,
    // } = props;
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
    const matchExpired = (balance === '0');
    const headingText = matchExpired ? 'Thank you for your support!' : 'Your gift will be matched!';
    return (
        <div className="charityInfowrap tabcharityInfowrap fullwidth lightGreenBg">
            <div className="charityInfo">
                <Header as="h4">{headingText}</Header>
                {matchExpired
                    ? (
                        <Fragment>
                            <p>
                                    Between November 1, 2019 and
                                    &nbsp;
                                {matchClose}
                                ,
                                <b>{company}</b>
                                &nbsp;
                                    generously matched each gift to this group dollar for dollar.
                            </p>
                            <div className="matchingFundsText">
                                <Header as="h3">{formattedBalance}</Header>
                                {/* <Header as="h5"> was matched by Charitable Impact</Header>
                                <div className="total">
                                    <p>
                                        of
                                        {formattedtotalMatch}
                                        &nbsp;
                                    provided by
                                        {company}
                                    </p>
                                </div> */}
                            </div>
                        </Fragment>
                    )
                    : (
                        <Fragment>
                            <p>
                            For every $1.00 you give to this group,
                                <b>{company}</b>
                                &nbsp;
                            will match your gift with $1.00 up to
                                &nbsp;
                                <b>{formattedmaxMatchAmount}</b>
                                per gift.
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
                                            of
                                            {formattedtotalMatch}
                                            &nbsp;
                                        provided by
                                            {company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )
                }
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
                    Expires
                    &nbsp;
                    {matchClose}
                </Button>
                {((type === 'groups') && !matchExpired)
                && (
                    <p className="blueHistory">View matching history</p>
                )}
            </div>
        </div>
        // <div className="active-match-message mt-3">
        //     <Message>
        //         <Grid>
        //             <Grid.Row>
        //                 <Grid.Column computer={13} tablet={12} mobile={8}>
        //                     <div className="active-match-heading mb-0 pb-0">
        //                         <h2 class="mb-0 pb-0">Your gift will be matched!</h2>
        //                     </div>
        //                 </Grid.Column>
        //                 {(entityDetails.attributes.activeMatch.matchClose) ?
        //                     (
        //                         <Grid.Column computer={3} tablet={4} mobile={8}>
        //                             <div className="active-match-btn">
        //                                 <div className="btn-active-match">
        //                                     {`Expires ${entityDetails.attributes.activeMatch.matchClose}`}
        //                                 </div>
        //                             </div>
        //                         </Grid.Column>
        //                     ) : null}
        //             </Grid.Row>
        //             <Grid.Row>
        //                 <Grid.Column computer={13} tablet={12} mobile={16}> 
        //                     <div className="active-match-comments">
        //                         <p>
        //                             {entityDetails.attributes.activeMatch.company} will match 100% for each $1.00 you give to this group, until matching funds run out or expire.
        //                         </p>
        //                         <p><span className="active-match-dollar"><b>{formattedBalance}</b></span> matching funds left.</p>
        //                     </div>
        //                 </Grid.Column>
        //                 <Grid.Column computer={3} tablet={4} mobile={0}>
        //                 </Grid.Column>
        //             </Grid.Row>
        //         </Grid>
        //     </Message>
        // </div>
    );
};
export default ActiveMatchBlock;
