const {
  getAllDocs,
  getDocById,
  createNewDoc,
  updateDocById,
  deleteDocById,
} = require("./controllers");

const express = require("express");
const cors = require("cors");
const router = express.Router();

let corsOption = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

router.use(cors(corsOption));
router.use(express.json());
router.get("/", getAllDocs);
router.get("/:id", getDocById);
router.post("/", createNewDoc);
router.put("/:id", updateDocById);
router.delete("/:id", deleteDocById);

module.exports = router;
