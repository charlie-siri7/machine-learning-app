import React, { useState } from "react";
import "../App.css";

function Dropbox({ onDrop, children }) {
  const [hover, setHover] = useState(false);


  const handleDrop = (e) => {
    e.preventDefault();
    setHover(false);
    onDrop(e);
  };

  return (
    <div
      className={`div1${hover ? " hovered" : ""}`}
      onDragEnter={() => { setHover(true); }}
      onDragLeave={() => { setHover(false); }}
      onDragOver={(e) => { e.preventDefault(); }}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}

export default Dropbox;