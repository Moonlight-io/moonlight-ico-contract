const sdk = require("@moonlight-io/asteroid-sdk-js");
const Networks = require("../../config/networks");
const neon = require("@cityofzion/neon-js")
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const fs = require("fs")

if (!process.env.ENVIRONMENT) {
  process.env.ENVIRONMENT = "dev"
}

require('dotenv').config({ path: "config/" + process.env.ENVIRONMENT + ".env" });

const newContractAVM = fs.readFileSync(process.env.CONTRACT_AVM_PATH, "hex");


/**
 * keys.env should define the following
 * CONTRACT_ADMIN_WIF=xxxxx
 * WHITELIST_ADDRESS_WIF=xxxxx
 */

const _config = {
  totalSupply: 750000000,
  targetGroup: 1,
  targetUnlockBlock: 1350,
  tokenName: "Moonlight Lux",
  tokenSymbol: "LX",
  tokenDecimals: "8",
  mintAmountOfNEO: 100,
  mintTokenPerNEO: 2000,
  mintExpectedBalance: 0,
  tokenTransferAmount: 5000,
  tokenTransferAmountWithDecimals: 0,
};

_config.tokenTransferAmountWithDecimals = _config.tokenTransferAmount * parseInt(1 + '0'.repeat(_config.tokenDecimals));
_config.mintExpectedBalance = _config.mintAmountOfNEO * _config.mintTokenPerNEO;

/**
 * runs before any other tests are run
 *
 * test the smart contract we want to test has been initialised
 */
before(async function () {
  this.timeout(20000);

  this.config = {
    totalSupply: 750000000,
    targetGroup: 1,
    targetUnlockBlock: 1350,
    tokenName: "Moonlight Lux",
    tokenSymbol: "LX",
    tokenDecimals: "8",
    mintAmountOfNEO: 100,
    mintTokenPerNEO: 2000,
    mintExpectedBalance: 0,
    tokenTransferAmount: 100,
    tokenTransferAmountWithDecimals: 0,
    tokenVestedBalance: 400000000
  };
  this.config.tokenTransferAmountWithDecimals = this.config.tokenTransferAmount * parseInt(1 + '0'.repeat(this.config.tokenDecimals));
  this.config.mintExpectedBalance = this.config.mintAmountOfNEO * this.config.mintTokenPerNEO;

  this.contracts = {
    neoLX: sdk.NeoCommon.getScriptHashForData(newContractAVM)
  };

  this.accounts = {
    master: new neon.wallet.Account(process.env.NEO_SINGLE_NODE_MASTER_WIF),
    contractMaster: new neon.wallet.Account(process.env.CONTRACT_ADMIN_WIF),
    whitelistAccount: new neon.wallet.Account(process.env.PKEYA),
    recipient: new neon.wallet.Account(process.env.PKEYB),
    spender: new neon.wallet.Account(process.env.PKEYC)
  };

  this.network = Networks[process.env.DEFAULT_NETWORK];

  this.sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  };


  //Claim gas
  console.log("Claiming Gas");
  await sdk.NeoCommon.transferAndClaim(this.network, this.accounts.master.WIF);
  await this.sleep(5000);
  //transfer to contract master
  await sdk.NeoCommon.transferAsset(this.network, this.accounts.master.WIF, this.accounts.whitelistAccount.address, 0, 10);
  await this.sleep(5000)
  await sdk.NeoCommon.transferAsset(this.network, this.accounts.master.WIF, this.accounts.recipient.address, 0, 10);
  await this.sleep(5000)
});
