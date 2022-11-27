import "./App.css";
import TextEditor from "./TextEditor";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DocumentSelection from "./DocumentSelection";

function App() {
  return (
    <>
      {/* <DocumentSelection></DocumentSelection> */}
      <Router>
        <Routes>
          {/* <Route
            path="/"
            exact
            element={<Navigate to={`documents/${uuidV4()}`} />}
          ></Route> */}
          <Route
            path="/"
            exact
            element={<DocumentSelection></DocumentSelection>}
          ></Route>
          <Route path="/documents/:id" element={<TextEditor />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
