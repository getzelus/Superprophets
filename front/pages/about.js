import Head from 'next/head'
import styles from '../styles/Page.module.css'
import {useEffect, useState } from "react";

export default function About() {

  return (
    <div>
        <h2>About</h2>
     
     <div>
        This defi dapp allows traders to show their skills at predicting the price of blockchain assets like LINK/USD. <br/>
        They can submit their idea, if it will go up or down at a certain time. <br/>
        Every 5 minutes, there is a new step. <br/>
        They can predict in 2 steps or more. <br/>
        On the price page, we can follow the price every step and if it went up or down.<br/>
        They can also register their bio in Traders page if they want to be contacted.
     </div>
    </div>
  )
}
