import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumberish } from 'ethers'
import { ethers, time, deployments } from 'hardhat'
import { Staking, Staking__factory, Token, Token__factory } from '../typechain'

async function stake(
  token: Token,
  staking: Staking,
  signer: SignerWithAddress,
  amount: BigNumberish
) {
  await token.connect(signer).approve(staking.address, ethers.constants.MaxUint256)
  await expect(() => staking.connect(signer).stake(amount)).changeTokenBalance(
    token,
    signer,
    amount
  )
}

async function harvest() {}

describe('Staking Contract', () => {
  let tokenA: Token, tokenB: Token
  let staking: Staking

  let owner: SignerWithAddress, user: SignerWithAddress

  before(async () => {
    ;[owner, user] = await ethers.getSigners()
    await deployments.fixture('Token A')
    await deployments.fixture('Token B')
    await deployments.fixture('Staking')

    tokenA = <Token>await ethers.getContract('Token A')
    tokenB = <Token>await ethers.getContract('Token B')
    staking = <Staking>await ethers.getContract('Staking')
  })

  describe('User functions', () => {
    it('should stake and wrire in blockchain', async () => {
      console.log(await tokenB.balanceOf(staking.address))
    })
    it('should harvest collected Token B', async () => {})
    it('should unstake and harvest', async () => {})
  })
  describe('Admin functions', () => {})
})
