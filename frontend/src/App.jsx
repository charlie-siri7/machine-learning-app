
import './App.css'
"use client"

import React from "react";
import { parse } from "papaparse";

function App() {
  const [hover, setHover] = React.useState(false);
  const [data, setData] = React.useState([
    { rowid: 999, species: "penguin", island: "Antarctica"}, 
  ]);
  const [headers, setHeaders] = React.useState([]);
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
                  setHeaders(result_headers)
                  console.log("CSV Headers:", result_headers)
                  const result_data = parse(text, { header: true });
                  console.log("CSV Data:", result_data)
                  setData(existing => [...existing, ...result_data.data])
                });
            }}>
              Drop file here
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  {headers.map((header_index) => (
                    <th key={header_index}>{header_index}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, row_index) => (
                <tr key={row_index}>
                  {headers.map(header_index => (
                    <td key={header_index}>{row[header_index]}</td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
  );
}

export default App
