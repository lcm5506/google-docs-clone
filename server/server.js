const axios = require("axios");
const api = "http://localhost:5000/api/v1/docs";
const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("join-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-text-change", (delta) => {
      console.log(delta);
      socket.broadcast.to(documentId).emit("recieve-text-change", delta);
    });
    socket.on("save-document", async (data) => {
      let saved = await axios.put(api + `/${documentId}`, { data });
      console.log(
        "----------------------SAVED DOCUMENT------------------------"
      );
      console.log(saved.status, saved.statusText);
      console.log(saved.data);
    });
  });
});

const defaultValue = "";

async function findOrCreateDocument(id) {
  if (id == null) return;
  let response;
  try {
    console.log("get request sent for document " + id);
    response = await axios.get(api + `/${id}`);
  } catch (err) {
    console.log(`--------------------------------------------`);
    console.log(err);
    console.log(`--------------------------------------------`);
  }
  if (response) return response.data;
  try {
    console.log("post request sent for new document " + id);
    response = await axios.post(api, { id: id, data: defaultValue });
  } catch (err) {
    console.log(`--------------------------------------------`);
    console.log(err);
    console.log(`--------------------------------------------`);
  }
  if (response) return response.data;
  return;
}
