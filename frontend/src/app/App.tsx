import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import Router from './Router';
import { BrowserRouter } from 'react-router-dom';

const styles = (theme: Theme) => createStyles({});

export interface AppProps extends WithStyles<typeof styles> {
  client: ApolloClient<{}>;
}

const App = (props: AppProps) => {
  return (
    <ApolloProvider client={props.client}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default withStyles(styles)(App);
