import { useEffect, useState } from 'react'
import Web3 from 'web3'
import './App.css'
import contracts from './contracts'

function App() {

  const web3 = new Web3(window.ethereum)

  const [userAccount , setUserAccount] = useState('')
  const [target, setTarget] = useState('0x8690b9429813e95a3999eA70c760dff932572D85')
  const [minutes, setMinutes] = useState(10)
  const [amount, setAmount] = useState(0.01)

  const handleConnect = async () => {
    if (window.ethereum !== undefined) {
      const res = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setUserAccount(res[0])
    }
  }

  useEffect(() => {
    handleConnect()
  }, [])
  
  const ethSender = new web3.eth.Contract(contracts.ethSender.abi as any, contracts.ethSender.address)
  const registery = new web3.eth.Contract(contracts.registery.abi as any, contracts.registery.address)

  const handleSend = async () => {
    const time = Date.now() + (minutes * 60 * 1000)
    const callData = ethSender.methods.sendEthAtTime(time, userAccount).encodeABI()
    const referer = '0x8690b9429813e95a3999eA70c760dff932572D85'
    const ethForCall = web3.utils.toWei(String(amount))

    const res = await registery.methods.newReq(target, referer, callData, ethForCall,false, false, false)
    .send({from: userAccount, value: web3.utils.toWei(String(amount + 0.01))})
    console.log(res)
  }

  return (
    <div className="App">
      <span>target</span>
      <input value={target} onChange={e => setTarget(e.target.value)}/>

      <span>minutes</span>
      <input value={minutes} onChange={e => setMinutes(parseInt(e.target.value))}/>
     
      <span>amount</span>
      <input value={amount} onChange={e => setAmount(parseInt(e.target.value))}/>


     <button onClick={handleSend}> Send</button>
     <button onClick={handleConnect}> Connect</button>

    </div>
  )
}

export default App
