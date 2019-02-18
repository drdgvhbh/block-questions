#include "tokensupply.hpp"
#include <eosiolib/print.hpp>
#include <eosiolib/transaction.hpp>

#define DEBUG
#include "logger.hpp"

ACTION tokensupply::requestokens() {
    logger_info("START");
    require_auth(name("eosio.token"));
    logger_info("AUTHORIZED AS eosio.token");

    auto from = name("eosio");
    logger_info(from);
    auto to = name("eosio.token");
    transaction txn{};
    txn.actions.emplace_back(permission_level(from, name("active")), from, to,
                             std::make_tuple(from, to, 500));

    txn.send(from.value, from);
}

EOSIO_DISPATCH(tokensupply, (requestokens))