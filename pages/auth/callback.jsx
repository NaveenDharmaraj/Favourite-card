import React, { Component } from 'react';
import { connect } from 'react-redux';

import auth0 from '../../services/auth';

class Callback extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        auth0.lock; // eslint-disable-line no-unused-expressions
        auth0.storeDispatch = dispatch;
    }

    // eslint-disable-next-line class-methods-use-this
    renderComponentAuth() {
        const {
            auth,
        } = this.props;
        if (auth === 'undefined' || auth === false) {
            return (<div>Loading...</div>);
        }
        return null;
    }

    render() {
        return (
            <div>
         Loading
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(Callback);
