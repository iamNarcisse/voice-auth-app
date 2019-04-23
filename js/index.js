const createAccount = document.getElementById("createAccount");
const next = document.getElementById("next-button");
const handleSpinner = document.getElementsByClassName('spinner-1')
//const url = "http://localhost:3002/create/user";
const url = "https://voice-auth.herokuapp.com/create/user";
createAccount.addEventListener("click", createUserAccount);
next.addEventListener("click", function(e) {
  e.preventDefault();
  window.location.replace("./register.html");
});

function createUserAccount(e) {
  e.preventDefault();
  document.getElementById("spinner").style.visibility = "visible"
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  let data = {
    email: email,
    name: name,
    password: password
  };

  if (!email || !name || !password){
    alert("One or more parameters missing")
    document.getElementById("spinner").style.visibility = "hidden"
    return;
  }


  axios({
    url: url,
    method: "post",
    data: data
  })
    .then(result => {
      if (result.status === 400) {
        //let pre = document.getElementById("log");
        //pre.innerHTML = "One or more parameters missing";
        alert("One or more paramater missing");
        return;
      }

      if (result.status === 200) {

        //next.disabled = false;
        console.log(result.data.user_id);
        let data = {
          dbId: result.data._id,
          voiceId: result.data.user_id,
          email: result.data.email,
          name: result.data.name
        };

        localStorage.setItem("user_id", JSON.stringify(data));

        document.getElementById("form").style.visibility = "hidden";
        document.getElementById("spinner").style.visibility ="hidden";
        document.getElementById("next-button").style.visibility = "visible";
        //let pre = document.getElementById("log");
        //pre.innerHTML = "Account created successfully, click next to proceed";
        alert("Account created successfully");
        return;
      }
//console.log(result);
    })
    .catch(error => {
      alert(error.response.data.msg);
      document.getElementById("spinner").style.visibility = "hidden"
    });

  //console.log(data);
}
