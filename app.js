(function(){
    "use strict";
    const myVideo = document.querySelector("#myVideo");

    var peer, call, user;

    $user = new URL(window.location.href).searchParams.get("user");

    navigator.mediaDevices.getUserMedia({video:true,audio:true})
    .then(function(stream){
        myVideo.srcObject = stream;
        myVideo.play();
    }).catch(function(err){
        console.log(err);
    });

    console.log(user);
    function createPeer(username){
        peer = new Peer(username);

        peer.on("open", function(peerid){
            console.log(`peer id : ${peerid}`);
        });
    }

    // function makeCall(otherUser){
    //     call = peer.call(otherUser, function(){

    //     })
    // }

}(document));