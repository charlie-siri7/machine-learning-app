import React, { useState } from "react";
import "../App.css";

function ScatterplotController({
    ready, onGenerate, onToggle, headers, showScatterplot
 }) {
    const [XColumn, setXColumn] = React.useState("rowid");
    const [YColumn, setYColumn] = React.useState("rowid");

    
    React.useEffect(() => {
        if (headers.length > 0) {
            setXColumn(headers[0]);
            setYColumn(headers[1] || headers[0]);
        }
    }, [headers]);

    // const handleScatterplot = () => {
    //     onHandleScatterplot({headers, XColumn, YColumn});
    // };

    // const toggleShowScatterplot = () => {
    //     onToggleShowScatterplot({});
    // };

    return (
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
            <button disabled={!ready} onClick={() => onGenerate(XColumn, YColumn)}>
                Generate
            </button>
            <button disabled={!ready} onClick={onToggle}>
                {showScatterplot ? "Hide" : "Show"}
            </button>
        </div>
    );
}

export default ScatterplotController;