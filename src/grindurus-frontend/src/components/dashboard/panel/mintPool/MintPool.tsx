import styles from './MintPool.module.scss'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { Token } from '../../../../config'
import { ERC20, ERC20__factory } from '../../../../typechain-types'
import { useAppKitAccount } from '@reown/appkit/react'
import { Select, Option, FormGroup } from '../../../ui'
import { useIsMobile } from '../../../../hooks'

function MintPool() {
  const { provider, networkConfig, poolsNFT } = useProtocolContext()
  const { address: userAddress } = useAppKitAccount()

  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [selectedStrategyId, setSelectedStrategyId] = useState<number>(1)
  const [selectedQuoteToken, setSelectedQuoteToken] = useState<string>(networkConfig.quoteTokens![1].symbol)
  const [selectedBaseToken, setSelectedBaseToken] = useState<string>(networkConfig.baseTokens![0].symbol)

  const [quoteTokenContract, setQuoteTokenContract] = useState<ERC20 | null>(null)
  const [quoteTokenAmount, setQuoteTokenAmount] = useState<string>("")
  const [quoteTokenInfo, setQuoteTokenInfo] = useState<Token | null>(null)

  const [mode, setMode] = useState<'manual' | 'grinder'>('manual')

  const [waitApproving, setWaitApproving] = useState<boolean>(false)
  const [waitMint, setWaitMint] = useState<boolean>(false)

  const isMobile = useIsMobile(1000)

  useEffect(() => {
    initQuoteToken()
  }, [networkConfig, selectedQuoteToken, provider])

  useEffect(() => {
    checkAllowance()
  }, [quoteTokenAmount])

  const initQuoteToken = async () => {
    if (!provider) return console.error("Provider not found!")

    const tokenInfo = networkConfig.quoteTokens!.find(q => q.symbol === selectedQuoteToken)
    if (!tokenInfo) return console.error("tokenInfo not found!")
    setQuoteTokenInfo(tokenInfo)

    const quoteTokenAddress = tokenInfo!.address
    const signer = await provider.getSigner()
    const contract = ERC20__factory.connect(quoteTokenAddress, signer)
    setQuoteTokenContract(contract)
  }

  const checkRequired = () => {
    if (!provider) return console.error("provider not set!")
    if (!quoteTokenContract) return console.error("quoteTokenContract is null!")
    if (!quoteTokenInfo) return console.error("quoteTokenInfo is null!")
  }

  const checkAllowance = async () => {
    try {
      checkRequired()

      const spenderAddress = networkConfig.poolsNFT!
      if (quoteTokenContract) {
        const allowanceRaw = await quoteTokenContract!.allowance(userAddress!, spenderAddress)
        const allowanceFormatted = ethers.formatUnits(allowanceRaw, quoteTokenInfo!.decimals)
  
        setIsApproved(Number(quoteTokenAmount) <= Number(allowanceFormatted))
      }
    } catch (err) {
      console.error("Error checking allowance:", err)
    }
  }

  const handleMaxDepositQuoteToken = async () => {
    try {
      checkRequired()
      setWaitApproving(true)

      const balanceRaw = await quoteTokenContract!.balanceOf(userAddress!)
      const balance = ethers.formatUnits(balanceRaw, quoteTokenInfo!.decimals)

      setQuoteTokenAmount(balance)
    } catch (err) {
      alert("Failed to fetch balance!")
      console.error("Error fetching balance: ", err)
    } finally {
      setWaitApproving(false)
    }
  }

  const handleApprove = async () => {
    try {
      checkRequired()
      setWaitApproving(true)

      const spenderAddress = networkConfig.poolsNFT
      const amount = ethers.parseUnits(quoteTokenAmount, quoteTokenInfo!.decimals)
      const tx = await quoteTokenContract!.approve(spenderAddress!, amount)
      await tx.wait()

      setIsApproved(true)
    } catch (err) {
      alert("Failed approve tokens")
      console.error("Error approving tokens", err)
    } finally {
      setWaitApproving(false)
    }
  }

  const handleMint = async () => {
    try {
      checkRequired()
      if (!poolsNFT) return console.error("poolsNFT is null!")

      setWaitMint(true)

      const strategyId = networkConfig.strategies![selectedStrategyId].id
      const baseTokenInfo = networkConfig.baseTokens!.find(b => b.symbol === selectedBaseToken)
      if (!baseTokenInfo || !quoteTokenInfo) return console.error("Tokens not set!")

      const quoteTokenAmountRaw = ethers.parseUnits(quoteTokenAmount, quoteTokenInfo.decimals)
      const tx = await poolsNFT!.mint(strategyId, baseTokenInfo.address, quoteTokenInfo.address, quoteTokenAmountRaw)
      await tx.wait()
    } catch (err) {
      alert("Error minting pool")
      console.error("Error minting pool", err)
    } finally {
      setWaitMint(false)
    }
  }

  useEffect(() => {
    if (selectedQuoteToken === selectedBaseToken) {
      const fallback = networkConfig.quoteTokens!.find(q => q.symbol !== selectedBaseToken)
      if (fallback) setSelectedQuoteToken(fallback.symbol)
    }
  }, [selectedBaseToken])

  return (
    <div className={`${styles["form"]} form`}>
      <div className={styles["header"]}>
        <h2 className={`${styles["title"]} form-title`}>Deposit</h2>
        <button className={`${styles["autofill-button"]} ${mode === 'grinder' ? styles["active"] : ''} button`}>
          {isMobile ? "Autofill" : "Autofill Fields"}
        </button>
      </div>
      <div className={styles["select-mode"]}>
        <button onClick={() => setMode('manual')} className={`${styles["mode-button"]} ${mode === 'manual' ? styles["active"] : ''}`}>
          Manual
        </button>
        <button onClick={() => setMode('grinder')} className={`${styles["mode-button"]} ${mode === 'grinder' ? styles["active"] : ''}`}>
          via AI
        </button>
      </div>
      <FormGroup label="Strategy">
        <Select onChange={(value) => setSelectedStrategyId(value as number)}>
          {networkConfig.strategies!.map((strategy, index) => (
            <Option key={index} value={index}>
              {strategy.description}
            </Option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label="Base Token">
        <Select onChange={(value) => setSelectedBaseToken(value as string)}>
          {networkConfig.baseTokens!.map((token, index) => (
            <Option key={index} value={token.symbol}>
              <img src={token.logo} alt={token.symbol} className={styles["token-icon"]} />
              {token.symbol}
            </Option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label="Quote Token">
        <Select onChange={(value) => setSelectedQuoteToken(value as string)}>
          {networkConfig.quoteTokens!
            .filter(t => t.symbol !== selectedBaseToken)
            .map((token, index) => (
              <Option key={index} value={token.symbol}>
                <img src={token.logo} alt={token.symbol} className={styles["token-icon"]} />
                {token.symbol}
              </Option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label="Quote Token Amount">
        <div className="form-input">
          <input
            value={quoteTokenAmount}
            placeholder="0"
            onChange={e => setQuoteTokenAmount(e.target.value)}
          />
          <button className="max-button button" type="button" onClick={handleMaxDepositQuoteToken}>
            MAX
          </button>
        </div>
      </FormGroup>
      <div className={styles["buttons"]}>
        {!isApproved ? (
          <button className={`${styles["approve-button"]} button`} onClick={handleApprove} disabled={waitApproving}>
            Approve
          </button>
        ) : (
          <button className={`${styles["mint-button"]} button`} onClick={handleMint} disabled={waitMint}>
            Mint
          </button>
        )}
      </div>
    </div>
  )
}

export default MintPool