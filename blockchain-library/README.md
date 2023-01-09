# Library

## Build
The library currently depends on smart contract-related types from the `Unece` project, which are created dynamically from the specific ABIs.\
To build the library, it is therefore necessary:
1. Run `npm install`, to install the library dependencies.
2. Compile and generate (typechain) types fot `Supply chain Management` (`Unece`)  smart contracts running `npm run compile-smart-contracts-supply-chain-mgmt`.
3. At this point the ABIs and types of the individual projects should have been created in the `/blockchain-lib/packages/supply-chain-mgmt/smart-contracts` folder. 
4. Run `npm run build-supply-chain-mgmt`, to finally build the library.

It is possible to study the use of the library by means of the files in `/blockchain-lib/packages/supply-chain-mgmt/__dev__`

## Tests
You can run tests for single packages using:
- `npm run test-supply-chain-mgmt`

## Deploy Smart Contracts
First you need to create/edit the `/blockchain-lib.env`, file with the missing information specified in `/blockchain-lib.env,template`.\
You can now deploy new instances of smart contracts using:
- `npm run deploy-contracts-supply-chain-mgmt`

