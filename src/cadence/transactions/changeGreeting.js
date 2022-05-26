export const changeGreeting = 
`
import HelloWorld from 0xfc3432b757958af5

transaction(newGreeting: String) {

  prepare(acct: AuthAccount) {}

  execute {
    HelloWorld.changeGreeting(newGreeting: newGreeting);
    log("changed greeting!");
  }
}

`