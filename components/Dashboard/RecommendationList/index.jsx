/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
    Container,
    Header,
    Icon,
    Image,
    Grid,
    Card,
    Popup,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    getRecommendationList,
} from '../../../actions/dashboard';
import placeholderCharity from '../../../static/images/no-data-avatar-charity-profile.png';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import { Link } from '../../../routes';
import PlaceholderGrid from '../../shared/PlaceHolder';
import { renderText } from '../../../helpers/utils';

class RecommendationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendationListLoader: !props.recommendationData,
        };
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        const url = `/recommend/all?userid=${Number(currentUser.id)}&page[number]=1&page[size]=9`;
        getRecommendationList(dispatch, url);
    }

    componentDidUpdate(prevProps) {
        const {
            recommendationData,
        } = this.props;
        let {
            recommendationListLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(recommendationData, prevProps.recommendationData)) {
                recommendationListLoader = false;
            }
            this.setState({
                recommendationListLoader,
            });
        }
    }

    recommendationList() {
        const {
            recommendationData,
        } = this.props;
        let recommendationList = 'No Data';
        if (recommendationData && recommendationData.data && _.size(recommendationData.data) > 0) {
            const showData = _.slice(recommendationData.data, 0, 9);
            recommendationList = showData.map((data, index) => {
                let charityName = '';
                const charityShortName = renderText(data.attributes.name, 3);
                if (data.attributes.city != null) {
                    charityName = `${charityShortName}, ${data.attributes.city}, ${data.attributes.province}`;
                } else {
                    charityName = charityShortName;
                }
                const type = data.attributes.type === 'group' ? 'giving group' : 'charity';
                const typeClass = data.attributes.type === 'group' ? 'chimp-lbl group' : 'chimp-lbl charity';
                const placeholder = data.attributes.type === 'group' ? placeholderGroup : placeholderCharity;
                const urlEntity = data.attributes.type === 'group' ? 'groups' : 'charities';
                return (
                    <Grid.Column key={index}>
                        <Card className="left-img-card" fluid>
                            <Card.Header>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={6}>
                                            <Image src={placeholder} />
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <Grid columns="2">
                                                <Grid.Row style={{ padding: '1.7rem 0rem 0.2rem' }}>
                                                    <Grid.Column>
                                                        <Header as="h4">
                                                            <Header.Content>
                                                                <Header.Subheader className={typeClass}>{type}</Header.Subheader>
                                                            </Header.Content>
                                                        </Header>
                                                    </Grid.Column>
                                                    <Grid.Column textAlign="right">
                                                        <Header as="h4">
                                                            <Header.Content>
                                                                <Header.Subheader>
                                                                    <Popup
                                                                        basic
                                                                        className="filterPopup"
                                                                        on="click"
                                                                        pinned
                                                                        position="bottom right"
                                                                        trigger={<a><span className="more-icon"><Icon name="ellipsis horizontal" /></span></a>}>
                                                                        <div className="filterPanel">
                                                                            <div className="filterPanelContent">
                                                                                <div className="filterPanelItem">
                                                                                    <div className="filter-header font-18 font-bold">
                                                                                        Hide
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Popup>
                                                                </Header.Subheader>
                                                            </Header.Content>
                                                        </Header>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Header as="h4" style={{ margin: '0rem 0rem .5rem' }}>
                                                <Header.Content>
                                                    {charityName}
                                                </Header.Content>
                                            </Header>
                                            <Link className="lnkChange" route={`/${urlEntity}/${data.attributes.slug}`}>
                                                <Button className="btn-small-white-border">View</Button>
                                            </Link>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Card.Header>
                        </Card>
                    </Grid.Column>
                );
            });
        }
        return (
            <div className="pt-2">
                <Grid columns="equal" stackable doubling columns={3}>
                    <Grid.Row>
                        {recommendationList}
                    </Grid.Row>
                </Grid>
            </div>

        );
    }

    render() {
        const {
            recommendationData,
        } = this.props;
        const {
            recommendationListLoader,
        } = this.state;
        let viewAllDiv = null;
        if (recommendationData && recommendationData.count > 7) {
            viewAllDiv = (
                <Link route={`/user/recommendations`}>
                    <a className="viewAll">
                        View all
                        {/* ({recommendationData.count}) */}
                    </a>
                </Link>
            );
        }
        return (
            <div className="pt-2 pb-2">
                <Container>
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={11} tablet={12} computer={12}>
                                <Header as="h3">
                                    <Header.Content>
                                        Discovered for you
                                        <span className="small">Suggestions based on your interests. </span>
                                    </Header.Content>
                                </Header>
                            </Grid.Column>
                            <Grid.Column mobile={5} tablet={4} computer={4}>
                                <div className="text-right">
                                    {viewAllDiv}
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    { recommendationListLoader ? <PlaceholderGrid row={2} column={3} /> : (
                        this.recommendationList()
                    )}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        recommendationData: state.dashboard.recommendationData,
    };
}


export default (connect(mapStateToProps)(RecommendationList));
