//import Head from 'next/head'
import styles from '../styles/Page.module.css'
import { useEffect, useState, useRef} from "react";
import { ethers } from "ethers";
import useStore from './../store/useStore';
import superContract from '../utils/superContract.json';
import {contractAddress} from '../utils/shared';

export default function Predictions() {

  const signer = useStore(s => s.signer);

  const [preds, setPreds] = useState([]);
  const [minStep, setMinStep] = useState();

  const contract = useRef();
  const upRef = useRef();
  const stepRef = useRef();


  const getLogs = async (rc) => {
  //  const logs = rc.logs.map(log => contract.current.interface.parseLog(log));
    const firstLog = rc.logs[0];
    const res = contract.current.interface.parseLog(firstLog);
    return res.args;
  }

  useEffect( () => {
    if (!signer) return;

    console.log('effect');

    const init = async () => {
      
      const abi = superContract.abi;
      const address = contractAddress;
      contract.current = new ethers.Contract(address,abi,signer);
      let recsNum = await contract.current.recsNum();
      setMinStep(Number(recsNum)+2);
      await getPreds();
    }
    init();

    return () => {
      console.log('effect return');
    }
  }, [signer])


  const getPreds = async () => {
    let predsNum = await contract.current.predsNum();
    let newPreds = [];
    for (let i=0; i<predsNum; i++){
      let pred = await contract.current.preds(i);
      newPreds.push(pred);
    }
    setPreds(newPreds);
  }

  const makePred = async () => {
    const valueUp = upRef.current.value;
    const valueStep = stepRef.current.value;
   
    let tx;
    try {
      tx = await contract.current.makePred(valueStep, valueUp);
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
        <h2>Predictions</h2>

        <div>
        In n° steps :  <input type='number' min={minStep} ref={stepRef}></input><br/>
        <label>Price will go up or down ?</label>
        <select name="prediction" id="prediction" ref={upRef}>
          <option value="true">Up</option>
          <option value="false">Down</option>
        </select>

            <button onClick={makePred}>Make prediction</button>
          </div>

          <div className={styles.cardContainer}>
          { preds?.map((pred, index) => (
          <div key={index} className={styles.card}>
            <p>Step after : {Number(pred.stepAfter)}</p>
            <p>Price before: {Number(pred.priceBefore)}</p>
            <p>Price after : {Number(pred.priceAfter)}</p>
            <p>Up : {pred.up ? 'true' : 'false'}</p>
            <p>Timestamp: {Number(pred.timestamp)}</p>
            <p>Address: {pred.trader}</p>
            <p>Exact: {pred.exact ? 'true' : 'false'}</p>
            <p>Done: {pred.done ? 'true' : 'false'}</p>

          </div>
          ))}
          </div>

    </div>
  )
}
