const URL = "http://192.168.1.102:4002/api"

const loginForm = window.document.querySelector("#loginForm");
const loginInp = window.document.querySelector("#username");
const passwordInp = window.document.querySelector("#password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let res = await fetch(`${URL}/users/login`, {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
    },
    body: JSON.stringify({
      login: loginInp.value,
      password: passwordInp.value
    })
  });
  res = await res.json();
  console.log(res);
  window.localStorage.setItem("token", JSON.stringify(res.data.token))
  window.location.pathname = '/index.html'
});