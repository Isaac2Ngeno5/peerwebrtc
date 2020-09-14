(function (global) {

// Compatibility
    navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    var peerTeacher;
    var currentPeerConnection;
    var peers = [];
    var peerConnections = {};
    var localMediaStream; // the broadcast tream

// Streams
    var Webcam_stream; //default broadcast
    var Audio_Screen_stream;
    var Canvas_Video_Audio_stream;
//var Student_Canvas_Audio_stream;


    $(function () {

        var $myselfId = $('#js-myself-id');
        var $peerId = $('#js-peer-id');
        var $partnerId = $('#js-partner-id');
        var $createKlass = $('#js-open');
//var $connect = $('#js-connect');
        var videoMyself = document.querySelector('#js-video-myself');
        var jsBroadcastvideo = document.querySelector('#js-Broadcast-video');
        var jsvideomyselfscreen = document.querySelector('#js-video-myself-screen');
        var videoPartner = document.querySelector('#js-video-partner');
        var videoStudent = document.querySelector('#js-video-student');
//var append_pats = document.querySelector('');

//function captureWebcam_Audio()
        navigator.getUserMedia_({video: true, audio: true}, function (stream) {
            videoMyself.srcObject = stream;
            videoMyself.play();
            localMediaStream = stream;
            Webcam_stream = stream;
        });

//function captureAudioPlusScreen()
        document.getElementById("js-open").onclick = function () {
            navigator.mediaDevices.getDisplayMedia({
                video: true
            }).then(stream => {
                navigator.mediaDevices.getUserMedia({audio: true}).then(function (mic) {
                    stream.addTrack(mic.getTracks()[0]);
                    jsvideomyselfscreen.srcObject = stream;
                    jsvideomyselfscreen.play();
                    localMediaStream = stream;
                    Audio_Screen_stream = stream;
                });
            }).catch(function (error) {
                console.log(error);
            });
        }

// Load the Black Board Modal

          $('#Black_Board_Modal').on('shown.bs.modal',function(){      
            $(this).find('iframe').attr('src','http://localhost/rtcdemo/Record/peerwebrtc/black_board_canvas/classic_with_gui/')
          });

//function captureScreen() Webcam Vedio Streams
    
    var mediaRecorder;
    var recording_broadcast_stream;
    var recordedChunks = [];
    var recursive_calls = [];

// get the user agent
    const sUsrAg = navigator.userAgent;
        if (sUsrAg.indexOf('Firefox') > -1) {
          console.log('Firefox');
          recording_broadcast_stream = jsBroadcastvideo.mozCaptureStream(25);
        } else {
          console.log('Other User Agent');
          recording_broadcast_stream = jsBroadcastvideo.captureStream(25);
        }
                
        console.log(recording_broadcast_stream); 
        let options = {mimeType: 'video/webm'};

        //var mediaRecorder = new MediaRecorder(recording_broadcast_stream, options);
        
        document.getElementById("record").onclick = function () {

//Recursive function to record the Scenes
        var r_calls = 1;
          function recursive_record(){

              mediaRecorder = new MediaRecorder(recording_broadcast_stream, options);
              mediaRecorder.ondataavailable = handleDataAvailable;
              try{  mediaRecorder.onerror = function(){
                    mediaRecorder.stop(); 
                    delete mediaRecorder;
                    alert( 'Error due to Switching Streams and Stopped  :'+ mediaRecorder.state );
                    recursive_record(); 
                  }
              }
              catch(e){ console.error('Exception MediaRecorder:', e);
              }
              mediaRecorder.start();
              console.log( 'mediaRecorder started :'+ mediaRecorder );
              recursive_calls.push('call :' + r_calls );
              r_calls = r_calls + 1;
          }
          recursive_record();
        }

//Recursive function to handleDataAvailable on Scenes
        function handleDataAvailable(event) {
              console.log("data-available recording");
              if ( (event.data.size > 0) && (event.data.size != null) ) {
                  recordedChunks.push(event.data);
                  console.log('recordedChunks  :' + recursive_calls);
                  console.log(recordedChunks);
                  console.log('inside handleDataAvailable state '+ mediaRecorder.state);

              } else { console.log('No Data Available in Stream');
              }
        }

//function to download the Scenes
        function download() { mediaRecorder.stop();

//function to concatenate all the scenes
            var MyBlobBuilder = function() {
              this.parts = [];
            }
            MyBlobBuilder.prototype.append = function(part) {
              this.parts.push(part);
              this.blob = undefined; // Invalidate the blob
            };
            MyBlobBuilder.prototype.getBlob = function() {
              if (!this.blob) {
                this.blob = new Blob(this.parts, { type: "video/webm" });
              }
              return this.blob;
            };
            var myBlobBuilder = new MyBlobBuilder();

            for(var i = 0; i < recordedChunks.length - 0; i++) {
                myBlobBuilder.append(  recordedChunks[i]  );
                console.log( " recordedChunks.length :" + recordedChunks.length);
                alert( " Scenes :" + i);
                console.log( recordedChunks[i] );
            }
            var mergedScenes = myBlobBuilder.getBlob();
            console.log( " Merged Scenes :");
            console.log( mergedScenes );
//function to concatenate all the scenes

            var blob = new Blob( recordedChunks, {
                type: "video/webm"
            });
            console.log( recordedChunks );
            // for(var i = 0; i < recordedChunks.length; i++) {
            //     console.log( " recordedChunks.length :" + recordedChunks.length);
            //     alert( " Scenes :" + i);
            //     console.log( recordedChunks[i] );
            // }
            var url = URL.createObjectURL(mergedScenes);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "test.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            
            //empty the records
            //recordedChunks = null;
            console.log("downloaded, recordedChunks = null => recursive_calls");
            console.log(recursive_calls);
        }

//Recording event handlers
        document.getElementById("stoprecord").onclick = function (e) {
                console.log("stopping");
                //mediaRecorder.stop();
            }
        document.getElementById("download").onclick = function (e) {
                download();
          }

//onclick set the broadcast stream

        $('#Webcam_stream').on('click', function (e) {
            //alert('Webcam_stream');
            localMediaStream = Webcam_stream;
            jsBroadcastvideo.srcObject = localMediaStream;
            jsBroadcastvideo.play();
        });

        $('#Audio_Screen_stream').on('click', function (e) {
            //alert('Audio_Screen_stream');
            localMediaStream = Audio_Screen_stream;
            jsBroadcastvideo.srcObject = localMediaStream;
            jsBroadcastvideo.play();
        });

        $('#Canvas_Video_Audio_stream').on('click', function (e) {
            //alert('Canvas_Video_Audio_stream');
            localMediaStream = Canvas_Video_Audio_stream;
            //jsBroadcastvideo.srcObject = localMediaStream;
            //jsBroadcastvideo.play();
        });


        $createKlass.on('click', function (e) {
// create peer object
            var myselfId = $myselfId.val();
            peerTeacher = new Peer(myselfId);


// if peer connection is opened
            peerTeacher.on('open', function () {
                alert(peerTeacher.id)
                $peerId.html(peerTeacher.id);
            });

            peerTeacher.on('call', function (call) {
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
                $(`<li id = "'+call.peer+'" > '+call.peer+' < /li>`).appendTo('#List_of_Class_Participants');

// wait for partner's stream
                call.on('stream', function (stream) {
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
                call.on('close', function () {
                    console.log('Connection is closed.');
                });

                $('li').on('click', function (e) {
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
            //$connect.removeAttr('disabled');
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