import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import  App from '../../ui/App.jsx';
import  Chart from '../../ui/Chart.jsx';

Meteor.startup( () => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App } />
        <Route path="/chart/:id" component={Chart}/>
    </Router>,
    document.getElementById('react-root')
  );
});
