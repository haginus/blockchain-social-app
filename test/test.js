const Social = artifacts.require('./Social.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Social', ([deployer, newUser1, newUser2]) => {
  let social

  before(async () => {
    social = await Social.deployed()
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await social.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a deployer address', async () => {
      const address = await social.owner()
      assert.equal(address, deployer);
    });

  });

  describe('user', async () => {
    let result;
    before(async () => {
      result = await social.addUser("Haginus", "haginus", "Happy boy", { from: newUser1 });
    });

    it('creates account', async () => {
      const event = result.logs[0].args;
      assert.equal(event.id, "1");
      assert.equal(event.fullName, "Haginus");
      assert.equal(event.username, "haginus");
      assert.equal(event.bio, "Happy boy");
    });

    it('is "logged in"', async () => {
      const loggedUser = await social.getCurrentUser({ from: newUser1 });
      assert.equal(loggedUser.fullName, "Haginus");
      assert.equal(loggedUser.username, "haginus");
      assert.equal(loggedUser.bio, "Happy boy");
      assert.equal(loggedUser.followerCount, "0");
      assert.equal(loggedUser.followingCount, "0");
      assert.equal(loggedUser.postCount, "0");
    });

    it('can edit bio', async () => {
      const editResult = await social.editUserBio('Sad boy', { from: newUser1 });
      const event = editResult.logs[0].args;
      assert.equal(event.id, "1");
      assert.equal(event.fullName, "Haginus");
      assert.equal(event.username, "haginus");
      assert.equal(event.bio, "Sad boy");
    });

    it('cannot create a second account', async () => {
      await social.addUser("Haginus", "boom", "Double accounter", { from: newUser1 }).should.be.rejected;
    });

    it('cannot create account with the same username', async () => {
      await social.addUser("Someone else", "haginus", "Can I hijack this?", { from: newUser2 }).should.be.rejected;
    });

    it('can follow another user', async () => {
      await social.addUser("Another User", "another", "Just someone else", { from: newUser2 });
      const followResult = await social.followUser(newUser2, { from: newUser1 });

      const event = followResult.logs[0].args;
      assert.equal(event.userAddress, newUser2);
      assert.equal(event.by, newUser1);

      const userData1 = await social.users(0, { from: newUser1 });
      const userData2 = await social.users(1, { from: newUser1 });

      assert.equal(userData1.followingCount, '1', "Following count for first user should be 1");
      assert.equal(userData1.followerCount, '0', "Follower count for first user should be 0");
      assert.equal(userData2.followingCount, '0', "Following count for second user should be 0");
      assert.equal(userData2.followerCount, '1', "Follower count for second user should be 1");

      const user1Following = await social.userFollowing(newUser1, 0, { from: newUser1 });
      const user2Followers = await social.userFollowers(newUser2, 0, { from: newUser1 });

      assert.equal(user1Following, '2', "Second user doesn't appear in first user's following list");
      assert.equal(user2Followers, '1', "First user doesn't appear in second user's followers list");

    });

    it('cannot follow twice', async () => {
      await social.followUser(newUser2, { from: newUser1 }).should.be.rejected;
    });

    it('cannot follow himself', async () => {
      await social.followUser(newUser1, { from: newUser1 }).should.be.rejected;
    });

  });

  describe('photo', async () => {

    let result, photoCount;
    const hash = 'sarabunafratilorsafitiiubiti';

    before(async () => {
      result = await social.uploadPhoto(hash, 'Photo description', { from: newUser1 });
      photoCount = await social.photoCount();
    });

    it('user can create photo', async () => {
      // SUCESS
      assert.equal(photoCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), photoCount.toNumber(), 'Id is incorrect');
      assert.equal(event.hash, hash, 'Hash is incorrect');
      assert.equal(event.description, 'Photo description', 'description is incorrect');
      assert.equal(event.likeCount, '0', 'Like count is incorrect');
      assert.equal(event.author, newUser1, 'author is incorrect');
      assert.equal(event.authorId, '1', 'author id is incorrect');

      let userData = await social.getCurrentUser({ from: newUser1 });
      assert.equal(userData.postCount, '1', 'user post count is incorrect');

      let userPhotoId = await social.userPhotos(newUser1, 0);
      assert.equal(userPhotoId.toNumber(), event.id.toNumber(), 'user photo id is incorrect');

    });

    it('user can like photo', async () => {
      let likeResult = await social.likePhoto(1, { from: newUser1 });
      const event = likeResult.logs[0].args;
      assert.equal(event.id, '1', 'Photo Id is incorrect');
      assert.equal(event.by, newUser1, 'Liking user address is incorrect');
      assert.equal(event.likeCount, '1', 'Like count is incorrect');

      let photoLikedByUser = await social.photoLikedBy(1, newUser1, { from: newUser1 });
      assert.equal(photoLikedByUser, true, 'Map failure');

      let photoLikesListItem = await social.photoLikes(1, 0, { from: newUser1 });
      assert.equal(photoLikesListItem, '1', 'List failure');

    });

    it('user cannot like photo twice', async () => {
      await social.likePhoto(1, { from: newUser1 }).should.be.rejected;
    });
  });
});