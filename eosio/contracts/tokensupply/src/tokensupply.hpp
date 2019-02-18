#include <eosiolib/eosio.hpp>

using namespace eosio;

CONTRACT tokensupply : public contract {
   public:
    using contract::contract;

    ACTION requestokens();
};
