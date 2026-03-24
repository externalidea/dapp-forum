const contract_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

let web3;
let contract;
let current_account;

document.addEventListener("DOMContentLoaded", () =>{
    document.getElementById("connection_btn").addEventListener("click", connectWallet);
    document.getElementById("makePost_btn").addEventListener("click", makePost);

    web3 = new Web3('http://127.0.0.1:8545');
    contract = new web3.eth.Contract(c_abi,contract_address);

    contract.events.PostCreated({fromBlock:"latest"})
        .on("data", event =>{
            console.log("PostsCreated: ", event.returnValues);
            getPosts();
            loadPosts();
        })

    connectWallet();
})

const connectWallet = async (e) => {
    if(window.ethereum){
        try{
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })
            current_account = accounts[0];
            e.target.hidden=true;
            enterToDapp();
        }
        catch(error){
            alert("Connect to app error. Check Logs")
        }
    }
    else{
        alert("Install WEB3 provider")
    }
}
const enterToDapp = () => {
    const account_lbl = document.getElementById("account_lbl");
    account_lbl.hidden = false;
    account_lbl.style.color = "darkgreen";
    account_lbl.textContent = current_account;

    document.getElementById("dapp").hidden = false;

    const postsContainer = document.getElementById("post-card");
    postsContainer.hidden = false;

    loadPosts()
}
const makePost = async ()=>{
    try{
        const postText = document.getElementById("post_text");
        const message = postText.value;
        if(!message) return alert("Message empty");

        await contract.methods.createPost(message).send({ from:current_account, gas: 1000000, gasPrice: 1000000000 });
        postText.value="";
    }
    catch(error){
        console.error("Create arror: ", error);
        alert("Create post error. Check logs.");
    }
    loadPosts();
}
const getPost = async () => {
    try{
        const post = await contract.methods.getPost(0).call();
        console.log(post);
    }
    catch(error)
    {
        console.error("Get post error")
    }
}
const getPosts = async () => {
    try{
        const posts = await contract.methods.getPosts().call();
        console.log(posts);
    }
    catch(error)
    {
        console.error("Get post error")
    }
}
async function loadPosts(){
    try{
        const postsContainer = document.getElementById("post-card");
        postsContainer.innerHTML="";

        const posts = await contract.methods.getPosts().call();

        posts.forEach((post, index) => {
            const div = document.createElement("div");
            div.classList.add("post-card");
            div.innerHTML =`
                <p>${post.message}</p>
                <span>Author: ${post.author}</span>
                <span>Date: ${new Date(Number(post.createdAt) * 1000).toLocaleDateString()}</span>
            `;
            postsContainer.appendChild(div);
        })
    } catch(error){
        console.error("Load posts error: ", error);
    }
}