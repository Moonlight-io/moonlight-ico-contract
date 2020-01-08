const sdk = require("@moonlight-io/asteroid-sdk-js");

describe('nep5 token interaction', function () {

  it("transfer() executes", async function () {
    this.timeout(20000)
    let originalBalance = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.accounts.recipient.address);
    let wlb = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.accounts.whitelistAccount.address);
    let newBalance = 0;
    await sdk.NeoContractLX.transfer(this.network, this.contracts.neoLX, this.accounts.recipient.address, this.config.tokenTransferAmountWithDecimals, this.accounts.whitelistAccount.WIF)
    for (let i = 0; i < 20; i++) {
      newBalance = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.accounts.recipient.address);
      if (newBalance > originalBalance) {
        break
      }
      await this.sleep(2000)
    }
    newBalance.should.be.equal(originalBalance + this.config.tokenTransferAmount);
  });


  it("transfer() transfer to self results in net 0 balance change", async function() {
    this.timeout(20000)
    let originalBalance = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.accounts.recipient.address);
    await sdk.NeoContractLX.transfer(this.network, this.contracts.neoLX, this.accounts.recipient.address, this.config.tokenTransferAmountWithDecimals, this.accounts.recipient.WIF)
    let newBalance
    for (let i = 0; i < 20; i++) {
      newBalance = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.accounts.recipient.address);
      newBalance.should.be.equal(originalBalance)
    }
    await this.sleep(2000)
  });


/*
  it("allowance is set", async function () {
    this.timeout(20000)
    let allowance = await sdk.NeoContractLX.allowance(this.network, this.contracts.neoLX, this.accounts.recipient, this.accounts.spender)
    allowance.should.be.greaterThan(0);
  });

  it("transferFrom() executes and succeeds", async function () {
    this.timeout(15000);

    let balance = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.acounts.recipient);
    let masterBalance = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.acounts.contractMaster);
    let newBalance, newMasterBalance, allowance;
    let origAllowance = await sdk.NeoContractLX.getAllowanceBalance(this.network, this.contracts.neoLX, this.accounts.contractMaster, this.accounts.spender);

    // test the transferFrom method
    await sdk.NeoContractLX.transferFrom(this.network, this.contracts.neoLX, this.accounts.recipient, this.accounts.contractMaster, 50000000000, this.accounts.spender.WIF)
    for (let i = 0; i < 20; i++) {
      newBalance = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.acounts.recipient);
      newMasterBalance = sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.acounts.contractMaster);
      allowance = await sdk.NeoContractLX.getAllowanceBalance(this.network, this.contracts.neoLX, this.accounts.recipient, this.accounts.spender);

      if ((newBalance === (balance + 50000000000)) &&
         (allowance === (origAllowance - 50000000000)) &&
         (newMasterBalance === (masterBalance - 50000000000))) {
           break
      }
      await sleep(2000)
    }

    newBalance.should.be.equal(balance + 50000000000)
    allowance.should.be.equal(origAllowance - 50000000000)
    newMasterBalance.should.be.equal(masterBalance - 50000000000)
  });
*/
});