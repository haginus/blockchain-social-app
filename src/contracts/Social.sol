// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Social {
    address public owner;

    // Users
    struct UserInfo {
        address _address;
        uint256 id;
        string fullName;
        string username;
        string bio;
        uint256 followingCount;
        uint256 followerCount;
        uint256 postCount;
    }

    UserInfo[] public users;
    uint256 public userCount;
    mapping(address => uint256) public userAddressMap;
    mapping(string => uint256) public usernameMap;

    mapping(address => uint256[]) public userFollowing;
    mapping(address => uint256[]) public userFollowers;

    event UserCreated(uint256 id, string fullName, string username, string bio);
    event UserEdited(uint256 id, string fullName, string username, string bio);
    event UserFollowed(address userAddress, address by);

    // Photos
    struct Photo {
        uint256 id;
        string hash;
        string description;
        uint256 likeCount;
        uint256 authorId;
        address author;
    }

    Photo[] public photos;
    uint256 public photoCount;
    mapping(address => uint256[]) public userPhotos;
    mapping(uint256 => mapping(address => bool)) public photoLikedBy;
    mapping(uint256 => uint256[]) public photoLikes;

    event PhotoCreated(uint256 id, string hash, string description, uint256 likeCount, uint256 authorId, address author);
    event PhotoLiked(uint256 id, address by, uint256 likeCount);

    constructor() {
        owner = msg.sender;
        userCount = 0;
        photoCount = 0;
    }

    function addUser(string memory fullName, string memory username, string memory bio) public {
        require(bytes(fullName).length > 0, "Full name is required.");
        require(bytes(username).length > 0, "Username is required.");
        require(userAddressMap[msg.sender] == 0, "User already exists.");
        require(usernameMap[username] == 0, "Username already taken.");
        uint256 id = userCount + 1;
        UserInfo memory user = UserInfo(msg.sender, id, fullName, username, bio, 0, 0, 0);
        users.push(user);
        userCount += 1;
        // The ID of the user is the (ID - 1) position in the array
        userAddressMap[msg.sender] = id;
        usernameMap[username] = id;
        
        emit UserCreated(userCount, user.fullName, user.username, user.bio);
    }

    function editUserBio(string memory bio) public {
        require(bytes(bio).length > 0, "Bio is required.");
        uint256 id = userAddressMap[msg.sender];
        require(id > 0, "User doesn't exist.");
        users[id - 1].bio = bio;
        UserInfo memory user = users[id - 1];
        emit UserEdited(id, user.fullName, user.username, user.bio);
    }

    function getCurrentUser() public view returns (uint256 id, string memory fullName, string memory username, string memory bio,
        uint256 followingCount, uint256 followerCount, uint256 postCount) {
        
        uint256 uid = userAddressMap[msg.sender];
        require(uid > 0, "User doesn't exist.");
        UserInfo memory user = users[uid - 1];
        return (uid, user.fullName, user.username, user.bio, user.followingCount, user.followerCount, user.postCount);
    }

    function followUser(address userAddress) public {
        require(msg.sender != userAddress, "User cannot follow himself.");

        uint256 uid_from = userAddressMap[msg.sender];
        require(uid_from > 0, "Follower user doesn't exist.");

        uint256 uid_to = userAddressMap[userAddress];
        require(uid_to > 0, "Following user doesn't exist.");

        users[uid_from - 1].followingCount += 1;
        users[uid_to - 1].followerCount += 1;

        userFollowing[msg.sender].push(uid_to);
        userFollowers[userAddress].push(uid_from);

        emit UserFollowed(userAddress, msg.sender);
    }

    // Photos
    function uploadPhoto(string memory _imgHash, string memory _description) public {
        require(msg.sender != address(0), "address is 0");
        uint256 userId = userAddressMap[msg.sender];
        require(userId > 0, "User doesn't exist.");
        require(bytes(_imgHash).length > 0, "Image hash required.");
        require(bytes(_description).length > 0, "Image description required.");

        photoCount++;
        photos.push(Photo(photoCount, _imgHash, _description, 0, userId, msg.sender));

        userPhotos[msg.sender].push(photoCount);
        users[userId - 1].postCount += 1;

        emit PhotoCreated(photoCount, _imgHash, _description, 0, userId, msg.sender);
    }

    function likePhoto(uint256 photoId) public {
        require(msg.sender != address(0), "address is 0");
        uint256 userId = userAddressMap[msg.sender];
        require(userId > 0, "User doesn't exist.");

        require(photoId <= photoCount, "Invalid photo ID.");
        require(photoLikedBy[photoId][msg.sender] == false, "Already liked.");
        
        photos[photoId - 1].likeCount++;
        photoLikedBy[photoId][msg.sender] = true;
        photoLikes[photoId].push(userId);

        emit PhotoLiked(photoId, msg.sender, photos[photoId - 1].likeCount);
    }
}