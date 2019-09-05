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
} from 'prop-types';

import { getDetails } from '../../actions/group';
import LeftImageCard from '../shared/LeftImageCard';
import PlaceholderGrid from '../shared/PlaceHolder';

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
                        url={`/charities/${card.attributes.slug}`}
                    />
                ))}
            </Grid.Row>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            charityLoader: !props.groupBeneficiaries.data.length > 0,
        };
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

    componentDidUpdate(prevProps) {
        const {
            groupBeneficiaries: {
                data: charityData,
            },
        } = this.props;
        let {
            charityLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(charityData, prevProps.groupBeneficiaries.data)) {
                charityLoader = false;
            }
            this.setState({
                charityLoader,
            });
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
            groupBeneficiaries: {
                data: beneficiariesData,
                nextLink: beneficiariesNextLink,
            },
        } = this.props;
        const {
            charityLoader,
        } = this.state;
        return (
            <Fragment>
                {!charityLoader ? (
                    <Grid stackable doubling columns={3}>
                        {!_isEmpty(beneficiariesData)
                            && CharitySupport.loadCards(beneficiariesData)}
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
    dispatch: _.noop,
    groupBeneficiaries: {
        data: [],
        nextLink: '',
    },
    id: null,
};

CharitySupport.propTypes = {
    dispatch: func,
    groupBeneficiaries: {
        data: arrayOf(PropTypes.element),
        nextLink: string,
    },
    id: number,
};

function mapStateToProps(state) {
    return {
        groupBeneficiaries: state.group.groupBeneficiaries,
    };
}

export default connect(mapStateToProps)(CharitySupport);
