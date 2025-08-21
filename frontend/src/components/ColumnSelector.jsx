import React, { useState } from "react";
import "../App.css";

function ColumnSelector({
    headers, ready, onSelectColumn
 }) {
    const [selectedColumn, setSelectedColumn] = React.useState("rowid");

    React.useEffect(() => {
        if (headers.length) {
        setSelectedColumn(headers[0]);
        }
    }, [headers]);

    const handleSelectColumn = () => {
        onSelectColumn({selectedColumn});
    };

    return (
        <>
            <select
                className="spaced"
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
            >
                {headers.map((col) => (
                <option value={col} key={col}>
                    {col}
                </option>
                ))}
            </select>
            <button disabled={!ready} onClick={handleSelectColumn} className="spaced">
                Go
            </button>
        </>
    );
}

export default ColumnSelector;