const inputArea = document.querySelector(".large-area--input");
const outputArea = document.querySelector(".large-area--output");
const btnFormat = document.querySelector(".controls__button--format");
const btnTree = document.querySelector(".controls__button--Tree");
const treeContainer = document.querySelector(".json-tree-container");

// Format JSON
btnFormat.addEventListener("click", () => {
    try {
        const formatted = JSON.stringify(JSON.parse(inputArea.value), null, 4);
        outputArea.value = formatted;
        outputArea.style.display = "block"; // Show output area
        treeContainer.style.display = "none"; // Hide tree view
    } catch (error) {
        outputArea.value = "Invalid JSON!";
    }
});

// Display JSON as a tree
btnTree.addEventListener("click", () => {
    try {
        const json = JSON.parse(inputArea.value);
        outputArea.style.display = "none"; // Hide textarea output
        treeContainer.style.display = "block"; // Show tree container
        treeContainer.innerHTML = ""; // Clear previous content
        treeContainer.appendChild(createTree(json));
    } catch (error) {
        treeContainer.innerHTML = "<span style='color: red;'>Invalid JSON!</span>";
    }
});

// Function to create the JSON tree structure
function createTree(json, isChild = false) {
    const container = document.createElement("div");

    for (let key in json) {
        const value = json[key];
        const node = document.createElement("div");

        if (typeof value === "object" && value !== null) {
            // Create expand/collapse toggle button
            const toggle = document.createElement("span");
            toggle.textContent = "▶ ";
            toggle.classList.add("json-toggle");

            const keySpan = document.createElement("span");
            keySpan.classList.add("json-key");
            keySpan.textContent = `"${key}"`;

            node.appendChild(toggle);
            node.appendChild(keySpan);
            node.appendChild(document.createTextNode(": {"));

            const childContainer = createTree(value, true);
            childContainer.style.display = "none"; // Initially hidden

            node.appendChild(childContainer);
            node.appendChild(document.createTextNode("}"));

            // Add event listener for toggle functionality
            toggle.addEventListener("click", () => {
                if (childContainer.style.display === "none") {
                    childContainer.style.display = "block";
                    toggle.textContent = "▼ "; // Change icon to indicate expanded state
                } else {
                    childContainer.style.display = "none";
                    toggle.textContent = "▶ "; // Change back to collapsed icon
                }
            });
        } else {
            let valueType = typeof value === "string" ? "json-string" :
                            typeof value === "number" ? "json-number" :
                            typeof value === "boolean" ? "json-boolean" :
                            value === null ? "json-null" : "";

            node.innerHTML = `<span class="json-key">"${key}"</span>: <span class="${valueType}">${JSON.stringify(value)}</span>`;
        }

        container.appendChild(node);
    }

    if (isChild) {
        container.style.paddingLeft = "20px";
    }

    return container;
}
