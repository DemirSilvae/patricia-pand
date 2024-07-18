import styles from './GrETH.module.scss'
import Burn from './burn/Burn'
import Mint from './mint/Mint'

function GrETH() {
  return (
    <section className={styles["greth"]}>
      <div className={`${styles["container"]} container`}>
        <div className={styles["left"]}>
          <Burn/>
        </div>
        <div className={styles["right"]}>
          <Mint/>
        </div>
      </div>
    </section>
  )
}

export default GrETH