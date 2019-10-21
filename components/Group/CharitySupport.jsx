import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    Grid,
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

import { getDetails } from '../../actions/group';
import LeftImageCard from '../shared/LeftImageCard';
import PlaceholderGrid from '../shared/PlaceHolder';

import GroupNoDataState from './GroupNoDataState';

class CharitySupport extends React.Component {
    static loadCards(data) {
        return (
            <Grid.Row stretched>
                {data.map((card) => (
                    <LeftImageCard
                        entityName={card.attributes.name}
                        location=""
                        placeholder={card.attributes.avatar}
                        typeClass="chimp-lbl charity"
                        type="charity"
                        url={`/charities/${card.attributes.slug}`}
                    />
                ))}
            </Grid.Row>
        );
    }

    componentDidMount() {
        const {
            dispatch,
            groupBeneficiaries: {
                data: beneficiariesData,
            },
            id: groupId,
        } = this.props;
        if (_isEmpty(beneficiariesData)) {
            getDetails(dispatch, groupId, 'charitySupport');
        }
    }

    loadMore() {
        const {
            dispatch,
            groupBeneficiaries: {
                nextLink: beneficiariesNextLink,
            },
            id: groupId,
        } = this.props;
        const url = (beneficiariesNextLink) ? beneficiariesNextLink : null;
        getDetails(dispatch, groupId, 'charitySupport', url);
    }

    render() {
        const {
            charityLoader,
            groupBeneficiaries: {
                data: beneficiariesData,
                nextLink: beneficiariesNextLink,
            },
            groupDetails: {
                attributes: {
                    isAdmin,
                    slug,
                },
            },
        } = this.props;
        const viewData = !_isEmpty(beneficiariesData)
            ? CharitySupport.loadCards(beneficiariesData)
            : (
                <GroupNoDataState
                    type="charities"
                    isAdmin={isAdmin}
                    slug={slug}
                />
            );

        return (
            <Fragment>
                {!charityLoader ? (
                    <Grid stackable doubling columns={3}>
                        {viewData}
                        {(beneficiariesNextLink)
                        && (
                            <div className="text-right">
                                <Button
                                    onClick={() => this.loadMore()}
                                    basic
                                    color="blue"
                                    content="View more"
                                />
                            </div>
                        )
                        }
                    </Grid>
                ) : (<PlaceholderGrid row={1} column={3} placeholderType="card" />)
                }
            </Fragment>
        );
    }
}

CharitySupport.defaultProps = {
    charityLoader: true,
    dispatch: _.noop,
    groupBeneficiaries: {
        data: [],
        nextLink: '',
    },
    groupDetails: {
        attributes: {
            isAdmin: false,
            slug: '',
        },
    },
    id: null,
};

CharitySupport.propTypes = {
    charityLoader: bool,
    dispatch: func,
    groupBeneficiaries: {
        data: arrayOf(PropTypes.element),
        nextLink: string,
    },
    groupDetails: {
        attributes: {
            isAdmin: bool,
            slug: string,
        },
    },
    id: number,
};

function mapStateToProps(state) {
    return {
        charityLoader: state.group.showPlaceholder,
        groupBeneficiaries: state.group.groupBeneficiaries,
        groupDetails: state.group.groupDetails,
    };
}

export default connect(mapStateToProps)(CharitySupport);
