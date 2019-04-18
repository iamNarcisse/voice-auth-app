var createVoiceInput = document.getElementById("start");
var enroll = document.getElementById("enroll"); //Stops recording process
const deleted = document.getElementById("delete");
var id = JSON.parse(localStorage.getItem("user_id")).voiceId;
//Add eventlisteners to the variables declared above

createVoiceInput.addEventListener("click", handleCreate);
enroll.addEventListener("click", enrollAudio);

//delete audio file
deleted.addEventListener("click", function(e) {
  //console.log("ye")
  //let id = JSON.parse(localStorage.getItem("user_id")).voiceId;
  //  console.log(id, "i am here")
  e.preventDefault();
  console.log(id, "i am here");
  const span = document.getElementById("span");
  span.innerHTML = "";
});
//stop.addEventListener("click", handleStop);

//Creating function handleCreate and handleStop
function handleCreate(e) {
  e.preventDefault();
  let id = JSON.parse(localStorage.getItem("user_id")).voiceId;
  let phrase = document.getElementById("phrase").value;
  if (!phrase) {
    alert("Please enter a phrase to proceed");
    return;
  }

  if (!id) {
    alert("Please go back to create an account");
    return;
  }

  console.log(id);
  console.log("recording in progress");
  //setting media constraints
  const constraints = {
    audio: true,
    video: false
  };

  createVoiceInput.disabled = true;
  enroll.disabled = false;

  //using the inbuilt media operation

  var handleSuccess = function(stream) {
    audioContext = new AudioContext();
    gumStream = stream;
    input = audioContext.createMediaStreamSource(stream);
    rec = new Recorder(input, { numChannels: 1 });
    rec.record();
    console.log("recording started");
    let loader = document.getElementById("loader");
    loader.className = "loader";
    setTimeout(handleStop, 5000);
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleSuccess)
    .catch(function(error) {
      console.log(error);
      start.disabled = false;
      enroll.disabled = true;
    });
}

//Function stopRecording
function handleStop() {
  let loader = document.getElementById("loader");
  loader.className = "";
  createVoiceInput.disabled = false;
  enroll.disabled = false;
  console.log("Recording stopped");
  rec.stop();
  gumStream.getAudioTracks()[0].stop();
  rec.exportWAV(play);

  /*gumStream.getAudioTracks()[0].stop();*/
  //  rec.exportWAV(handleAudioFile);
  //  rec.clear()
}

function play(data) {
  const url = URL.createObjectURL(data);
  const au = document.createElement("audio");
  const li = document.createElement("li");
  const link = document.createElement("a");
  const span = document.getElementById("span");
  //add controls to the <audio> getElementById
  au.controls = true;
  au.src = url;
  //li.appendChild(au);
  span.appendChild(au);
}

function enrollAudio(e) {
  e.preventDefault();
  let phrase = document.getElementById("phrase").value;
  console.log(phrase);
  if (!phrase) {
    alert("Key phrase must be added");
    return;
  }
  rec.exportWAV(handleAudioFile);
}

//handleAudioFile

function handleAudioFile(audiofile) {
  console.log(audiofile);
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
        var phrase = document.getElementById("phrase").value;
        var id = JSON.parse(localStorage.getItem("user_id")).voiceId;
        console.log("File available at", downloadURL);
        console.log(id, "voice id");
        console.log(phrase);
        const data = {
          url: downloadURL,
          id: id,
          phrase: phrase
        };

        if (!id) {
          console.log(" NO voice ID");
          return;
        }

        const url = `https://voice-auth.herokuapp.com/user/enroll`;
        //const url = `http://localhost:3002/user/enroll`;
        axios({
          url: url,
          method: "post",
          data: data
        })
          .then(result => {
            if (result.status == 201) {
              var count = localStorage.getItem("count");
              var pre = document.getElementById("log");
              switch (count) {
                case count == null:
                  localStorage.setItem("count", 1);
                  pre.innerHTML =
                    "Enrollment successfully 2 more enrollments to go";
                  break;
                case count == 1:
                  localStorage.setItem("count", 2);
                  pre.innerHTML =
                    "Enrollment successfully 1 more enrollments to go";
                  break;
                case count == 2:
                  pre.innerHTML =
                    "All 3 voice enrollments successfully, You can now login with your voice";
                  break;
                default:
                  alert(
                    "Voice enrolled successfully, add two more to complete the proceess"
                  );
                  console.log(count, "is here");
              }
              return;
            }

            if (result.status == 400) {
              console.log(result.data);
            }

            console.log(result);
          })
          .catch(error => {
            var pre = document.getElementById("log");
            pre.innerHTML = error.response.data.msg;
            console.log(error.response.data);
          });
      });
    }
  );

  // Create a root reference
  // Create a reference to 'mountains.jpg'
}
