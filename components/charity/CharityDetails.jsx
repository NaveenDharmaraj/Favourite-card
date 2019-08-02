import React from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    Card,
    Image,
    Button,
} from 'semantic-ui-react';

import getConfig from 'next/config';
import { Link } from '../../routes'; // 'next/link';// '../../routes';
const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class CharityDetails extends React.Component {
    constructor(props) {
        super(props);
        console.log('CharityDetails props', props);
    }

    render() {
        const {
            charityDetails,
            isAUthenticated,
        } = this.props;
        let buttonLink = null;
        if (charityDetails && charityDetails.charityDetails.attributes) {
            if (isAUthenticated) {
                buttonLink = (
                    <Link route={(`/give/to/charity/${charityDetails.charityDetails.attributes.slug}/gift/new`)}>
                        <Button
                            color="blue"
                            content="Give to this charity"
                        />
                    </Link>
                );
            } else {
                buttonLink = (
                    <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/charity/${charityDetails.charityDetails.attributes.slug}/gift/new`)}>
                        <Button
                            color="blue"
                            content="Give to this charity"
                        />
                    </a>
                );
            }
        }
        return (
            <Grid.Column>
                <Grid>
                    <Grid.Row stretched>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <Card className="charityLogo-wraper">
                                <div className="verticalCenter">
                                    <Image src={(charityDetails && charityDetails.charityDetails.attributes) && charityDetails.charityDetails.attributes.avatar} />
                                </div>
                            </Card>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={11} computer={11}>
                            <div className="CharityDescription">
                                <h6 className="text-muted">{(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes) && charityDetails.charityDetails.attributes.beneficiaryType}</h6>
                                <h3>{(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes) && charityDetails.charityDetails.attributes.name}</h3>
                                <div>
                                    {buttonLink}
                                    <Button
                                        color="blue"
                                        content="Contact this charity"
                                        // id="taxReceiptsLink"
                                        // path={taxProfileLink}
                                    />
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <p className="mt-2">
                    Is this your chariy? You can claim your free profile page on your platform
                    <a href="#">by following these steps</a>
                </p>
            </Grid.Column>
        );
    }
}

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(CharityDetails);
