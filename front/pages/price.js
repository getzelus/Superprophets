//import Head from 'next/head'
import styles from '../styles/Page.module.css'
import { useEffect, useState, useRef} from "react";
import { ethers } from "ethers";
import useStore from './../store/useStore';
import superContract from '../utils/superContract.json';
import {contractAddress} from '../utils/shared';

export default function Price() {

  const signer = useStore(s => s.signer);
  const [price, setPrice] = useState(null);
  const [recs, setRecs] = useState([]);
  const contract = useRef();

  useEffect( () => {
    if (!signer) return;

    const init = async () => {
      const abi = superContract.abi;
      const address = contractAddress;
      contract.current = new ethers.Contract(address,abi,signer);
      getPrice();
      getRecs();
    }
    init();

    return () => {
    }
  }, [signer])

  const getLogs = async (rc) => {
    //  const logs = rc.logs.map(log => contract.current.interface.parseLog(log));
      const firstLog = rc.logs[0];
      const res = contract.current.interface.parseLog(firstLog);
      return res.args;
    }


  const getPrice = async () => {
    let newPrice = await contract.current.getLatestData();
    newPrice = Number(newPrice);
    newPrice /= 100000000;
    console.log(newPrice);
    setPrice(newPrice);
  }

  const getRecs = async () => {
    let recsNum = await contract.current.recsNum();
    let newRecs = [];
    for (let i=0; i<recsNum; i++){
      let newRec = await contract.current.recs(i);
      newRecs.push(newRec);
    }
    setRecs(newRecs);
  }

  if (!signer){
    return 'Connect first';
  }

  return (
    <div>
        <h2>Prices</h2>
  
        <div>
          <p>LINK/USD : {price} $</p>
         <p><button onClick={getPrice}>Get price</button> </p>
        </div>

        <div className={styles.cardContainer}>
        { recs?.map((rec, index) => (
        <div key={index} className={styles.card}>
          <p>Step: {Number(rec.step)}</p>
          <p>Price: {Number(rec.price)}</p>
          <p>Up: {rec.up ? 'true' : 'false'}</p>
          <p>Timestamp: {Number(rec.timestamp)}</p>
        </div>
        ))}
        </div>


    </div>
  )
}
