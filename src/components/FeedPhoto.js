import { useEffect, useState } from "react";
import { Heart, HeartFill } from 'react-bootstrap-icons';

import { useRecoilState, useRecoilValue } from 'recoil';
import { appState, usersCache } from "../recoil/atoms";
import { social } from '../Social';

import './FeedPhoto.css';

import Identicon from 'react-identicons';

function FeedPhoto({ id, hash, description, likeCount, authorId, authorAddress }) {

    const [canFollow, setCanFollow] = useState(false);
    const [hasLiked, setHasLiked] = useState(null);

    const [users, setUsers] = useRecoilState(usersCache);

    const [author, setAuthor] = useState({});

    const [likeCountS, setLikeCount] = useState(likeCount);

    const [app, setApp] = useRecoilState(appState);

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

            if(app.currentUser.id === authorId) {
                setCanFollow(false);
            } else {
                // check if user has followed author (needs contract changes)
                setCanFollow(true);
            }

            setHasLiked(await social.methods.photoLikedBy(id, app.selectedAccount).call());
        };
        getUser();
    }, [])

    const likePhoto = () => {
        if(hasLiked) {
            return;
        }
        social.methods.likePhoto(id).send({ from: app.selectedAccount }).on('transactionHash', (hash) => {
            setLikeCount(+likeCount + 1);
            setHasLiked(true);

        }).on('error', e => {
            
        });
    }

    const followAuthor = () => {
        social.methods.followUser(authorAddress).send({ from: app.selectedAccount })
        .on('transactionHash', (hash) => {
            setCanFollow(false);
            let newApp = { ...app };
            newApp.currentUser.followingCount = +newApp.currentUser.followingCount + 1;
            setApp(newApp);
            setAuthor({ ...author, followerCount: +author.followerCount + 1 });
            setUsers({ ...users, [authorId]: author });
        }).on('error', e => {
            
        });
    };

    return (
        <div className="feed-photo">
            <div className="photo-header">
                <div className="profile-picture">
                    <Identicon string={authorAddress} size={36}/>
                </div>
                <div className="username">
                    { author.username }
                </div>
                { canFollow ? 
                    <div className="follow-button" onClick={() => followAuthor()}>Follow</div>
                    : '' 
                }
            </div>
            <div className="image-container">
                <img src={`https://ipfs.infura.io/ipfs/${hash}`}/>
            </div>
            <div className="photo-footer">
                <div className="photo-actions">
                    <div className="icon-button" onClick={() => likePhoto()}>
                        { hasLiked ? <HeartFill size={24}></HeartFill> : <Heart size={24}></Heart>}
                    </div>
                </div>
                <div className="photo-description-container">
                    <div className="like-count bold">{ likeCountS } likes</div>
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