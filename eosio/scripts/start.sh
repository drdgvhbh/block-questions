#!/usr/bin/env bash

DIR_TO_CHECK="data"
WALLET_PASSWORD_FILE="data/wallet_password.txt"
cleos --wallet-url $WALLET_URL wallet create --file $WALLET_PASSWORD_FILE
cleos --wallet-url $WALLET_URL wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
(nodeos -e -p eosio \
--http-server-address 0.0.0.0:8888 \
--plugin eosio::chain_api_plugin \
--plugin eosio::net_api_plugin \
--plugin eosio::http_plugin \
--access-control-allow-origin=* \
--http-validate-host=false
--contracts-console \
--verbose-http-errors \
--config-dir data/eosio \
--data-dir data/eosio) &

until curl localhost:8888/v1/chain/get_info
do
  echo "Running curl on localhost:8888/v1/chain/get_info"
  sleep 1s
done
WALLET_KEY_FILE="data/wallet_key.txt"
PUBLIC_KEY_FILE="data/public_key.txt"
PRIVATE_KEY_FILE="data/private_key.txt"
PRODUCER_NAME="producer"
cleos --wallet-url $WALLET_URL set contract eosio contracts/eosio.bios
cleos create key --file $WALLET_KEY_FILE
PRIVATE_KEY=$(head $WALLET_KEY_FILE -n 1 | grep -oE '[^ ]+$')
PUBLIC_KEY=$(sed "2q;d" $WALLET_KEY_FILE | grep -oE '[^ ]+$')
echo $PUBLIC_KEY > $PUBLIC_KEY_FILE
echo $PRIVATE_KEY > $PRIVATE_KEY_FILE
cleos --wallet-url $WALLET_URL wallet import --private-key $PRIVATE_KEY
cleos --wallet-url $WALLET_URL create account eosio $PRODUCER_NAME $PUBLIC_KEY $PUBLIC_KEY
(nodeos --producer-name $PRODUCER_NAME \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::chain_plugin \
  --plugin eosio::http_plugin \
  --plugin eosio::net_api_plugin \
  --plugin eosio::net_plugin \
  --http-server-address 0.0.0.0:8889 \
  --http-validate-host=false \
  --p2p-listen-endpoint localhost:9877 \
  --access-control-allow-origin=* \
  --p2p-peer-address localhost:9876 \
  --signature-provider $PUBLIC_KEY=KEY:$PRIVATE_KEY \
  --config-dir data/$PRODUCER_NAME \
  --data-dir data/$PRODUCER_NAME) &

cleos --wallet-url $WALLET_URL \
  push action eosio setprods "{ \"schedule\": [{\"producer_name\": \"$PRODUCER_NAME\",\"block_signing_key\": \"$PUBLIC_KEY\"}]}" -p eosio@active
MONGO_PRODUCER_NAME=mongo
cleos --wallet-url $WALLET_URL create account eosio $MONGO_PRODUCER_NAME $PUBLIC_KEY $PUBLIC_KEY
until curl mongo:27017
do
  sleep 1s
done
(nodeos \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::net_api_plugin \
  --plugin eosio::mongo_db_plugin \
  --read-mode "read-only" \
  --http-server-address 127.0.0.1:8890 \
  --p2p-listen-endpoint localhost:9878 \
  --p2p-peer-address localhost:9877 \
  --config-dir data/$MONGO_PRODUCER_NAME \
  --data-dir data/$MONGO_PRODUCER_NAME \
  --mongodb-uri mongodb://mongo:27017/EOS \
  --mongodb-update-via-block-num true) &
/scripts/deploy_contracts.sh /user_contracts/build/ $(cat /data/public_key.txt) $(cat /data/wallet_password.txt)
while :
  do
    sleep 1
done