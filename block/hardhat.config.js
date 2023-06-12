require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
//const POLYGONSCAN_KEY = process.env.POLYGONSCAN_KEY;
const MUMBAI_URL = process.env.MUMBAI_URL;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: MUMBAI_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};
