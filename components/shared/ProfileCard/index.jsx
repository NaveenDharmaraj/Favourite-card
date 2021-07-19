import React, {
    Fragment,
    useState,
    useEffect,
} from 'react';
import {
    Card,
    Header,
    Icon,
    Image,
    Dropdown,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import getConfig from 'next/config';
import {
    array,
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import { useDispatch } from 'react-redux';

import { Link } from '../../../routes';
import { withTranslation } from '../../../i18n';
import {
    formatCurrency,
} from '../../../helpers/give/utils';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import { removeFavorite } from '../../../actions/user';
import LeaveModal from '../../shared/LeaveModal';
import { default as charityAvatar } from '../../../static/images/no-data-avatar-charity-profile.png';
import { default as groupAvatar } from '../../../static/images/no-data-avatar-giving-group-profile.png';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const ProfileCard = (props) => {
    const {
        avatar,
        type,
        name,
        causes,
        entityId,
        location,
        isMyProfile,
        isCampaign,
        Profiletype,
        slug,
        isPreviewMode,
        canEdit,
        totalMoneyRaised,
        isFavourite,
        showLeave,
        callLeaveGroup,
        showError,
        showMangeGroups,
        leaveButtonLoader,
        errorMessage,
        closeLeaveModal,
    } = props;
    const [
        showLeaveModal,
        setshowLeaveModal,
    ] = useState(false);

    useEffect(() => {
        if (closeLeaveModal) {
            setshowLeaveModal(false);
        }
    }, [
        closeLeaveModal,
    ]);
    let displayAvatar = avatar;
    if (_isEmpty(displayAvatar)) {
        displayAvatar = Profiletype === 'charity' ? charityAvatar : groupAvatar;
    }
    let route = 'charities';
    const currency = 'USD';
    const language = 'en';
    const dispatch = useDispatch();
    let editLink = `/groups/${slug}/edit`;
    if (Profiletype === 'group') {
        route = (isCampaign) ? 'campaigns' : 'groups';
        editLink = (isCampaign) ? `${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/manage-basics` : editLink;
    }
    const callRemoveFav = (removeId, type) => {
        const {
            currentUser,
            currentPageNumber,
            favouritesData,
            pageSize,
            totalUserFavouritesRecordCount,
            totalUserFavouritesPageCount,
            callLeaveGroup,
        } = props;
        dismissAllUxCritialErrors(dispatch);
        const item = (Profiletype === 'charity') ? _find(favouritesData, { attributes: { charity_id: removeId } })
            : _find(favouritesData, { attributes: { group_id: removeId } });
        if (item) {
            dispatch({
                payload: {
                },
                type: 'DISABLE_FAVORITES_BUTTON',
            });
            removeFavorite(dispatch, removeId, currentUser.id, favouritesData, type, totalUserFavouritesRecordCount, pageSize, currentPageNumber, totalUserFavouritesPageCount, true);
        }
    };
    return (
        <Card>
            <Link className="lnkChange" route={`/${route}/${slug}`} passHref>
                <Card.Content>
                    <Fragment>
                        <div className="cardPrflImg">
                            <Image src={displayAvatar} />
                        </div>
                        <div className="cardcontentWrap">
                            <Header as="h6" className={`${(Profiletype === 'group' ? 'groupClr' : 'charityClr')}`}>
                                {type}
                            </Header>
                            <Header as="h4">{name}</Header>
                            <p>{causes}</p>
                            <p>{location}</p>
                            {!_isEmpty(totalMoneyRaised)
                                && (
                                    <p>{`Total Raised: ${formatCurrency(totalMoneyRaised, language, currency)}`}</p>
                                )}
                        </div>
                    </Fragment>
                </Card.Content>
            </Link>
            {(isMyProfile && (Profiletype === 'group') && !isPreviewMode && canEdit)
                && (
                    <div className="edit">
                        <Link route={editLink}>
                            Edit
                        </Link>
                    </div>
                )}
            {isFavourite && isMyProfile
                && (
                    <Icon
                        name="heart"
                        disabled={props.disableFavorites}
                        onClick={() => callRemoveFav(entityId, Profiletype)}
                    />
                )}
            {showLeave
            && (
                <div className="edit">
                    <Dropdown
                        className="rightBottom"
                        icon="ellipsis horizontal"
                        closeOnBlur
                    >
                        <Dropdown.Menu>
                            <Dropdown.Item
                                text="Leave Group"
                                onClick={() => setshowLeaveModal(true)}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}
            {showLeaveModal
            && (
                <LeaveModal
                    showError={showError}
                    showMangeGroups={showMangeGroups}
                    slug={slug}
                    name={name}
                    id={entityId}
                    callLeaveGroup={() => callLeaveGroup(entityId)}
                    close={() => setshowLeaveModal(false)}
                    open={showLeaveModal}
                    errorMessage={errorMessage}
                    leaveButtonLoader={leaveButtonLoader}
                />
            )}
        </Card>
    );
};

ProfileCard.defaultProps = {
    avatar: '',
    callLeaveGroup: () => {},
    canEdit: false,
    causes: '',
    closeLeaveModal: false,
    currentPageNumber: 1,
    disableFavorites: false,
    entityId: '',
    errorMessage: {},
    favouritesData: [],
    isCampaign: false,
    isFavourite: false,
    isMyProfile: false,
    isPreviewMode: false,
    leaveButtonLoader: false,
    location: '',
    name: '',
    pageSize: 10,
    Profiletype: '',
    showError: false,
    showLeave: false,
    showMangeGroups: false,
    slug: '',
    totalMoneyRaised: '',
    totalUserFavouritesRecordCount: 0,
    totalUserFavouritesPageCount: 0,
    type: '',
};

ProfileCard.propTypes = {
    avatar: string,
    callLeaveGroup: func,
    canEdit: bool,
    causes: string,
    closeLeaveModal: bool,
    currentPageNumber: number,
    disableFavorites: bool,
    entityId: string,
    errorMessage: PropTypes.shape({}),
    favouritesData: array,
    isCampaign: bool,
    isFavourite: bool,
    isMyProfile: bool,
    isPreviewMode: bool,
    leaveButtonLoader: bool,
    location: string,
    name: string,
    pageSize: number,
    Profiletype: string,
    showError: bool,
    showLeave: bool,
    showMangeGroups: bool,
    slug: string,
    totalMoneyRaised: string,
    totalUserFavouritesRecordCount: number,
    totalUserFavouritesPageCount: number,
    type: string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        disableFavorites: state.user.disableFavorites,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(ProfileCard));
export {
    connectedComponent as default,
    ProfileCard,
    mapStateToProps,
};
