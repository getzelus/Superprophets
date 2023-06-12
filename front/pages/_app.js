import '../styles/globals.css'
import Menu from '../components/Menu';
import Wallet from '../components/Wallet';

function MyApp({ Component, pageProps }) {
  return (<>
    <Menu />
    <Wallet />
    <div className='pages-container'>
     <Component {...pageProps} />
    </div>
  </>)
 }

export default MyApp
