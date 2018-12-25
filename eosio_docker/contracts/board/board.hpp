#pragma once
#include <eosiolib/eosio.hpp>

using namespace eosio;

CONTRACT board : public contract {
   public:
    using contract::contract;

    board(name receiver, name code, datastream<const char *> ds)
        : contract(receiver, code, ds), questions_(code, code.value){};

    ACTION postquestion(name author);

   private:
    TABLE question {
        uint64_t primary_key_;
        name author;

        uint64_t primary_key() const { return primary_key_; };
    };

    typedef multi_index<name("question"), question> question_table;

    question_table questions_;
};
