const contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

let web3;
let contract;
let current_account;

document.addEventListener("DOMContentLoaded", () =>{
    document.getElementById("connection_btn").addEventListener("click", connectWallet);
    document.getElementById("makePost_btn").addEventListener("click", makePost);
    document.getElementById("author_filter").addEventListener("change", loadPosts);

    if(window.ethereum){
        web3 = new Web3('http://127.0.0.1:8545');
        contract = new web3.eth.Contract(c_abi,contract_address);

        contract.events.PostCreated({fromBlock:"latest"})
            .on("data", event =>{
                console.log("PostsCreated: ", event.returnValues);
                getPosts();
                loadPosts();
            })
        window.ethereum.on("accountsChanged", (accounts) => {
            if(accounts.length > 0){
                current_account = accounts[0];
                enterToDapp();
            }
        })
    }else{
            alert ("Install WEB3 provider");
    }
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
    account_lbl.textContent = `Wallet: ${current_account}`;

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
async function loadPosts() {
    try {
        const postsContainer = document.getElementById("post-card");
        const filterValue = document.getElementById("author_filter").value;
        postsContainer.innerHTML = "Loading...";

        const posts = await contract.methods.getPosts().call();
        postsContainer.innerHTML = "";

        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            
            if (filterValue === "me" && post.author.toLowerCase() !== current_account.toLowerCase()) {
                continue;
            }

            // Если аккаунт еще не подгружен, используем заглушку
            const userAddr = current_account || "0x0000000000000000000000000000000000000000";
            const hasLiked = await contract.methods.checkMyLike(i, userAddr).call();
            
            const isAuthor = current_account && post.author.toLowerCase() === current_account.toLowerCase();

            const div = document.createElement("div");
            div.className = "post-card";
            div.innerHTML = `
                <p class="post-message">${post.message}</p>
                <span class="post-info">Author: ${post.author.substring(0, 6)}...</span>
                <span class="post-info">Date: ${new Date(Number(post.createdAt) * 1000).toLocaleDateString()}</span>
                
            <div class="post-actions">
                <button class="like-btn" onclick="toggleLike(${i})" style="color: ${hasLiked ? '#e74c3c' : '#333'}">
                    <span class="heart">${hasLiked ? '❤️' : '🤍'}</span> 
                    <span class="count">${post.like}</span>
                </button>
                    ${isAuthor ? `<button onclick="deletePost(${i})" class="delete-btn">🗑️</button>` : ""}
                </div>
            `;
            postsContainer.appendChild(div);
        }
    } catch (error) {
        console.error("Load posts error: ", error);
    }
}

window.toggleLike = async (index) => {
    try {
        await contract.methods.toggleLike(index).send({ from: current_account });
        await loadPosts(); 
    } catch (error) {
        console.error("Like error", error);
    }
};

window.deletePost = async (index) => {
    if (!confirm("Delete?")) return;
    try {
        await contract.methods.deletePost(index).send({ from: current_account });
        await loadPosts();
    } catch (error) {
        console.error("Delete error", error);
    }
};