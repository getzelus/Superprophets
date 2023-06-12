//import Head from 'next/head'
import styles from '../styles/Page.module.css'
import { useEffect, useState, useRef} from "react";
import { ethers } from "ethers";
import useStore from './../store/useStore';
import superContract from '../utils/superContract.json';
import {contractAddress} from '../utils/shared';

export default function Traders() {
  const signer = useStore(s => s.signer);
  const [traders, setTraders] = useState([]);
  const contract = useRef();

  const bioRef = useRef();

  useEffect( () => {
    if (!signer) return

    const init = async () => {
      const abi = superContract.abi;
      const address = contractAddress;
      contract.current = new ethers.Contract(address,abi,signer);
      await getTraders();
    }
    init();

    return () => {

    }
  }, [signer])


  const getTraders = async () => {
    let tradersNum = await contract.current.tradersNum();
    let newTraders = [];
    for (let i=0; i<tradersNum; i++){
      let trader = await contract.current.traders(i);
      newTraders.push(trader);
    }
    setTraders(newTraders);

  }

  const createProfile = async () => {
    const value = bioRef.current.value;
  
    let tx;
    try {
      tx = await contract.current.createProfile('', value);
    }catch(e){
      console.log(e);
    }

    if (tx){
       const rc = await tx.wait();
       console.log(rc);
    }
  }


  if (!signer){
    return 'Connect first';
  }

  return (
    <div>
        <h2>Super</h2>

          <div>
        <input type='text' placeholder='bio' ref={bioRef} />
            <button onClick={createProfile}>Create or change profile</button>
        </div>

          <div>
          { traders?.map((trader, index) => (
            <div key={index}>
                <p>Address : {trader.ad}</p>
                <p>Bio: {trader.bio}</p>
            </div>
          ))}
          </div>

    </div>
  )
}
