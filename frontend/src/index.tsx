import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';
import registerServiceWorker from '@/utils/registerServiceWorker';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient();

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { JsonRpc, Api } from 'eosjs';

/* ScatterJS.plugins(new ScatterEOS());

const network = ScatterJS.Network.fromJson({
  blockchain: process.env.REACT_APP_BLOCKCHAIN || 'eos',
  protocol: process.env.REACT_APP_BLOCKCHAIN_PROTOCOL || 'https',
  host: process.env.REACT_APP_BLOCKCHAIN_HOST || 'nodes.get-scatter.com',
  port: Number(process.env.REACT_APP_BLOCKCHAIN_PORT) || 443,
  chainId:
    process.env.REACT_APP_BLOCKCHAIN_ID ||
    'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
});

const rpc = new JsonRpc(network.fullhost());

ScatterJS.connect('YourAppName', { network }).then((connected) => {
  if (!connected) return console.error('no scatter');

  const eos = ScatterJS.eos(network, Api, { rpc, beta3: true });

  ScatterJS.login().then((id) => {
    if (!id) return console.error('no identity');
    const account = ScatterJS.account('eos');

    eos
      .transact(
        {
          actions: [
            {
              account: 'board',
              name: 'postquestion',
              authorization: [
                {
                  actor: account.name,
                  permission: account.authority,
                },
              ],
              data: {
                author: account.name,
                title: 'FUCK',
                content: 'yolo',
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      )
      .then((res) => {
        console.log('????');
        console.log('sent: ', res);
      })
      .catch((err) => {
        console.error('error: ', err);
      });
  });
}); */

ReactDOM.render(<App client={client} />, document.getElementById('root'));
registerServiceWorker();
