import React, {
    Fragment,
} from 'react';
import {
    Progress,
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
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../i18n';

import {
    formatCurrency,
} from '../../../helpers/give/utils';
import {
    getPrivacyType,
} from '../../../helpers/profiles/utils';
import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';

const UserGoal = (props) => {
    const {
        previewMode: {
            isPreviewMode,
        },
        userFriendProfileData: {
            attributes: {
                giving_goal_amt,
                giving_goal_met,
                giving_goal_visibility,
                profile_type,
            },
        },
    } = props;
    const currency = 'USD';
    const language = 'en';
    let goalPercent = 0;
    if (!_isEmpty(giving_goal_amt) && !_isEmpty(giving_goal_met)) {
        goalPercent = ((Number(giving_goal_met) * 100) / Number(giving_goal_amt));
    }
    const isMyProfile = (profile_type === 'my_profile');
    const currentPrivacyType = getPrivacyType(giving_goal_visibility);
    return (
        <div className="givingGoalWrap">
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={12} mobile={13} tablet={11}>
                        <Header>Giving goal</Header>
                    </Grid.Column>
                    <Grid.Column computer={4} mobile={3} tablet={5}>
                        {(isMyProfile && !isPreviewMode)
                        && (
                            <ProfilePrivacySettings
                                columnName='giving_goal_visibility'
                                columnValue={giving_goal_visibility}
                                iconName={currentPrivacyType}
                            />
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {/* <Header>{formatCurrency(giving_goal_met, language, currency)}</Header> */}
            {!_isEmpty(giving_goal_amt)
                ? (
                    <Fragment>
                        <Header>{formatCurrency(giving_goal_met, language, currency)}</Header>
                        <p>contributed towards this  year's <span>{formatCurrency(giving_goal_amt, language, currency)}</span> goal</p>
                        <Progress percent={goalPercent} />
                    </Fragment>
                )
                : (
                    <Fragment>
                        <p>A giving goal hasn’t been set.</p>
                        <Progress percent={goalPercent} />
                    </Fragment>
                )
            }
        </div>
    );
};

UserGoal.defaultProps = {
    previewMode: {
        isPreviewMode: false,
    },
    userFriendProfileData: {
        attributes: {
            giving_goal_amt: '',
            giving_goal_met: '',
            giving_goal_visibility: null,
            profile_type: '',
        },
    },
};

UserGoal.propTypes = {
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
    }),
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            giving_goal_amt: string,
            giving_goal_met: string,
            giving_goal_visibility: number,
            profile_type: string,
        }),
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        previewMode: state.userProfile.previewMode,
        userFriendProfileData: state.userProfile.userFriendProfileData,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(UserGoal));
export {
    connectedComponent as default,
    UserGoal,
    mapStateToProps,
};
