cmake_minimum_required(VERSION 3.5)
project(contracts VERSION 1.0.0)

find_package(eosio.cdt)

### Generate the wasm and abi
add_contract(board board board/board.cpp)

### add the path to where the ricardian contracts/clauses are found
target_compile_options(board.wasm PUBLIC -R${CMAKE_CURRENT_SOURCE_DIR}/board)

add_subdirectory(tokensupply)