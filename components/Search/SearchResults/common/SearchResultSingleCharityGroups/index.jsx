import React, {Fragment} from 'react';
import {
    Header,
    Grid,
    Image,
    Button,
    Icon,
} from 'semantic-ui-react';
import _map from 'lodash/map';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import {
    Router
} from '../../../../../routes';
import PlaceholderGrid from '../../../../shared/placeHolder';

// eslint-disable-next-line react/prefer-stateless-function
class SearchResultSingleCharityGroups extends React.Component {
    constructor(props) {
        super(props);
        this.renderCharityGroupComponent = this.renderCharityGroupComponent.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this
    handleRoute(type, slug) {
        let route = null;
        if (type === 'groups') {
            route = `/groups/${slug}`;
        } else {
            route = `/charities/${slug}`;
        }
        Router.pushRoute(route);
    }

    renderCharityGroupComponent() {
        let charitiesGroupsComponent = [];
        const {
            CharityGroups,
        } = this.props;
        if (!_isEmpty(CharityGroups) && CharityGroups.length > 0) {
            charitiesGroupsComponent = _map(CharityGroups, (CharityGroup, i) => (
                <div className="search-result-single charities">
                    <Grid stackable>
                        <Grid.Row stretched key={i}>
                            <Grid.Column width={5}>
                                <Image src={CharityGroup.attributes.avatar} className="search-left-img" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={7} computer={8} verticalAlign="top">
                                <div className=" description">
                                    <Header as="h4">
                                        {CharityGroup.attributes.name}
                                        <Header.Subheader>
                                            {!_isEmpty(CharityGroup.attributes.description) ? CharityGroup.attributes.description.split(' ').slice(0, 20).join(' ') : null}
                                            {(!_isEmpty(CharityGroup.attributes.description) && CharityGroup.attributes.description.split(' ').length > 20) && '...'}
                                            <br />
                                            {(!_isEmpty(CharityGroup.attributes.city) || !_isEmpty(CharityGroup.attributes.province)) && 'Location:' }
                                            {!_isEmpty(CharityGroup.attributes.city) ? CharityGroup.attributes.city : null}
                                            {!_isEmpty(CharityGroup.attributes.province) ? CharityGroup.attributes.province : null}
                                            <br />
                                        </Header.Subheader>
                                    </Header>
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={4} computer={3} verticalAlign="middle" textAlign="center">
                                <div className="btn-wraper">
                                    <Button className="view-btn" onClick={()=>{this.handleRoute(CharityGroup.type,CharityGroup.attributes.slug);}}>
                                        {(CharityGroup.type === 'groups') ? 'View Group' : 'View charity'}
                                    </Button>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                
            ));
            return charitiesGroupsComponent;
        }
        return 'No Data available';
    }

    render() {
        const {
            textSearchCharityGroupLoader,
        } = this.props;
        return (
            <Fragment>
                {textSearchCharityGroupLoader ? (
                    <PlaceholderGrid column={1} row={2} />
                ) : (
                    <div className="search-result">
                        {this.renderCharityGroupComponent()}
                    </div>
                )}
            </Fragment>
        );
    }
}
SearchResultSingleCharityGroups.propTypes = {
    CharityGroups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    textSearchCharityGroupLoader: PropTypes.bool,
};

SearchResultSingleCharityGroups.defaultProps = {
    CharityGroups: null,
    textSearchCharityGroupLoader: false,
};
export default SearchResultSingleCharityGroups;
