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

const oldContractAVM = fs.readFileSync(process.env.CONTRACT_PATH_ORIGINAL, "hex");
const newContractAVM = fs.readFileSync(process.env.CONTRACT_AVM_PATH, "hex");

before(function () {
  this.contracts = {
    neoLX: sdk.NeoCommon.getScriptHashForData(oldContractAVM)
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


})

describe("migrate the contract", function(){

  it('Contract.Migrate', async function() {
    this.timeout(20000);

    //transfer to contract master
    await sdk.NeoCommon.transferAsset(this.network, this.accounts.master.WIF, this.accounts.contractMaster.address, 0, 1000);
    await this.sleep(5000)

    await sdk.NeoCommon.contractMigrate(
      this.network,
      this.contracts.neoLX,
      newContractAVM,
      "0710",
      "05",
      1,
      "Moonlight LX Contract",
      "1.5",
      "Moonlight",
      "chris@moonlight.io",
      "Moonlight",
      this.accounts.contractMaster.WIF
    );

    let newScriptHash = sdk.NeoCommon.getScriptHashForData(newContractAVM);
    let name
    for (let i = 0; i < 20; i++) {
      name = await sdk.NeoContractLX.contractName(this.network, newScriptHash);
      if (name) {
        console.log("migrated: " + name);
        break
      }
      await this.sleep(2000)
    }
  })

});