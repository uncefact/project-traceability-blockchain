require('dotenv').config();
const { ethers, upgrades } = require('hardhat');
const { Client, GatewayIntentBits } = require('discord.js');
const moment = require('moment');

// ------------------------------------------
// Define contracts to be compiled
// ------------------------------------------
// const contracts = [
//   { name: "Greeter", args: ["Hello, Hardhat!"]}, // with params
//   { name: "Foo", args: []}, // no params
//   {name: "GreeterV2", address: "0x1234567"} // contract to be upgraded
// ];

const HARDHAT_CHAIN_ID = 31337;

const contracts = [
    // { name: "UneceCottonTracking", args: [], address: "0x77d699d8Aec01bF44F450ae6171c9CcfF232165b" },
    { name: 'UneceCottonTracking', args: [] },
];

const {
    BOT_TOKEN, CHANNEL_ID,
} = process.env;

// const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// const sendMessageOnDiscordChannel = (message) => {
//     try {
//         const channel = client.channels.cache.get(CHANNEL_ID);
//         channel.send(message);
//     } catch (e) {
//         console.error(e);
//     }
// };

// When the client is ready, run this code (only once)
// client.once('ready', () => {
//   sendMessageOnDiscordChannel(`${moment().format('DD.MM.YYYY')}`);
// });

// Login to Discord with your client's token
// client.login(BOT_TOKEN);

async function deploy(contractName, contractArgs) {
    console.log(`Deploying '${contractName}'`);

    const Contract = await ethers.getContractFactory(contractName);
    const contract = await upgrades.deployProxy(Contract, contractArgs);
    await contract.deployed();

    console.log(`${contractName} deployed to: ${contract.address}`);
    const network = await ethers.provider.getNetwork();
    // if (network.chainId !== HARDHAT_CHAIN_ID) { sendMessageOnDiscordChannel(`✅ ${contractName} deployed on ${network.name} (${moment().format('DD.MM.YYYY')}): ${contract.address}`); }

    return contract;
}

async function upgrade(contractName, address) {
    console.log(`Upgrading '${contractName}' (address: ${address})`);

    const Contract = await ethers.getContractFactory(contractName);
    const contract = await upgrades.upgradeProxy(address, Contract);

    console.log(`${contractName} upgraded`);
    const network = await ethers.provider.getNetwork();
    if (network.chainId !== HARDHAT_CHAIN_ID) { sendMessageOnDiscordChannel(`⬆️ ${contractName} upgraded on ${network.name} (${moment().format('DD.MM.YYYY')})`); }

    return contract;
}

async function main() {
    try {
        const contactsAddresses = {
            date: new Date().toISOString(),
            addresses: {},
        };

        console.log('Processing contracts...');
        const promises = contracts.map(async (c) => {
            const contract = c.address
                ? await upgrade(c.name, c.address)
                : await deploy(c.name, c.args);
            contactsAddresses.addresses[c.name] = contract.address;
        });

        await Promise.all(promises);
        console.log('Contracts successfully deployed!');
    } catch (err) {
        console.error(`Failed to deploy smart contract ${err}`);
    }
}

// We recommend this pattern to be able to use async / await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
