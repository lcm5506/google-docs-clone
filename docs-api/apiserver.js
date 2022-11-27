const express = require("express");
const app = express();
const router = require("./router");

const PORT = 5000;

app.use("/api/v1/docs", router);

app.listen(PORT, () => console.log(`Server is now listening on port #${PORT}`));
