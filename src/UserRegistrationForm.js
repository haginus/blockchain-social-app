import { userState } from './recoil/atoms';
import { useRecoilState } from 'recoil';
import { useState } from 'react';

const registerUser = (social, account, name, username, bio, setUser) => {
    console.log(social);
    
    social.methods.addUser(name, username, bio).send({ from: account }).on('transactionHash', (hash) => {
        console.log(hash);
    })
}

function UserRegistrationForm({social, account}) {
    const [user, setUser] = useRecoilState(userState);
    const [name, setName] = useState(undefined);
    const [username, setUsername] = useState(undefined);
    const [bio, setBio] = useState(undefined);

    return (
        <div>
            <label>Full name</label>
            <input type="text" id="name" name="name" value={name} onChange={(event) => {setName(event.target.value)}}/>
            <label>Username</label>
            <input type="text" id="username" name="username" value={username} onChange={(event) => {setUsername(event.target.value)}}/>
            <label>Bio</label>
            <input type="text" id="bio" name="bio" value={bio} onChange={(event) => {setBio(event.target.value)}}/>
            <button onClick={() => {registerUser(social, account, name, username, bio, setUser)}}>Register user</button>
        </div>
    );
  }
  
export default UserRegistrationForm;