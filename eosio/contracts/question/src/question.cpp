#include "question.hpp"
#include <eosiolib/print.hpp>
#include <eosiolib/transaction.hpp>

#define DEBUG
#include "logger.hpp"

questionbook::questionbook(name receiver, name code, datastream<const char*> ds)
    : contract(receiver, code, ds), questions_(code, code.value){};

ACTION questionbook::post(name user, std::string title, asset stake) {
    auto initial_log_message =
        "Posting question from user: " + user.to_string() +
        " with question: " + title + " with stake: " + stake.to_string();
    logger_info(initial_log_message);
    require_auth(user);
    logger_info("Authorized as " + user.to_string());

    action(permission_level{user, name("active")}, name("eosio.token"),
           name("transfer"),
           std::make_tuple(user, _self, stake, std::string("")))
        .send();

    logger_info("Question " + title + " posted!");

    questions_.emplace(user, [&](auto& question) {
        auto id = sha256(title.c_str(), title.length());

        question.key = questions_.available_primary_key();
        question.id = id;
        question.stake = stake.amount;
    });
}

EOSIO_DISPATCH(questionbook, (post));