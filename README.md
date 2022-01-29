# Hardhat Template

## Desctiption

Hardhat Template with TypeScript support. For the main deployment plugin, we use `hardhat-deploy` instead of the standard deployment script, because it provides many utilities, such as saving all information about contracts and automatically verifying them on the block scanner, and so on [read here](https://www.npmjs.com/package/hardhat-deplo). Also template has plugin for manipulation time on blockchain `extensions/time.ts`. And two extends for standart classes `String` and `BigNumber`.

After `yarn deploy --network <network>` all inforamtion abount contract saves in file `contracts.json`. You can modify path in `package.json`

You can use `tags` in deployments script and `hardhat.config.ts` to separate contracts for different purpose.
**Example:** You have on mainnet tokens and you need to write `Staking.sol`. You can add to Token deployment tag `dev`, and it will deploy only on testnet chains. And create analogue files in mainnet folder `deployments/bsc_mainnet/Token.json` with existed address and abi, and after deploying with `yarn deploy --network bsc_mainnet` generates file `contracts.json` with real token's address and abi and staking too.

Put all your secret inforamtion inside `.secrets.ts`, see example `.secrets.ts.example`

For testing we dont use `hardhat-deploy` `fixtures` because for now `solidity-coverage` does not support them

## Quick Setup

```console
$ yarn
$ yarn compile
```

## Scripts

- `yarn compile` - compiles all smartcontracts and generates typechain
- `yarn deploy <netowrk>` - executes all deploy scripts with provided `network` (reuse old deployments)
- `yarn test` - runs all tests
- `yarn coverage` - runs coverage of tests
- `yarn verify <network>` - verifies contract on `network`

## Folders

- `contracts` - for smartcontracts
- `deploy` - for deploy scripts
- `deployments` - for all deployments
- `extensions`
- `scripts` - setup scripts for init smartcontracts
- `test` - for tests
- `typechain` - generated interfaces for contracts
- `utils` - different utils

## Custom extensions

### Time

Extension for hardhat `hre`. Provides base methods `evm` time manipulation

- `evm_snapshot` - snapshot the state of the blockchain at the current block. Takes no parameters.
- `evm_revert` - revert the state of the blockchain to a previous snapshot. Takes a single parameter, which is the snapshot id to revert to. If no snapshot id is passed it will revert to the latest snapshot.
- `evm_increaseTime` - jump forward in time. Takes one parameter, which is the amount of time to increase in seconds.
- `evm_mine` - Force a block to be mined. Takes no parameters. Mines a block independent of whether or not mining is started or stopped.

#### Usage

```typescript
import { time } from 'hardhat'

async function example() {
  const snapId = await time.snapshot() // saves snpashot id of node state
  await time.increaseTime(1000) // increase time on 1000 seconds
  await time.mine() // mines actual block
  await time.revert(snapId) // reverts state of node to snapId
}
```

### BigNumber extending

Extends `ethers.js` `BigNumber` class with two useful functions

- `BigNumber.prototype.formatString(decimals: number, precision: number): string` - formats `BigNumber` to human readable string of token amount with provided `precision`
- `BigNumber.prototype.formatNumber(decimals: number, precision: number): number` - formats `BigNumber` to human readable number of token amount with provided `precision`

#### Usage

```typescript
import { BigNumber, ethers } from 'ethers'

function example() {
  const tokens = ethers.constants.WeiPerEther.mul(1111).div(1000) // 1.111 ether

  const formattedInString = tokens.formatString(/* decimals */ 18, /* precision */ 2) // '1.11'
  const formattedInNumber = tokens.fromatNumber((/* decimals */ 18, /* precision */ 2) // 1.111
}
```

### String extending

Extends class `String` with useful function for blockchain

- `String.prototype.toBigNumber(decimals = 0): BigNumber` - converts string to BigNumber with `decimals`
- `String.prototype.cutZeros(): string` - cuts all zeros after comma
- `String.prototype.shortAddress(start = 6, end = start - 2): string` - converts long address to short variant
- `String.prototype.validNumber(...)` - validates number input. By default, any **positive**, **non-zero** number consisting only of `0-9` and maybe `.` dot character

```typescript
  String.prototype.validNumber(
    num: string,
    params = {} as {
      /** Forbid float. Default: false */
      nofloat?: boolean
      /** Allow zero value. Default: false */
      allowzero?: boolean
      /** Allow negative value. Default: false */
      allownegative?: boolean
    })
```

#### Usage

```typescript
function example() {
  const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  address.shortAddress() // '0x5FbD...0aa3'

  // ...
}
```

## Dependencies

- [Hardhat](https://hardhat.org/)
- [Contract Sizer](https://www.npmjs.com/package/hardhat-contract-sizer)
- [Hardhat Deploy](https://www.npmjs.com/package/hardhat-deploy)

## Useful links

- [Hardhat Project with hardhat-deploy](https://github.com/wighawag/template-ethereum-contracts)
- [Hardhat Project with hardhat-deploy fork deploy](https://github.com/wighawag/template-ethereum-contracts/tree/examples/fork-test)
