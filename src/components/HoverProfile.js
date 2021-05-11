import Identicon from "react-identicons";
import './HoverProfile.css';
function HoverProfile({ id, fullName, username, bio, _address, followerCount, followingCount, postCount }) {
    return (
        <div className="HoverProfile">
            <div className="header">
                <div className="profile-picture">
                    <Identicon string={_address} size={48}/>
                </div>
                <div className="user-info">
                    <div className="username bold">{ username }</div>
                    <div className="user-full-name">{ fullName }</div>
                    <div className="bio">{ bio }</div>
                </div>
            </div>
            <div className="stats">
                <div className="stat">
                    <div className="stat-line">{ postCount }</div>
                    <div className="stat-line second">posts</div>
                </div>
                <div className="stat">
                    <div className="stat-line">{ followerCount }</div>
                    <div className="stat-line second">followers</div>
                </div>
                <div className="stat">
                    <div className="stat-line">{ followingCount }</div>
                    <div className="stat-line second">following</div>
                </div>
            </div>
        </div>
    )
}

export default HoverProfile;