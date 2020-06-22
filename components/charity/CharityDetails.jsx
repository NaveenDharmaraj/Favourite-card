import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    array,
    bool,
    string,
    number,
    func,
    PropTypes,
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
import ShareProfile from '../shared/ShareProfile';

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
                id: charityId,
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
        } = this.props;
        let getCauses = null;

        if (!_isEmpty(causes)) {
            getCauses = causes.map((cause) => (
                <span data-test="CharityDetails_causes_span" className="badge">
                    {cause.display_name}
                </span>
            ));
        }
        return (
            <Grid.Row>
                <Grid.Column data-test="CharityDetails_wrapper_grid" mobile={16} tablet={10} computer={11} className="charity_profileWrap">
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
                                    </Header>
                                    <Header as="p">
                                        {location}
                                    </Header>
                                    <div className="ch_badge-group">
                                        {getCauses}
                                    </div>
                                    <div className="ch_share">
                                        <ShareProfile
                                            liked={following}
                                            profileId={profileId}
                                            type={type}
                                            name={name}
                                        />
                                    </div>
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
                                {!_isEmpty(formattedDescription)
                                    && <p data-test="CharityDetails_description_p">{ReactHtmlParser(formattedDescription)}</p>}
                                {!_isEmpty(formattedDescriptionNew)
                                    && <p data-test="CharityDetails_new_description_p">{ReactHtmlParser(formattedDescriptionNew)}</p>}
                            </Grid.Column>
                        </Grid.Row>
                        <Divider />
                        <ProgramAreas />
                        <Divider />
                        <Charts />
                    </Grid>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={6} computer={5}>
                    <Responsive minWidth={768}>
                        <UserDetails />
                    </Responsive>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

CharityDetails.defaultProps = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: '',
            beneficiaryType: '',
            causes: [],
            following: false,
            formattedDescription: '',
            formattedDescriptionNew: '',
            location: '',
            name: '',
            slug: '',
        }),
        id: '',
        type: '',
    }),
    currentUser: {
        id: null,
    },
    dispatch: () => { },
    isAUthenticated: false,
};

CharityDetails.propTypes = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            beneficiaryType: string,
            causes: array,
            following: bool,
            formattedDescription: string,
            formattedDescriptionNew: string,
            location: string,
            name: string,
            slug: string,
        }),
        id: string,
        type: string,
    }),
    currentUser: {
        id: number,
    },
    dispatch: func,
    isAUthenticated: bool,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        currentUser: state.user.info,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

const connectedComponent = connect(mapStateToProps)(CharityDetails);
export {
    connectedComponent as default,
    CharityDetails,
    mapStateToProps,
};
