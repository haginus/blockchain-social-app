

function Feed ({ipfs, social, account, setLoading, photos}) {
    let imageDescription;
    let buffer;

    const captureFile = event => {
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)

        reader.onloadend = () => {
            buffer = Buffer(reader.result);
            console.log('buffer', buffer);
        }
    }

    const uploadImage = description => {
        console.log("Submitting file to ipfs...")
        ipfs.add(buffer, (error, result) => {
            console.log('Ipfs result', result)
            if(error) {
                console.error(error)
                return;
            }

            setLoading(true);
            social.methods.uploadPhoto(result[0].hash, description).send({ from: account }).on('transactionHash', (hash) => {
                console.log(hash);
                setLoading(false);
            });
        })
    }
    
    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="content mr-auto ml-auto">
                    <p>&nbsp;</p>
                    <h2>Share Image</h2>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        const description = imageDescription.value;
                        uploadImage(description);
                    }} >
                        <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile} />
                        <div className="form-group mr-sm-2">
                        <br></br>
                            <input
                            id="imageDescription"
                            type="text"
                            ref={(input) => { imageDescription = input }}
                            className="form-control"
                            placeholder="Image description..."
                            required />
                        </div>
                        <button type="submit" class="btn btn-primary btn-block btn-lg">Upload!</button>
                    </form>

                    { 
                        photos.map(photo => {
                            console.log(photo.hash);
                            return(
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <small className="text-muted">{photo.author}</small>
                                    </div>
                                    <ul id="imageList" className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <p class="text-center"><img src={`https://ipfs.infura.io/ipfs/${photo.hash}`}/></p>
                                            <p>{photo.description}</p>
                                        </li>
                                    </ul>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default Feed;