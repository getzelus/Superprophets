import styles from "../styles/Menu.module.css";
import Link from 'next/link'

export default function Menu() {
  return (<div className={styles.menu}>

    <Link href='/'>Home</Link>
    <Link href='/predictions'>Predictions</Link>
    <Link href='/price'>Price</Link>
    <Link href='/traders'>Traders</Link>
    <Link href='/about'>About</Link>

  </div>);
}


