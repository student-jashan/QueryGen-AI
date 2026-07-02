/* ==========================================
   NL2SQL Assistant
   script.js  (full logic — no changes)
========================================== */

const API = "http://127.0.0.1:8000/api";

/* DOM ELEMENTS */
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");
const askBtn = document.getElementById("askBtn");
const clearBtn = document.getElementById("clearBtn");
const questionInput = document.getElementById("questionInput");
let currentTableName = "";
const sqlOutput = document.getElementById("sqlOutput");
const resultTable = document.getElementById("resultTable");
const tableHead = resultTable.querySelector("thead");
const tableBody = resultTable.querySelector("tbody");
const loadingSection = document.getElementById("loadingSection");
const datasetName = document.getElementById("datasetName");
const rowCount = document.getElementById("rowCount");
const columnCount = document.getElementById("columnCount");
const historyList = document.getElementById("historyList");
const resultCount = document.getElementById("resultCount");

let queryHistory = [];
let currentResults = [];

function showLoading() { loadingSection.classList.remove("hidden"); }
function hideLoading() { loadingSection.classList.add("hidden"); }
function showSuccess(message) {
  uploadStatus.innerHTML = `<div class="success-box"><i class="fas fa-check-circle"></i> ${message}</div>`;
}
function showError(message) {
  uploadStatus.innerHTML = `<div class="error-box"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
}
function clearMessage() { uploadStatus.innerHTML = ""; }

function updateDatasetInfo(data) {
  datasetName.textContent = data.filename || "Uploaded Dataset";
  rowCount.textContent = data.row_count ?? "--";
  columnCount.textContent = data.column_count ?? "--";
}

uploadBtn.addEventListener("click", async () => {
  clearMessage();
  const file = fileInput.files[0];
  if (!file) { showError("Please select a CSV or Excel file."); return; }
  const formData = new FormData();
  formData.append("file", file);
  showLoading();
  try {
    const response = await fetch(`${API}/upload`, { method: "POST", body: formData });
    const data = await response.json();
    hideLoading();
    if (!response.ok) throw new Error(data.detail || "Upload failed");
    showSuccess("Dataset uploaded successfully.");
    updateDatasetInfo(data);
    if (data.table_name) currentTableName = data.table_name;
  } catch (error) {
    hideLoading();
    showError(error.message);
    console.error(error);
  }
});

function clearTable() {
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";
  resultCount.textContent = "0 Records";
}
function clearSQL() {
  sqlOutput.textContent = "Waiting for question…";
}

askBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (question === "") { alert("Please enter your question."); return; }
  showLoading();
  try {
    const response = await fetch(`${API}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question, table_name: currentTableName })
    });
    const data = await response.json();
    hideLoading();
    if (!response.ok) throw new Error(data.detail || "Failed to generate SQL.");
    renderSQL(data.generated_sql);
    renderTable(data.results);
    resultCount.textContent = `${data.row_count} Records`;
    addToHistory(question);
  } catch (error) {
    hideLoading();
    alert(error.message);
    console.error(error);
  }
});

function renderSQL(sql) {
  if (!sql) { sqlOutput.textContent = "No SQL generated."; return; }
  sqlOutput.textContent = sql;
}

function renderTable(rows) {
  currentResults = rows;
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";
  if (!rows || rows.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="100%" class="no-data">No Records Found</td></tr>`;
    resultCount.textContent = "0 Records";
    return;
  }
  const headers = Object.keys(rows[0]);
  let headerHTML = "<tr>";
  headers.forEach(column => { headerHTML += `<th>${column}</th>`; });
  headerHTML += "</tr>";
  tableHead.innerHTML = headerHTML;
  rows.forEach(row => {
    let rowHTML = "<tr>";
    headers.forEach(column => {
      rowHTML += `<td>${formatNumber(row[column])}</td>`;
    });
    rowHTML += "</tr>";
    tableBody.innerHTML += rowHTML;
  });
}

function addToHistory(question) {
  queryHistory.unshift(question);
  if (queryHistory.length > 10) queryHistory.pop();
  historyList.innerHTML = "";
  queryHistory.forEach(item => {
    historyList.innerHTML += `<li><i class="fas fa-history"></i> ${item}</li>`;
  });
}

// copy SQL
const copySqlBtn = document.getElementById("copySqlBtn");
copySqlBtn.addEventListener("click", async () => {
  const sql = sqlOutput.textContent.trim();
  if (sql === "" || sql === "Waiting for question…" || sql === "No SQL generated.") {
    alert("No SQL available to copy.");
    return;
  }
  try {
    await navigator.clipboard.writeText(sql);
    copySqlBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => { copySqlBtn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 2000);
  } catch { alert("Unable to copy SQL."); }
});

clearBtn.addEventListener("click", () => {
  questionInput.value = "";
  clearSQL();
  clearTable();
});

questionInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    askBtn.click();
  }
});

historyList.addEventListener("click", function(event) {
  if (event.target.tagName === "LI") {
    questionInput.value = event.target.textContent.trim();
    questionInput.focus();
  }
});

function resetDataset() {
  datasetName.textContent = "No dataset uploaded";
  rowCount.textContent = "--";
  columnCount.textContent = "--";
}
function clearHistory() { queryHistory = []; historyList.innerHTML = ""; }
function resetApplication() {
  clearSQL(); clearTable(); clearHistory(); resetDataset();
  fileInput.value = ""; currentTableName = ""; questionInput.value = "";
}

function formatNumber(value) {
  if (typeof value === "number") return value.toLocaleString();
  return value;
}

/* theme toggle */
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem("nl2sql-theme", isLight ? "light" : "dark");
});
if (localStorage.getItem("nl2sql-theme") === "light") {
  document.body.classList.add("light-mode");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

window.addEventListener("load", () => {
  hideLoading();
  clearSQL();
  clearTable();
});

async function checkBackend() {
  try {
    const response = await fetch("http://127.0.0.1:8000/");
    if (response.ok) console.log("Backend Connected");
    else console.warn("Backend Running with Issues");
  } catch { console.error("Backend Not Reachable"); }
}
checkBackend();

console.log("================================");
console.log("NL2SQL Assistant Loaded");
console.log("FastAPI Endpoint :", API);
console.log("================================");
