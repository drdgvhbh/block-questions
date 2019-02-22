#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>

using namespace eosio;

CONTRACT questionbook : public contract {
   public:
    using contract::contract;

    questionbook(name receiver, name code, datastream<const char*> ds);

    ACTION post(name user, std::string title, asset stake);
    ACTION postanswer(name user, std::string question, std::string answer);
    ACTION openvoting(uint64_t question_key);
    ACTION paystkhlders(uint64_t question_key);

   private:
    checksum256 compute_hash(std::string data);

    TABLE question {
        uint64_t key;
        name author;
        checksum256 id;
        uint64_t question_stake;
        uint64_t answer_stake;
        uint64_t contribution_stake;
        uint64_t total_contribution_stake;
        bool is_open_for_voting;

        uint64_t primary_key() const { return key; }

        checksum256 get_id() const { return id; };
    };

    TABLE answer {
        uint64_t key;
        name answerer;
        uint64_t question_key;
        checksum256 id;
        uint16_t votes;

        uint64_t primary_key() const { return key; }

        uint64_t get_question_key() const { return question_key; }
    };

    TABLE stake {
        uint64_t key;
        uint64_t answer_key;

        uint64_t primary_key() const { return key; }

        uint64_t get_answer_key() const { return answer_key; }
    };

    typedef eosio::multi_index<
        name("question"), question,
        indexed_by<name("id"),
                   const_mem_fun<question, checksum256, &question::get_id>>>
        question_index;
    typedef eosio::multi_index<
        name("answer"), answer,
        indexed_by<name("questkey"),
                   const_mem_fun<answer, uint64_t, &answer::get_question_key>>>
        answer_index;
    typedef eosio::multi_index<
        name("stake"), stake,
        indexed_by<name("answerkey"),
                   const_mem_fun<stake, uint64_t, &stake::get_answer_key>>>
        stake_index;



    question_index questions_;
    answer_index answers_;
    stake_index stakes_;
};
