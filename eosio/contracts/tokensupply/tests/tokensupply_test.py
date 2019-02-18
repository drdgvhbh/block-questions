import unittest
import sys
from eosfactory.eosf import *
from eosfactory.eosf import Permission

CONTRACT_WORKSPACE = sys.path[0] + "/../"

EOSIO_TOKEN_CONTRACT = sys.path[0] + \
    "/../../eosio.contracts/eosio.token"


class Test(unittest.TestCase):

    def run(self, result=None):
        super().run(result)

    @classmethod
    def setUpClass(self):
        SCENARIO('''
        Execute simple actions.
        ''')
        reset()

        self.master = create_master_account("master")

        COMMENT('''
        Build and deploy the contract:
        ''')
        self.host = create_account("host", self.master)
        contract = Contract(self.host, CONTRACT_WORKSPACE)
        contract.build(force=False)
        contract.deploy()

        COMMENT('''
        Create test accounts:
        ''')
        self.eosio_token = create_account(
            "eosiotoken", self.master, "eosio.token")

        eosio_token_contract = Contract(
            self.eosio_token,
            EOSIO_TOKEN_CONTRACT,
            abi_file="build/eosio.token.abi",
            wasm_file="build/eosio.token.wasm")
        eosio_token_contract.deploy()

        self.eosio_token.push_action(
            "create",
            ["eosio", "125000 OQM"],
            permission=(self.eosio_token, Permission.ACTIVE)
        )

        derp = create_account("derp", self.master)


        self.derp = derp

    def setUp(self):
        pass

    def test_external_users_should_not_be_able_to_request_tokens(self):
        with self.assertRaises(MissingRequiredAuthorityError):
            self.host.push_action(
                "requestokens", '[]', permission=(self.derp, Permission.ACTIVE))

    def test_eosio_token_should_be_able_to_request_tokens(self):
        self.host.push_action(
            "requestokens", '[]', permission=(self.eosio_token, Permission.ACTIVE))

    def tearDown(self):
        pass

    @classmethod
    def tearDownClass(self):
        stop()


if __name__ == "__main__":
    unittest.main()
