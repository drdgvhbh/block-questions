import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import Router from './Router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@/redux';

const styles = (theme: Theme) => createStyles({});

const store = configureStore();

export interface AppProps extends WithStyles<typeof styles> {
  client: ApolloClient<{}>;
}

const App = (props: AppProps) => {
  return (
    <Provider store={store}>
      <ApolloProvider client={props.client}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
};

export default withStyles(styles)(App);
