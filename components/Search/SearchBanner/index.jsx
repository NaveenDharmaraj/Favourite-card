import React from 'react';
import {
    Grid,
    Input,
    Icon
} from 'semantic-ui-react';

import {
    Router, Link,
} from '../../../routes';

class SearchBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchWord: props.searchWordProps ? props.searchWordProps : '',
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleKeyEnter = this.handleKeyEnter.bind(this);
    }

    handleOnChange(event) {
        const {
            target: {
                value,
            },
        } = event;
        this.setState({
            searchWord: value,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    handleKeyEnter(route) {
        Router.pushRoute(route);
    }

    render() {
        const {
            searchWord,
        } = this.state;
        const {
            searchType,
        } = this.props;
        const route = `/search?search=${searchWord}&result_type=${searchType}`;
        return (
            <div className="search-banner">
                <div className="searchbox">
                    <Grid centered>
                        <Grid.Row>
                            <Grid.Column mobile={12} tablet={8} computer={6}>
                                <Input
                                    fluid
                                    placeholder="Search Charitable Impact"
                                    onChange={this.handleOnChange}
                                    value={searchWord}
                                    onKeyPress={(event) => { (event.keyCode || event.which) === 13 ? this.handleKeyEnter(route) : null; }}
                                />
                                <div className="search-btn">
                                    <Link route={route}>
                                        <Icon name="search" />
                                    </Link>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        );
    }
}


export default SearchBanner;
