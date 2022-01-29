import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumberish } from 'ethers'
import { ethers, time } from 'hardhat'
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
  let tokenFactory: Token__factory
  let stakingFactory: Staking__factory

  let tokenA: Token, tokenB: Token
  let staking: Staking

  let owner: SignerWithAddress, user: SignerWithAddress

  let snapInit

  before(async () => {
    ;[owner, user] = await ethers.getSigners()

    tokenFactory = await ethers.getContractFactory('Token')
    tokenA = await tokenFactory.deploy()
    tokenB = await tokenFactory.deploy()

    stakingFactory = await ethers.getContractFactory('Staking')
    staking = await stakingFactory.deploy(tokenA.address, tokenB.address, owner.address)

    snapInit = await time.snapshot()
  })

  describe('User functions', () => {
    it('should stake and write in blockchain', async () => {})
    it('should harvest collected Token B', async () => {})
    it('should unstake and harvest', async () => {})
  })
  describe('Admin functions', () => {})
})
