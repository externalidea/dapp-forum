const contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

let web3;
let contract;
let current_account;

document.addEventListener("DOMContentLoaded", () =>{
    document.getElementById("connection_btn").addEventListener("click", connectWallet);
    document.getElementById("makePost_btn").addEventListener("click", makePost);
    if(window.ethereum){

        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(c_abi,contract_address);

        contract.events.PostCreated({fromBlock:"latest"})
            .on("data", event =>{
                console.log("PostsCleared: ", event.return.Values);
                getPosts();
            })

        window.ethereum.on("accountsChanged", (accounts) => {
            if(accounts.length > 0){
                current_account = accounts[0];
                enterToDapp();
            }
        })
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
    account_lbl.textContent = current_account;

    document.getElementById("dapp").hidden = false;
}
const makePost = async ()=>{
    try{
        const postText = document.getElementById("post_text");
        const message = postText.value;
        if(!message) return alert("Message empty");

        await contract.methods.createPost(message).send({ from:current_account });
        postText.value="";


    getPost();//////////
    }
    catch(error){
        console.error("Create arror: ", error);
        alert("Create post error. Check logs.");
    }
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