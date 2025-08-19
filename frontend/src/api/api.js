export async function postJSON(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Posting JSON data failed:", await response.text());
      return;
    }

    // const result = await response.json();
    return response.json();
}

export const getData = (headers, data) => {
    postJSON("http://localhost:8000/api/receive-data/", {headers, data})
}

export async function postForm(url, data) {

    const response = await fetch(url, {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      console.error("Posting form data failed:", await response.text());
      return;
    }

    return response.json();
}

export const sortCSV = (file, column) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("column", column);
    return postForm("http://localhost:8000/api/sort-csv/", formData);
}

export const getRow = (file, column, operator, value) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("column", column);
    formData.append("operator", operator);
    formData.append("value", value);
    return postForm("http://localhost:8000/api/select-row/", formData);
}

export const getColumn = (file, column) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("column", column);
    return postForm("http://localhost:8000/api/select-column/", formData);
}

export const getScatterplot = (file, x_column, y_column) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("x_column", x_column);
    formData.append("y_column", y_column);
    return postForm("http://localhost:8000/api/scatterplot/", formData);
}