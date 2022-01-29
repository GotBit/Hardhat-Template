import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import { ethers } from 'hardhat'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments } = hre
  const { deploy } = deployments
  const [deployer] = await ethers.getSigners()

  await deploy('Token B', {
    from: deployer.address,
    contract: 'Token',
    args: [],
    log: true,
  })
}
export default func
func.tags = ['dev']
