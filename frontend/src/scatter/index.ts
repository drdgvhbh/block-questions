import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { JsonRpc, Api } from 'eosjs';
import { network } from './network';

ScatterJS.plugins(new ScatterEOS());
const rpc = new JsonRpc(network.fullhost());

export async function login(): Promise<ScatterJS.Account> {
  const isConnected = await ScatterJS.connect('One Question Minor', {
    network,
  });

  if (!isConnected) {
    throw new Error('Unable to connect to Scatter');
  }

  if (!(await ScatterJS.login())) {
    throw new Error('Failed to login to Scatter');
  }

  return ScatterJS.account('eos');
}

export async function transact(actions: ScatterJS.Action[]): Promise<void> {
  const eos = ScatterJS.eos(network, Api, { rpc, beta3: true });

  await eos.transact({ actions }, { blocksBehind: 3, expireSeconds: 30 });
}
