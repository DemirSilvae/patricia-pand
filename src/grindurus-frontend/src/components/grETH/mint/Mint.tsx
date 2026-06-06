import styles from './Mint.module.scss'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useProtocolContext } from '../../../context/ProtocolContext'
import { useAppKitAccount } from '@reown/appkit/react'
import { FormGroup, Checkbox, InputModal } from '../../ui'

function Mint() {
  const { grETH, provider } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  const [mintAmount, setMintAmount] = useState<string>('')

  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [changeAddress, setChangeAddress] = useState<boolean>(false)

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!mintAmount || parseFloat(mintAmount) <= 0) return console.error("mintAmount not set!")
      if(!grETH) return console.error("grETH not set!")

      const receiver = changeAddress ? receiverAddress : userAddress!
      const value = ethers.parseUnits(mintAmount, 18)

      const tx = await grETH.mintTo(receiver, { value })
      await tx.wait()
    } catch (err) {
      console.error('Mint failed:', err)
    }
  }

  const handleMaxClick = async () => {
    if (!userAddress) return;
    const balance = await provider!.getBalance(userAddress)
    const notAllBalance = balance * 95n / 100n
    const formattedBalance = ethers.formatEther(notAllBalance)
    setMintAmount(formattedBalance);
  }

  const isFormValid = mintAmount && parseFloat(mintAmount) > 0

  return (
    <div className={`${styles["mint-form"]} form`}>
      <div className={`${styles["title"]} form-title`}>Mint grETH</div>
      <div className={`${styles["description"]}`}>Exchange native token to grETH by rate 1 ETH per 1 grETH</div>
      <FormGroup label="grETH To Mint">
        <div className="form-input">
          <input
            value={mintAmount}
            placeholder="0"
            className="input-field"
            onChange={(e) => setMintAmount(e.target.value)}
          />
          <button
            type="button"
            onClick={handleMaxClick}
            className={`${styles["max-button"]} button`}
          >
            MAX
          </button>
        </div>
      </FormGroup>
      <FormGroup className={`${changeAddress ? styles["checked"] : styles["not-checked"]}`}>
        <Checkbox defaultChecked={false} onChange={setChangeAddress}>
          {changeAddress ? 
            <div className="form-input">
              <input 
                type="text"
                placeholder="Enter recepient address"
                onChange={(e) => setReceiverAddress(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div> :
            "Another Recepient"
          }
        </Checkbox>
      </FormGroup>
      <button
        className={`${styles["mint-button"]} button`}
        disabled={!isFormValid}
        onClick={handleMint}
      >
        Mint
      </button>
    </div>
  )
}

export default Mint