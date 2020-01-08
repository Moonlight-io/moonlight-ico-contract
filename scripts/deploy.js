const sdk = require("@moonlight-io/asteroid-sdk-js");
let neon = require("@cityofzion/neon-js");
const Networks = require("../config/networks");
const fs = require("fs")

const contractAVM = fs.readFileSync(process.env.CONTRACT_AVM_PATH, "hex");
let contracts = {
  neoCNS: process.env.SCRIPT_HASH_CNS,
  neoLX: sdk.NeoCommon.getScriptHashForData(contractAVM)
};

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};


(async () => {
  let network = Networks[process.env.DEFAULT_NETWORK];
  let wif = process.env.NEO_SINGLE_NODE_MASTER_WIF;
  let contractMasterWIF = process.env.CONTRACT_ADMIN_WIF;

  //Claim gas
  console.log("Claiming Gas");
  await sdk.NeoCommon.transferAndClaim(network, wif);
  sleep(5000);

  //Deploy the contract
  let name;
  let res = await sdk.NeoCommon.invokeFunction(network, contracts.neoLX, "name", []);
  if (res.result.stack && res.result.stack.length > 0) {
    name = neon.default.u.hexstring2str(res.result.stack[0].value)
  }
  if (name) {
    // have a response, contract must be deployed
    console.log("Contract Already Deployed: " + name)
  } else {
    // if stack length is deploy the contract and poll until the deploy is verified
    await sdk.NeoCommon.deployContract(network, contractAVM, wif);
    for ( let i = 0; i < 30; i++ ) {
      res = await sdk.NeoCommon.invokeFunction(network, contracts.neoLX, "name", []);
      if (res.result.stack && res.result.stack.length > 0) {
        console.log("Contract Deployed: " + neon.u.hexstring2str(res.result.stack[0].value));
        break;
      }
      await sleep(2000);
    }
  }


  this.timeout(20000)
  let res = await sdk.NeoContractLX.initSmartContract(network, contracts.neoLX, contractMasterWIF)
  let supply
  for (let i = 0; i < 20; i++) {
    supply = await sdk.NeoContractLX.totalSupply(network, contracts.neoLX)
    if (supply != 0) {
      console.log("contract initialized!")
      break
    }
    await this.sleep(2000)
  }



  //Verify Registration in CNS
  let contractName = name;
  let registeredHash = await sdk.NeoContractNameService.getAddress(network, contracts.neoCNS, contractName);

  if (registeredHash === "") {
    console.log("Neo Contract Name Service registering");
    await sdk.NeoContractNameService.registerName(network, contracts.neoCNS, contractName, contracts.neoLX, wif);
    for ( let i = 0; i < 30; i++ ) {
      let res = await sdk.NeoContractNameService.getAddress(network, contracts.neoCNS, contractName);
      if (res === contracts.neoLX) {
        console.log("Neo Contract Name Service registered");
        break;
      }
      await sleep(2000);
    }

  } else if (registeredHash !== contracts.neoLX) {
    console.log("Neo Contract Name Service updating");
    await sdk.NeoContractNameService.updateAddress(network, contracts.neoCNS, contractName, contracts.neoLX, wif);
    for ( let i = 0; i < 30; i++ ) {
      let res = await sdk.NeoContractNameService.getAddress(network, contracts.neoCNS, contractName);
      if (res === contracts.neoLX) {
        console.log("Neo Contract Name Service updated");
        break;
      }
      await sleep(2000);
    }

  } else {
    console.log("Neo Contract Name Service already accurate");
  }

})();

