#include "board.hpp"

board::board(name receiver, name code, datastream<const char *> ds)
    : contract(receiver, code, ds), questions_(code, code.value){};

ACTION board::postquestion(name author, const std::string &title,
                           const std::string &content) {
    require_auth(author);

    questions_.emplace(author, [&](auto &question) {
        auto hash_data = author.to_string() + title + content;
        question.primary_key_ = questions_.available_primary_key();
        question.content_hash = sha256(hash_data.c_str(), hash_data.length());
        question.author = author;
    });
}

EOSIO_DISPATCH(board, (postquestion));
