import styles from './ConnectWallet.module.scss';
import ConnectButton from './ConnectButton';

export default function ConnectWallet() {
  return (
    <div className={styles['connect-wallet']}>
      <div className={styles['container']}>
        <div className={styles['content']}>
          <h1 className={styles['title']}>
            Connect Wallet to Explore GrindURUS
          </h1>
          <div className={styles['text']}>
            <p>To get started, connect your wallet and dive into the experience.</p>
          </div>
          <ConnectButton />
        </div>
      </div>
    </div>
  )
}