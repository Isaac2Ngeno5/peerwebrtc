(function(global) {

    // Compatibility
    navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia
     || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  
    var peerTeacher;
    var currentPeerConnection;
    var peers = [];
    var peerConnections = {};
    var localMediaStream;
  
    $(function() {
  
      var $myselfId = $('#js-myself-id');
      var $peerId = $('#js-peer-id');
      var $partnerId = $('#js-partner-id');
      var $createKlass = $('#js-open');
      //var $connect = $('#js-connect');
      var videoMyself = document.querySelector('#js-video-myself');
      var videoPartner = document.querySelector('#js-video-partner');
      var videoStudent = document.querySelector('#js-video-student');
      //var append_pats = document.querySelector('');
  
      navigator.getUserMedia_({video: true, audio: true}, function(stream) {
        videoMyself.srcObject = stream;
        videoMyself.play();
        localMediaStream = stream;
      });
      
      $createKlass.on('click', function(e) {
        // create peer object
        var myselfId = $myselfId.val();
        peerTeacher = new Peer(myselfId);
  
  
        // if peer connection is opened
        peerTeacher.on('open', function() {
          alert(peerTeacher.id)
          $peerId.html(peerTeacher.id);
        });
        
        peerTeacher.on('call', function(call) {
          // answer with my media stream
          call.answer(localMediaStream);
          
          var caller = {};
          
          // close current connection if exists
        //   if (currentPeerConnection) {
        //     currentPeerConnection.close();
        //   }
          
          // keep call as currentPeerConnection
          //currentPeerConnection = call;

          //caller.call = call;

          peerConnections[call.peer] = {call: call, stream: {}};
          $('<li id="'+call.peer+'">'+call.peer+'</li>').appendTo('#List_of_Class_Participants');
          
          // wait for partner's stream
          call.on('stream', function(stream) {
            //videoPartner.srcObject = stream;
            //videoPartner.play();
            //caller.stream = stream;
            let peerx = peerConnections[call.peer];
            peerx.stream = stream;
            peerConnections[call.peer] = peerx;
            
          });
          
          console.log(caller);
          //peers.push(caller);
          //append the caller id to the dom
          


          // if connection is closed
          call.on('close', function() {
            console.log('Connection is closed.');
          });

          $('li').on('click', function(e){
              e.preventDefault();
              e.stopPropagation();

              let p = peerConnections[$(this).attr('id')];
              videoStudent.srcObject = p.stream;
              videoStudent.play();
          })
        });
        
        // disable id input
        $myselfId.attr('disabled', 'disabled');
        
        // enable partner id input
        $partnerId.removeAttr('disabled');
        
        // enable connect button
        $connect.removeAttr('disabled');
      });
  
      /*$connect.on('click', function(e) {
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
          console.log(peers);
        });
  
        // if connection is closed
        call.on('close', function() {
          console.log('Connection is closed.');
        });
      });*/
    });
  
  })(this);