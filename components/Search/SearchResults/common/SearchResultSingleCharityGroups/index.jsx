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
import placeholderCharity from '../../../../../static/images/no-data-avatar-charity-profile.png';
import placeholderGroup from '../../../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../../../shared/PlaceHolder';

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
            charityGroups,
        } = this.props;
        if (!_isEmpty(charityGroups) && charityGroups.length > 0) {
            charitiesGroupsComponent = _map(charityGroups, (charityGroup, i) => {
                const {
                    attributes:{
                        avatar,
                        description,
                        name,
                        type,
                        city,
                        province,
                        slug
                    }
                } = charityGroup;

                let displayAvatar = placeholderCharity;
                if(type === 'group'){
                    displayAvatar = placeholderGroup;
                }
                displayAvatar = (!_.isEmpty(avatar)) ? avatar : displayAvatar;
                return(
                <div className="search-result-single charities">
                    <Grid stackable>
                        <Grid.Row stretched key={i}>
                            <Grid.Column mobile={16} tablet={5} computer={5}>
                                <Image src={displayAvatar} className="search-left-img" />
                                {/* <div className="leftSideImage" style={{backgroundImage:`url(${this.showAvatar(charityGroup.attributes.avatar, charityGroup.attributes.type)})`}}></div> */}
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={7} computer={8} verticalAlign="top">
                                <div className=" description">
                                    <Header as="h4">
                                        {name}
                                        <Header.Subheader>
                                            {!_isEmpty(description) ? description.split(' ').slice(0, 20).join(' ') : null}
                                            {(!_isEmpty(description) && description.split(' ').length > 20) && '...'}
                                            <br />
                                            {(!_isEmpty(city) || !_isEmpty(province)) && 'Location:' }
                                            {!_isEmpty(city) ? city : null}
                                            {!_isEmpty(province) ? province : null}
                                            <br />
                                        </Header.Subheader>
                                    </Header>
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={4} computer={3} verticalAlign="middle" textAlign="center">
                                <div className="btn-wraper">
                                    <Button className="view-btn" onClick={()=>{this.handleRoute(type,slug);}}>
                                        {(type === 'group') ? 'View Group' : 'View charity'}
                                    </Button>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                
            )});
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
