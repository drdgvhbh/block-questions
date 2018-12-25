#include "board.hpp"

ACTION board::postquestion(name author) {
    require_auth(author);

    questions_.emplace(author, [&](auto &question) {
        question.primary_key_ = questions_.available_primary_key();
        question.author = author;
    });
}

EOSIO_DISPATCH(board, (postquestion));
