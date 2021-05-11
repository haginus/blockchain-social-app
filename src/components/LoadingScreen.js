import { Spinner } from 'react-bootstrap'

function LoadingScreen() {
    return (
        <div className="fullscreen center-hv">
            <Spinner animation="grow" variant="success"/>
        </div>
    )
}

export default LoadingScreen;