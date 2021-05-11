import { useEffect, useState } from "react";
import { Heart } from 'react-bootstrap-icons';

import { useRecoilState } from 'recoil';
import { usersCache } from "../recoil/atoms";
import { social } from '../Social';

import './FeedPhoto.css';

function FeedPhoto({ id, hash, description, likeCount, authorId }) {

    const [canFollow, setCanFollow] = useState(false);
    const [hasLiked, setHasLiked] = useState(null);

    const [users, setUsers] = useRecoilState(usersCache);

    const [author, setAuthor] = useState({});

    useEffect(() => {
        async function getUser() {
            if(users[authorId]) {
                let userData = await Promise.resolve(users[authorId]);
                setAuthor(userData);
            } else {
                let prm = social.methods.users(authorId - 1).call();
                setUsers({ ...users, [authorId]: prm });
                let userData = await prm;
                setUsers({ ...users, [authorId]: userData });
                setAuthor(userData);
            }
        };
        getUser();
    }, [])

    return (
        <div className="feed-photo">
            <div className="photo-header">
                <div className="profile-picture">

                </div>
                <div className="username">
                    { author.username }
                </div>
                <div className="follow-button">Follow</div>
            </div>
            <div className="image-container">
                <img src="/test.jpeg"/>
            </div>
            <div className="photo-footer">
                <div className="photo-actions">
                    <div className="icon-button">
                        <Heart size={24}></Heart>
                    </div>
                </div>
                <div className="photo-description-container">
                    <div className="like-count bold">{ likeCount } likes</div>
                    <div>
                        <span className="bold">haginus</span>
                        <span className="photo-description">{ description }</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedPhoto;