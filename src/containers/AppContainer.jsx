import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    store  : PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { routes, store } = this.props;

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory}>{routes}</Router>
        </div>
      </Provider>
    );
  }
}

export default AppContainer;
