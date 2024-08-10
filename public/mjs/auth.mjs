//Google Autenticación

async function handleCredentialResponse(response) {
  const body = {
    id_token: response.credential,
  };

  await fetch(`${window.location.origin}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => {
      //console.log(res);
      localStorage.setItem("app-token", res.token);
      localStorage.setItem("email", res.user.email);
      window.location = "chat.html";
      //location.reload();
    })
    .catch(console.warn);
}

const button = document.querySelector("#google_signout");
button.onclick = () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};

//Local Autenticación

const my_form = document.querySelector("form");
my_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const form_data = {};

  for (let element of my_form.elements) {
    if (element.name.length > 0) {
      form_data[element.name] = element.value;
    }
  }

  fetch(`${window.location.origin}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(form_data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.msg) {
        return console.error(res.msg);
      }
      localStorage.setItem("app-token", res.token);
      localStorage.setItem("email", res.user.email);
      window.location = "chat.html";
      //location.reload();
    })
    .catch((err) => console.error(err));
});
