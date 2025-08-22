import React, { useState } from "react";
import "../App.css";

function DataTable({
    visibleHeaders, data
 }) {

    return (
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
    );
}

export default DataTable;