(function(){
    "use strict";
    const myVideo = document.querySelector("#myVideo");
    const otherVideo = document.querySelector("#otherVideo");
    const otherUser = document.querySelector("#otherUser");
    const callbtn = document.querySelector("#call");


    var peer, call, user, localStream;

    user = new URL(window.location.href).searchParams.get("user");

    createPeer(user);

    navigator.mediaDevices.getUserMedia({video:true,audio:false})
    .then(function(stream){
        localStream = stream;
        myVideo.srcObject = stream;
        myVideo.play();
    }).catch(function(err){
        console.log(err);
    });

    callbtn.addEventListener("click", function(event){
        if(otherUser.value !== ""){
            makeCall(otherUser.value);

            if(peer !== ""){
                peer.on("call", function(call){
                    call.answer(localStream);
                });
            }
        
            if(call !== ""){
                call.on("stream", function(stream){
                    otherVideo.srcObject = stream;
                    otherVideo.play();
                });
            }
        
        }else{
            alert("Please provide other user value");
        }
    });

    
    console.log(user);
    function createPeer(username){
        peer = new Peer(username);

        document.querySelector(".card-title").textContent = `Hi! ${peer.id}`;

        peer.on("open", function(peerid){
            console.log(`peer id : ${peerid}`);
        });

    }

    function makeCall(otherUser){
        call = peer.call(otherUser, localStream);
    }

}(document));