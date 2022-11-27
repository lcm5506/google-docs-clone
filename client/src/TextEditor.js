import React, { useEffect, useCallback, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./TextEditor.css";
import { io } from "socket.io-client";
import { useParams, Link } from "react-router-dom";

export default function TextEditor() {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id: documentId } = useParams();
  const [lastSaved, setLastSaved] = useState();
  const SAVE_INTERVAL = 10000;

  // handles socket.io connection.
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // handles retreiving existing document content if there is one. else the server will send new document.
  useEffect(() => {
    console.log(documentId);
    if (socket == null || quill == null || documentId == null) return;
    socket.emit("join-document", documentId);
    socket.on("load-document", (document) => {
      console.log("loading document");
      console.log(document);
      quill.setContents(document);
      quill.enable();
    });
  }, [socket, quill, documentId]);

  // sends the changes user makes to the server so it can be broadcasted to other users.
  useEffect(() => {
    if (quill == null || socket == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-text-change", delta);
    };
    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [quill, socket]);

  // Handles recieved delta which comes from others changing the document at the same time
  useEffect(() => {
    if (quill == null || socket == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("recieve-text-change", handler);

    return () => socket.off("recieve-text-change", handler);
  }, [quill, socket]);

  // callback function to create quill obj and attach to container
  const containerRef = useCallback((element) => {
    if (element == null) return;
    element.innerHTML = "";
    let editorContainer = document.createElement("div");
    element.append(editorContainer);
    let toolbarOptions = [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown

      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"], // toggled buttons
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ align: [] }],
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme

      ["blockquote", "code-block"],
      ["clean"], // remove formatting button
    ];
    let q = new Quill(editorContainer, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    q.disable();
    q.setText("Please wait until we finish loading...");
    setQuill(q);
  }, []);

  // Saving automatically at set interval
  useEffect(() => {
    if (quill == null || socket == null) return;
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
      let savedDate = new Date();
      setLastSaved(savedDate.toLocaleTimeString("en-US"));
    }, SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [quill, socket]);

  return (
    <>
      <Link to="/" className="back-btn">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>
      <div id="container" ref={containerRef}></div>
      {/* <div className="info-display">
        <div className="info-item">
          <p className="info-label">ID: </p>
          <p className="info-text">{documentId}</p>
        </div>
        {lastSaved ? (
          <div className="info-item">
            <p className="info-label">Last Saved: </p>
            <p className="info-text">{lastSaved}</p>
          </div>
        ) : (
          ""
        )}
      </div> */}
    </>
  );
}
