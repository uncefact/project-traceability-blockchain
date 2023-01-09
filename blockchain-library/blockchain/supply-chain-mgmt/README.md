# Prerequisites
To compile and deploy the smart contracts you need to complete the `.env` configuration file according to the `.env.template` example.

The ABI will be saved in the folder `OUTPUT_DIR` (defined in the `.env` file) in an `artifacts` sub-directory.
On deploy the addresses will be saved in a file called as defined in `DEPLOYED_CONTRACTS_ADDRESSES_FILE_NAME` also in the `OUTPUT_DIR` folder.

This file will be in the following structure:

```json
{
    "date": "2022-03-23T13:37:25.465Z",
    "addresses": {
        "Greeter": "0x123456"
    }
}
```

# Compile
To compile the contracts, place the Solidity file (.sol) in the `contracts` folder, then execute (from the root directory) 
```
npm run compile
```` 
(or `npx hardhat compile`).

# Deploy / upgrade contract
To deploy/upgrade contracts, make sure that they are defined in the `scripts/deploy.js` file, in the array called `contracts`, e.g.:
```js
const contracts = [
  { name: "Greeter", args: ["Hello, Hardhat!"]}, // with params
  { name: "Foo", args: []}, // no params
  {name: "GreeterV2", address: "0x1234567"} // contract to be upgraded
];
```

If an address is specified, that contract will be upgraded instead of being deployed. Otherwise, a new instance will be deployed.

`NOTE`: Contracts **cannot** have a constructor, use an "`initialize`" method instead ([documentation](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable))

Then execute:
```
npm run deploy
```
(or `npx hardhat run scripts/deploy.js`).

To deploy it to a network different from Ropsten:
- add network configuration in `hardhat.config.js`
- add the `--network <name>` to the aforementioned npx command (use npx in this case)

