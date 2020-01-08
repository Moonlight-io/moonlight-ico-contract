<p align="center">
  <img
    src="https://assets.moonlight.io/vi/moonlight-logo-dark-800w.png" 
    width="400px"
    alt="Moonlight">
</p>

<p align="center" style="font-size: 48px;">
  <strong>Moonlight ICO Template</strong>
</p>

<p align="center">
 A C# ICO Template for the NEO Ecosystem
</p>

# Overview
The Moonlight team is proud to provide a new ICO template for use by the NEO community.  The template is written in C# and represents a feature-rich platform for token sales on the Neo blockchain.  We welcome pull request and issue submission.

## Features
* All NEP-5 Methods Including allowance, transferFrom, and approve
* Purchase of tokens with both NEO and GAS
* Presale methods which support tiered vesting without blocking the accounts from additional purchase
* KYC whitelisting and participation groups with variable participation blockHeight and allocations
* Immediate token minting upon purchase
* Multi-Stage vesting for founders allocation
* Contract Migration
* Presale allocation locking
* Partial refunds at hardcap
* Vested project token allocation

## Deployed
This contract can be found on Neo Mainnet at `cea5a3963a5813a26accc6bc67e9be9d14d395f0 `



# Quickstart
1. Ensure that you correctly set `InitialAdminAccount` to your own address
2. [Build](http://docs.neo.org/en-us/sc/quickstart/getting-started-csharp.html) and [deploy](http://docs.neo.org/en-us/sc/quickstart/deploy-invoke.html) the contract with input params: `07`
2. Upon deployment you need to run the InitSmartContract administration method (can only be run once)
    * `main("admin", ["InitSmartContract"])`
    * **Note:** This is a latching method and cannot be undone
3. Allocate presale purchase amounts
    * `main("admin", ["AllocatePresalePurchase", hash160Recipient, tokenAmountFactorised]`
4. Lock future presale allocation
    * `main("admin", ["LockPresaleAllocation"])`
    * **Note:** This is a latching method and cannot be undone
5. Public method to ensure transparent use of `AllocatePresalePurchase`
    * `main("IsPresaleAllocationLocked", [])`


# Wallet Integration
- Check if a user has been whitelisted
    - > bool main("crowdsale_status", (hash160)address)
- Get the participation group number for the whitelisted user
    - > int main("GetGroupNumber", (hash160)address)
- Get the max number of LX the group can purchase
    - > int main("GetGroupMaxContribution")
- Get the block number the group can start participating
    - > int main("GetGroupUnlockBlock")
- Determine if the specified group number can now purchase tokens
    - > bool main("GroupParticipationIsUnlocked", (int)groupNumber)
* **Note:** `Group` refers to the phase of the sale a user can participate in.


# Support scripts and testing
<i>Note 1:</i> This package includes a support script to easily deploy and verify the contract as
 well as optionally register the contract with the Moonlight Neo Contract Name Service.  All support scripts depend on
 the `asteroid-sdk-js` package which you may or may not have access to.  It wraps a number of contract methods
 using the `neon-js` project by COZ.

 * To deploy: `make deploy`
 * To run tests: `make unit_test`

 <i>Note 2:</i> These scripts rely on the config files found in the `config` directory and will default to the `dev` environment.
 You may change the environment by defining the `ENVIRONMENT` environment variable.

 <i>Note 3:</i> An environment variable is intentionally omitted from the configuration files which is critical to
 deployment and configuration of this contract. `CONTRACT_ADMIN_WIF` is used to define the contract owner which is
 initially hard-coded into the contract itself [here](./ICOContract/ICOContract.cs#L19)

 The test folder provides a number of good examples on how to work with the contract including how to execute a contract migration.