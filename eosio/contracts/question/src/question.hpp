#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>

using namespace eosio;

CONTRACT questionbook : public contract {
   public:
    using contract::contract;

    questionbook(name receiver, name code, datastream<const char*> ds);

    ACTION post(name user, std::string title, asset stake);

   private:
    TABLE question {
        uint64_t key;
        checksum256 id;
        uint64_t stake;

        uint64_t primary_key() const { return key; }

        checksum256 get_id() const { return id; };
    };

    typedef eosio::multi_index<name("question"), question> question_index;

    question_index questions_;
};
