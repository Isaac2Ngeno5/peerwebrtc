(function(){
    "use strict";

    console.log("app loaded");

    const username = document.querySelector("#username");
    const register = document.querySelector("#register");
    const form = document.querySelector("#registration");

    var peer;

    const container = document.querySelector(".container");

    form.addEventListener("submit", function(event){
        event.preventDefault();
let user = username.value;
        if(user !== ""){  
            createPeer(user);          
        console.log(user);
        }else{
            alert("please provide a username");
        } 
    });


    function createPeer(username){
        peer = new peer(username);

        peer.on("open", function(peerid){
            console.log(`peer id : ${peerid}`);
        });
    }


}(document));