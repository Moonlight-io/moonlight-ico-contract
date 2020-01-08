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

const contractAVM = fs.readFileSync(process.env.CONTRACT_PATH_ORIGINAL, "hex");

/**
 * runs before any other tests are run
 *
 * test the smart contract we want to test has been initialised
 */
before(function () {
  this.contracts = {
    neoLX: sdk.NeoCommon.getScriptHashForData(contractAVM)
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
    tokenTransferAmount: 5000,
    tokenTransferAmountWithDecimals: 0,
    tokenVestedBalance: 400000000
  };
  this.config.tokenTransferAmountWithDecimals = this.config.tokenTransferAmount * parseInt(1 + '0'.repeat(this.config.tokenDecimals));
  this.config.mintExpectedBalance = this.config.mintAmountOfNEO * this.config.mintTokenPerNEO;

})


describe('Deploy and configure the original contract', function () {

  // test if the latest contract has been deployed to the network
  it("should deploy the old contract", async function () {
    this.timeout(30000);

    //Claim gas
    console.log("Claiming Gas");
    await sdk.NeoCommon.transferAndClaim(this.network, this.accounts.master.WIF);
    await this.sleep(5000);

    //transfer to contract master
    await sdk.NeoCommon.transferAsset(this.network, this.accounts.master.WIF, this.accounts.contractMaster.address, 0, 1000);
    await this.sleep(5000)
    await sdk.NeoCommon.transferAsset(this.network, this.accounts.master.WIF, this.accounts.whitelistAccount.address, 100, 0);
    await this.sleep(5000)

    //Deploy the contract
    let name = await sdk.NeoContractLX.contractName(this.network, this.contracts.neoLX);
    if (name) {
      // have a response, contract must be deployed
      console.log("Contract Already Deployed: " + name)
    } else {
      // if stack length is deploy the contract and poll until the deploy is verified
      await sdk.NeoCommon.deployContract(this.network, contractAVM, this.accounts.contractMaster.WIF);
      for (let i = 0; i < 30; i++) {
        name = await sdk.NeoContractLX.contractName(this.network, this.contracts.neoLX);
        if (name) {
          console.log("Contract Deployed: " + name);
          break;
        }
        await this.sleep(2000);
      }
    }
    await this.sleep(5000)
  });

  it("initialize the the contract", async function() {

    this.timeout(20000)
    await sdk.NeoContractLX.initSmartContract(this.network, this.contracts.neoLX, this.accounts.contractMaster.WIF)
    let supply
    for (let i = 0; i < 20; i++) {
      supply = await sdk.NeoContractLX.totalSupply(this.network, this.contracts.neoLX)
      if (supply != 0) {
        console.log("contract initialized!")
        break
      }
      await this.sleep(2000)
    }
    supply.should.be.greaterThan(100)
    await this.sleep(5000)
  })

});
