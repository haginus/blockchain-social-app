import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import Social from './abis/Social.json'
import { useEffect, useState } from 'react';
import UserRegistrationForm from './UserRegistrationForm';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
};

const loadBlockchainData = async (setAccount, setSocial, setPhotoCount, setModal) => {
  const web3 = window.web3
  // Load account
  const accounts = await web3.eth.getAccounts();
  setAccount(accounts[0]);
  // Network ID
  const networkId = await web3.eth.net.getId()
  const networkData = Social.networks[networkId]
  if(networkData) {
    const social = new web3.eth.Contract(Social.abi, networkData.address);
    setSocial(social);
    console.log(social);
    try {
      const user = await social.methods.getCurrentUser().call();
    } catch(e) {
      setModal(true);
      return;
    }
  } else {
    window.alert('Social contract not deployed to detected network.')
  }
}

function App() {

  const [modal, setModal] = useState(false);

  const [social, setSocial] = useState(undefined);
  const [photoCount, setPhotoCount] = useState(undefined);
  const [account, setAccount] = useState(undefined);

  const [web3] = useState(undefined);
  useEffect(() => {
    async function loadDep() {
      await loadWeb3();
      await loadBlockchainData(setAccount, setSocial, setPhotoCount, setModal);
    }
    if (!web3) {
      loadDep();
    }
  }, [web3]);

  return (
    <div className="App">
      {
        modal ? <UserRegistrationForm social={social} account={account}/> : "nemodal"
      }
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
