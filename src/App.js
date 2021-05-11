import './App.css';


import { social, initSocial } from './Social';
import { useEffect, useState } from 'react';
import UserRegistrationForm from './UserRegistrationForm';
import Feed from './Feed';

import { appState } from './recoil/atoms';
import { useRecoilState } from 'recoil';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values


    //setApp({ accounts, selectedAccount, isLoadingUser: false, currentUser, socialContract: {...social } });

    // const photoCount = await social.methods.photoCount().call();
    // const promises = [];
    // for (let i = 0; i < photoCount; i++) {
    //   promises.push(social.methods.photos(i).call());
    // }
    // Promise.all(promises)
    //   .then(photos => {
    //     setPhotos(photos);
    //     photos.forEach(photo => console.log(photo));
    //     setLoading(false);
    //   });

function App() {

  const [app, setApp] = useRecoilState(appState);

  /** Bootstraping the app */
  useEffect(() => {
    initSocial().then(async (accounts) => {
      let currentUser;
      try {
        currentUser = await social.methods.getCurrentUser().call();
      } catch(e) {
        currentUser = null;
      }
      setApp({ accounts, selectedAccount: accounts[0], isInitializing: false, currentUser });
    });
  }, []);
  

  return (
    <div className="App">
      { app.isInitializing ? 
        "Loading..." : 
          (app.currentUser ? 'logged in' : <UserRegistrationForm/>) }
         
    </div>
  );
}

export default App;
