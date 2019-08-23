import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
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
} from 'prop-types';

import { getGroupBeneficiaries } from '../../actions/group';
import LeftImageCard from '../shared/LeftImageCard';

class CharitySupport extends React.Component {
    static loadCards(data) {
        return (
            <Grid.Row stretched>
                {data.map((card) => (
                    <LeftImageCard
                        entityName={card.attributes.name}
                        placeholder={card.attributes.avatar}
                        typeClass="chimp-lbl charity"
                        type={card.type}
                        url={`/${card.type}/${card.attributes.slug}`}
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
            getGroupBeneficiaries(dispatch, groupId);
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
        getGroupBeneficiaries(dispatch, groupId, url);
    }

    render() {
        const {
            groupBeneficiaries: {
                data: beneficiariesData,
                nextLink: beneficiariesNextLink,
            },
        } = this.props;
        return (
            <Fragment>
                <Grid stackable doubling columns={3}>
                    {!_isEmpty(beneficiariesData) && CharitySupport.loadCards(beneficiariesData)}
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
            </Fragment>
        );
    }
}

CharitySupport.defaultProps = {
    dispatch: _.noop,
    groupBeneficiaries: {
        data: [],
        links: {
            next: '',
        },
    },
    id: null,
};

CharitySupport.propTypes = {
    dispatch: func,
    groupBeneficiaries: {
        data: arrayOf(PropTypes.element),
        links: PropTypes.shape({
            next: string,
        }),
    },
    id: number,
};

function mapStateToProps(state) {
    return {
        groupBeneficiaries: state.group.groupBeneficiaries,
    };
}

export default connect(mapStateToProps)(CharitySupport);
