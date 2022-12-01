// const uuidV4 = require("uuid");
// const path = require("path");
// const mongoose = require("mongoose");
// const Document = require("./Document");
// mongoose.connect("mongodb://localhost/google-docs-clone");
const Document = require("./database");
const getAllDocs = async (req, res) => {
  let allDocs = await Document.find({});
  if (!allDocs)
    res
      .status(400)
      .json({ status: "failed", message: "Could not find documents" });
  res.status(200).send(allDocs);
  //   res.send(allDocs);
};

const getDocById = async (req, res) => {
  let id = req.params.id;
  console.log(`get request with ID ${id}`);
  if (!id)
    return res
      .status(400)
      .json({ status: "failed", message: "Provided id is invalid." });
  let doc = await Document.findById(id);
  if (!doc)
    return res
      .status(400)
      .json({ status: "failed", message: `Entry with ID ${id} is not found.` });
  return res.status(200).json(doc);
};

const defaultData = "";
const createNewDoc = async (req, res) => {
  console.log(`Creating new document with ID ${req.body.id}`);
  const { id, data } = req.body;
  console.log(id, data);
  if (!id) res.status(400).json({ status: "failed", message: `Invalid ID.` });
  if (!data) await Document.create({ _id: id, data: defaultData });
  else {
    const result = await Document.create({ _id: id, data: data });
    console.log(result);
  }
  res.status(201).json({ status: "success", message: `New document created.` });
};

const updateDocById = async (req, res) => {
  const id = req.params.id;
  if (!id) res.status(400).json({ status: "failed", message: `Invalid ID.` });
  const { data } = req.body;
  if (!data)
    res
      .status(400)
      .json({ status: "failed", message: `Update content is missing.` });
  const result = await Document.findByIdAndUpdate(id, { data });
  console.log(`Document Updated`);
  console.log(result);
  res.status(200).json({ status: "success", message: `Document updated.` });
};

const deleteDocById = async (req, res) => {
  const id = req.params.id;
  if (!id) res.status(400).json({ status: "failed", message: `Invalid ID.` });
  const result = await Document.findByIdAndDelete(id);
  console.log("Document deleted");
  console.log(result);
  res.status(200).json({ status: "success", message: `Document deleted.` });
};

module.exports = {
  getAllDocs,
  getDocById,
  createNewDoc,
  updateDocById,
  deleteDocById,
};
