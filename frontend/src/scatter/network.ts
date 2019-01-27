import ScatterJS from 'scatterjs-core';

const blockchain = process.env.REACT_APP_BLOCKCHAIN;
const protocol = process.env.REACT_APP_BLOCKCHAIN_PROTOCOL;
const host = process.env.REACT_APP_BLOCKCHAIN_HOST;
const port = process.env.REACT_APP_BLOCKCHAIN_PORT;
const chainId = process.env.REACT_APP_BLOCKCHAIN_ID;

function missingEnvironmentVariableMessage(variable: string) {
  return `${variable} is not defined in the environment`;
}

if (!blockchain) {
  throw new Error(missingEnvironmentVariableMessage(`REACT_APP_BLOCKCHAIN`));
}
if (!protocol) {
  throw new Error(
    missingEnvironmentVariableMessage(`REACT_APP_BLOCKCHAIN_PROTOCOL`),
  );
}

if (!host) {
  throw new Error(
    missingEnvironmentVariableMessage(`REACT_APP_BLOCKCHAIN_HOST`),
  );
}

if (!port) {
  throw new Error(
    missingEnvironmentVariableMessage(`REACT_APP_BLOCKCHAIN_PORT`),
  );
}

if (!chainId) {
  throw new Error(missingEnvironmentVariableMessage(`REACT_APP_BLOCKCHAIN_ID`));
}

export const network = ScatterJS.Network.fromJson({
  blockchain: process.env.REACT_APP_BLOCKCHAIN!!,
  protocol: process.env.REACT_APP_BLOCKCHAIN_PROTOCOL!!,
  host: process.env.REACT_APP_BLOCKCHAIN_HOST!!,
  port: Number(process.env.REACT_APP_BLOCKCHAIN_PORT),
  chainId: process.env.REACT_APP_BLOCKCHAIN_ID!!,
});
