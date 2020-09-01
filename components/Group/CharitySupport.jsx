import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    Header,
    Divider,
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
import { getDetails } from '../../actions/group';
import PlaceholderGrid from '../shared/PlaceHolder';

import GroupSupportCard from './GroupSupportCard';

class CharitySupport extends React.Component {
    constructor(props) {
        super(props);
        this.showCharities = this.showCharities.bind(this);
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
        let showDivider = false;
        return (
            beneficiariesData.map((data, index) => {
                if (index > 0 && index < beneficiariesData.length) {
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
                },
            },
            t: formatMessage,
        } = this.props;
        let data = '';
        if (!_isEmpty(beneficiariesData)) {
            data = this.showCharities();
        } else if (!campaignId && _isEmpty(beneficiariesData)) {
            data = (
                <p>{formatMessage('groupProfile:charitySupportNoDataText')}</p>
            );
        }
        return (
            <div className="charityInfowrap fullwidth">
                <div className="charityInfo paddingcharity">
                    <Header className="heading_btm" as="h4">{formatMessage('groupProfile:groupSupportsheadertext')}</Header>
                    {campaignId
                    && (
                        <Fragment>
                            <GroupSupportCard
                                avatar={campaignAvatar}
                                name={campaignName}
                                slug={campaignSlug}
                                isCampaign
                            />
                            {!_isEmpty(beneficiariesData)
                            && <Divider />}
                        </Fragment>
                    )
                    }
                    {(charityLoader)
                        ? (
                            <div className="mt-2">
                                <PlaceholderGrid row={4} column={1} placeholderType="singleCard" />
                            </div>
                        )
                        : data}
                </div>
            </div>
        );
    }
}

CharitySupport.defaultProps = {
    charityLoader: true,
    dispatch: () => {},
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
        },
        id: '',
    },
    t: () => {},
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
