// SPDX-License-Identifier: MIT
//pragma solidity ^0.8.2;
pragma solidity >=0.8.2 <0.9.0;

contract Forum{
    
    error NotOwner(address from);

    event PostCreated(address indexed author, uint createdAt);
    event PostsCleared(uint indexed timestamp, uint post_count);


    struct Post{
        string message;
        address author;
        uint createdAt;
        uint like;
    }
    Post[] posts;
    address owner;

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
                message,
                msg.sender,
                block.timestamp,
                0
            )
        );
        emit PostCreated(msg.sender, block.timestamp);
    }
    function getPosts() external view returns(Post[] memory){
        return posts;
    }
    function getPost(uint idx) external view returns(Post memory){
        require(idx < posts.length, "Not found");
        return posts[idx];
    }
}