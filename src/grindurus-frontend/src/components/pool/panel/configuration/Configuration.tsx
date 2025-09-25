import styles from './Configuration.module.scss'
import { useEffect, useState } from 'react'
import { Strategy__factory, Strategy } from '../../../../typechain-types'
import { FormGroup, Select, Option } from '../../../ui'
import { useProtocolContext } from '../../../../context/ProtocolContext'
import { IPoolsNFTLens } from '../../../../typechain-types/PoolsNFT'

type ConfigurationProps = {
  poolId: number
}

const Configuration = ({ poolId }: ConfigurationProps) => {
  const { poolsNFT, signer } = useProtocolContext()

  const [pool, setPool] = useState<Strategy | null>(null)

  const [longNumberMax, setLongNumberMax] = useState<number>(3)
  const [inputLongNumberMax, setInputLongNumberMax] = useState<number>(3)
  const [hedgeNumberMax, setHedgeNumberMax] = useState<number>(3)
  const [inputHedgeNumberMax, setInputHedgeNumberMax] = useState<number>(3)
  const [extraCoef, setExtraCoef] = useState<string>("2.00")
  const [inputExtraCoef, setInputExtraCoef] = useState<string>("2.00")
  const [priceVolatilityPercent, setPriceVolatilityPercent] = useState<string>("1.00")
  const [inputPriceVolatilityPercent, setInputPriceVolatilityPercent] = useState<string>("1.00")
  const [selectedOpReturnPercent, setSelectedOpReturnPercent] = useState<number>(1)
  const [inputReturnPercent, setInputReturnPercent] = useState<number>(0)
  const [longSellReturnPercent, setLongSellReturnPercent] = useState<string>("100.5")
  const [hedgeSellReturnPercent, setHedgeSellReturnPercent] = useState<string>("100.5")
  const [hedgeRebuyReturnPercent, setHedgeRebuyReturnPercent] = useState<string>("100.5")
  const [selectedOpFeeCoef, setSelectedOpFeeCoef] = useState<number>(1)
  const [inputFeeCoef, setInputFeeCoef] = useState<number>(0)
  const [longSellFeeCoef, setLongSellFeeCoef] = useState<string>("100.5")
  const [hedgeSellFeeCoef, setHedgeSellFeeCoef] = useState<string>("100.5")
  const [hedgeRebuyFeeCoef, setHedgeRebuyFeeCoef] = useState<string>("100.5")

  useEffect(() => {
    initPool()
  }, [signer, poolsNFT, poolId])

  const initPool = async () => {
    const poolAddress = await poolsNFT!.pools(poolId)
    const contract = Strategy__factory.connect(poolAddress, signer)
    const poolsNFTInfos: IPoolsNFTLens.PoolNFTInfoStructOutput[] = await poolsNFT!.getPoolNFTInfosBy([poolId])
    const config = poolsNFTInfos[0].config
    setLongNumberMax(Number(config.longNumberMax))
    setHedgeNumberMax(Number(config.hedgeNumberMax))
    setExtraCoef((Number(config.extraCoef) / 100).toFixed(2))
    setPriceVolatilityPercent((Number(config.priceVolatilityPercent) / 100).toFixed(2))
    setLongSellReturnPercent((Number(config.returnPercentLongSell) / 100).toFixed(2))
    setHedgeSellReturnPercent((Number(config.returnPercentHedgeSell) / 100).toFixed(2))
    setHedgeRebuyReturnPercent((Number(config.returnPercentHedgeRebuy) / 100).toFixed(2))
    const feeConfig = poolsNFTInfos[0].feeConfig
    setLongSellFeeCoef(((Number(feeConfig.longSellFeeCoef)) / 100).toFixed(2))
    setHedgeSellFeeCoef(((Number(feeConfig.hedgeSellFeeCoef)) / 100).toFixed(2))
    setHedgeRebuyFeeCoef(((Number(feeConfig.hedgeRebuyFeeCoef)) / 100).toFixed(2))
    setPool(contract)
  }

  const checkRequired = () => {
    if(!pool) {
      return console.error("pool not set!")
    }
  }

  const handleSetLongNumberMax = async () => {
    checkRequired()
    try{
      const tx = await pool!.setLongNumberMax(inputLongNumberMax)
      await tx.wait()
    } catch(err) {
      console.log("Failed to set long number max", err)
    }
  }

  const handleSetHedgeNumberMax = async () => {
    checkRequired()
    try{
      const tx = await pool!.setHedgeNumberMax(inputHedgeNumberMax)
      await tx.wait()
    } catch(err) {
      console.log("Failed to set hedge number max", err)
    }
  }

  const handleSetExtraCoef = async () => {
    checkRequired()
    try{
      const extraCoefRaw = Math.round(parseFloat(inputExtraCoef) * 100)
      const tx = await pool!.setExtraCoef(extraCoefRaw)
      await tx.wait()
    } catch(err) {
      console.log("Failed to set extra coef", err)
    }
  }

  const handleSetPriceVolatilityPercent = async () => {
    checkRequired()
    try{
      const priceVolatilityPercentRaw = Math.round(parseFloat(inputPriceVolatilityPercent) * 100)
      const tx = await pool!.setPriceVolatilityPercent(priceVolatilityPercentRaw)
      await tx.wait()
    } catch(err) {
      console.log("Failed to set long number max", err)
    }
  }

  const handleSetReturnPercent = async () => {
    checkRequired()
    try{
      let op = selectedOpReturnPercent
      let returnPercent = inputReturnPercent * 100
      console.log(op)
      console.log(returnPercent)
      const tx = await pool!.setOpReturnPercent(op, returnPercent)
      await tx.wait()
    } catch(err) {
      console.error("failed to set return percent", err)
    }
  }

  const handleSetFeeCoef = async () => {
    checkRequired()
    try{
      let op = selectedOpFeeCoef
      let feeCoef = inputFeeCoef * 100
      const tx = await pool!.setOpFeeCoef(op, feeCoef)
      await tx.wait()
    } catch(err) {
      console.log("failed to set fee coef", err)
    }
  }

  return (
    <div className={`${styles["configuration"]} form`}>
      <h2 className={styles["title"]}>Configuration</h2>
      <div className={styles["content"]}>
        <div className={styles["row"]}>
          <FormGroup label={`Long Number Max (Current value: ${longNumberMax.toString()})`} className={styles["form-group"]}>
            <div className="form-input">
              <input
                className="input-field"
                placeholder='Long number max example: 2'
                onChange={(e) => setInputLongNumberMax(Number(e.target.value))}
              />
              <button
                className={`${styles["button"]} button`}
                onClick={() => handleSetLongNumberMax()}  
              >
                Set
              </button>
            </div>
          </FormGroup>
          <FormGroup label={`Hedge Number Max (Current value: ${hedgeNumberMax.toString()})`} className={styles["form-group"]}>
            <div className="form-input">
              <input
                className="input-field"
                placeholder='Hedge number max example: 4'
                onChange={(e) => setInputHedgeNumberMax(Number(e.target.value))}
              />
              <button 
                className={`${styles["button"]} button`}
                onClick={() => handleSetHedgeNumberMax()}  
              >
                Set
              </button>
            </div>
          </FormGroup>
        </div>
        <div className={styles["row"]}>
          <FormGroup label={`Extra Coefficient (Current value: ${extraCoef.toString()})`} className={styles["form-group"]}>
            <div className="form-input">
              <input
                placeholder='Extra coef example: 2.00'
                onChange={(e) => setInputExtraCoef(e.target.value)}
              />
              <button
                className={`${styles["button"]} button`}
                onClick={() => handleSetExtraCoef()}
              >
                Set
              </button>
            </div>
          </FormGroup>
          <FormGroup label={`Price Volatility Percent (Current value: ${priceVolatilityPercent.toString()})`} className={styles["form-group"]}>
            <div className="form-input">
              <input
                className="input-field"
                placeholder='Price volatility percent example: 1.4%'
                onChange={(e) => setInputPriceVolatilityPercent(e.target.value)}
              />
              <button 
                className={`${styles["button"]} button`}
                onClick={() => handleSetPriceVolatilityPercent()}
              >
                Set
              </button>
            </div>
          </FormGroup>
        </div>
        <div className={styles["row"]}>
          <FormGroup label={`Operation & Return Percent (Current value: ${
            selectedOpReturnPercent === 1 ? longSellReturnPercent :
            selectedOpReturnPercent === 2 ? hedgeSellReturnPercent :
            selectedOpReturnPercent === 3 ? hedgeRebuyReturnPercent : ""
            }%)`} className={styles["form-group"]}>
            <div className={styles["operation-row"]}>
              <Select onChange={(value) => setSelectedOpReturnPercent(value as number)} className={styles["select"]}>
              <Option value={1}>
                Long sell
              </Option>
              <Option value={2}>
                Hedge sell
              </Option>
              <Option value={3}>
                Hedge buy
              </Option>
              </Select>
              <div className={`${styles["form-input"]} form-input`}>
              <input
                placeholder='Return percent example: 1.0'
                onChange={(e) => setInputReturnPercent(parseFloat(e.target.value))}
              />
              <button
                className={`${styles["button"]} button`}
                onClick={() => handleSetReturnPercent()}  
              >
                Set
              </button>
              </div>
            </div>
            </FormGroup>
          <FormGroup label={`Operation & Fee Coef (Current value: x${
            selectedOpFeeCoef === 1 ? longSellFeeCoef :
            selectedOpFeeCoef === 2 ? hedgeSellFeeCoef :
            selectedOpFeeCoef === 3 ? hedgeRebuyFeeCoef : ""
            })`} className={styles["form-group"]}>
            <div className={styles["operation-row"]}>
              <Select onChange={(value) => setSelectedOpFeeCoef(value as number)} className={styles["select"]}>
                <Option value={1}>
                  Long sell
                </Option>
                <Option value={2}>
                  Hedge sell
                </Option>
                <Option value={3}>
                  Hedge buy
                </Option>
              </Select>
              <div className={`${styles["form-input"]} form-input`}>
                <input
                  placeholder='Fee coef example: 1.0'
                  onChange={(e) => setInputFeeCoef(parseFloat(e.target.value))}
                />
                <button
                  className={`${styles["button"]} button`}
                  onClick={() => handleSetFeeCoef()}
                >
                  Set
                </button>
              </div>
            </div>
          </FormGroup>
        </div>
      </div>
    </div>
  )
}

export default Configuration