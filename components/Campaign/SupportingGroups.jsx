
import React, { Fragment } from 'react';
import {
    Grid,
    Header,
    Image,
    Button,
    Input,
    Icon,
    Divider,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { withTranslation } from '../../i18n';
import PlaceholderGrid from '../shared/PlaceHolder';
import MatchingHistory  from '../shared/MatchingHistory';
import placeholder from '../../static/images/no-data-avatar-giving-group-profile.png';
import SupportingGroup from '../Campaign/SupportingGroup';
import noDataImgCampain from '../../static/images/campaignprofile_nodata_illustration.png';
import { getCampaignSupportGroups } from '../../actions/profile';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

let timeout = '';
class SupportingGroups extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            searchKey: '',
        };
        this.tabRef = React.createRef();
        this.renderGroups = this.renderGroups.bind(this);
        this.searchClick = this.searchClick.bind(this);
        this.searchOnChange = this.searchOnChange.bind(this);
        this.renderMatchHistory = this.renderMatchHistory.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            dispatch,
            matchHistory,
            scrollOffset,
        } = this.props;
        const {
            current: {
                offsetTop,
            },
        } = this.tabRef;
        if(!_isEmpty(matchHistory) && !_isEqual(scrollOffset, offsetTop)) {
            dispatch({
                payload: {
                    scrollOffset: offsetTop,
                },
                type: 'GET_GROUP_TAB_OFFSET',
            });
        }
    }

    campaignGroups() {
        const {
            campaignId,
            dispatch,
        } = this.props;
        dispatch(getCampaignSupportGroups(campaignId));
    }

    debounceFunction({ dispatch, campaignId, searchQuery }, delay) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            dispatch(getCampaignSupportGroups(campaignId, searchQuery));
        }, delay);
    }

    searchOnChange(event) {
        const {
            target: {
                value
            }
        } = event;
        const { searchData } = this.props;
        if (value.length >= 4) {
            const {
                dispatch,
                campaignId,
            } = this.props;
            const arg = { dispatch, campaignId, searchQuery: value };
            this.debounceFunction(arg, 300);
        };
        if (_isEmpty(value) && !_isEqual(value, searchData)) {
            this.campaignGroups();
        };
        this.setState({
            searchKey: value,
        });
    }

    searchClick() {
        const { searchKey } = this.state;
        const {
            dispatch,
            campaignId,
        } = this.props;
        dispatch(getCampaignSupportGroups(campaignId, searchKey));
    }

    noDataSupportingGroups = (slug, formatMessage, searchData) => {
        if (searchData) {
            return (<p className="noResult">No results found</p>)
        }
        else {
            return (
                <Grid.Column width={16} className="c-w-100">
                    <div className="givingGroup noData mt-1 mb-2">
                        <Grid verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={8} computer={8}>
                                    <Image src={noDataImgCampain} className="noDataLeftImg" />
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={8} computer={8}>
                                    <div className="givingGroupNoDataContent">
                                        <Header as="h4">
                                            <Header.Content>
                                                {formatMessage('campaignProfile:supportNoDataHeader')}
                                                <Header.Subheader>
                                                    {formatMessage('campaignProfile:supportNoDataSubHeader')}
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                        <div>
                                            <a href={`${RAILS_APP_URL_ORIGIN}/campaigns/${slug}/step/one`}>
                                                <Button className="success-btn-rounded-def">{formatMessage('campaignProfile:createGivingGroupBtn')}</Button>
                                            </a>
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                </Grid.Column>
            );
        }
    };

    renderGroups(campaignSubGroupDetails, slug, formatMessage, searchData) {
        let groupCards = [];
        if ((typeof campaignSubGroupDetails === 'object') && (campaignSubGroupDetails.length > 0)) {
            campaignSubGroupDetails.map((subGroup) => {
                const groupImg = subGroup.attributes.avatar;
                groupCards.push(<SupportingGroup
                    subgroupSlug={subGroup.attributes.slug}
                    entityName={subGroup.attributes.name}
                    placeholder={(groupImg) || placeholder}
                    amountRaised={subGroup.attributes.totalMoneyRaised}
                    city={subGroup.attributes.city}
                    province={subGroup.attributes.province}
                    causes={subGroup.attributes.causes}
                    type="GIVING GROUP"
                />);
            });
        } else {
            groupCards = this.noDataSupportingGroups(slug, formatMessage, searchData);
        }
        return groupCards;
    };


    renderMatchHistory(matchHistory) {
        const {
            t: formatMessage,
        } = this.props;
        if (!_isEmpty(matchHistory)) {
            return (
                <div className="GroupTab">
                    <Divider className="mt-2 mobHideDivider" />
                    <div className="supportingWithsearch">
                        <Header as="h3">{formatMessage('campaignProfile:matchingCampaignHeader')}</Header>
                    </div>
                    <MatchingHistory />
                </div>
            )
        }
        return null;
    };

    renderCount(campaignSubGroupDetails, subgroupCount) {
        const {
            matchHistory
        } = this.props;
        
        if (!_isEmpty(campaignSubGroupDetails) && _size(campaignSubGroupDetails) > 0) {
            const countText = `Showing ${_.size(campaignSubGroupDetails)} of ${subgroupCount}`;
            return (
                <div className={`${ !_isEmpty(matchHistory) ? "hide_match" : 'show_match'}`}>
                    <p>{countText}</p>
                </div>
            );
        }
        return null;
    }

    render() {
        const {
            slug,
            campaignSubGroupDetails,
            campaignSubGroupsShowMoreUrl,
            isAuthenticated,
            matchHistory,
            seeMoreLoaderStatus,
            subGroupListLoader,
            viewMoreFn,
            t: formatMessage,
            searchData,
            subgroupCount,
        } = this.props;
        const { searchKey } = this.state;
        return (
            <Fragment>
                <div className="supportingWithsearch">
                    <Header as="h3">{formatMessage('campaignProfile:supportCampaignHeader')}</Header>
                </div>
                {_isEmpty(campaignSubGroupDetails) && _isEmpty(searchKey) ? 
                '':
                (<div className="search-banner campaignSearchBanner">
                    <div className="searchbox">
                        <Grid >
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={12} computer={8}>
                                    <Input
                                        fluid
                                        placeholder="Search Giving Groups"
                                        onChange={(event) => this.searchOnChange(event)}
                                    />
                                    <div className="search-btn campaignSearch">
                                        <a onClick={this.searchClick}>
                                            <Icon name="search" />
                                        </a>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                </div>)
                }
                <div className="supportingcardWapper">
                    {subGroupListLoader ? <PlaceholderGrid row={2} column={3} /> : (
                        <div className="custom_Grid">
                            {this.renderGroups(campaignSubGroupDetails, slug, formatMessage, searchData)}
                        </div>
                    )}
                    {(campaignSubGroupsShowMoreUrl) ? (
                    <div className={!_isEmpty(matchHistory) ? "supportingMatchHistory" : "supportingcardShowMore"}>
                        <Button
                            className="btnMore blue-bordr-btn-round-def"
                            onClick={viewMoreFn}
                            loading={!!seeMoreLoaderStatus}
                            disabled={!!seeMoreLoaderStatus}
                            content="Show more"
                        />
                    </div>
                ) : ''
                }
                {this.renderCount(campaignSubGroupDetails, subgroupCount)}
                </div>
                <div ref={this.tabRef}>
                {isAuthenticated && this.renderMatchHistory(matchHistory)}
                </div>
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        searchData: state.profile.searchData,
        isAuthenticated: state.auth.isAuthenticated,
        scrollOffset: state.group.scrollOffset,
    };
}

SupportingGroups.defaultProps = {
    slug: '',
    campaignSubGroupDetails: [],
    campaignSubGroupsShowMoreUrl: '',
    isAuthenticated: false,
    matchHistory: [],
    seeMoreLoaderStatus: false,
    subGroupListLoader: false,
    viewMoreFn: () => {},
    t: () => {},
    searchData: '',
    dispatch: () => {},
    campaignId: '',
    scrollOffset: 0,
    subgroupCount: 0,
}

// eslint-disable-next-line react/no-typos
SupportingGroups.PropTypes = {
    slug: PropTypes.string,
    campaignSubGroupDetails: PropTypes.array,
    campaignSubGroupsShowMoreUrl: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    matchHistory: PropTypes.array,
    seeMoreLoaderStatus: PropTypes.bool,
    subGroupListLoader: PropTypes.bool,
    viewMoreFn: PropTypes.func,
    t: PropTypes.func,
    searchData: PropTypes.string,
    dispatch: PropTypes.func,
    campaignId:  PropTypes.string,
    scrollOffset: PropTypes.number,
    subgroupCount: PropTypes.number,
}

export default withTranslation('campaignProfile')(connect(mapStateToProps)(SupportingGroups));
