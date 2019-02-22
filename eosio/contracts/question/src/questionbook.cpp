#include "questionbook.hpp"
#include <cmath>
#include <eosiolib/print.hpp>
#include <eosiolib/transaction.hpp>

#define DEBUG
#include "logger.hpp"

const int SECONDS_IN_AN_MINUTE = 60;
const int MINUTES_IN_AN_HOUR = 60;
const int HOURS_IN_A_DAY = 24;

questionbook::questionbook(name receiver, name code, datastream<const char*> ds)
    : contract(receiver, code, ds),
      questions_(code, code.value),
      answers_(code, code.value),
      stakes_(code, code.value){};

ACTION questionbook::post(name user, std::string title, asset stake) {
    auto initial_log_message =
        "Posting question from user: " + user.to_string() +
        " with question: " + title + " with stake: " + stake.to_string();
    logger_info(initial_log_message);
    require_auth(user);
    logger_info("Authorized as " + user.to_string());

    action(permission_level{user, name("active")}, name("eosio.token"),
           name("transfer"),
           std::make_tuple(user, get_self(), stake, std::string("")))
        .send();

    logger_info("Question " + title + " posted!");

    auto question_key = questions_.available_primary_key();
    questions_.emplace(user, [&](questionbook::question& question) {
        question.key = question_key;
        question.id = compute_hash(title);
        question.author = user;
        question.question_stake = int64_t(floor(stake.amount / 2.0));
        question.answer_stake = int64_t(ceil(stake.amount / 4.0));
        question.contribution_stake = int64_t(floor(stake.amount / 4.0));
        question.total_contribution_stake = question.contribution_stake;
        question.is_open_for_voting = false;
    });

    auto push_open_voting_action = [this, question_key]() {
        eosio::transaction trx{};
        trx.actions.emplace_back(permission_level(get_self(), name("active")),
                                 get_self(), name("openvoting"),
                                 std::make_tuple(question_key));
        trx.delay_sec =
            SECONDS_IN_AN_MINUTE * MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY;

        trx.send(question_key, get_self(), true);
    };

    push_open_voting_action();
}

ACTION questionbook::postanswer(name user, std::string question,
                                std::string answer_text) {
    require_auth(user);

    auto question_id = compute_hash(question);
    auto question_id_index = questions_.get_index<name("id")>();
    auto db_question_itr = question_id_index.find(question_id);

    eosio_assert(
        db_question_itr != question_id_index.end(),
        std::string("the question " + question + " cannot be found").c_str());

    answers_.emplace(user, [&](questionbook::answer& answer) {
        answer.key = answers_.available_primary_key();
        answer.answerer = user;
        answer.question_key = db_question_itr->key;
        answer.id = compute_hash(std::string(question + answer_text));
        answer.votes = 0;
    });
}

ACTION questionbook::openvoting(uint64_t question_key) {
    require_auth(get_self());

    auto question_itr = questions_.find(question_key);
    if (question_itr != questions_.end()) {
        questions_.modify(question_itr, get_self(),
                          [&](questionbook::question& question) {
                              question.is_open_for_voting = true;
                          });

        eosio::transaction trx{};
        trx.actions.emplace_back(permission_level(get_self(), name("active")),
                                 get_self(), name("paystkhlders"),
                                 std::make_tuple(question_key));
        trx.delay_sec =
            SECONDS_IN_AN_MINUTE * MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY * 30;

        trx.send(question_key, get_self(), true);
    }
}

ACTION questionbook::paystkhlders(uint64_t question_key) {
    require_auth(get_self());

    auto question_itr = questions_.find(question_key);
    if (question_itr != questions_.end()) {
        auto question = *question_itr;

        auto answer_index = answers_.get_index<name("questkey")>();
        auto answer_itr = answer_index.find(question_key);
        while (answer_itr != answer_index.end()) {
            answer current_answer = *answer_itr;

            auto stake_index = stakes_.get_index<name("answerkey")>();
            auto stake_itr = stake_index.find(current_answer.key);
            while (stake_itr != stake_index.end()) {
                stake_itr++;
            }
            // derp.
            // derp.
            // answer.

            answer_itr++;
        }

        question_itr++;
    }
}

checksum256 questionbook::compute_hash(std::string data) {
    return sha256(data.c_str(), data.length());
}

EOSIO_DISPATCH(questionbook, (post)(postanswer)(openvoting)(paystkhlders));