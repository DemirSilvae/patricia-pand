import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useProtocolContext } from '../../../../../context/ProtocolContext'
import { FormGroup } from '../../../../ui'

type InteractionProps = {
  poolId: number
}

const Interaction = ({ poolId }: InteractionProps) => {
  const { poolsNFT } = useProtocolContext()

  const [inputDeposit, setInputDeposit] = useState<number>(0)
  const [inputWithdraw, setInputWithdraw] = useState<number>(0)
  const [royaltyPrice, setRoyaltyPrice] = useState<bigint>(0n)

  const checkRequired = async () => {
    if(!poolsNFT) {
      console.error("PoolsNFT is null!")
      return false
    }
    return true
  }

  useEffect(() => {
    fetchRoyaltyPrice()
  }, []) // called only once

  const fetchRoyaltyPrice = async () => {
    if(!checkRequired()) return

    try {
      const price = await poolsNFT!.royaltyPrice(poolId)
      setRoyaltyPrice(price)
    } catch(err) {
      console.log("Failed to fetch royalty price", err)
    }
  }

  const handleDeposit = async () => {
    if(!checkRequired()) return
    try{
      // const quoteTokenConfig = networkConfig.quoteTokens.find(
      //   (token) => token.address.toLowerCase() === quoteTokenAddress.toLowerCase()
      // )
      const quoteTokenDecimals = 18
      const quoteTokenAmountRaw = ethers.parseUnits(inputDeposit.toString(), quoteTokenDecimals)
      const gasEstimate = await poolsNFT!.deposit.estimateGas(poolId, quoteTokenAmountRaw)
      const gasLimit = gasEstimate * 14n / 10n
      const tx = await poolsNFT!.deposit(poolId, quoteTokenAmountRaw, {gasLimit})
      await tx.wait()
    } catch (err){
      console.log("Failed to deposit: ", err)
    }
  }

  const handleWithdraw = async () => {
    if(!checkRequired()) return
    try{
      const quoteTokenDecimals = 18
      const quoteTokenAmountRaw = ethers.parseUnits(inputWithdraw.toString(), quoteTokenDecimals)
      const gasEstimate = await poolsNFT!.deposit.estimateGas(poolId, quoteTokenAmountRaw)
      const gasLimit = gasEstimate * 14n / 10n
      const tx = await poolsNFT!.withdraw(poolId, quoteTokenAmountRaw, {gasLimit})
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
  }

  return (
    <div className="interaction-form">
      <div>
        <FormGroup label="Deposit Amount">
          <div className="form-input">
            <input
              type="number"
              placeholder="Enter deposit amount"
              onChange={(e) => setInputDeposit(parseFloat(e.target.value))}
            />
            <button 
              onClick={() => handleDeposit()} 
              className="action-button"
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
            >
              Withdraw
            </button>
          </div>
        </FormGroup>
      </div>
      <div>
        <div className="exit-description">
          Exit: emergency withdraw distribution of funds and ownership of strategy pool will be moved to royalty receiver.
        </div>
        <button 
          className="exit-button"
          onClick={() => handleExit()}
        >
          Exit
        </button>
        <button 
          className="royalty-button"
          onClick={() => handleBuyRoyalty()}  
        >
          Buy Royalty ({royaltyPrice.toString()} ETH)
        </button>
      </div>
    </div>
  )
}

export default Interaction