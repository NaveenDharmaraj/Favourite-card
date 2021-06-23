import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    Header,
    Divider,
    Responsive,
    Button,
} from 'semantic-ui-react';
import {
    arrayOf,
    PropTypes,
    string,
    number,
    func,
    bool,
} from 'prop-types';

import { withTranslation } from '../../i18n';
import {
    Link,
} from '../../routes';
import { getDetails } from '../../actions/group';
import PlaceholderGrid from '../shared/PlaceHolder';

import GroupSupportCard from './GroupSupportCard';

class CharitySupport extends React.Component {
    constructor(props) {
        super(props);
        this.showCharities = this.showCharities.bind(this);
        this.handleViewMore = this.handleViewMore.bind(this);
        this.state = {
            viewButtonClicked: false,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            groupBeneficiaries: {
                data: beneficiariesData,
            },
            groupDetails: {
                id: groupId,
            },
        } = this.props;
        if (_isEmpty(beneficiariesData)) {
            dispatch(getDetails(groupId, 'charitySupport'));
        }
    }

    showCharities() {
        const {
            groupBeneficiaries: {
                data: beneficiariesData,
            },
        } = this.props;
        return (
            beneficiariesData.map((data, index) => {
                let showDivider = false;
                if (index > 0) {
                    showDivider = true;
                }
                return (
                    <Fragment>
                        {showDivider && <Divider />}
                        <GroupSupportCard
                            avatar={data.attributes.avatar}
                            name={data.attributes.name}
                            slug={data.attributes.slug}
                            isCampaign={false}
                        />
                    </Fragment>
                );
            })
        );
    }

    handleViewMore() {
        this.setState({
            viewButtonClicked: true,
        });
    }

    render() {
        const {
            charityLoader,
            groupBeneficiaries: {
                data: beneficiariesData,
            },
            groupDetails: {
                attributes: {
                    campaignAvatar,
                    campaignId,
                    campaignName,
                    campaignSlug,
                    hasCampaignAccess,
                    isAdmin,
                    slug,
                },
            },
            t: formatMessage,
        } = this.props;
        const {
            viewButtonClicked,
        } = this.state;
        let data = '';
        const showNoData = ((!campaignId || !hasCampaignAccess) && _isEmpty(beneficiariesData));
        if (!_isEmpty(beneficiariesData)) {
            data = this.showCharities();
        } else if (showNoData) {
            data = (
                <div>
                    <p>{formatMessage('groupProfile:charitySupportNoDataText')}</p>
                    {isAdmin
                    && (
                        <Link route={`/groups/${slug}/edit/charitysupport`}>
                            <Button
                                className="success-btn-rounded-def fluid"
                                style={{
                                    minHeight: '40px',
                                }}
                            >
                                Select a charity
                            </Button>
                        </Link>
                    )
                    }
                </div>
            );
        }
        return (
            <div className="charityInfowrap fullwidth">
                <div className="charityInfo paddingcharity">
                    <Header className="heading_btm" as="h4">
                        {formatMessage('groupProfile:groupSupportsheadertext')}
                    </Header>
                    {(campaignId && hasCampaignAccess)
                        && (
                            <Fragment>
                                <GroupSupportCard
                                    avatar={campaignAvatar}
                                    name={campaignName}
                                    slug={campaignSlug}
                                    isCampaign
                                />
                                {!_isEmpty(beneficiariesData)
                                    && (
                                        <Fragment>
                                            <Divider />
                                            <Responsive maxWidth={767} minWidth={320}>
                                                {!viewButtonClicked
                                                    && (
                                                        <Button
                                                            onClick={this.handleViewMore}
                                                            className="blue-bordr-btn-round-def view_allbtn w-120"
                                                            content="View all"
                                                        />
                                                    )
                                                }
                                            </Responsive>
                                        </Fragment>
                                    )}
                            </Fragment>
                        )
                    }
                    {(charityLoader)
                        ? (
                            <div className="mt-2">
                                <PlaceholderGrid row={4} column={1} placeholderType="singleCard" />
                            </div>
                        )
                        : (
                            <Fragment>
                                <Responsive minWidth={768}>
                                    {data}
                                </Responsive>
                                <Responsive maxWidth={767} minWidth={320}>
                                    {(!campaignId && !viewButtonClicked && !_isEmpty(beneficiariesData))
                                        && (
                                            <Fragment>
                                                <GroupSupportCard
                                                    avatar={beneficiariesData[0].attributes.avatar}
                                                    name={beneficiariesData[0].attributes.name}
                                                    slug={beneficiariesData[0].attributes.slug}
                                                    isCampaign={false}
                                                />
                                                {(beneficiariesData.length > 1)
                                                    && (
                                                        <Fragment>
                                                            <Divider />
                                                            <Button
                                                                onClick={this.handleViewMore}
                                                                className="blue-bordr-btn-round-def view_allbtn w-120"
                                                                content="View all"
                                                            />
                                                        </Fragment>
                                                    )}
                                            </Fragment>
                                        )
                                    }
                                    {(viewButtonClicked || showNoData)
                                        && (
                                            data
                                        )}
                                </Responsive>
                            </Fragment>
                        )}
                </div>
            </div>
        );
    }
}

CharitySupport.defaultProps = {
    charityLoader: true,
    dispatch: () => { },
    groupBeneficiaries: {
        data: [],
    },
    groupDetails: {
        attributes: {
            campaignAvatar: '',
            campaignCity: '',
            campaignId: null,
            campaignName: '',
            campaignSlug: '',
            hasCampaignAccess: false,
            isAdmin: false,
            slug: '',
        },
        id: '',
    },
    t: () => { },
};

CharitySupport.propTypes = {
    charityLoader: bool,
    dispatch: func,
    groupBeneficiaries: PropTypes.shape({
        data: arrayOf(PropTypes.element),
    }),
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            campaignAvatar: string,
            campaignCity: string,
            campaignId: number,
            campaignName: string,
            campaignSlug: string,
            hasCampaignAccess: bool,
            isAdmin: bool,
            slug: string,
        }),
        id: string,
    }),
    t: func,
};

function mapStateToProps(state) {
    return {
        charityLoader: state.group.charityLoader,
        groupBeneficiaries: state.group.groupBeneficiaries,
        groupDetails: state.group.groupDetails,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(CharitySupport));
export {
    connectedComponent as default,
    CharitySupport,
    mapStateToProps,
};
