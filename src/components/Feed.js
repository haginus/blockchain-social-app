import { appState, photosState } from '../recoil/atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { social } from '../Social';

import { Form, Button, Alert } from 'react-bootstrap';

import FeedPhoto from './FeedPhoto';

import './Feed.css';
import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';
import Identicon from 'react-identicons';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


function Feed () {
    let buffer;
    
    const captureFile = event => {
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)

        reader.onloadend = () => {
            buffer = Buffer(reader.result);
        }
    }

    const app = useRecoilValue(appState);

    const [uploadDesc, setUploadDesc] = useState('');
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingPhotoResult, setUploadingPhotoResult] = useState(null);

    const [photos, setPhotos] = useRecoilState(photosState);

    useEffect(() => {
        social.methods.photoCount().call().then(photoCount => {
            let promises = [];
            for (let i = 0; i < photoCount; i++) {
                promises.push(social.methods.photos(i).call());
            }
            Promise.all(promises).then(photos => {
                let photoMap = {};
                photos.forEach(photo => {
                    photoMap[photo.id] = photo;
                });
                setPhotos(photoMap);
            });
        });
    }, [])

    const uploadPhoto = (event) => {
        event.preventDefault();
        setUploadingPhoto(true);
        ipfs.add(buffer, (error, result) => {
            if(error) {
                setUploadingPhotoResult('error');
                return;
            }

            social.methods.uploadPhoto(result[0].hash, uploadDesc).send({ from: app.selectedAccount })
            .on('receipt', (receipt) => {
                setUploadingPhotoResult('success');
                setUploadingPhoto(false);
                const photo = receipt.events['PhotoCreated'].returnValues;
                const id = parseInt(photo.id); 
                setPhotos({ ...photos, [id]: photo });
            })
            .on('error', (error) => {
                setUploadingPhotoResult('error');
                setUploadingPhoto(false);
            });
        })
    }
    
    return (
        <div className="Feed">
            <div className="photo-upload-container">
                <div className="profile-picture">
                    <Identicon string={app.selectedAccount } size={36}/>
                </div>
                <Form className="photo-upload-form" onSubmit={(e) => uploadPhoto(e)}>
                    <h3>Upload a photo</h3>
                    <Form.Group controlId="description">
                        <Form.Control as="textarea" rows={3} placeholder="Description..."
                        onChange={ e => setUploadDesc(e.target.value) } required />
                    </Form.Group>
                    <Form.File id="file" label="Choose a photo" required
                    onChange={e => captureFile(e)}
                    />
                    <div className="photo-upload-actions">
                        <Button type="submit">Upload</Button>
                    </div>
                </Form>
                { uploadingPhoto ? <LoadingScreen/> : '' }
            </div>
            <div className="alert-area">
                {
                uploadingPhotoResult === null ? '' :
                    uploadingPhotoResult == 'success' ? 
                    <Alert variant="success">
                        Photo was uploaded succesfully.
                    </Alert> : 
                    <Alert variant="danger">
                        There was a problem.
                    </Alert>
                }
                
            </div>
            {
                Object.keys(photos).reverse().map(id => {
                    const photo = photos[id];
                    return (
                        <FeedPhoto id={photo.id} authorId={photo.authorId} likeCount={photo.likeCount}
                            hash={photo.hash} description={photo.description} authorAddress={photo.author} key={id}
                        />
                    )
                })
            }
        </div>
    );
}

export default Feed;