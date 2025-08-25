
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
import ColumnSelector from "./components/ColumnSelector.jsx";
import ScatterplotController from "./components/ScatterplotController.jsx";
import DataTable from "./components/DataTable.jsx";

function App() {
  const [hover, setHover] = React.useState(false);
  const [originalData, setOriginalData] = React.useState([]);
  const [data, setData] = React.useState([
    { rowid: 999, species: "penguin", island: "Antarctica"}, 
  ]);
  const [headers, setHeaders] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [rowOrCol, setRowOrCol] = React.useState("Row");
  const [datasetsToPredict, setDatasetsToPredict] = React.useState("1");
  const [visibleHeaders, setVisibleHeaders] = React.useState(headers);
  const [ready, setReady] = React.useState(false);
  const [scatterplotImage, setScatterplotImage] = React.useState(null);
  const [showScatterplot, setShowScatterplot] = React.useState(false);
  const [selectedColumn, setSelectedColumn] = React.useState("rowid");

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

  const handleSelectColumn = async ({selectedColumn}) => {
    setVisibleHeaders([selectedColumn]);
    const json = await getColumn(file, selectedColumn)
    setData(json);
  }

  const toggleShowScatterplot = () => {
    setShowScatterplot(prev => !prev);
  };

  const handleScatterplot = async (XColumn, YColumn) => {
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
                  <ColumnSelector headers={headers} ready={ready} onSelectColumn={handleSelectColumn} />
                )}
              </div>
              <ScatterplotController ready={ready} onGenerate={handleScatterplot} onToggle={toggleShowScatterplot} headers={headers} showScatterplot={showScatterplot} />

              <div>
                <label>Predict </label>
                <select
                    value={selectedColumn}
                    onChange={e => setSelectedColumn(e.target.value)}
                >
                    {headers.map((col) => (
                    <option value={col} key={col}>
                        {col}
                    </option>
                    ))}
                </select>
                <label> by </label>
                <select
                  value={datasetsToPredict}
                  onChange={(e) => setDatasetsToPredict(e.target.value)}>
                  <option value="1">1 Dataset (the current one)</option>
                  <option value="2">2 Datasets</option>
                </select>
                <div>
                  {datasetsToPredict == "2" && (
                    <span className="dropbox-row">
                      <Dropbox onDrop={handleDrop}>Add Training Dataset Here</Dropbox>
                      <Dropbox onDrop={handleDrop}>Add Testing Dataset Here</Dropbox>
                    </span>
                  )}
                  <button>
                  Go
                </button>
                </div>
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
          <DataTable visibleHeaders={visibleHeaders} data={data} />
        </div>
  );
}

export default App