import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    func,
    PropTypes,
    string,
    bool,
    array,
} from 'prop-types';
import {
    Container,
    Grid,
    Responsive,
    Divider,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import BreadcrumbDetails from '../shared/BreadCrumbs';
import ProfileTitle from '../shared/ProfileTitle';
import ProfilePageHead from '../shared/ProfilePageHead';

import GroupAdmins from './GroupAdmins';
import AboutGroup from './AboutGroup';
import ProfileDetails from './ProfileDetails';
import GroupRightColumnList from './GroupRightColumnList';

const GroupProfileWrapper = (props) => {
    const {
        dispatch,
        groupBeneficiaries: {
            data,
        },
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
        groupMatchingHistory: {
            data: matchHistory,
        },
    } = props;
    const beneficiariesCount = !_isEmpty(data) ? data : null;
    const {
        groupDetails,
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
                    <div className="ch_headerImage greenBg greenBgnew" />
                    <Grid.Row>
                        <Grid>
                            <Grid.Column mobile={16} tablet={10} computer={12}>
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
                                                beneficiariesCount={beneficiariesCount}
                                                pageDetails={groupDetails}
                                                dispatch={dispatch}
                                            />
                                        </ProfileTitle>
                                    </Grid>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column mobile={16}>
                                        <Responsive minWidth={320} maxWidth={767}>
                                            <GroupRightColumnList
                                                activeMatch={activeMatch}
                                                type={type}
                                                hasActiveMatch={hasActiveMatch}
                                                matchHistory={matchHistory}
                                            />
                                        </Responsive>
                                    </Grid.Column>
                                    <Divider className="mt-2" />
                                    <Grid.Column mobile={16} tablet={16} computer={16} className="ch_paragraph">
                                        <GroupAdmins />
                                    </Grid.Column>
                                    <Divider />
                                </Grid.Row>
                                <AboutGroup />
                                <ProfileDetails />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={6} computer={4}>
                                <Responsive minWidth={767}>
                                    <GroupRightColumnList
                                        activeMatch={activeMatch}
                                        type={type}
                                        hasActiveMatch={hasActiveMatch}
                                        matchHistory={matchHistory}
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
    dispatch: () => {},
    groupBeneficiaries: {
        data: [],
    },
    groupDetails: {
        attributes: {
            activeMatch: {},
            avatar: '',
            causes: [],
            hasActiveMatch: false,
            liked: false,
            location: '',
            name: '',
        },
        id: '',
        type: '',
    },
    groupMatchingHistory: {
        data: [],
    },
};

GroupProfileWrapper.propTypes = {
    dispatch: func,
    groupBeneficiaries: PropTypes.shape({
        data: array,
    }),
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            activeMatch: PropTypes.shape({}),
            avatar: string,
            causes: array,
            hasActiveMatch: bool,
            liked: bool,
            location: string,
            name: string,
        }),
        id: string,
        type: string,
    }),
    groupMatchingHistory: PropTypes.shape({
        data: array,
    }),
};

function mapStateToProps(state) {
    return {
        groupBeneficiaries: state.group.groupBeneficiaries,
        groupDetails: state.group.groupDetails,
        groupMatchingHistory: state.group.groupMatchingHistory,
    };
}

const connectedComponent = (connect(mapStateToProps)(GroupProfileWrapper));
export {
    connectedComponent as default,
    GroupProfileWrapper,
    mapStateToProps,
};
