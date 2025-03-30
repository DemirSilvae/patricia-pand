import styles from './Interaction.module.scss'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { FormGroup, Switcher } from '../../../ui'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { useAppKitAccount } from '@reown/appkit/react'
import { ERC20__factory } from '../../../../typechain-types'
import { IPoolsNFTLens } from '../../../../typechain-types/PoolsNFT'

type InteractionProps = {
  poolId: number
}

const Interaction = ({ poolId }: InteractionProps) => {
  const { poolsNFT, networkConfig, provider } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  const [inputDeposit, setInputDeposit] = useState<string>("")
  const [inputWithdraw, setInputWithdraw] = useState<number>(0)
  const [royaltyPrice, setRoyaltyPrice] = useState<string>("")
  const [poolsNFTInfo, setPoolsNFTInfo] = useState<IPoolsNFTLens.PoolNFTInfoStructOutput | null>(null)
  const [isProcessingBuyRoyalty, setIsProcessingBuyRoyalty] = useState<Boolean>(false)
  const [reinvest, setReinvest] = useState<boolean>(false)

  const checkRequired = () => {
    if(!poolsNFT) {
      console.error("PoolsNFT is null!")
      return false
    }
    if(!poolsNFTInfo) {
      console.error("poolsNFTInfo is null!")
      return false
    }
    return true
  }

  useEffect(() => {
    fetchPoolsNFTInfo()
  }, [poolsNFT])

  const fetchPoolsNFTInfo = async () => {
    const poolsNFTInfos: IPoolsNFTLens.PoolNFTInfoStructOutput[] = await poolsNFT!.getPoolNFTInfosBy([poolId])
    setPoolsNFTInfo(poolsNFTInfos[0])

    const newRoyaltyPrice = poolsNFTInfos[0].royaltyParams.newRoyaltyPrice
    const quoteTokenDecimals = poolsNFTInfos[0].quoteTokenDecimals
    const fetchedRoyaltyPrice = ethers.formatUnits(newRoyaltyPrice, quoteTokenDecimals)
    setRoyaltyPrice(fetchedRoyaltyPrice)
  }

  const handleDeposit = async () => {
    if(!checkRequired()) return
    try{
      const quoteTokenAddress = poolsNFTInfo!.quoteToken
      const quoteTokenDecimals = poolsNFTInfo!.quoteTokenDecimals

      const spenderAddress = networkConfig.poolsNFT!
      const signer = await provider?.getSigner()
      const quoteTokenContract = ERC20__factory.connect(quoteTokenAddress, signer)
      const allowanceRaw = await quoteTokenContract!.allowance(userAddress!, spenderAddress)
      const allowanceFormatted = ethers.formatUnits(allowanceRaw, quoteTokenDecimals)
      const inputDepositRaw = ethers.parseUnits(inputDeposit, quoteTokenDecimals)

      if (Number(inputDeposit) > Number(allowanceFormatted)) {
        let appove_tx = await quoteTokenContract.approve(spenderAddress, inputDepositRaw)
        await appove_tx.wait()
      }

      const quoteTokenAmountRaw = ethers.parseUnits(inputDeposit.toString(), quoteTokenDecimals)
      const gasEstimate = await poolsNFT!.deposit.estimateGas(poolId, quoteTokenAmountRaw)
      const gasLimit = gasEstimate * 14n / 10n
      const deposit_tx = await poolsNFT!.deposit(poolId, quoteTokenAmountRaw, {gasLimit})
      await deposit_tx.wait()
    } catch (err){
      console.log("Failed to deposit: ", err)
    }
  }

  const handleWithdraw = async () => {
    if(!checkRequired()) return
    try{
      const quoteTokenDecimals = poolsNFTInfo!.quoteTokenDecimals
      const quoteTokenAmountRaw = ethers.parseUnits(inputWithdraw.toString(), quoteTokenDecimals)
      const gasEstimate = await poolsNFT!.withdraw.estimateGas(poolId, userAddress as string, quoteTokenAmountRaw)
      const gasLimit = gasEstimate * 14n / 10n
      const tx = await poolsNFT!.withdraw(poolId, userAddress as string, quoteTokenAmountRaw, {gasLimit})
      await tx.wait()
    } catch(err) {
      console.log("Failed withdraw funds", err)
    }
  }

  const handleExit = async () => {
    if(!checkRequired()) return
    try{
      const tx = await poolsNFT!.exit(Number(poolId))
      await tx.wait()
    } catch(err) {
      console.log("Failed exit pool", err)
    }
  }

  const handleBuyRoyalty = async () => {
    if(!checkRequired()) return
    try {
      const quoteTokenAddress = poolsNFTInfo!.quoteToken
      const quoteTokenDecimals = poolsNFTInfo!.quoteTokenDecimals

      const spenderAddress = networkConfig.poolsNFT!
      const signer = await provider?.getSigner()
      const quoteTokenContract = ERC20__factory.connect(quoteTokenAddress, signer)
      const allowanceRaw = await quoteTokenContract!.allowance(userAddress!, spenderAddress)
      const allowanceFormatted = ethers.formatUnits(allowanceRaw, quoteTokenDecimals)
      const newRoyaltyPrice = poolsNFTInfo!.royaltyParams.newRoyaltyPrice
      const newRoyaltyPriceFormatted = ethers.formatUnits(newRoyaltyPrice, poolsNFTInfo!.quoteTokenDecimals)
      setIsProcessingBuyRoyalty(true)
      if (Number(newRoyaltyPriceFormatted) > Number(allowanceFormatted)) {
        let appove_tx = await quoteTokenContract.approve(spenderAddress, newRoyaltyPrice)
        await appove_tx.wait()
      }

      const buyRoyalty_tx = await poolsNFT!.buyRoyalty(poolId)
      await buyRoyalty_tx.wait()
      setIsProcessingBuyRoyalty(false)
    } catch (err) {
      setIsProcessingBuyRoyalty(false)
      console.log("Failed buy royalty")
    }
  }

  return (
    <div className={`${styles["interaction"]} form`}>
      <h2 className={styles["title"]}>Interaction</h2>
      <div className={styles["content"]}>
        <div className={styles["inputs"]}>
          <FormGroup label="Deposit Amount">
            <div className="form-input">
              <input
                type="number"
                placeholder="Enter deposit amount"
                onChange={(e) => setInputDeposit(e.target.value)}
              />
              <button 
                onClick={() => handleDeposit()} 
                className="button"
              >
                Deposit
              </button>
            </div>
          </FormGroup>
          <FormGroup label="Withdraw Amount">
            <div className="form-input">
              <input
                placeholder="Enter withdraw amount"
                onChange={(e) => setInputWithdraw(parseFloat(e.target.value))}
              />
              <button 
                onClick={() => handleWithdraw()}
                className="button"
              >
                Withdraw
              </button>
            </div>
          </FormGroup>
        </div>
        <div>
          <Switcher
            label="Reinvest"
            defaultValue={true}
            onChange={(value) => setReinvest(value)}
          />
          <div className={styles["exit-description"]}>
            Exit: emergency withdraw distribution of funds and ownership of strategy pool will be moved to royalty receiver.
          </div>
          <button 
            className={`${styles["button"]} button`}
            onClick={() => handleExit()}
          >
            Exit
          </button>
            <button 
            className={`${styles["button"]} button`}
            onClick={() => handleBuyRoyalty()}
            >
            {isProcessingBuyRoyalty
              ? 'Processing...'
              : poolsNFTInfo
                ? `Buy Royalty (${royaltyPrice} ${poolsNFTInfo.quoteTokenSymbol})`
                : 'Buy Royalty'
            }
            </button>
        </div>
      </div>
    </div>
  )
}

export default Interaction