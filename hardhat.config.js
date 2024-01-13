require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_TESNET_URL,
      accounts: [process.env.ADMIN_ACCOUNT_PRIVATE_KEY /*, process.env.OTHER_ACCOUNT_PRIVATE_KEY*/ ],
      timeout: 0,
      gas: "auto",
      gasPrice: "auto",
    },
  }
};