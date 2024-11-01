import styles from './Burn.module.scss'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useProtocolContext } from '../../../context/ProtocolContext'
import { useAppKitAccount } from '@reown/appkit/react'
import { Select, Option, FormGroup, Checkbox } from '../../ui'

function Burn() {
  const { networkConfig, grETH } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  const [burnAmount, setBurnAmount] = useState<string>('')
  const [selectedToken, setSelectedToken] = useState<string>(networkConfig.baseTokens![0].symbol)
  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [estimatedTokenAmount, setEstimatedTokenAmount] = useState<string>('0')

  const [isChangedToken, setIsChangedToken] = useState<boolean>(false)
  const [changeAddress, setChangeAddress] = useState<boolean>(false)

  const fetchEstimate = async () => {
    if (!grETH || !burnAmount) return

    try {
      const tokenInfo = networkConfig.baseTokens!.find(b => b.symbol === selectedToken)
      if (!tokenInfo) return console.error("tokenInfo not set!")

      const value = ethers.parseUnits(burnAmount || '0', 18)
      const estimate = await grETH.calcShare(value, tokenInfo.address)
      const formatted = ethers.formatUnits(estimate, tokenInfo.decimals)

      setEstimatedTokenAmount(formatted)
    } catch (err) {
      console.error("Error estimating token amount: ", err)
      setEstimatedTokenAmount('0')
    }
  }

  useEffect(() => {
    fetchEstimate()
  }, [burnAmount, selectedToken])

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!burnAmount || parseFloat(burnAmount) <= 0) return console.log("burnAmount not set!")
      if (!grETH) return console.error("grETH not set!")

      const tokenInfo = networkConfig.baseTokens!.find(b => b.symbol === selectedToken)
      if (!tokenInfo) return console.error("tokenInfo not set!")
      const amount = ethers.parseUnits(burnAmount, 18)
      const receiver = changeAddress ? receiverAddress : userAddress!

      const tx = await grETH!.burnTo(amount, tokenInfo.address, receiver)
    } catch (error) {
      console.error("Error burning grETH: ", error)
    }
  }

  const handleMaxClick = () => {
    // TODO: Change to user grETH balance
    setBurnAmount('100')
  }

  const isFormValid = burnAmount && parseFloat(burnAmount) > 0

  return (
    <div className={`${styles["burn-form"]} form`}>
      <h2 className={`${styles["title"]} form-title`}>Burn and Get Tokens</h2>
      <FormGroup label="Burn grETH Amount">
        <div className="form-input">
          <input
            value={burnAmount}
            placeholder="0"
            onChange={(e) => setBurnAmount(e.target.value)}
          />
          <button
            type="button"
            onClick={handleMaxClick}
            className="max-button button"
          >
            MAX
          </button>
        </div>
      </FormGroup>
      <FormGroup label="Receive Token">
        <Select onChange={(value) => setSelectedToken(value as string)}>
          {networkConfig.baseTokens!.map((token, index) => (
            <Option key={index} value={token.symbol}>
              <img src={token.logo} alt={token.symbol} className={styles["token-icon"]} />
              {token.symbol}
            </Option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup>
        <Checkbox defaultChecked={false} onChange={setChangeAddress}>
          Receiver wallet (optional)
        </Checkbox>
        {changeAddress && (
          <div className="form-input">
            <input
              type="text"
              value={receiverAddress}
              placeholder="0x..."
              onChange={(e) => setReceiverAddress(e.target.value)}
            />
          </div>
        )}
      </FormGroup>
      <p className="form-label">
        Estimated token amount: {estimatedTokenAmount}
      </p>
      <button
        className={`${styles["burn-button"]} button`}
        disabled={!isFormValid}
        onClick={handleBurn}
      >
        Burn
      </button>
    </div>
  )
}

export default Burn