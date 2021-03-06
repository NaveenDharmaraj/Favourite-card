import React, { Fragment } from 'react';
import {
    Header,
    Grid,
    Button,
    Icon,
} from 'semantic-ui-react';
import _map from 'lodash/map';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import {
    Router,
} from '../../../../../routes';
import {
    isFalsy,
} from '../../../../../helpers/utils';
import placeholderCharity from '../../../../../static/images/no-data-avatar-charity-profile.png';
import placeholderGroup from '../../../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../../../shared/PlaceHolder';
import DiscoveredForYouNoData from '../../../../shared/DiscoveredForYouNoData';


class SearchResultSingleCharityGroups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
        };
        this.renderCharityGroupComponent = this.renderCharityGroupComponent.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this
    handleRoute(type, slug, campaign, i) {
        let route = null;
        route = this.generateRoute(type, slug, campaign);
        this.setState({
            [`loader${i}`]: true,
        });
        Router.pushRoute(route);
    }

    // eslint-disable-next-line class-methods-use-this
    generateRoute(type, slug, campaign) {
        let route = null;
        if (!_isEmpty(type)) {
            if (type.toLowerCase() === 'group' && campaign) {
                route = `/campaigns/${slug}`;
            } else if (type.toLowerCase() === 'group' && isFalsy(campaign)) {
                route = `/groups/${slug}`;
            } else {
                route = `/charities/${slug}`;
            }
        }
        return route;
    }

    // eslint-disable-next-line class-methods-use-this
    handleAnchorClick(e) {
        e.preventDefault();
    }

    // eslint-disable-next-line class-methods-use-this
    renderButton(type, campaign) {
        if (!_isEmpty(type)) {
            if (type.toLowerCase() === 'group' && campaign) {
                return 'View Campaign';
            // eslint-disable-next-line no-else-return
            } else if (type.toLowerCase() === 'group' && isFalsy(campaign)) {
                return 'View Giving Group';
            }
        }
        return 'View charity';
    }

    renderCharityGroupComponent() {
        let charitiesGroupsComponent = [];
        const {
            charityGroups,
        } = this.props;
        if (!_isEmpty(charityGroups) && charityGroups.length > 0) {
            charitiesGroupsComponent = _map(charityGroups, (charityGroup, i) => {
                const {
                    attributes: {
                        avatar,
                        description,
                        is_campaign,
                        name,
                        type,
                        city,
                        province,
                        slug,
                    },
                } = charityGroup;
                let displayAvatar = placeholderCharity;
                if (!_isEmpty(type) && type.toLowerCase() === 'group') {
                    displayAvatar = placeholderGroup;
                }
                displayAvatar = (!_isEmpty(avatar)) ? avatar : displayAvatar;
                const headingClass = (type.toLowerCase() === 'group') ? 'search-result-single groups' : 'search-result-single charities';
                const anchorRoute = this.generateRoute(type, slug, is_campaign);
                return (
                    <div className={headingClass}>
                        <Grid stackable>
                            <Grid.Row stretched key={i}>
                                <Grid.Column mobile={16} tablet={5} computer={5} largeScreen={5}>
                                    {/* <Image src={displayAvatar} className="search-left-img" /> */}
                                    <div className="leftSideImage" style={{ backgroundImage: `url('${displayAvatar}')` }} />
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={6} computer={7} largeScreen={8} verticalAlign="middle">
                                    <div className=" description">
                                        <Header as="h4">
                                            {name}
                                            <Header.Subheader>
                                                {!_isEmpty(description) ? description.split(' ').slice(0, 20).join(' ') : null}
                                                {(!_isEmpty(description) && description.split(' ').length > 20) && '...'}
                                                <br />
                                                {!_isEmpty(city) ? city : null}
                                                {(!_isEmpty(city) && !_isEmpty(province)) && ','}
                                                {!_isEmpty(province) ? ` ${province}` : null}
                                                <br />
                                            </Header.Subheader>
                                        </Header>
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={5} computer={4} largeScreen={3} verticalAlign="middle" textAlign="center">
                                    <div className="btn-wraper">

                                        { this.state[`loader${i}`] ? <Icon name="spinner" loading />
                                            : (
                                                <a href={anchorRoute} onClick={(e) => { this.handleAnchorClick(e); }}>
                                                    <Button
                                                        className="view-btn"
                                                        onClick={() => { this.handleRoute(type, slug, is_campaign, i); }}
                                                    >

                                                        {this.renderButton(type, is_campaign)}
                                                    </Button>
                                                </a>
                                            )
                                        }
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>

                );
            });
            return charitiesGroupsComponent;
        }
        return <DiscoveredForYouNoData />;
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
    charityGroups: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
        }),
    ),
    textSearchCharityGroupLoader: PropTypes.bool,
};

SearchResultSingleCharityGroups.defaultProps = {
    charityGroups: null,
    textSearchCharityGroupLoader: false,
};
export default SearchResultSingleCharityGroups;
