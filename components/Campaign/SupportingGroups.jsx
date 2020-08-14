
import React, { Fragment } from 'react';
import {
    Grid,
    Header,
    Image,
    Button,
    Input,
    Icon,
} from 'semantic-ui-react';
import getConfig from 'next/config';
import { connect } from 'react-redux';
import { withTranslation } from '../../i18n';
import PlaceholderGrid from '../shared/PlaceHolder';
import placeholder from '../../static/images/no-data-avatar-giving-group-profile.png';
import SupportingGroup from '../Campaign/SupportingGroup';
import noDataImgCampain from '../../static/images/campaignprofile_nodata_illustration.png';
import { getCampaignFromSearch } from '../../actions/profile';
import { mapStateToProps } from '../shared/ShareProfile';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class SupportingGroups extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            searchKey: '',
        };
        this.renderGroups = this.renderGroups.bind(this);
        this.searchClick = this.searchClick.bind(this);
        this.searchOnChange = this.searchOnChange.bind(this);
    }

    noDataSupportingGroups = (slug, formatMessage) => {
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
    };

    searchOnChange(event) {
        const {
            target: {
                value
            }
        } = event;
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
        dispatch(getCampaignFromSearch(campaignId, searchKey));
    }

    renderGroups(campaignSubGroupDetails, slug, formatMessage) {
        let groupCards = [];
        if ((typeof campaignSubGroupDetails === 'object') && (campaignSubGroupDetails.length > 0)) {
            campaignSubGroupDetails.map((subGroup) => {
                const groupImg = subGroup.attributes.avatar;
                groupCards.push(<SupportingGroup
                    entityName={subGroup.attributes.name}
                    placeholder={(groupImg) || placeholder}
                    amountRaised={subGroup.attributes.totalMoneyRaised}
                    city={subGroup.attributes.city}
                    province={subGroup.attributes.province}
                    causes={subGroup.attributes.causes}
                    type="Giving Groups"
                />);
            });
        } else {
            groupCards = this.noDataSupportingGroups(slug, formatMessage);
        }
        return groupCards;
    };

    render() {
        const {
            slug,
            campaignSubGroupDetails,
            campaignSubGroupsShowMoreUrl,
            seeMoreLoaderStatus,
            subGroupListLoader,
            viewMoreFn,
            t: formatMessage,
        } = this.props;
        const { searchKey } = this.state;
        return (
            <Fragment>
                <div className="supportingWithsearch">
                    <Header as="h3">{formatMessage('campaignProfile:supportCampaignHeader')}</Header>
                </div>
                <div className="search-banner campaignSearchBanner">
                    <div className="searchbox">
                        <Grid >
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={12} computer={8}>
                                    {/* TODO Api call on search onChange */}
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
                </div>
                {subGroupListLoader ? <PlaceholderGrid row={2} column={3} /> : (
                    <div className="supportingcardWapper">
                        <div className="custom_Grid">
                            {this.renderGroups(campaignSubGroupDetails, slug, formatMessage)}
                        </div>
                    </div>
                )
                }
                {(campaignSubGroupsShowMoreUrl) ? (
                    <div className="supportingcardShowMore">
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
            </Fragment>
        )
    }
}

export default withTranslation('campaignProfile')(connect(mapStateToProps)(SupportingGroups));
