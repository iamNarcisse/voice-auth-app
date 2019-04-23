const start = document.getElementById("start");
//attach events to them

start.addEventListener("click", analyze);

function analyze(e) {
  e.preventDefault();
  var phrase = document.getElementById("phrase").value;
  var name = JSON.parse(localStorage.getItem("user_id")).name;
  console.log(name);
  if (!phrase) {
    alert("Please include your key phrase");
    return;
  }

  console.log("Recording has Started");

  console.log(phrase);

  const constraints = {
    audio: true,
    video: false
  };

  start.disabled = true;

  var handleSuccess = function(stream) {
    audioContext = new AudioContext();
    gumStream = stream;
    input = audioContext.createMediaStreamSource(stream);
    rec = new Recorder(input, { numChannels: 1 });
    rec.record();
    console.log("recording started");
    let loader = document.getElementById("spinner");
    loader.style.visibility = "visible";
    setTimeout(handleStop, 5000);
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleSuccess)
    .catch(function(error) {
      console.log(error);
      start.disabled = false;
      //  stop.disabled = true;
    });
}

//Function stopRecording
function handleStop() {
  //  createVoiceInput.disabled=false;
  start.disabled = true;
  console.log("Recording stopped");
  rec.stop();
  gumStream.getAudioTracks()[0].stop();
  rec.exportWAV(handleAudioFile);
  //  rec.clear()
}
function handleAudioFile(audiofile) {
  //console.log(file)
  audiofile.name = "narcisse";
  //  fd = new FormData();
  //  fd.append("audio", file, "audio.wav");

  // Create the file metadata
  var metadata = {
    contentType: "audio/wav"
  };
  var storageRef = firebase.storage().ref();

  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = storageRef
    .child("voices/" + audiofile.name)
    .put(audiofile, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    function(error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;

        case "storage/canceled":
          // User canceled the upload
          break;

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    function() {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log("File available at", downloadURL);
      });
    }
  ); // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    function(error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;

        case "storage/canceled":
          // User canceled the upload
          break;

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    function() {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log("File available at", downloadURL);
        var id = JSON.parse(localStorage.getItem("user_id")).voiceId;
        var name = JSON.parse(localStorage.getItem("user_id")).name;
        var phrase = document.getElementById("phrase").value;

        console.log(phrase, "I am here line 141");
        const data = {
          url: downloadURL,
          phrase: phrase,
          id: id
        };
        let url = `https://voice-auth.herokuapp.com/user/login`;
        //let url = `http://localhost:3002/user/login`;
        axios({
          url: url,
          method: "post",
          data: data
        })
          .then(result => {
            console.log(result);
            switch (result.status) {
              case 200:
                let loader = document.getElementById("spinner");
                loader.style.visibility = "visible";
                alert(`Welcome ${name}, login successful `);
                break;
              default:
                // let loader = document.getElementById("loader");
                //loader.className = "";
              //  alert("Check console something went wrong");
                console.log(result);
                break;
            }
            console.log(result);
            // console.log("User identified successfully");
          })
          .catch(error => {
            let loader = document.getElementById("spinner");
            loader.style.visibility= "hidden";
            alert(`${error.response.data.msg}`);
            console.log(error.response.data.msg);
          });
      });
    }
  );

  // Create a root reference
  // Create a reference to 'mountains.jpg'
}
