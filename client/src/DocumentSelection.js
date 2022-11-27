import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Doc from "./Doc";
import { v4 as uuidV4 } from "uuid";

export default function DocumentSelection() {
  const [docs, setDocs] = useState([]);
  const timeout = 5000;
  useEffect(() => {
    const source = axios.CancelToken.source();
    const api = "http://localhost:5000/api/v1/docs";
    axios
      .get(api, {
        cancelToken: source.token,
        timeout: timeout,
      })
      .then((res) => {
        if (res.data) setDocs(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
    return () => {
      source.cancel("Cancel in cleanup");
    };
  }, []);

  console.log(docs);
  return (
    <div className="document-selection">
      {docs.map((doc) => (
        <Doc key={doc._id} title={doc._id} content={doc.data} />
      ))}
      <Link to={`documents/${uuidV4()}`} className="newdoc-btn doc">
        <i className="fa-solid fa-plus"></i>
      </Link>
    </div>
  );
}
