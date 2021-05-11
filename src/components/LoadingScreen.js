import { Spinner } from 'react-bootstrap'

function LoadingScreen() {
    return (
        <div className="fullscreen abs top-left center-hv" style={{background: 'rgba(255, 255, 255, 0.3)'}}>
            <Spinner animation="grow" variant="success"/>
        </div>
    )
}

export default LoadingScreen;