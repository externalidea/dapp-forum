// SPDX-License-Identifier: MIT
//pragma solidity ^0.8.2;
pragma solidity >=0.8.2 <0.9.0;

contract Forum{
    
    error NotOwner(address from);

    event PostCreated(address indexed author, uint createdAt);
    event PostsCleared(uint indexed timestamp, uint post_count);
    event PostDeleted(uint indexed idx);
    event PostLiked(uint indexed postId, address indexed liker, bool isLiked, uint totalLikes);


    struct Post{
        uint id;
        string message;
        address author;
        uint createdAt;
        uint like;
    }
    Post[] posts;
    address owner;
    uint nextID;
    mapping(uint => mapping(address => bool)) isLiked;

    constructor(){
        owner = msg.sender;
    }
    function clearPosts() external{
        require(owner == msg.sender, NotOwner(msg.sender));
        uint posts_q = posts.length;
        emit PostsCleared(block.timestamp, posts_q);
        delete posts;
    }
    function createPost(string calldata message) external{
        posts.push(
            Post(
                nextID,
                message,
                msg.sender,
                block.timestamp,
                0
            )
        );
        emit PostCreated(msg.sender, block.timestamp);
        nextID++;
    }
    function getPosts() external view returns(Post[] memory){
        return posts;
    }
    function getPost(uint idx) external view returns(Post memory){
        require(idx < posts.length, "Not found");
        return posts[idx];
    }
    function deletePost(uint idx) external{
        require(idx < posts.length, "Post doesn't exist");
        require(posts[idx].author == msg.sender, "You are not author");

        posts[idx] = posts[posts.length -1];
        posts.pop();

        emit PostDeleted(idx);
    }
    function toggleLike(uint idx) external{
        require(idx < posts.length, "Post not found");

        uint postId = posts[idx].id;

        if(isLiked[postId][msg.sender]){
            isLiked[postId][msg.sender] = false;
            posts[idx].like -= 1;
        }
        else{
            isLiked[postId][msg.sender]=true;
            posts[idx].like += 1;
        }
        emit PostLiked(idx, msg.sender, isLiked[postId][msg.sender], posts[idx].like);
    }
    function checkMyLike(uint idx, address user) external view returns(bool) {
        require(idx < posts.length, "Index out of bounds");
        return isLiked[posts[idx].id][user];
    }
}