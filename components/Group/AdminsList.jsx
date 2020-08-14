import React from 'react';
import {
    List,
    Image,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
    arrayOf,
    PropTypes,
    string,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

const AdminsList = (props) => {
    const {
        groupAdminsDetails: {
            data,
            totalCount,
        },
    } = props;
    const adminData = [];
    const adminName = [];
    let remainingAdmins = '';
    if (!_isEmpty(data)) {
        data.slice(0, 3).map((admin) => {
            adminData.push(
                <List.Item as="a">
                    <Image className="grProfile" src={admin.attributes.avatar} />
                </List.Item>,
            );
            adminName.push(admin.attributes.displayName);
        });
        remainingAdmins = (totalCount - adminData.length);
    }
    return (
        <div className="ch_shareMore">
            <List horizontal relaxed="very" className="GroupPrfileAll">
                {adminData}
                <List.Item as="a">
                    <div className="RountBg">
                        <p>{`+${remainingAdmins}`}</p>
                    </div>
                </List.Item>
            </List>
            <div className="GroupPrfileAllText">
                <p>{`${adminName} and ${remainingAdmins} more`}</p>
            </div>
        </div>
    );
};

AdminsList.defaultProps = {
    groupAdminsDetails: {
        data: [],
        links: {
            next: '',
        },
    },
};

AdminsList.propTypes = {
    groupAdminsDetails: {
        data: arrayOf(PropTypes.element),
        links: PropTypes.shape({
            next: string,
        }),
    },
};

function mapStateToProps(state) {
    return {
        groupAdminsDetails: state.group.groupAdminsDetails,
    };
}

export default connect(mapStateToProps)(AdminsList);
