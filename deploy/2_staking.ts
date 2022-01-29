import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import { ethers } from 'hardhat'
import { Token } from '../typechain'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre
  const { deploy } = deployments
  const [deployer] = await ethers.getSigners()

  const tokenA = (await ethers.getContract('Token A')) as Token
  const tokenB = (await ethers.getContract('Token B')) as Token

  await deploy('Staking', {
    from: deployer.address,
    args: [tokenA.address, tokenB.address, deployer.address],
    log: true,
  })

  if (hre.network.tags.dev) {
    const staking = await ethers.getContract('Staking')
    await tokenB.connect(deployer).transfer(staking.address, 1)
  }
}
export default func
func.tags = ['prod', 'dev']
