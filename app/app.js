function sendRequest() {
    const url = document.getElementById("url").value;
    const method = document.getElementById("method").value;
    const params = {};

    // Collect non-empty key-value pairs as parameters
    const keyInputs = document.querySelectorAll(".key");
    const valueInputs = document.querySelectorAll(".value");
    for (let i = 0; i < keyInputs.length; i++) {
        const key = keyInputs[i].value.trim();
        const value = valueInputs[i].value.trim();
        if (key !== "") {
            params[key] = value;
        }
    }

    // Create the API call and handle the response
    const apiUrl = `${url}?${new URLSearchParams(params).toString()}`;
    fetch(apiUrl, { method })
        .then(response => response.json())
        .then(data => {
            const responseContent = document.getElementById("response-content");
            if (isTableResponse(data)) {
                // Display the JSON response as an HTML table
                responseContent.innerHTML = jsonToTable(data);
            } else {
                // Display the raw JSON response
                responseContent.textContent = JSON.stringify(data, null, 2);
            }
        })
        .catch(error => {
            document.getElementById("response-content").textContent = `Error: ${error.message}`;
        });
}

// Function to check if the response data represents a table structure
function isTableResponse(data) {
    return Object.keys(data).every(key => typeof data[key] === "object" && Object.keys(data[key]).every(innerKey => !isNaN(innerKey)));
}

// Function to convert JSON data to an HTML table
function jsonToTable(data) {
    const keys = Object.keys(data);
    const rows = Object.keys(data[keys[0]]);

    const tableHeaderRow = `<tr>${keys.map(key => `<th>${key}</th>`).join("")}</tr>`;
    const tableBody = rows.map(row => {
        const rowData = keys.map(key => `<td>${data[key][row]}</td>`).join("");
        return `<tr>${rowData}</tr>`;
    }).join("");

    return `<table border="1"><thead>${tableHeaderRow}</thead><tbody>${tableBody}</tbody></table>`;
}

// Function to load JSON content into the value field
function loadFromJSON(button) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    // Handle file selection
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                button.previousElementSibling.value = event.target.result;
            };
            reader.readAsText(file);
        }
    });

    // Trigger the file input dialog
    fileInput.click();
}

// Function to add a new parameter line
function addParameterLine() {
    const parameterContainer = document.getElementById("parameter-container");
    const newParameterLine = document.createElement("div");
    newParameterLine.classList.add("key-value-pair");
    newParameterLine.innerHTML = `
        <input type="text" class="key" name="key" placeholder="Key">
        <input type="text" class="value" name="value" placeholder="Value">
        <button class="load-button">Load from JSON</button>
    `;
    parameterContainer.appendChild(newParameterLine);

    // Add event listener for the newly added button
    const loadButton = newParameterLine.querySelector(".load-button");
    loadButton.addEventListener("click", function () {
        loadFromJSON(loadButton);
    });
}

// Add event listeners to all buttons with the class "load-button"
const loadButtons = document.querySelectorAll(".load-button");
loadButtons.forEach(button => {
    button.addEventListener("click", function () {
        loadFromJSON(button);
    });
});

// Event listener for the "Add Parameter" button
const addParameterButton = document.querySelector(".add-parameter-button");
addParameterButton.addEventListener("click", addParameterLine);

// Event listener for the "Send Request" button
const sendRequestButton = document.querySelector(".send-request-button");
sendRequestButton.addEventListener("click", sendRequest);