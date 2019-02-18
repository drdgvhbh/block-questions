import unittest
import sys
from eosfactory.eosf import *
from eosfactory.core.account import SystemNewaccount
import eosfactory.core.cleos_get as cleos_get
import re
from decimal import Decimal

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
        cls.eosio_token = create_account(
            "eosiotoken", cls.master, "eosio.token")

        eosio_token_contract = Contract(
            cls.eosio_token,
            EOSIO_TOKEN_CONTRACT,
            abi_file="eosio.token.abi",
            wasm_file="eosio.token.wasm")
        eosio_token_contract.deploy()

        cls.eosio_token.push_action(
            "create",
            [cls.master, "125000.0000 OQM"],
            permission=(cls.eosio_token, Permission.ACTIVE)
        )

        bob = create_account('bob', cls.master)
        cls.eosio_token.push_action(
            "issue",
            [
                bob, "1000.0000 OQM", "XD"
            ],
            permission=(cls.master, Permission.ACTIVE))
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
                            "actor": str(cls.host),
                            "permission": "eosio.code"
                        },
                        "weight": 1
                    }
                ]},
            parent_permission_name=Permission.OWNER,
            permission=(bob, Permission.OWNER)
        )

        cls.bob = bob
        cls.contract = contract

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_token_stake_is_transferred(self):
        def table(account: SystemNewaccount):
            return self.eosio_token.table("accounts", account)

        def get_account_balance(table: cleos_get.GetTable) -> Decimal:
            if len(table.json["rows"]) > 0:
                token_balance: str = table.json["rows"][0]["balance"]

                return Decimal("".join(re.findall(r'\d+|\.', token_balance)))

            return Decimal(0.0000)

        prebalance_bob = get_account_balance(table(self.bob))
        prebalance_contract = get_account_balance(table(self.host))
        transfer_amount = Decimal('100.0000')

        self.contract.push_action("post", [str(self.bob), "1234", f'{transfer_amount} OQM'],
                                  permission=(self.bob, Permission.ACTIVE))

        self.assertEqual(
            get_account_balance(table(self.bob)), prebalance_bob - transfer_amount)
        self.assertEqual(
            get_account_balance(table(self.host)), prebalance_contract + transfer_amount)

    @classmethod
    def tearDownClass(cls):
        stop()


if __name__ == "__main__":
    unittest.main()
