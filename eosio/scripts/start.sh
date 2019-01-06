#!/usr/bin/env bash
WALLET_URL=http://keosd:8899
WAIT_HOSTS=keosd:8899 /wait
cleos --wallet-url $WALLET_URL  wallet create --file wallet_password.txt
cleos --wallet-url $WALLET_URL wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
(nodeos -e -p eosio \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::net_api_plugin \
  --contracts-console \
  --verbose-http-errors) &
until curl localhost:8888/v1/chain/get_info
do
  echo "Running curl on localhost:8888/v1/chain/get_info"
  sleep 1s
done
cleos --wallet-url $WALLET_URL set contract eosio contracts/eosio.bios
cleos create key --file wallet_key.txt
PRIVATE_KEY=$(head wallet_key.txt -n 1 | grep -oE '[^ ]+$')
PUBLIC_KEY=$(sed "2q;d" wallet_key.txt | grep -oE '[^ ]+$')
PRODUCER_NAME="mongo"
cleos --wallet-url $WALLET_URL wallet import --private-key $PRIVATE_KEY
cleos --wallet-url $WALLET_URL create account eosio $PRODUCER_NAME $PUBLIC_KEY $PUBLIC_KEY
(nodeos --producer-name $PRODUCER_NAME \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::net_api_plugin \
  --http-server-address 127.0.0.1:8889 \
  --p2p-listen-endpoint localhost:9877 \
  --p2p-peer-address localhost:9876 \
  --signature-provider $PUBLIC_KEY=KEY:$PRIVATE_KEY \
  --config-dir data/$PRODUCER_NAME \
  --data-dir data/$PRODUCER_NAME) &
cleos --wallet-url $WALLET_URL \
  push action eosio setprods "{ \"schedule\": [{\"producer_name\": \"$PRODUCER_NAME\",\"block_signing_key\": \"$PUBLIC_KEY\"}]}" -p eosio@active
PRODUCER_2=derp
cleos --wallet-url $WALLET_URL create account eosio $PRODUCER_2 $PUBLIC_KEY $PUBLIC_KEY
(nodeos -e -p $PRODUCER_2 \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::net_api_plugin \
  --http-server-address 127.0.0.1:8890 \
  --p2p-listen-endpoint localhost:9878 \
  --p2p-peer-address localhost:9877 \
  --config-dir data/$PRODUCER_2 \
  --data-dir data/$PRODUCER_2) &
while :
  do
    sleep 1
done