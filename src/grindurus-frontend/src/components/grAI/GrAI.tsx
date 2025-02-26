import styles from './GrAI.module.scss'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useAppKitAccount } from '@reown/appkit/react'
import { Select, Option, FormGroup, Checkbox } from '../ui'
import { useProtocolContext } from '../../context/ProtocolContext'
import arbitrumLogo from '../../assets/images/logoArbitrum.png'
import baseLogo from '../../assets/images/logoBase.png'
import optimismLogo from '../../assets/images/logoOptimism.png'
import polygonLogo from '../../assets/images/logoPolygon.png'
import solanaLogo from '../../assets/images/logoSolana.png'

function GrAI() {
  const { grAI } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  type SupportedBridgeChains = "arbitrum" | "base" | "optimism" | "polygon" | "solana"
  const [bridgeFrom, setBridgeFrom] = useState<SupportedBridgeChains>("arbitrum")
  const [bridgeTo, setBridgeTo] = useState<SupportedBridgeChains>("base")

  const [bridgeAmount, setBridgeAmount] = useState<number>(0)
  const [receiverAddress, setReceiverAddress] = useState<string>("")
  const [changeAddress, setChangeAddress] = useState<boolean>(false)
  const [estimatedFeeAmount, setEstimatedFeeAmount] = useState<number>(0)

  const checkRequired = () => {
    if(!grAI) {
      console.error("grAI is null!")
      return false
    }
    return true
  }

  const handleBridge = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!checkRequired()) return

    try {
      if (!bridgeAmount || bridgeAmount <= 0) return console.log("bridgeAmount not set!")

      const amount = ethers.parseUnits(bridgeAmount.toString(), 18)
      const receiver = changeAddress ? receiverAddress : userAddress!

      // const tx = await grETH!.burnTo(amount, tokenInfo.address, receiver)
    } catch (error) {
      console.error("Error burning grETH: ", error)
    }
  }

  const handleMaxClick = () => {
    // TODO: Change to user grAI balance
    setBridgeAmount(100)
  }

  const isFormValid = bridgeAmount && bridgeAmount > 0

  return (
    <section>
      <div className="container">
        <div className={`${styles["bridge-form"]} form`}>
          <h2 className={`${styles["title"]} form-title`}>Bridge grAI</h2>
          <FormGroup label="Chain From">
            <Select onChange={(value) => setBridgeFrom(value as SupportedBridgeChains)}>
              <Option value="arbitrum">
                <img src={arbitrumLogo} alt="Aribitrum Logo" className={styles["chain-icon"]} />
                Arbitrum
              </Option>
              <Option value="base">
                <img src={baseLogo} alt="Base Logo" className={styles["chain-icon"]} />
                Base
              </Option>
              <Option value="optimism">
                <img src={optimismLogo} alt="Optimism Logo" className={styles["chain-icon"]} />
                Optimism
              </Option>
              <Option value="polygon">
                <img src={polygonLogo} alt="Polygon Logo" className={styles["chain-icon"]} />
                Polygon
              </Option>
              <Option value="solana">
                <img src={solanaLogo} alt="Solana Logo" className={styles["chain-icon"]} />
                Solana
              </Option>
            </Select>
          </FormGroup>
          <FormGroup label="Chain To">
            <Select onChange={(value) => setBridgeTo(value as SupportedBridgeChains)}>
              <Option value="arbitrum">
                <img src={arbitrumLogo} alt="Aribitrum Logo" className={styles["chain-icon"]} />
                Arbitrum
              </Option>
              <Option value="base">
                <img src={baseLogo} alt="Base Logo" className={styles["chain-icon"]} />
                Base
              </Option>
              <Option value="optimism">
                <img src={optimismLogo} alt="Optimism Logo" className={styles["chain-icon"]} />
                Optimism
              </Option>
              <Option value="polygon">
                <img src={polygonLogo} alt="Polygon Logo" className={styles["chain-icon"]} />
                Polygon
              </Option>
              <Option value="solana">
                <img src={solanaLogo} alt="Solana Logo" className={styles["chain-icon"]} />
                Solana
              </Option>
            </Select>
          </FormGroup>
          <FormGroup label="Bridge Amount">
            <div className="form-input">
              <input
                placeholder="0"
                onChange={(e) => setBridgeAmount(parseFloat(e.target.value))}
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
          <FormGroup>
            <Checkbox defaultChecked={false} onChange={setChangeAddress}>
              Another Recepient
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
            Estimated token amount: {estimatedFeeAmount.toString()}
          </p>
          <button
            className={`${styles["bridge-button"]} button`}
            disabled={!isFormValid}
            onClick={handleBridge}
          >
            Bridge
          </button>
        </div>
      </div>
    </section>
  )
}

export default GrAI