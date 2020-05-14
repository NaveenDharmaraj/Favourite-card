import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    bool,
    string,
} from 'prop-types';
import {
    Grid,
    Container,
    Image,
    Button,
    Header,
    Responsive,
    Divider,
} from 'semantic-ui-react';
import getConfig from 'next/config';
import ReactHtmlParser from 'react-html-parser';

import { Link } from '../../routes';

import UserDetails from './UserDetails';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const CharityDetails = (props) => {
    const {
        charityDetails,
        isAUthenticated,
    } = props;
    let getCauses = null;

    if (!_isEmpty(charityDetails.charityDetails.attributes.causes)) {
        getCauses = charityDetails.charityDetails.attributes.causes.map((cause) => (
            <span className="badge">
                {cause.display_name}
            </span>
        ));
    }

    return (
        <Grid.Row>
            <Grid.Column mobile={16} tablet={11} computer={11} className="charity_profileWrap">
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={4} computer={4} className="ch_profileWrap">
                            <div className="ch_profileImage">
                                <Image
                                    src={charityDetails.charityDetails.attributes.avatar}
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={11} computer={11} className="">
                            <div className="ch_profileDetails">
                                <Header as="h5">
                                    {charityDetails.charityDetails.attributes.beneficiaryType}
                                </Header>
                                <Header as="h3">
                                    {charityDetails.charityDetails.attributes.name}
                                    <br />
                                    <span>
                                        WHAT TO SHOW
                                    </span>
                                </Header>
                                <Header as="p">
                                    {charityDetails.charityDetails.attributes.location}
                                </Header>
                                <div className="ch_badge-group">
                                    {getCauses}
                                </div>
                                {/* SHARE DETAILS*/}
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={5} computer={5}>
                            <Responsive minWidth={320} maxWidth={767}>
                                <UserDetails />
                            </Responsive>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider className="mobHideDivider" />
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={16} computer={16} className="ch_paragraph mt-1 mb-2">
                            {!_isEmpty(charityDetails.charityDetails.attributes.formattedDescription) && <p>{ReactHtmlParser(charityDetails.charityDetails.attributes.formattedDescription)}</p>}
                            {!_isEmpty(charityDetails.charityDetails.attributes.formattedDescriptionNew) && <p>{ReactHtmlParser(charityDetails.charityDetails.attributes.formattedDescriptionNew)}</p>}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={5} computer={5}>
                <Responsive minWidth={768}>
                    <UserDetails />
                </Responsive>
            </Grid.Column>
        </Grid.Row>
    );
};

CharityDetails.defaultProps = {
    charityDetails: {
        charityDetails: {
            attributes: {
                avatar: '',
                location: '',
                name: '',
                slug: '',
            },
        },
    },
    isAUthenticated: false,
};

CharityDetails.propTypes = {
    charityDetails: {
        charityDetails: {
            attributes: {
                avatar: string,
                location: string,
                name: string,
                slug: string,
            },
        },
    },
    isAUthenticated: bool,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(CharityDetails);
