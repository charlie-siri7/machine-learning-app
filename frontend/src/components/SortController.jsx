import React, { useState } from "react";
import "../App.css";

function SortController({
    ready, onSort, headers
 }) {
    const [selectedColumn, setSelectedColumn] = React.useState("rowid");
    const [selectedSort, setSelectedSort] = React.useState("None");

    const handleSort = () => {
        onSort({ selectedColumn, selectedSort });
    };

    return (
        <div>
            <label>Sort by: </label>
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

            <select
                value={selectedSort}
                onChange={e => setSelectedSort(e.target.value)}
            >
                <option value="None">None</option>
                <option value="Increasing">Increasing</option>
                <option value="Decreasing">Decreasing</option>
            </select>

            <button disabled={!ready} onClick={handleSort}>
                Go
            </button>
        </div>
    );
}

export default SortController;