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
    number,
    func,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

const AdminsList = (props) => {
    const updateIndex = () => {
        const {
            dispatch,
            scrollOffset,
        } = props;
        dispatch({
            payload: {
                activeIndex: 1,
            },
            type: 'GET_GROUP_TAB_INDEX',
        });
        window.scrollTo({
            behavior: 'smooth',
            top: scrollOffset,
        });
    };

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
        remainingAdmins = (totalCount - adminData.length);
        data.slice(0, 3).map((admin) => {
            adminData.push(
                <List.Item as="a">
                    <Image className="grProfile" src={admin.attributes.avatar} />
                </List.Item>,
            );
            adminName.push(` ${admin.attributes.displayName}`);
        });
    }

    return (
        <div className="ch_shareMore" onClick={updateIndex}>
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
    dispatch: () => {},
    groupAdminsDetails: {
        data: [],
        links: {
            next: '',
        },
    },
    scrollOffset: 0,
};

AdminsList.propTypes = {
    dispatch: func,
    groupAdminsDetails: {
        data: arrayOf(PropTypes.element),
        links: PropTypes.shape({
            next: string,
        }),
    },
    scrollOffset: number,
};

function mapStateToProps(state) {
    return {
        groupAdminsDetails: state.group.groupAdminsDetails,
        isAuthenticated: state.auth.isAuthenticated,
        scrollOffset: state.group.scrollOffset,
    };
}

export default connect(mapStateToProps)(AdminsList);
