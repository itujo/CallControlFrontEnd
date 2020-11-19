import React from 'react';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Main from './pages/Call/index/index';
import Call from './pages/Call/showCall';
import Insert from './pages/Call/insertCall';
import NotFoundPage from './pages/NotFoundPage';
import EditCall from './pages/Call/editCall';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Main} />
      <Route path='/call/:id' component={Call} />
      <Route path='/insert' component={Insert} />
      <Route path='/edit/:id' component={EditCall} />
      <Route path='/404' component={NotFoundPage} />
      <Redirect to='/404' />
    </Switch>
  </BrowserRouter>
);

export default Routes;
