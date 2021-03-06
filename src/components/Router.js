import React from 'react';
import App from './App';
import NotFound from './NotFound';
import TablePicker from './TablePicker';
import Admin from './Admin';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={TablePicker} />
      <Route path="/table/:tableId" component={App} />
      <Route path="/admin/:tableId" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default Router;
