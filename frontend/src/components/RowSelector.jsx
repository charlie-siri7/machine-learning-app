import React, { useState } from "react";
import "../App.css";

function RowSelector({
    headers, ready, onSelectRow
 }) {
    const [selectedColumn, setSelectedColumn] = React.useState("rowid");
    const [operator, setOperator] = React.useState("=");
    const [value, setValue] = React.useState("");

    React.useEffect(() => {
        if (headers.length) {
        setSelectedColumn(headers[0]);
        }
    }, [headers]);

    const handleSelectRow = () => {
        onSelectRow({selectedColumn, operator, value});
    };

    return (
        <div>
            <p className="inline"> where </p>
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
            <select
                className="spaced"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}>
                <option value="=">=</option>
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
            </select>
            <input 
                className="spaced"
                value={value}
                onChange={(e) => setValue(e.target.value)}></input>
            <button disabled={!ready || !value} onClick={handleSelectRow}>
                Go
            </button>
        </div>
    );
}

export default RowSelector;