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

class StoriesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storiesListLoader: !props.storiesData,
        };
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        getStoriesList(dispatch, currentUser.id);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            storiesData
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
            storiesList = storiesData.data.map((data, index) => {
                return (
                    <Grid.Column>
                        <Card as="a" href={data.blog_URL} target="_blank" className="tips-card" style={{ backgroundImage: `url(${data.blog_image_URL})` }}>
                            <Card.Content>
                                <Card.Header>{data.blog_title}</Card.Header>
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
                <div className="text-right">
                    <a>
                        View all
                        (
                        {storiesData.count}
                        )
                    </a>
                </div>
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
                                        <span className="small">Copy here. </span>
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
