#!/usr/bin/env bash
COMPILED_CONTRACTS_DIR=$1
PUBLIC_KEY=$2
WALLET_PASSWORD=$3

for contract in $COMPILED_CONTRACTS_DIR*.wasm; do
  [ -f "$contract" ] || break
  contract_name=${contract%.wasm}
  contract_name=`basename $contract_name`
  echo $WALLET_PASSWORD
  cleos --wallet-url $WALLET_URL wallet unlock --password $WALLET_PASSWORD
  cleos --wallet-url $WALLET_URL create account eosio $contract_name $PUBLIC_KEY
  cleos --wallet-url $WALLET_URL set account permission $contract_name active --add-code
  ls $COMPILED_CONTRACTS_DIR$contract_name.wasm
  cleos --wallet-url $WALLET_URL set contract $contract_name "$COMPILED_CONTRACTS_DIR" $contract_name.wasm $contract_name.abi --permission $contract_name@active
done