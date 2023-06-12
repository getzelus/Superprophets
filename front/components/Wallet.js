import styles from "../styles/Wallet.module.css";
import { useEffect} from "react";
import useStore from './../store/useStore';
import { ethers } from "ethers";

export default function Wallet() {

 // const provider = useStore((s) => s.provider);
  const setProvider = useStore((s) => s.setProvider);

  const signer = useStore((s) => s.signer);
  const setSigner = useStore((s) => s.setSigner);

  useEffect(() => {
    console.log('wallet');
    connect();
  }, [])

  const connect = async () => {
    try {
      //&& window.ethereum.isMetaMask
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = await new ethers.BrowserProvider(window.ethereum);
        if (newProvider){
          const { chainId } = await newProvider.getNetwork();
          if (chainId != 80001) { 
            alert('Switch to Polygon Mumbai network');
            setSigner(null);
            return;
          }
          setProvider(newProvider);
          const newSigner = await newProvider.getSigner();
          setSigner(newSigner);
        }
      
      } else {
        console.log('MetaMask not installed; using read-only defaults');
       // const provider = ethers.getDefaultProvider();
        // Do something with the provider object
      }
    } catch (error) {
      console.error(error);
    }
  }


  return (<div className={styles.container}>

    <p>
        Wallet : {signer?.address}  <br/>
        <i>Polygon Mumbai</i>
    </p>
    <button onClick={() => connect()}>connect</button>

  </div>);
}


