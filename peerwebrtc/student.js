(function(global) {

    // Compatibility
    navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia
     || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  
    var peerClient;
    var currentPeerConnection = [];
    var peers = [];
    var localMediaStream;
  
    $(function() {
  
      var $myselfId = $('#js-myself-id');
      var $peerId = $('#js-peer-id');
      var $partnerId = $('#js-partner-id');
      var $register = $('#js-open');
      var $joinclass = $('#js-connect');
      var videoMyself = document.querySelector('#js-video-myself');
      var videoPartner = document.querySelector('#js-video-partner');
      var append_pats = document.querySelector('#List_of_Class_Participants');
  
      navigator.getUserMedia_({video: true, audio: true}, function(stream) {
        videoMyself.srcObject = stream;
        videoMyself.play();
        localMediaStream = stream;
      });
      
      $register.on('click', function(e) {
        // create peer object
        var myselfId = $myselfId.val();
        peerClient = new Peer(myselfId);
  
  
        // if peer connection is opened
        peerClient.on('open', function() {
          alert(peerClient.id)
          $peerId.html(peerClient.id);
        });
        
        peerClient.on('call', function(call) {
          // answer with my media stream
          call.answer(localMediaStream);
          var caller = {};
          
          // close current connection if exists
        //   if (currentPeerConnection) {
        //     currentPeerConnection.close();
        //   }
          
          // keep call as currentPeerConnection
          currentPeerConnection = call;

          caller.call = call;
          
          // wait for partner's stream
          call.on('stream', function(stream) {
            //videoPartner.srcObject = stream;
            //videoPartner.play();
            caller.stream = stream;
          });
          
          console.log(caller);
          peers.push(caller);
          //append the caller id to the dom
          append_pats.append( "<li>"+caller.call.peer+"</li>" );


          // if connection is closed
          call.on('close', function() {
            console.log('Connection is closed.');
          });
        });
        
        // disable id input
        $myselfId.attr('disabled', 'disabled');
        
        // enable partner id input
        $partnerId.removeAttr('disabled');
        
        // enable connect button
        $joinclass.removeAttr('disabled');
      });
  
      $joinclass.on('click', function(e) {
        // if peerClient is not initialized
        if (!peerClient) {
          return;
        }
        
        // connect to partner
        var partnerId = $partnerId.val();
        var call = peerClient.call(partnerId, localMediaStream);
  
        // close current connection if exists
        // if (currentPeerConnection) {
        //   currentPeerConnection.close();
        // }
  
        // keep call as currentPeerConnection
        currentPeerConnection = call;
  
        // wait for partner's stream
        call.on('stream', function(stream) {
          videoPartner.srcObject = stream;
          videoPartner.play();
          //console.log(peers);
        });
  
        // if connection is closed
        call.on('close', function() {
          console.log('Connection is closed.');
        });
      });
    });
  
  })(this);