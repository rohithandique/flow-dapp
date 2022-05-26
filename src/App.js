import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";

import { getGreeting } from "./cadence/scripts/getGreeting";
import { changeGreeting } from "./cadence/transactions/changeGreeting"

fcl.config()
  .put("flow.network", "testnet")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {

  const [ user, setUser ] = useState();

  const getTheGreeting = async() => {
    try {
      /*
      const result = await fcl.query({
        cadence: `${getGreeting}`
      })
      */
      const result = await fcl.send([
        fcl.script(getGreeting)
      ]).then(fcl.decode);
      console.log(result)
    } catch(err) {
      console.log(err)
    }
  }

  const changeTheGreeting = async() => {
    try {
      
      const transactionId = await fcl.send([
        fcl.transaction(changeGreeting),
        fcl.args([
          fcl.arg("Goodbye", types.String)
        ]),
        fcl.payer(fcl.currentUser),
        fcl.proposer(fcl.currentUser),
        fcl.authorizations([fcl.currentUser]),
        fcl.limit(9999)
      ]).then(fcl.decode)
      
      /*const transactionId = await fcl.mutate({
        cadence: `${changeGreeting}`,
        args: (arg, t) => [arg("HelloRohit", t.String)],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 50
      })
  
      const transaction = await fcl.tx(transactionId).onceSealed()
      console.log(transactionId)
      console.log(transaction) // The transactions status and events after being sealed*/
      fcl.tx(transactionId).subscribe(res=>{
        console.log(res)
      })

    } catch(err) {
      console.log(err)
    }
    
  }

  const logIn = async() => {
    fcl.authenticate();
    fcl.currentUser().subscribe(setUser);
  }
  console.log(user)
  return (
    <div className="App">
      Hello
      <div>
        { user && user.addr ? user.addr : ""}
      </div>
      <button onClick={()=>getTheGreeting()}>
        Get Greeting
      </button>
      <button onClick={()=>changeTheGreeting()}>
        Change Greeting
      </button>
      <button onClick={()=>logIn()}>
        Log In
      </button>
      <button onClick={()=>fcl.unauthenticate()}>
        Log Out
      </button>
    </div>
  );
}

export default App;
