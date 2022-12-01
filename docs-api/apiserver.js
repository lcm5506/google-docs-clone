const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const router = require("./router");
const Document = require("./database");

const PORT = 5000;

app.use(express.static("public"));
app.use("/api/v1/docs", router);

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("join-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document);

    socket.on("send-text-change", (delta) => {
      console.log(documentId + " :: " + JSON.stringify(delta));
      socket.broadcast.to(documentId).emit("recieve-text-change", delta);
    });
    socket.on("save-document", async (data) => {
      let saved = await Document.findByIdAndUpdate(documentId, { data });
      console.log(`SAVED DOCUMENT: ${documentId}`);
      console.log(saved);
    });
  });
});

const defaultValue = "";

async function findOrCreateDocument(id) {
  if (id == null) return;
  let response;
  try {
    console.log("get request sent for document: " + id);
    response = await Document.findById(id);
    console.log(response);
  } catch (err) {
    console.log(`--------------------------------------------`);
    console.log(err);
    console.log(`--------------------------------------------`);
  }
  if (response) return response.data;
  try {
    console.log("post request sent for new document: " + id);
    response = await Document.create({ _id: id, data: defaultValue });
    console.log(response);
  } catch (err) {
    console.log(`--------------------------------------------`);
    console.log(err);
    console.log(`--------------------------------------------`);
  }
  if (response) return response.data;
  return;
}

server.listen(PORT, () =>
  console.log(`Server is now listening on port #${PORT}`)
);
