
import './App.css'
"use client"

import React from "react";
import { parse } from "papaparse";

function App() {
  const [hover, setHover] = React.useState(false);
  const [originalData, setOriginalData] = React.useState([]);
  const [data, setData] = React.useState([
    { rowid: 999, species: "penguin", island: "Antarctica"}, 
  ]);
  const [headers, setHeaders] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [selectedColumn, setSelectedColumn] = React.useState("rowid");
  const [selectedColumn2, setSelectedColumn2] = React.useState("rowid");
  const [selectedColumn3, setSelectedColumn3] = React.useState("rowid");
  const [selectedSort, setSelectedSort] = React.useState("None");
  const [rowOrCol, setRowOrCol] = React.useState("Row");
  const [operator, setOperator] = React.useState("=");
  const [visibleHeaders, setVisibleHeaders] = React.useState(headers);

  const sendDataToBackend = async (newHeaders, newData) => {
    const response = await fetch('http://localhost:8000/api/receive-data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: newHeaders,
        headers: newData,
      }),
    });
    const result = await response.json();
    console.log(result);
  };

  // When headers change, default the dropdown to the first column
  React.useEffect(() => {
    if (headers.length && !selectedColumn) {
      setSelectedColumn(headers[0]);
    }
  }, [headers, selectedColumn]);

  const handleDrop = async (e) => {
    e.preventDefault();
    setHover(false);

    const csvFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === "text/csv");
    if (csvFiles.length > 0) {
      // Get .csv file
      const file = csvFiles[0];
      setFile(file);
      const text = await file.text();
      // Get headers from .csv file
      const result_headers = parse(text, { header: false }).data[0];
      setHeaders(result_headers);
      console.log("CSV Headers:", result_headers)
      // Get rest of .csv file
      const result_data = parse(text, { header: true });
      setData(existing => [...existing, ...result_data.data]);
      setOriginalData(existing => [...existing, ...result_data.data]);
      console.log("CSV Data:", result_data)
      // Send data to backend
      sendDataToBackend(result_headers, [...data, ...result_data.data])
    }
  };

  React.useEffect(() => {
    setVisibleHeaders(headers);
  }, [headers]);

  // Call backend to sort CSV by selected column
  const handleSort = async () => {
    // Make sure a file and column are selected
    if (!file || !selectedColumn) return;

    setVisibleHeaders(headers);
    
    if (selectedSort == "None") {
      setData(originalData);
      return;
    }
    // Body of post request - with file and column
    const formData = new FormData();
    formData.append("file", file);
    formData.append("column", selectedColumn);
    // Fetch and await response (post request to backend)
    const response = await fetch("http://localhost:8000/api/sort-csv/", {
      method: "POST",
      body: formData,
    });

    // If response fails
    if (!response.ok) {
      console.error("Sort failed:", await response.text());
      return;
    }

    // Set displayed data to sorted data if response is successful
    const json = await response.json();

    if (selectedSort == "Decreasing") {
      json.reverse();
    }
    setData(json);
  };

  const handleSelectRow = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("column", selectedColumn2);
    formData.append("operator", operator);
    formData.append("value", document.querySelector("input").value);
    
    const response = await fetch("http://localhost:8000/api/select-row/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Select row failed:", await response.text());
      return;
    }

    setVisibleHeaders(headers);
    const json = await response.json();
    setData(json);
  };

  const handleSelectColumn = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("column", selectedColumn3);

    const response = await fetch("http://localhost:8000/api/select-column/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Select column failed:", await response.text());
      return;
    }

    setVisibleHeaders([selectedColumn3]);
    const json = await response.json();
    setData(json);
  }

  return (
        <div>
          <div className={`div1${hover ? " hovered" : ""}`}
            onDragEnter = {() => { setHover(true); }}
            onDragLeave = {() => { setHover(false); }}
            onDragOver = {(e) => { e.preventDefault(); }}
            onDrop = { handleDrop }>
              Drop file here
          </div>

          {headers.length > 0 && (
            <>
              <div>
                <label>Sort by: </label>
                <select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                >
                  {headers.map((col) => (
                    <option value={col} key={col}>
                      {col}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="Increasing">Increasing</option>
                  <option value="Decreasing">Decreasing</option>
                </select>

                <button onClick={handleSort}>
                  Go
                </button>
              </div>
              <br></br>
              <div>
                <label className="spaced">Select</label>
                <select
                  className="spaced"
                  value={rowOrCol}
                  onChange={(e) => setRowOrCol(e.target.value)}>
                  <option value="Row">Row</option>
                  <option value="Column">Column</option>
                </select>
                {rowOrCol == "Row" && (
                  <>
                    <p className="inline"> where </p>
                    <select
                      className="spaced"
                      value={selectedColumn2}
                      onChange={(e) => setSelectedColumn2(e.target.value)}
                    >
                      {headers.map((col) => (
                        <option value={col} key={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                    <select
                      className="spaced"
                      value={operator}
                      onChange={(e) => setOperator(e.target.value)}>
                      <option value="=">=</option>
                      <option value=">">&lt;</option>
                      <option value="<">&gt;</option>
                    </select>
                    <input className="spaced"></input>
                    <button onClick={handleSelectRow}>
                      Go
                    </button>
                  </>
                )}
                {rowOrCol == "Column" && (
                  <>
                    <select
                      className="spaced"
                      value={selectedColumn3}
                      onChange={(e) => setSelectedColumn3(e.target.value)}
                    >
                      {headers.map((col) => (
                        <option value={col} key={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                    <button onClick={handleSelectColumn}>
                      Go
                    </button>
                  </>
                )}
                
              </div>
            </>
          )}
          <div>
            <table>
              <thead>
                <tr>
                  {visibleHeaders.map((header_index) => (
                    <th key={header_index}>{header_index}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, row_index) => (
                  <tr key={row_index}>
                    {visibleHeaders.map(header_index => (
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