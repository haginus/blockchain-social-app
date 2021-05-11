import { appState } from './recoil/atoms';
import { useRecoilState } from 'recoil';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { social } from './Social';

import './UserRegistrationForm.css';

function UserRegistrationForm() {
    const [app, setApp] = useRecoilState(appState);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    const registerUser = () => {
        setLoading(true);
        social.methods.addUser(name, username, bio).send({ from: app.selectedAccount })
        .on('receipt', (receipt) => {
            const id = parseInt(receipt.events['UserCreated'].returnValues['id']);
            setApp({ ...app, currentUser: { id, name, username, bio } });
        })
        .on('error', (err) => {
            setLoading(false);
            alert('An error occured.');
        });
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        if(form.checkValidity() === true) {
            registerUser();
        }
    };

    return (
        <div className="landing-signup">
            <h1 className="center">Welcome to Social App!</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-box">
                <h2>Sign up</h2>
                <Form.Group controlId="name">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control type="text" placeholder="John Doe" required onChange={ e => setName(e.target.value) } />
                    <Form.Control.Feedback type="invalid">
                        Please fill up your full name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="johndoe" required onChange={ e => setUsername(e.target.value) } />
                    <Form.Control.Feedback type="invalid">
                        Please fill up your username.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="bio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={ e => setBio(e.target.value) } />
                </Form.Group>
                <div className="center">
                    <Button type="submit" disabled={loading}>Sign up</Button>
                </div>
            </Form>
        </div>
    );
  }
  
export default UserRegistrationForm;