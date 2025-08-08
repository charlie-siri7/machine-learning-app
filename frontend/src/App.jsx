import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
"use client"

import React from "react";
import { parse } from "papaparse";

function App() {
  const [hover, setHover] = React.useState(false);
    const [data, setData] = React.useState([
      { rowid: 999, species: "penguin", island: "Antarctica"}, 
    ]);
    React.useEffect(() => {
      console.log("Data after update:", data)
    }, [data])
    return (
          <div>
            <div className={`div1${hover ? " hovered" : ""}`}
              onDragEnter={() => {
                setHover(true);
              }}
              onDragLeave={() => {
                setHover(false);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                setHover(false);
  
                console.log(e.dataTransfer.files);
                Array.from(e.dataTransfer.files).filter((file) => file.type === "text/csv")
                  .forEach(async (file) => {
                    const text = await file.text();
                    const result_headers = parse(text, { header: false }).data[0];
                    console.log("CSV Headers:", result_headers)
                    const result_data = parse(text, { header: true });
                    console.log("CSV Data:", result_data)
                    setData(existing => [...existing, ...result_data.data])
                  });
              }}>
                Drop file here
            </div>
  
            <ul>
              {data.map((datapoint) => (
                <li key = {datapoint.rowid}>
                  <strong>{datapoint.species}</strong>: {datapoint.island}
                </li>
              ))}
            </ul>
          </div>
    );
}

export default App
