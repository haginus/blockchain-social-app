import './App.css';


import { social, initSocial } from './Social';
import { useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Feed from './components/Feed';
import UserRegistrationForm from './components/UserRegistrationForm';
import { appState } from './recoil/atoms';
import { useRecoilState } from 'recoil';
import { parseObject } from './util';

function App() {

  const [app, setApp] = useRecoilState(appState);

  /** Bootstraping the app */
  useEffect(() => {
    initSocial().then(async (accounts) => {
      let currentUser;
      try {
        currentUser = parseObject(await social.methods.getCurrentUser().call({ from: accounts[0] }));
      } catch(e) {
        currentUser = null;
      }
      setApp({ accounts, selectedAccount: accounts[0], isInitializing: false, currentUser });
    });
  }, []);
  

  return (
    <div className="App">
      { app.isInitializing ? 
        <LoadingScreen/> : 
          (app.currentUser ? <Feed/> : <UserRegistrationForm/>) }
         
    </div>
  );
}

export default App;
