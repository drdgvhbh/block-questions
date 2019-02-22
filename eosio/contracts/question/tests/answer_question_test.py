import unittest
import sys
from math import floor, ceil
from eosfactory.eosf import *
from eosfactory.core.account import SystemNewaccount
import eosfactory.core.cleos_get as cleos_get
import re
from decimal import Decimal
from eosfactory.shell.contract import Contract
from hashlib import sha256

CONTRACT_WORKSPACE = sys.path[0] + "/../"

EOSIO_TOKEN_CONTRACT = sys.path[0] + \
    "/../../eosio.contracts/build/eosio.token"


class AnswerQuestionTest(unittest.TestCase):
    def run(self, result=None):
        super().run(result)

    @classmethod
    def setUpClass(cls):
        reset()

        master = create_master_account("master")

        COMMENT('''
        Build and deploy the contract:
        ''')
        host = create_account("host", master, "host")
        contract = Contract(host, CONTRACT_WORKSPACE)
        contract.build(force=False)
        contract.deploy()

        COMMENT('''
        Create test accounts:
        ''')
        eosio_token = create_account(
            "eosiotoken", master, "eosio.token")

        eosio_token_contract = Contract(
            eosio_token,
            EOSIO_TOKEN_CONTRACT,
            abi_file="eosio.token.abi",
            wasm_file="eosio.token.wasm")
        eosio_token_contract.deploy()

        eosio_token.push_action(
            "create",
            [master, "125000 OQM"],
            permission=(eosio_token, Permission.ACTIVE)
        )

        transfer_amount = Decimal('1001')

        bob = create_account('bob', master, force_unique=1)
        eosio_token.push_action(
            "issue",
            [
                bob, f'{transfer_amount} OQM', "XD"
            ],
            permission=(master, Permission.ACTIVE),
            force_unique=1)
        bob.set_account_permission(
            permission_name=Permission.ACTIVE,
            authority={
                "threshold": 1,
                "keys": [
                    {
                        "key": bob.active(),
                        "weight": 1
                    }
                ],
                "accounts": [
                    {
                        "permission": {
                            "actor": str(host),
                            "permission": "eosio.code"
                        },
                        "weight": 1
                    }
                ]},
            parent_permission_name=Permission.OWNER,
            permission=(bob, Permission.OWNER),
            force_unique=1
        )

        question = "What is up?"
        answer = "Down"

        contract.push_action("post",
                             [str(bob), question,
                              f'{transfer_amount} OQM'],
                             permission=(bob, Permission.ACTIVE),
                             force_unique=1)

        alice = create_account('alice', master, force_unique=1)

        cls.contract = contract
        cls.eosio_token = eosio_token
        cls.eosio_token_contract = eosio_token_contract
        cls.master = master
        cls.host = host
        cls.bob = bob
        cls.alice = alice
        cls.question = question
        cls.answer = answer

    def setUp(self):
        COMMENT('''
        Setup:
        ''')
        pass

    def tearDown(self):
        pass

    def test_should_throw_if_trying_to_answer_nonexistent_question(self):
        contract = self.contract
        alice = self.alice

        with self.assertRaisesRegex(EOSIOAssertionError, "the question (.*) cannot be found"):
            contract.push_action("postanswer",
                                 [str(alice), "Where is the question?", "derping"],
                                 permission=(alice, Permission.ACTIVE),
                                 force_unique=1)

    def test_should_start_with_zero_votes(self):
        self.push_generic_answer()

        table = self.contract.table("answer", self.host)
        self.assertEqual(table.json["rows"][0]['votes'], 0)

    def test_should_store_answerer_in_table(self):
        alice = self.alice
        self.push_generic_answer()

        table = self.contract.table("answer", self.host)
        self.assertEqual(table.json["rows"][0]['answerer'], str(alice))

    def test_should_properly_compute_id_hash(self):
        question = self.question
        answer = self.answer
        self.push_generic_answer()

        hash_input = question + answer
        id = sha256()
        id.update(bytes(hash_input, encoding='utf-8'))

        table = self.contract.table("answer", self.host)
        self.assertEqual(table.json["rows"][0]['id'], id.hexdigest())

    def push_generic_answer(self):
        contract = self.contract
        alice = self.alice
        question = self.question
        answer = self.answer

        contract.push_action("postanswer",
                             [str(alice), question, answer],
                             permission=(alice, Permission.ACTIVE),
                             force_unique=1)

    @classmethod
    def tearDownClass(cls):
        stop()


if __name__ == "__main__":
    unittest.main()
