import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Sign from "./views/Sign";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign" element={<Sign />} />
    </Routes>
  );
}

export default App;
