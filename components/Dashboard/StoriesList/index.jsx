/* eslint-disable react/prop-types */
import React from 'react';
import {
    Container,
    Header,
    Grid,
    Card,
} from 'semantic-ui-react';
import _ from 'lodash';
import {
    connect,
} from 'react-redux';

import {
    getStoriesList,
} from '../../../actions/dashboard';
import PlaceholderGrid from '../../shared/PlaceHolder';
import { Link } from '../../../routes';
import logger from '../../../helpers/logger'

class StoriesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storiesListLoader: !props.storiesData,
        };
    }

    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        const url =    `/blogs/newBlogs?size=7`;
        getStoriesList(dispatch, url);
    }

    componentDidUpdate(prevProps) {
        const {
            storiesData,
        } = this.props;
        let {
            storiesListLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(storiesData, prevProps.storiesData)) {
                storiesListLoader = false;
            }
            this.setState({
                storiesListLoader,
            });
        }
    }

    storiesList() {
        const {
            storiesData,
        } = this.props;
        let storiesList = 'No Data';
        if (storiesData && storiesData.data && _.size(storiesData.data) > 0) {
            const showData = _.slice(storiesData.data, 0, 7);
            storiesList = showData.map((data, index) => {
                let blogTitle = data.blog_title.replace('&#8217;', "'");
                try {
                    blogTitle = decodeURI(blogTitle);
                } catch (e) {
                    logger.error(`[StoriesList] - decodeURI: ${JSON.stringify(e)}`);
                }

                return (
                    <Grid.Column key={index}>
                        <Card as="a" href={data.blog_URL} target="_blank" className="tips-card" style={{ backgroundImage: `url(${data.blog_image_URL})` }}>
                            <Card.Content>
                                <Card.Header>{blogTitle}</Card.Header>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                );
            });
        }
        return (
            <div className="stories-tips pt-2">
                <Grid columns="equal" stackable doubling columns={7}>
                    <Grid.Row stretched>
                        {storiesList}
                    </Grid.Row>
                </Grid>
            </div>
        );
    }

    render() {
        const {
            storiesData,
        } = this.props;
        const {
            storiesListLoader,
        } = this.state;
        let viewAllDiv = null;
        if (storiesData && storiesData.count > 7) {
            viewAllDiv = (
                <Link route={`/user/stories`}>
                    <a className="viewAll">
                        View all
                        {/* (
                        {storiesData.count}
                        ) */}
                    </a>
                </Link>
            );
        }
        return (
            <div className="pt-2 pb-3">
                <Container>
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={10} tablet={12} computer={12}>
                                <Header as="h3">
                                    <Header.Content>
                                    Stories and tips
                                    </Header.Content>
                                </Header>
                            </Grid.Column>
                            <Grid.Column mobile={6} tablet={4} computer={4}>
                                <div className="text-right">
                                    {viewAllDiv}
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    { storiesListLoader ? <PlaceholderGrid row={1} column={7} /> : (
                        this.storiesList()
                    )}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        storiesData: state.dashboard.storiesData,
    };
}


export default (connect(mapStateToProps)(StoriesList));
