#pragma once
#include <eosiolib/eosio.hpp>

using namespace eosio;

CONTRACT board : public contract {
   public:
    using contract::contract;

    board(name receiver, name code, datastream<const char *> ds);

    ACTION postquestion(name author, const std::string &title,
                        const std::string &content);

    ACTION postquestqed(name author, const std::string &title,
                        const std::string &content);

   private:
    TABLE question {
        uint64_t primary_key_;
        checksum256 content_hash;
        name author;

        uint64_t primary_key() const { return primary_key_; };

        checksum256 get_content_hash() const { return content_hash; };
    };

    typedef multi_index<name("question"), question,
                        indexed_by<name("contenthash"),
                                   const_mem_fun<question, checksum256,
                                                 &question::get_content_hash>>>
        question_table;

    question_table questions_;
};
