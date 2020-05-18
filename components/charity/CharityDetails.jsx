import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    bool,
    string,
    number,
    func,
} from 'prop-types';
import {
    Grid,
    Image,
    Header,
    Responsive,
    Divider,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

import {
    generateDeepLink,
} from '../../actions/profile';
import GroupShareDetails from '../Group/GroupShareDetails';

import ProgramAreas from './ProgramAreas';
import Charts from './Charts';
import UserDetails from './UserDetails';

class CharityDetails extends React.Component {
    componentDidMount() {
        const {
            currentUser: {
                id: userId,
            },
            charityDetails: {
                charityDetails: {
                    id: charityId,
                },
            },
            dispatch,
            isAUthenticated,
        } = this.props;
        let deepLinkApiUrl = `deeplink?profileType=charityprofile&profileId=${charityId}`;
        if (isAUthenticated) {
            deepLinkApiUrl += `&sourceId=${userId}`;
        }
        generateDeepLink(deepLinkApiUrl, dispatch);
    }

    render() {
        const {
            charityDetails: {
                charityDetails: {
                    attributes: {
                        avatar,
                        beneficiaryType,
                        causes,
                        formattedDescription,
                        formattedDescriptionNew,
                        following,
                        location,
                        name,
                    },
                    id: profileId,
                    type,
                },
            },
            currentUser: {
                id: userId,
            },
            deepLinkUrl,
            isAUthenticated,
        } = this.props;
        let getCauses = null;

        if (!_isEmpty(causes)) {
            getCauses = causes.map((cause) => (
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
                                        src={avatar}
                                    />
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={11} computer={11} className="">
                                <div className="ch_profileDetails">
                                    <Header as="h5">
                                        {beneficiaryType}
                                    </Header>
                                    <Header as="h3">
                                        {name}
                                        <br />
                                        <span>
                                            WHAT TO SHOW
                                        </span>
                                    </Header>
                                    <Header as="p">
                                        {location}
                                    </Header>
                                    <div className="ch_badge-group">
                                        {getCauses}
                                    </div>
                                    <GroupShareDetails
                                        liked={following}
                                        profileId={profileId}
                                        type={type}
                                        name={name}
                                    />
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
                            <Grid.Column mobile={16} tablet={16} computer={16} className="ch_paragraph">
                                {!_isEmpty(formattedDescription) && <p>{ReactHtmlParser(formattedDescription)}</p>}
                                {!_isEmpty(formattedDescriptionNew) && <p>{ReactHtmlParser(formattedDescriptionNew)}</p>}
                            </Grid.Column>
                        </Grid.Row>
                        <Divider />
                        <ProgramAreas />
                        <Divider />
                        <Charts />
                    </Grid>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={5} computer={5}>
                    <Responsive minWidth={768}>
                        <UserDetails />
                    </Responsive>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

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
    currentUser: {
        id: null,
    },
    dispatch: () => {},
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
    currentUser: {
        id: number,
    },
    dispatch: func,
    isAUthenticated: bool,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        deepLinkUrl: state.profile.deepLinkUrl,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(CharityDetails);
