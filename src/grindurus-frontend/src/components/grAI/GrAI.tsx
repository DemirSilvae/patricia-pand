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

  // https://docs.layerzero.network/v2/deployments/deployed-contracts
  const endpointIds = {
    "arbitrum": 30110,
    "base": 30184,
    "optimism": 30111,
    "polygon": 30109,
    "solana": 30168
  }

  type SupportedBridgeChains = "arbitrum" | "base" | "optimism" | "polygon" | "solana"
  const [bridgeFrom, setBridgeFrom] = useState<SupportedBridgeChains>("arbitrum")
  const [bridgeTo, setBridgeTo] = useState<SupportedBridgeChains>("base")

  const [bridgeAmount, setBridgeAmount] = useState<number>(0)
  const [inputBridgeAmount, setInputBridgeAmount] = useState<string>("")
  const [receiverAddress, setReceiverAddress] = useState<string>("")
  const [changeAddress, setChangeAddress] = useState<boolean>(false)
  const [fee, setFee] = useState<string>("0")

  const checkRequired = () => {
    if(!grAI) {
      console.error("grAI is null!")
      return false
    }
    return true
  }

  useEffect(() => {
    handleFee()
  }, [bridgeFrom, bridgeTo, inputBridgeAmount, receiverAddress])

  const handleFee = async () => {
    try {
      const grAIdecimals = 18 
      const receiver = changeAddress ? receiverAddress : userAddress!
      const dstChain = endpointIds[bridgeTo];
      const toAddress = await grAI!.addressToBytes32(receiver)
      const amount = ethers.parseUnits(bridgeAmount.toString(), grAIdecimals)
      const [ nativeFee, nativeBridgeFee, totalNativeFee ] = await grAI!.getTotalFeesForBridgeTo(dstChain, toAddress, amount)
      const feeFromatted = ethers.formatUnits(totalNativeFee, 18)
      setFee(feeFromatted)
    } catch (error) {
      console.error("Error burning grAI: ", error)
      return 0
    }
  }

  const handleBridge = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!checkRequired()) return

    try {
      const grAIdecimals = 18 
      const receiver = changeAddress ? receiverAddress : userAddress!
      const dstChain = endpointIds[bridgeTo];
      const toAddress = await grAI!.addressToBytes32(receiver)
      const amount = ethers.parseUnits(bridgeAmount.toString(), grAIdecimals)
      console.log(toAddress)
      const [ nativeFee, nativeBridgeFee, totalNativeFee ] = await grAI!.getTotalFeesForBridgeTo(dstChain, toAddress, amount)
      const tx = await grAI!.bridgeTo(dstChain, toAddress, amount, {value: totalNativeFee})
      await tx.wait()
    } catch (error) {
      console.error("Error burning grAI: ", error)
    }
  }

  const handleMaxClick = async () => {
    const grAIbalance = await grAI?.balanceOf(userAddress as string)
    setBridgeAmount(Number(grAIbalance))
    const grAIbalanceFormatted = ethers.formatUnits(grAIbalance as BigNumberish, 18)
    setInputBridgeAmount(grAIbalanceFormatted)
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
                value={inputBridgeAmount}
                onChange={(e) => {  
                  setInputBridgeAmount(e.target.value)
                  const amount = ethers.parseUnits(e.target.value, 18)
                  setBridgeAmount(Number(amount))
                }}
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
            Fee: {fee.toString()}
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