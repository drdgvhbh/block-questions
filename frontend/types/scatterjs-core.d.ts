import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { Api, ApiInterfaces, JsonRpc } from 'eosjs';

declare module 'scatterjs-core' {
  export interface Account {
    blockchain: 'eos';
    name: string;
    authority: string;
  }

  export interface NetworkParams {
    blockchain: string;
    protocol: string;
    host: string;
    port: number;
    chainId: string;
  }

  export interface EOSOptions {
    expireInSeconds?: number;
    rpc?: JsonRpc;
    beta3?: boolean;
  }

  export interface TransactionOptions {
    authorization: string[];
  }

  export interface EOS {
    transact(
      params: { actions: Action[] },
      params2: {
        broadcast?: boolean;
        sign?: boolean;
        blocksBehind?: number;
        expireSeconds?: number;
      },
    ): Promise<any>;
  }

  export interface Network {
    fullhost(): string;
  }

  export interface Transaction {
    transaction_id: string;
  }

  export interface Action {
    account: string;
    name: string;
    authorization: [
      {
        actor: string;
        permission: string;
      }
    ];
    data: any;
  }

  export function plugins(scatterEOS: ScatterEOS): void;

  export const Network: {
    fromJson(network: NetworkParams): Network;
  };

  export function eos(
    network: Network,
    eos: typeof Api,
    options: EOSOptions,
  ): EOS;

  export function login(): Promise<string>;

  export function account(type: 'eos'): Account;

  export function transact(): any;

  export function connect(
    appName: string,
    network: { network: Network },
  ): Promise<boolean>;
}
