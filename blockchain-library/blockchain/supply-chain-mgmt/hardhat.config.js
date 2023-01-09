/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config({ path: '../../.env' });
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');

const {
    DEFAULT_DEPLOY_NETWORK, ROPSTEN_API_URL, PRIVATE_KEY, KOVAN_API_URL, GOERLI_API_URL,
} = process.env;

module.exports = {
    solidity: '0.8.2',
    defaultNetwork: DEFAULT_DEPLOY_NETWORK || 'localhost',
    networks: {
        hardhat: {},
        ropsten: {
            url: ROPSTEN_API_URL || '',
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
        },
        kovan: {
            url: KOVAN_API_URL || '',
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
        },
        goerli: {
            url: GOERLI_API_URL || '',
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
        },
        // rinkeby: {
        //   url: RINKEBY_API_URL,
        //   accounts: [`0x${PRIVATE_KEY}`]
        // },
        // matic: {
        //   url: MATIC_API_URL,
        //   accounts: [`0x${PRIVATE_KEY}`]
        // },
        // fuji: {
        //   url: FUJI_API_URL,
        //   chainId: 43113,
        //   accounts: [`0x${PRIVATE_KEY}`]
        // },
        // optimism_kovan: {
        //   url: OPTIMISM_KOVAN_API_URL,
        //   chainId: 69,
        //   accounts: [`0x${PRIVATE_KEY}`]
        // }
    },
};
