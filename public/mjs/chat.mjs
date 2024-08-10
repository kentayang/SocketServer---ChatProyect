let user = null;
let socket = null;

//Referencias HMTL
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

const validarJWT = async () => {
  const token = localStorage.getItem("app-token") || "";
  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token válido");
  }

  const resp = await fetch(`${window.location.origin}/api/auth`, {
    headers: { "app-token": token },
  })
    .then((res) => res.json())
    .then((data) => {
      const { user: userDB, token: tokenDB } = data;
      localStorage.setItem("app-token", tokenDB);
      user = userDB;
      document.title = user.name;
    });

  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      "app-token": localStorage.getItem("app-token"),
    },
  });

  socket.on("connect", () => {
    console.log("Sockets online");
  });

  socket.on("disconnect", () => {
    console.log("Sockets offline");
  });

  socket.on("recibir-mensajes", showMessages);
  socket.on("usuarios-activos", showUsers);

  socket.on("mensaje-privado", (payload) => {
    console.log("Privado", payload);
  });
};

const showUsers = (users = []) => {
  let usersHTML = "";
  users.forEach(({ name, uid }) => {
    usersHTML += `
      <li>
        <p>
          <h5 class="text-success"> ${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;
  });
  ulUsuarios.innerHTML = usersHTML;
};

const showMessages = (messages = []) => {
  let messagesHTML = "";
  messages.forEach(({ name, message }) => {
    messagesHTML += `
      <li>
        <p>
          <span class="text-primary"> ${name}: </span>
          <span>${message}</span>
        </p>
      </li>
    `;
  });
  ulMensajes.innerHTML = messagesHTML;
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const message = txtMensaje.value;
  const uid = txtUid.value;
  //console.log(keyCode);
  if (keyCode !== 13) return;
  if (message.length === 0) return;
  if (message.trim().length === 0) return;

  socket.emit("enviar-mensaje", { message, uid });
  txtMensaje.value = "";
});

const main = async () => {
  await validarJWT();
};
main();
