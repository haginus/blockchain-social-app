import Web3 from 'web3';
import Social from './abis/Social.json';

export let social;

export const initSocial = async () => {
  await loadWeb3();
  return loadContractAndAccounts();
}

const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  } else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
};

const loadContractAndAccounts = async () => {
  const web3 = window.web3;

  const accounts = await web3.eth.getAccounts();

  const networkId = await web3.eth.net.getId()
  const networkData = Social.networks[networkId]
  if (networkData) {
    social = new web3.eth.Contract(Social.abi, networkData.address);
  } else {
    social = null;
  }
  return accounts;
}