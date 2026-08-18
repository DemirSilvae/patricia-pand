import { useAppKitAccount } from '@reown/appkit/react'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { useProtocolContext } from '../../../context/ProtocolContext'
import { Checkbox, FormGroup, Option, Select } from '../../ui'
import styles from './Burn.module.scss'

function Burn() {
  const { networkConfig, grETH } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  const [burnAmount, setBurnAmount] = useState<string>('')
  const [selectedToken, setSelectedToken] = useState<string>(networkConfig.baseTokens![0].symbol)
  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [estimatedTokenAmount, setEstimatedTokenAmount] = useState<string>('0')

  const [changeAddress, setChangeAddress] = useState<boolean>(false)

  const fetchEstimate = async () => {
    if (!grETH || !burnAmount) return

    try {
      const tokenInfo = networkConfig.baseTokens!.find(b => b.symbol === selectedToken)
      if (!tokenInfo) return console.error('tokenInfo not set!')

      const value = ethers.parseUnits(burnAmount || '0', 18)
      const estimate = await grETH.calcShare(value, tokenInfo.address)
      const formatted = ethers.formatUnits(estimate, tokenInfo.decimals)

      setEstimatedTokenAmount(formatted)
    } catch (err) {
      console.error('Error estimating token amount: ', err)
      setEstimatedTokenAmount('0')
    }
  }

  useEffect(() => {
    fetchEstimate()
  }, [burnAmount, selectedToken])

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!burnAmount || parseFloat(burnAmount) <= 0) return console.log('burnAmount not set!')
      if (!grETH) return console.error('grETH not set!')

      const tokenInfo = networkConfig.baseTokens!.find(b => b.symbol === selectedToken)
      if (!tokenInfo) return console.error('tokenInfo not set!')
      const amount = ethers.parseUnits(burnAmount, 18)
      const receiver = changeAddress ? receiverAddress : userAddress!

      const tx = await grETH!.burnTo(amount, tokenInfo.address, receiver)
    } catch (error) {
      console.error('Error burning grETH: ', error)
    }
  }

  const handleMaxClick = async () => {
    const grethAmount = await grETH!.balanceOf(userAddress as string)
    const grethAmountFormatted = ethers.formatUnits(grethAmount, 18)
    setBurnAmount(grethAmountFormatted)
  }

  const isFormValid = burnAmount && parseFloat(burnAmount) > 0

  return (
    <div className={`${styles['burn-form']} form`}>
      <h2 className={`${styles['title']} form-title`}>Burn grETH</h2>
      <div className={`${styles['description']} form-title`}>
        Choose token, burn grETH and receive your token share
      </div>
      <FormGroup label="Burn grETH Amount">
        <div className="form-input">
          <input value={burnAmount} placeholder="0" onChange={e => setBurnAmount(e.target.value)} />
          <button
            type="button"
            onClick={handleMaxClick}
            className={`${styles['max-button']} button`}
          >
            MAX
          </button>
        </div>
      </FormGroup>
      <FormGroup label="Receive Token">
        <Select onChange={value => setSelectedToken(value as string)}>
          {networkConfig.baseTokens!.map((token, index) => (
            <Option key={index} value={token.symbol}>
              <img src={token.logo} alt={token.symbol} className={styles['token-icon']} />
              {token.symbol}
            </Option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup className={`${changeAddress ? styles['checked'] : styles['not-checked']}`}>
        <Checkbox defaultChecked={false} onChange={setChangeAddress}>
          {changeAddress ? (
            <div className="form-input">
              <input
                type="text"
                placeholder="Enter recepient address"
                onChange={e => setReceiverAddress(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
          ) : (
            'Another Recepient'
          )}
        </Checkbox>
      </FormGroup>
      <p className="form-label">Estimated token amount: {estimatedTokenAmount}</p>
      <button
        className={`${styles['burn-button']} button`}
        disabled={!isFormValid}
        onClick={handleBurn}
      >
        Burn
      </button>
    </div>
  )
}

export default Burn
