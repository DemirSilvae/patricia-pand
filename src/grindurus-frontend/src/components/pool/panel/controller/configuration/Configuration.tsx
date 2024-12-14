import styles from './Configuration.module.scss'
import { useEffect, useState } from 'react'
import { useProtocolContext } from '../../../../../context/ProtocolContext'
import { Strategy__factory, Strategy } from '../../../../../typechain-types'
import { FormGroup, Select, Option } from '../../../../ui'

type ConfigurationProps = {
  poolId: number
}

const Configuration = ({ poolId }: ConfigurationProps) => {
  const { poolsNFT, signer } = useProtocolContext()

  const [pool, setPool] = useState<Strategy | null>(null)

  const [longNumberMax, setLongNumberMax] = useState<number>(4)
  const [hedgeNumberMax, setHedgeNumberMax] = useState<number>(4)
  const [extraCoef, setExtraCoef] = useState<number>(0)
  const [priceVolatilityPercent, setPriceVolatilityPercent] = useState<number>(1)
  const [selectedOpReturnPercent, setSelectedOpReturnPercent] = useState<number>(1)
  const [inputReturnPercent, setInputReturnPercent] = useState<number>(0)
  const [selectedOpFeeCoef, setSelectedOpFeeCoef] = useState<number>(1)
  const [inputFeeCoef, setInputFeeCoef] = useState<number>(0)

  useEffect(() => {
    initPool()
  }, [signer])

  const initPool = async () => {
    const poolAddress = await poolsNFT!.pools(poolId)
    const contract = Strategy__factory.connect(poolAddress, signer)
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
      const tx = await pool!.setLongNumberMax(longNumberMax)
      await tx.wait()
    } catch(err) {
      console.log("Failed to set long number max", err)
    }
  }

  const handleSetHedgeNumberMax = async () => {
    checkRequired()
    try{
      const tx = await pool!.setHedgeNumberMax(hedgeNumberMax)
      await tx.wait()
    } catch(err) {
      console.log("Failed to set hedge number max", err)
    }
  }

  const handleSetExtraCoef = async () => {
    checkRequired()
    try{
      const extraCoefRaw = Math.round(extraCoef * 100)
      const tx = await pool!.setExtraCoef(extraCoefRaw)
      await tx.wait()
    } catch(err) {
      console.log("Failed to set extra coef", err)
    }
  }

  const handleSetPriceVolatilityPercent = async () => {
    checkRequired()
    try{
      const priceVolatilityPercentRaw = Math.round(priceVolatilityPercent * 100)
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
    <div className={styles["configuration"]}>
      <FormGroup label={`Long Number Max (Current value: ${longNumberMax.toString()})`}>
        <div className="form-input">
          <input
            className="input-field"
            placeholder='Long number max example: 2'
            onChange={(e) => setLongNumberMax(Number(e.target.value))}
          />
          <button 
            className="set-button"
            onClick={() => handleSetLongNumberMax()}  
          >
            Set
          </button>
        </div>
      </FormGroup>
      <FormGroup label={`Hedge Number Max (Current value: ${hedgeNumberMax.toString()})`}>
        <div className="form-input">
          <input
            className="input-field"
            placeholder='Hedge number max example: 4'
            onChange={(e) => setHedgeNumberMax(Number(e.target.value))}
          />
          <button 
            className="set-button"
            onClick={() => handleSetHedgeNumberMax()}  
          >
            Set
          </button>
        </div>
      </FormGroup>
      <FormGroup label={`Extra Coefficient (Current value: ${extraCoef.toString()})`}>
        <div className="form-input">
          <input
            placeholder='Extra coef example: 2.00'
            onChange={(e) => setExtraCoef(parseFloat(e.target.value))}
          />
          <button
            onClick={() => handleSetExtraCoef()}
          >
            Set
          </button>
        </div>
      </FormGroup>
      <FormGroup label={`Price Volatility Percent (Current value: ${priceVolatilityPercent.toString()})`}>
        <div className="form-input">
          <input
            className="input-field"
            placeholder='Price volatility percent example: 1.4%'
            onChange={(e) => setPriceVolatilityPercent(parseFloat(e.target.value))}
          />
          <button 
            className="set-button"
            onClick={() => handleSetPriceVolatilityPercent()}
          >
            Set
          </button>
        </div>
      </FormGroup>
      <FormGroup label="Operation & Return Percent">
        <Select onChange={(value) => setSelectedOpReturnPercent(value as number)}>
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
        <div className="form-input">
          <input
            placeholder='Return percent example: 1.0'
            onChange={(e) => setInputReturnPercent(parseFloat(e.target.value))}
          />
          <button
            onClick={() => handleSetReturnPercent()}  
          >
            Set
          </button>
        </div>
      </FormGroup>
      <FormGroup label="Operation & Fee Coefficient">
        <Select onChange={(value) => setSelectedOpFeeCoef(value as number)}>
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
        <div className="form-input">
          <input
            placeholder='Fee coef example: 1.0'
            onChange={(e) => setInputFeeCoef(parseFloat(e.target.value))}
          />
          <button
            onClick={() => handleSetFeeCoef()}
          >
            Set
          </button>
        </div>
      </FormGroup>
    </div>
  )
}

export default Configuration