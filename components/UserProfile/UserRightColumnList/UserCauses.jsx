import React, {
    Fragment,
} from 'react';
import {
    Container,
    Header,
    Image,
    Icon,
    Grid,
    Button,
    Dropdown,
    Modal,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    array,
    func,
    string,
    number,
    PropTypes,
    bool,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../i18n';
import {
    getUserCharitableInterests,
} from '../../../actions/userProfile';
import {
    getPrivacyType,
} from '../../../helpers/profiles/utils';
import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';
import CharitableInterestsList from '../EditCharitableInterest';

class UserCauses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewButtonClicked: false,
        };
        this.userCausesList = this.userCausesList.bind(this);
        this.handleViewAll = this.handleViewAll.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
            friendUserId,
        } = this.props;
        if (!_isEmpty(friendUserId)) {
            getUserCharitableInterests(dispatch, friendUserId);
        }
    }

    userCausesList() {
        const {
            userProfileCausesData: {
                data: causesList,
            },
        } = this.props;
        const causesArray = [];
        causesList.map((cause) => {
            causesArray.push(
                <Button className="user_badgeButton active">{cause.attributes.name}</Button>,
            );
        });
        return causesArray;
    }

    handleViewAll() {
        this.setState({
            viewButtonClicked: true,
        });
    }

    render() {
        const {
            previewMode: {
                isPreviewMode,
            },
            userProfileCausesData: {
                data: causesList,
            },
            userFriendProfileData: {
                attributes: {
                    causes_visibility,
                    profile_type,
                },
            },
        } = this.props;
        const {
            viewButtonClicked,
        } = this.state;
        const isMyProfile = (profile_type === 'my_profile');
        const currentPrivacyType = getPrivacyType(causes_visibility);
        const dataArray = !_isEmpty(causesList) ? this.userCausesList() : '';
        let initialList = !_isEmpty(dataArray) ? dataArray : '';
        if (!_isEmpty(dataArray) && dataArray.length > 10) {
            initialList = dataArray.slice(0, 10);
        }
        return (
            <div className="cause_topicsWrap">
                <Grid>
                    <Grid.Row>
                        <Grid.Column computer={12} mobile={13} tablet={11}>
                            <div className="headerWrap">
                                <Header>Causes and topics</Header>
                                {(isMyProfile && !isPreviewMode)
                                && (
                                    <CharitableInterestsList />
                                )}
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={4} mobile={3} tablet={5}>
                            {(isMyProfile && !_isEmpty(currentPrivacyType) && !isPreviewMode)
                            && (
                                <ProfilePrivacySettings
                                    columnName='causes_visibility'
                                    columnValue={causes_visibility}
                                    iconName={currentPrivacyType}
                                />
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {!_isEmpty(dataArray)
                    ? (
                        <div className="user-badge-group">
                            {!viewButtonClicked
                                ? initialList
                                : dataArray}
                        </div>
                    )
                    : (
                        <p className='nodata'>Nothing to show here yet.</p>
                    )}
                {(!_isEmpty(dataArray) && dataArray.length > 10 && !viewButtonClicked)
                && (
                    <div className="text-center">
                        <Button
                            className="blue-bordr-btn-round-def"
                            onClick={this.handleViewAll}
                        >
                        View all
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}

UserCauses.defaultProps = {
    dispatch: () => {},
    friendUserId: '',
    previewMode: {
        isPreviewMode: false,
    },
    userFriendProfileData: {
        attributes: {
            causes_visibility: null,
            profile_type: '',
        },
    },
    userProfileCausesData: {
        data: [],
    },
};

UserCauses.propTypes = {
    dispatch: func,
    friendUserId: string,
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
    }),
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            causes_visibility: number,
            profile_type: string,
        }),
    }),
    userProfileCausesData: PropTypes.shape({
        data: array,
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        previewMode: state.userProfile.previewMode,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileCausesData: state.userProfile.userProfileCausesData,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(UserCauses));
export {
    connectedComponent as default,
    UserCauses,
    mapStateToProps,
};
