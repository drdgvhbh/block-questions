import unittest
import sys
from math import floor, ceil
from eosfactory.eosf import *
from eosfactory.core.account import SystemNewaccount
import eosfactory.core.cleos_get as cleos_get
import re
from decimal import Decimal
from eosfactory.shell.contract import Contract

CONTRACT_WORKSPACE = sys.path[0] + "/../"

EOSIO_TOKEN_CONTRACT = sys.path[0] + \
    "/../../eosio.contracts/build/eosio.token"


class PostQuestionTest(unittest.TestCase):
    def run(self, result=None):
        super().run(result)

    @classmethod
    def setUpClass(cls):
        reset()

        cls.master = create_master_account("master")

        COMMENT('''
        Build and deploy the contract:
        ''')
        cls.host = create_account("host", cls.master, "host")
        contract = Contract(cls.host, CONTRACT_WORKSPACE)
        contract.build(force=False)
        contract.deploy()

        COMMENT('''
        Create test accounts:
        ''')
        eosio_token = create_account(
            "eosiotoken", cls.master, "eosio.token")

        eosio_token_contract = Contract(
            eosio_token,
            EOSIO_TOKEN_CONTRACT,
            abi_file="eosio.token.abi",
            wasm_file="eosio.token.wasm")
        eosio_token_contract.deploy()

        eosio_token.push_action(
            "create",
            [cls.master, "125000 OQM"],
            permission=(eosio_token, Permission.ACTIVE)
        )

        cls.contract = contract
        cls.eosio_token = eosio_token
        cls.eosio_token_contract = eosio_token_contract

    def setUp(self):
        COMMENT('''
        Setup:
        ''')
        host = self.host

        transfer_amount = Decimal('1001')

        bob = create_account('bob', self.master, force_unique=1)
        self.eosio_token.push_action(
            "issue",
            [
                bob, f'{transfer_amount} OQM', "XD"
            ],
            permission=(self.master, Permission.ACTIVE),
            force_unique=1)
        host.set_account_permission(
            permission_name=Permission.ACTIVE,
            authority={
                "threshold": 1,
                "keys": [
                    {
                        "key": host.active(),
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
            permission=(host, Permission.OWNER),
            force_unique=1
        )
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
                            "actor": str(self.host),
                            "permission": "eosio.code"
                        },
                        "weight": 1
                    }
                ]},
            parent_permission_name=Permission.OWNER,
            permission=(bob, Permission.OWNER),
            force_unique=1
        )

        get_account_balance = self.get_account_balance
        table = self.table

        prebalance_bob = get_account_balance(
            table(self.eosio_token_contract, bob))
        prebalance_contract = get_account_balance(
            table(self.eosio_token_contract, self.host))

        self.contract.push_action("post",
                                  [str(bob), "What is up?",
                                   f'{transfer_amount} OQM'],
                                  permission=(bob, Permission.ACTIVE),
                                  force_unique=1)

        self.bob = bob
        self.prebalance_bob = prebalance_bob
        self.prebalance_contract = prebalance_contract
        self.transfer_amount = transfer_amount

    def tearDown(self):
        host = self.host
        eosio_token = self.eosio_token

        self.eosio_token.push_action(
            "transfer",
            [
                host, eosio_token, f'{self.transfer_amount} OQM', "XD"
            ],
            permission=(self.host, Permission.ACTIVE),
            force_unique=1)

    def test_stake_is_recorded_in_contract_table(self):
        table = self.contract.table("question", self.host)

        self.assertEqual(table.json["rows"][0]
                         ['question_stake'], floor(self.transfer_amount / 2))
        self.assertEqual(table.json["rows"][0]
                         ['answer_stake'], ceil(self.transfer_amount / 4))
        self.assertEqual(table.json["rows"][0]
                         ['contribution_stake'], floor(self.transfer_amount / 4))

    def test_is_not_open_for_voting_by_default(self):
        table = self.contract.table("question", self.host)

        self.assertEqual(table.json["rows"][0]
                         ['is_open_for_voting'], False)

    def test_token_stake_is_transferred(self):
        get_account_balance = self.get_account_balance
        table = self.table
        prebalance_bob = self.prebalance_bob
        transfer_amount = self.transfer_amount
        prebalance_contract = self.prebalance_contract

        self.assertEqual(
            get_account_balance(
                table(self.eosio_token_contract, self.bob)),
            prebalance_bob - transfer_amount)
        self.assertEqual(
            get_account_balance(
                table(self.eosio_token_contract, self.host)),
            prebalance_contract + transfer_amount)

    @classmethod
    def tearDownClass(cls):
        stop()

    def table(self, contract: Contract, account: SystemNewaccount):
        # type: ignore
        return contract.table("accounts", account)

    def get_account_balance(self, table: cleos_get.GetTable) -> Decimal:
        if len(table.json["rows"]) > 0:
            token_balance: str = table.json["rows"][0]["balance"]

            return Decimal("".join(re.findall(r'\d+|\.', token_balance)))

        return Decimal(0)


if __name__ == "__main__":
    unittest.main()
