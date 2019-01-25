import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '@/pages/Home';
import AskQuestion from '@/pages/AskQuestion';

const Router = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/questions/ask" component={AskQuestion} />
  </Switch>
);

export default Router;
