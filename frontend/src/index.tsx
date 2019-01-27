import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';
import registerServiceWorker from '@/utils/registerServiceWorker';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient();

ReactDOM.render(<App client={client} />, document.getElementById('root'));
registerServiceWorker();
