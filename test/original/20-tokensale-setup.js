const sdk = require("@moonlight-io/asteroid-sdk-js");

describe("token sale setup", function () {

  it("test set group unlock block mechanism", async function () {
    this.timeout(10000);

    let res = await sdk.NeoContractLX.getGroupUnlockBlock(this.network, this.contracts.neoLX, this.config.targetGroup);
    if (res !== this.config.targetUnlockBlock) {
      await sdk.NeoContractLX.setGroupUnlockBlock(this.network, this.contracts.neoLX, this.config.targetGroup, this.config.targetUnlockBlock, this.accounts.contractMaster.WIF)

      for (let i = 0; i < 20; i++) {
        res = await sdk.NeoContractLX.getGroupUnlockBlock(this.network, this.contracts.neoLX, this.config.targetGroup);
        if (res === this.config.targetUnlockBlock) {
          break
        }
        await this.sleep(2000)
      }
    }
    res.should.be.equal(this.config.targetUnlockBlock)
    await this.sleep(5000);
  });

  it("whitelist an address for pre-sale", async function () {
    this.timeout(10000);
    // test if the address is whitelisted
    let res = await sdk.NeoContractLX.getTokenSaleGroupNumber(this.network, this.contracts.neoLX, this.accounts.whitelistAccount.address);
    if (!res) {
      // the user has not been whitelisted yet
      await sdk.NeoContractLX.addAddress(this.network, this.contracts.neoLX, this.accounts.whitelistAccount.address, this.config.targetGroup, this.accounts.contractMaster.WIF);
      //this.nep5.AddAddress(this.nep5.accounts.whitelistAccount.scriptHash, this.nep5.config.targetGroup, this.nep5.accounts.contractAdmin.WIF);
      for (let i = 0; i < 20; i++) {
        res = await sdk.NeoContractLX.getTokenSaleGroupNumber(this.network, this.contracts.neoLX, this.accounts.whitelistAccount.address);
        if (res === this.config.targetGroup) {
          break
        }
        await this.sleep(2000)
      }
    }
    res.should.be.equal(this.config.targetGroup)
    this.sleep(5000)
  });


  it("invoke mintTokens", async function () {
    this.timeout(10000);
    let res = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.accounts.whitelistAccount.address);

    await sdk.NeoContractLX.mintTokens(this.network, this.contracts.neoLX, this.config.mintAmountOfNEO, this.accounts.whitelistAccount.WIF)
    for (let i = 0; i < 20; i++) {
      res = await sdk.NeoContractLX.balanceOf(this.network, this.contracts.neoLX, this.accounts.whitelistAccount.address);
      if (res == this.config.mintAmountOfNEO * this.config.mintTokenPerNEO) {
        break
      }
      await this.sleep(2000)
    }
    res.should.be.equal(this.config.mintAmountOfNEO * this.config.mintTokenPerNEO)
    this.sleep(5000)
  });

});
