import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import  App from '../../ui/App.jsx';
import  ChartContainer from '../../ui/ChartContainer.jsx';

Meteor.startup( () => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App } />
        <Route path="/charts/:id" component={ChartContainer}/>
    </Router>,
    document.getElementById('react-root')
  );
});
