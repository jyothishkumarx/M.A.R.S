const API_URL = "http://localhost:5000/api";

const output = document.getElementById("output");

// Scan File
async function scanFile() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/scan`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
}

// Redact File
async function redactFile() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/redact`, {
        method: "POST",
        body: formData
    });

    const blob = await res.blob();

    // AUTO DOWNLOAD
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cleaned_file";
    a.click();
}

// Get Logs
async function getLogs() {
    const res = await fetch(`${API_URL}/audit`);
    const data = await res.json();

    output.textContent = JSON.stringify(data, null, 2);
}

document.getElementById("risk").innerText =
    `Risk: ${data.riskScore} (${data.severity})`;