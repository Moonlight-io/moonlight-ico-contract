const sdk = require("@moonlight-io/asteroid-sdk-js");

describe('nep5 token info', function () {

  it("totalSupply() matches config", async function () {
    let res = await sdk.NeoContractLX.totalSupply(this.network, this.contracts.neoLX);
    res.should.be.equal(this.config.totalSupply + (this.config.mintAmountOfNEO * this.config.mintTokenPerNEO))
  });

  it('name() matches config', async function () {
    let res = await sdk.NeoContractLX.contractName(this.network, this.contracts.neoLX);
    console.log(res)
    res.should.be.equal(this.config.tokenName)
  });

  it('symbol() matches config', async function () {
    let res = await sdk.NeoContractLX.symbol(this.network, this.contracts.neoLX);
    res.should.be.equal(this.config.tokenSymbol)
  });

  it('decimals() matches config', async function () {
    let res = await sdk.NeoContractLX.decimals(this.network, this.contracts.neoLX);
    res.should.be.equal(this.config.tokenDecimals)
  });

  it('test balanceOfVestedAddress', async function () {
    let res = await sdk.NeoContractLX.balanceOfVestedAddress(this.network, this.contracts.neoLX, process.env.VESTED_ADDRESS );
    res.should.be.equal(this.config.tokenVestedBalance)
  });


});