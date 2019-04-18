const createAccount = document.getElementById("createAccount");
const next = document.getElementById("next");
//const url = "http://localhost:3002/create/user";
const url = "https://voice-auth.herokuapp.com/create/user";
createAccount.addEventListener("click", createUserAccount);
next.addEventListener("click", function(e) {
  e.preventDefault();
  window.location.replace("./register.html");
});

function createUserAccount(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  let data = {
    email: email,
    name: name,
    password: password
  };

  axios({
    url: url,
    method: "post",
    data: data
  })
    .then(result => {
      if (result.status === 400) {
        let pre = document.getElementById("log");
        pre.innerHTML = "One or more parameters missing";
        return;
      }

      if (result.status === 200) {
        next.disabled = false;
        console.log(result.data.user_id);
        let data = {
          dbId: result.data._id,
          voiceId: result.data.user_id,
          email: result.data.email,
          name: result.data.name
        };

        localStorage.setItem("user_id", JSON.stringify(data));
        let pre = document.getElementById("log");
        pre.innerHTML = "Account created successfully, click next to proceed";
        return;
      }

      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });

  //console.log(data);
}
