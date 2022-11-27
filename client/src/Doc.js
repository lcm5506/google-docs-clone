import React from "react";
import { Link } from "react-router-dom";

export default function Doc(props) {
  return (
    <Link to={`/documents/${props.title}`} className="doc">
      <h3 className="doc-title">{props.title}</h3>
    </Link>
  );
}
