import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    bool,
    string,
    number,
    func,
    PropTypes,
} from 'prop-types';
import {
    Grid,
    Responsive,
    Divider,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

import {
    generateDeepLink,
} from '../../actions/profile';
import ProgramAreas from './ProgramAreas';
import Charts from './Charts';
import UserDetails from './UserDetails';
import ProfileTitle from '../shared/ShareTitle/index';

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
                    following,
                    location,
                    name,
                    formattedDescription,
                    formattedDescriptionNew,
                },
                id: profileId,
                type,
            },
        } = this.props;
        return (
            <Grid.Row>
                <Grid.Column data-test="Charity_CharityDetails_wrapper" mobile={16} tablet={10} computer={11} className="charity_profileWrap">
                    <Grid>
                        <Grid.Row>
                            <ProfileTitle
                                avatar={avatar}
                                beneficiaryType={beneficiaryType}
                                causes={causes}
                                following={following}
                                location={location}
                                name={name}
                                profileId={profileId}
                                type={type}
                            />
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
                                    && <p data-test="Charity_CharityDetails_description">{ReactHtmlParser(formattedDescription)}</p>}
                                {!_isEmpty(formattedDescriptionNew)
                                    && <p data-test="Charity_CharityDetails_new_description">{ReactHtmlParser(formattedDescriptionNew)}</p>}
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
    charityDetails: {
        attributes: {
            avatar: '',
            beneficiaryType: '',
            // causes: [],
            following: false,
            formattedDescription: '',
            formattedDescriptionNew: '',
            location: '',
            name: '',
        },
        id: '',
        type: '',
    },
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
            // causes: array,
            following: bool,
            formattedDescription: string,
            formattedDescriptionNew: string,
            location: string,
            name: string,
        }),
        id: string,
        type: string,
    }),
    currentUser: PropTypes.shape({
        id: number,
    }),
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
