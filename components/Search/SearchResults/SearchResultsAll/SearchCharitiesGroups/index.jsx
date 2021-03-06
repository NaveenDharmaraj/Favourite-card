import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Header,
    Grid,
    Card,
    Image,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';

import PlaceholderGrid from '../../../../shared/PlaceHolder';
import DiscoveredForYouNoData from '../../../../shared/DiscoveredForYouNoData';
import { Link } from '../../../../../routes';
import charityImg from '../../../../../static/images/no-data-avatar-charity-profile.png';
import groupImg from '../../../../../static/images/no-data-avatar-giving-group-profile.png';
import { renderText } from '../../../../../helpers/utils';

class SearchCharitiesGroups extends React.Component {
    constructor(props) {
        super(props);
        this.renderCharityComponent = this.renderCharityComponent.bind(this);
        this.renderGroupComponent = this.renderGroupComponent.bind(this);
    }

    renderCharityComponent() {
        let charitiesComponent = [];
        const {
            charities,
        } = this.props;
        if (!_isEmpty(charities) && charities.data && charities.data.length > 0) {
            charitiesComponent = _map(charities.data, (charity, i) => (
                <Grid.Column mobile={16} tablet={8} computer={4}>
                    <Link route={`/charities/${charity.attributes.slug}`} passHref>

                        <Card as="a" key={i}>
                            <div className="searchCardTopImg" style={{ backgroundImage: `url('${!_isEmpty(charity.attributes.avatar) ? charity.attributes.avatar : charityImg}')` }} />
                            <Card.Content>
                                <Card.Header>{charity.attributes.name}</Card.Header>
                                <Card.Description>
                                    {charity.attributes.description && renderText(charity.attributes.description, 20)}
                                </Card.Description>
                                <Card.Meta>
                                    {!_isEmpty(charity.attributes.city) ? charity.attributes.city : null}
                                    {(!_isEmpty(charity.attributes.city) && !_isEmpty(charity.attributes.province)) && ','}
                                    {!_isEmpty(charity.attributes.province) ? ` ${charity.attributes.province}` : null}
                                </Card.Meta>
                            </Card.Content>
                        </Card>
                    </Link>
                </Grid.Column>

            ));
            return charitiesComponent;
        }
        return 'No charities available';
    }


    renderGroupComponent() {
        let groupsComponent = [];
        const {
            groups,
        } = this.props;
        if (!_isEmpty(groups) && groups.data && groups.data.length > 0) {
            groupsComponent = _map(groups.data, (group, i) => {
                const route = (!_isEmpty(group.attributes) && group.attributes.is_campaign === 1) ? `/campaigns/${group.attributes.slug}` : `/groups/${group.attributes.slug}`;
                return (
                    <Grid.Column mobile={16} tablet={8} computer={4}>
                        <Link route={route} passHref>
                            <Card as="a" key={i}>
                                <div className="searchCardTopImg" style={{ backgroundImage: `url('${!_isEmpty(group.attributes.avatar) ? group.attributes.avatar : groupImg}')` }} />
                                <Card.Content>
                                    <Card.Header>{group.attributes.name}</Card.Header>
                                    <Card.Description>
                                        {group.attributes.description && renderText(group.attributes.description, 20)}
                                    </Card.Description>
                                    <Card.Meta>
                                        {!_isEmpty(group.attributes.city) ? group.attributes.city : null}
                                        {(!_isEmpty(group.attributes.city) && !_isEmpty(group.attributes.province)) && ','}
                                        {!_isEmpty(group.attributes.province) ? ` ${group.attributes.province}` : null}
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        </Link>
                    </Grid.Column>
                );
            });
            return groupsComponent;
        }
        return 'No Groups available';
    }

    render() {
        const {
            charities,
            charityLoader,
            groupLoader,
            groups,
            searchWord,
        } = this.props;
        let searchQueryParam = '';
        let showNoData = false;

        if ((charities && _isEmpty(charities.data) && !charityLoader) && (groups && _isEmpty(groups.data) && !groupLoader)) {
            showNoData = true;
        }

        if (!_isEmpty(searchWord)) {
            searchQueryParam = `search=${searchWord}&`;
        }
        return (
            <Fragment>
                {!showNoData
                    ? (
                        <Fragment>
                            {((charities && !_isEmpty(charities.data)) || charityLoader)
                            && charityLoader
                                ? (<PlaceholderGrid column={4} row={1} />
                                ) : (
                                    <Fragment>
                                        <div className="search-main-head charities">
                                            <Header as="h2">
                                                Charities discovered for you
                                                <Header.Subheader>
                                                    Suggestions based on your interests.
                                                    {
                                                        (!_isEmpty(charities) && !_isEmpty(charities.meta) && charities.meta.recordCount > 4)
                                                        && <div className="right-align"><Link route={`/search?${searchQueryParam}result_type=Beneficiary`}>&nbsp;&nbsp;View all</Link></div>
                                                    }
                                                </Header.Subheader>
                                            </Header>
                                            <div className="search-result-all">
                                                <Grid>
                                                    <Grid.Row stretched>
                                                        {this.renderCharityComponent()}
                                                    </Grid.Row>
                                                </Grid>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            }
                            {((groups && !_isEmpty(groups.data)) || groupLoader)
                            && (groupLoader ? (
                                <PlaceholderGrid column={4} row={1} />
                            ) : (
                                <Fragment>
                                    <div className="search-main-head groups">
                                        <Header as="h2">
                                            Giving Groups discovered for you
                                            <Header.Subheader>
                                                Suggestions based on your interests.
                                                {
                                                    (!_isEmpty(groups) && !_isEmpty(groups.meta) && groups.meta.recordCount > 4)
                                                    && <div className="right-align"><Link route={`/search?${searchQueryParam}result_type=Group`}>&nbsp;&nbsp;View all</Link></div>
                                                }
                                            </Header.Subheader>
                                        </Header>
                                        <div className="search-result-all">
                                            <Grid>
                                                <Grid.Row stretched>
                                                    {this.renderGroupComponent()}
                                                </Grid.Row>
                                            </Grid>
                                        </div>
                                    </div>
                                </Fragment>
                            )
                            )}
                        </Fragment>
                    )
                    : (
                        <Fragment>
                            <Header as="h3">
                                <Header.Content>
                                    Discovered for you
                                    <span className="small">Suggestions based on your interests. </span>
                                </Header.Content>
                            </Header>
                            <DiscoveredForYouNoData />
                        </Fragment>
                    )}
            </Fragment>
        );
    }
}


SearchCharitiesGroups.propTypes = {
    charities: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    Loader: PropTypes.bool,
};

SearchCharitiesGroups.defaultProps = {
    charities: [],
    groups: [],
    Loader: null,
};
export default SearchCharitiesGroups;
