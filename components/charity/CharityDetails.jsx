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
} from 'semantic-ui-react';
import getConfig from 'next/config';

import { Link } from '../../routes';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const CharityDetails = (props) => {
    const {
        charityDetails,
        isAUthenticated,
    } = props;
    let buttonLink = null;
    let getCauses = null;

    if (charityDetails.charityDetails.attributes && !charityDetails.charityDetails.attributes.hideGive) {
        if (isAUthenticated) {
            buttonLink = (
                <Link route={(`/give/to/charity/${charityDetails.charityDetails.attributes.slug}/gift/new`)}>
                    <Button primary fluid className="blue-btn-rounded">Give</Button>
                </Link>
            );
        } else {
            buttonLink = (
                <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/charity/${charityDetails.charityDetails.attributes.slug}/gift/new`)}>
                    <Button primary fluid className="blue-btn-rounded">Give</Button>
                </a>
            );
        }
    }

    if (!_isEmpty(charityDetails.charityDetails.attributes.causes)) {
        getCauses = charityDetails.charityDetails.attributes.causes.map((cause) => (
            <span className="badge">
                {cause.display_name}
            </span>
        ));
    }

    return (
        <div className="profile-header">
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={3} computer={2}>
                            <div className="profile-img-rounded">
                                <div className="pro-pic-wraper">
                                    <Image
                                        circular
                                        src={charityDetails.charityDetails.attributes.avatar}
                                    />
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={10} computer={12}>
                            <div className="ProfileHeaderWraper">
                                <Header as="h3">
                                    {charityDetails.charityDetails.attributes.name}
                                    <Header.Subheader>
                                        {charityDetails.charityDetails.attributes.location}
                                    </Header.Subheader>
                                </Header>
                                <div className="badge-group">
                                    {getCauses}
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={3} computer={2}>
                            <div className="buttonWraper">
                                {buttonLink}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
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
