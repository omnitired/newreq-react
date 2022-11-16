import { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import LabledInput from "./components/LabledInput";
import contracts from "./contracts";

function App() {
  const web3 = new Web3(window.ethereum);

  const [userAccount, setUserAccount] = useState("");
  const [target, setTarget] = useState(
    "0x8690b9429813e95a3999eA70c760dff932572D85"
  );
  const [minutes, setMinutes] = useState(10);
  const [amount, setAmount] = useState(0.01);
  const [txHash, setTxHash] = useState('')

  const handleConnect = async () => {
    if (window.ethereum !== undefined) {
      const res = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (res && res[0]) {
        setUserAccount(res[0]);
      }
    }
  };

  useEffect(() => {
    handleConnect();
  }, []);

  const ethSender = new web3.eth.Contract(
    contracts.ethSender.abi as any,
    contracts.ethSender.address
  );
  const registery = new web3.eth.Contract(
    contracts.registery.abi as any,
    contracts.registery.address
  );

  const handleSend = async () => {
    const time = Date.now() + minutes * 60 * 1000;
    const callData = ethSender.methods
      .sendEthAtTime(time, userAccount)
      .encodeABI();
    const referer = "0x8690b9429813e95a3999eA70c760dff932572D85";
    const ethForCall = web3.utils.toWei(String(amount));

    const res = await registery.methods
      .newReq(target, referer, callData, ethForCall, false, false, false)
      .send({
        from: userAccount,
        value: web3.utils.toWei(String(amount + 0.01)),
      });
    setTxHash(res.transactionHash)
    console.log(res);
  };

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-4">
        <LabledInput
          id="target"
          label="Target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <LabledInput
          id="minutes"
          label="Minutes"
          value={minutes}
          type='number'
          onChange={(e) => setMinutes(parseInt(e.target.value))}
        />
        <LabledInput
          id="amount"
          label="Amount"
          value={amount}
          type='number'
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />

        <div className="flex justify-between">
          <button
            onClick={handleSend}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Send
          </button>

          <button
          disabled={!!userAccount}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleConnect}
          >
            {
              userAccount? 'Connected!' : 'Connect'
            }
          </button>
        </div>
        {
          txHash &&
          <span>
          success! see Transaction{" "}
          <a className="text-blue-700" target='_blank' href={`https://goerli.etherscan.io/tx/${txHash}`}>
            here
          </a>
          </span>
        }
      </div>
    </div>
  );
}

export default App;
