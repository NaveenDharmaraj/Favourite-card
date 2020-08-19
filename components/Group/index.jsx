import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    PropTypes,
    string,
    bool,
} from 'prop-types';
import {
    Container,
    Grid,
    Responsive,
    Divider,
} from 'semantic-ui-react';

import BreadcrumbDetails from '../shared/BreadCrumbs';
import ProfileTitle from '../shared/ProfileTitle';
import ProfilePageHead from '../shared/ProfilePageHead';

import GroupAdmins from './GroupAdmins';
import AboutGroup from './AboutGroup';
import ProfileDetails from './ProfileDetails';
import GroupRightColumnList from './GroupRightColumnList';

const GroupProfileWrapper = (props) => {
    const {
        groupDetails: {
            attributes: {
                activeMatch,
                avatar,
                causes,
                liked,
                location,
                name,
                hasActiveMatch,
            },
            id: profileId,
            type,
        },
        isAuthenticated,
    } = props;
    const pathArr = [
        'Explore',
        'Giving Groups',
        name,
    ];
    return (
        <Fragment>
            <div className="top-breadcrumb">
                <BreadcrumbDetails
                    pathDetails={pathArr}
                />
            </div>
            <div className="GivingGroupProfileWapper">
                <Container>
                    <div className="ch_headerImage greenBg" />
                    <Grid.Row>
                        <Grid>
                            <Grid.Column mobile={16} tablet={10} computer={11}>
                                <Grid.Row>
                                    <Grid>
                                        <ProfileTitle
                                            avatar={avatar}
                                            type={type}
                                            causes={causes}
                                            following={liked}
                                            location={location}
                                            name={name}
                                            profileId={profileId}
                                        >
                                            <ProfilePageHead
                                                pageDetails={props.groupDetails}
                                            />
                                        </ProfileTitle>
                                    </Grid>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column mobile={16}>
                                        <Responsive minWidth={320} maxWidth={767}>
                                            <div className="charityInfowrap tabcharityInfowrap fullwidth">
                                                <GroupRightColumnList
                                                    activeMatch={activeMatch}
                                                    type={type}
                                                    hasActiveMatch={hasActiveMatch}
                                                />
                                            </div>
                                        </Responsive>
                                    </Grid.Column>
                                    <Divider className="mt-2" />
                                    {isAuthenticated
                                    && (
                                        <Fragment>
                                            <Grid.Column mobile={16} tablet={16} computer={16} className="ch_paragraph mt-2 mb-2">
                                                <GroupAdmins />
                                            </Grid.Column>
                                            <Divider />
                                        </Fragment>
                                    )}
                                </Grid.Row>
                                <AboutGroup />
                                <ProfileDetails />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={6} computer={5}>
                                <Responsive minWidth={767}>
                                    <GroupRightColumnList
                                        activeMatch={activeMatch}
                                        type={type}
                                        hasActiveMatch={hasActiveMatch}
                                    />
                                </Responsive>
                            </Grid.Column>
                        </Grid>
                    </Grid.Row>
                </Container>
            </div>
        </Fragment>
    );
};

GroupProfileWrapper.defaultProps = {
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            activeMatch: {},
            avatar: '',
            causes: [],
            hasActiveMatch: false,
            liked: false,
            location: '',
            name: '',
        }),
        id: '',
        type: '',
    }),
    isAuthenticated: false,
};

GroupProfileWrapper.propTypes = {
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            activeMatch: PropTypes.shape({}),
            avatar: string,
            causes: PropTypes.arrayOf(
                PropTypes.shape({}),
            ),
            hasActiveMatch: bool,
            liked: bool,
            location: string,
            name: string,
        }),
        id: string,
        type: string,
    }),
    isAuthenticated: bool,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(GroupProfileWrapper);
