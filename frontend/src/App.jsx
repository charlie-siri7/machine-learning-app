
import './App.css'
"use client"

import React, { useState } from "react";
import { parse } from "papaparse";
import {
  getData,
  sortCSV,
  getRow,
  getColumn,
  getScatterplot,
} from "./api/api";
import Dropbox from "./components/dropbox.jsx";
import SortController from "./components/SortController.jsx";
import RowSelector from "./components/RowSelector.jsx";

function App() {
  const [hover, setHover] = React.useState(false);
  const [originalData, setOriginalData] = React.useState([]);
  const [data, setData] = React.useState([
    { rowid: 999, species: "penguin", island: "Antarctica"}, 
  ]);
  const [headers, setHeaders] = React.useState([]);
  const [file, setFile] = React.useState(null);
  // const [selectedColumn, setSelectedColumn] = React.useState("rowid");
  const [selectedColumn2, setSelectedColumn2] = React.useState("rowid");
  const [selectedColumn3, setSelectedColumn3] = React.useState("rowid");
  const [XColumn, setXColumn] = React.useState("rowid");
  const [YColumn, setYColumn] = React.useState("rowid");
  // const [selectedSort, setSelectedSort] = React.useState("None");
  const [rowOrCol, setRowOrCol] = React.useState("Row");
  const [operator, setOperator] = React.useState("=");
  const [visibleHeaders, setVisibleHeaders] = React.useState(headers);
  const [ready, setReady] = React.useState(false);
  const [scatterplotImage, setScatterplotImage] = React.useState(null);
  const [showScatterplot, setShowScatterplot] = React.useState(false);

  React.useEffect(() => {
    setVisibleHeaders(headers);
  }, [headers]);

  // To avoid race conditions with backend calls
  React.useEffect(() => {
    fetch('/api/health/').then(res => {
      if (res.ok) setReady(true);
    });
  }, []);

  // Call backend to sort CSV by selected column
  const handleSort = async ({selectedColumn, selectedSort}) => {
    // Make sure a file and column are selected
    if (!file || !selectedColumn) return;

    setVisibleHeaders(headers);

    if (selectedSort == "None") {
      setData(originalData);
      return;
    }

    let json = await sortCSV(file, selectedColumn)

    if (selectedSort == "Decreasing") {
      json.reverse();
    }
    setData(json);
  };

  const handleSelectRow = async ({selectedColumn, operator, value}) => {
    setVisibleHeaders(headers);
    let json = await getRow(file, selectedColumn, operator, value);
    setData(json);
  };

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
      const result_data = parse(text, { header: true });

      setHeaders(result_headers);
      setData(existing => [...existing, ...result_data.data]);
      setOriginalData(existing => [...existing, ...result_data.data]);
      
      console.log("CSV Headers:", result_headers)
      console.log("CSV Data:", result_data)
      getData(result_headers, [...data, ...result_data.data]);
    }
  };

  const handleSelectColumn = async () => {
    setVisibleHeaders([selectedColumn3]);
    const json = await getColumn(file, selectedColumn3)
    setData(json);
  }

  const toggleShowScatterplot = () => setShowScatterplot(prev => !prev);

  const handleScatterplot = async () => {
    setVisibleHeaders(headers);
    const json = await getScatterplot(file, XColumn, YColumn);
    setScatterplotImage(json.image);
    setShowScatterplot(true);
  }


  return (
        <div>
          <Dropbox onDrop={handleDrop}>Drop file here</Dropbox>

          {headers.length > 0 && (
            <>
              <SortController headers={headers} onSort={handleSort} ready={ready} />
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
                    <RowSelector headers={headers} ready={ready} onSelectRow={handleSelectRow} />
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
                    <button disabled={!ready} onClick={handleSelectColumn}>
                      Go
                    </button>
                  </>
                )}
              </div>
              <div>
                <label className="spaced">Generate Scatterplot Comparing</label>
                <select
                  value={XColumn}
                  onChange={(e) => setXColumn(e.target.value)}
                >
                  {headers.map((col) => (
                    <option value={col} key={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <select
                  value={YColumn}
                  onChange={(e) => setYColumn(e.target.value)}
                >
                  {headers.map((col) => (
                    <option value={col} key={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <button disabled={!ready} onClick={handleScatterplot}>
                  Generate
                </button>
                <button disabled={!ready} onClick={toggleShowScatterplot}>
                  {showScatterplot ? "Hide" : "Show"}
                </button>
              </div>
            </>
          )}
          {showScatterplot && scatterplotImage && (
            <img
              src={`data:image/png;base64,${scatterplotImage}`}
              alt="Scatterplot"
              style={{ maxWidth: "100%", height: "auto", marginTop: 20 }}
            />
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