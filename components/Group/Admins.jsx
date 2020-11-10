import React from 'react';
import {
    List,
    Image,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
    arrayOf,
    PropTypes,
    number,
    func,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import imagePlaceholder from '../../static/images/no-data-avatar-user-profile.png';
import {
    Link,
} from '../../routes';
import { withTranslation } from '../../i18n';

const Admins = (props) => {
    const {
        groupAdminsDetails: {
            data,
        },
        t: formatMessage,
    } = props;
    let adminData = '';
    if (!_isEmpty(data)) {
        adminData = data.map((admin) => {
            let isCurrentUserBlocked = false;
            if (admin.attributes.friendStatus === 'BLOCKED_IN') {
                isCurrentUserBlocked = true;
            }
            return (
                <Link
                    route={`/users/profile/${admin.id}` }
                >
                    <List.Item {...(!isCurrentUserBlocked && { as: 'a' })} className={(isCurrentUserBlocked) ? '' : 'isDisabled'}>
                        <Image className="grProfile" src={isCurrentUserBlocked ? imagePlaceholder : admin.attributes.avatar} />
                        <List.Content>
                            <List.Header>{isCurrentUserBlocked ? formatMessage('groupProfile:anonymousUser') : admin.attributes.displayName}</List.Header>
                        </List.Content>
                    </List.Item>
                </Link>
            );
        });
    }
    return (
        <div className="ch_share">
            <List horizontal relaxed="very" className="GroupPrfile">
                { adminData }
            </List>
        </div>
    );
};

Admins.defaultProps = {
    groupAdminsDetails: {
        data: [],
        totalCount: null,
    },
    t: () => {},
};

Admins.propTypes = {
    groupAdminsDetails: {
        data: arrayOf(PropTypes.element),
        totalCount: number,
    },
    t: func,
};

function mapStateToProps(state) {
    return {
        groupAdminsDetails: state.group.groupAdminsDetails,
    };
}

const connectedComponent = withTranslation('groupProfile')(connect(mapStateToProps)(Admins));
export {
    connectedComponent as default,
    Admins,
    mapStateToProps,
};
