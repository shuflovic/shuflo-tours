document.addEventListener("DOMContentLoaded", function () {
    const todoInput = document.getElementById("TDL");
    const addButton = document.getElementById("TDLButton");
    const todoTable = document.getElementById("guestDataTableBody1");

    // Load tasks from localStorage
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
        tasks.forEach(task => addTaskToTable(task.text, task.checked, task.note));
    }

    // Save tasks to localStorage
    function saveTasks() {
        let tasks = [];
        document.querySelectorAll("#guestDataTableBody1 tr").forEach(row => {
            tasks.push({
                text: row.querySelector(".task-text").textContent,
                checked: row.querySelector(".task-checkbox").checked,
                note: row.querySelector(".task-note").value
            });
        });
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }

    // Function to add task to table
    function addTaskToTable(taskText, isChecked = false, noteText = "") {
        const newRow = document.createElement("tr");

        // Task Column
        const taskCell = document.createElement("td");
        taskCell.textContent = taskText;
        taskCell.classList.add("task-text");
        newRow.appendChild(taskCell);

        // Checkbox Column
        const checkboxCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isChecked;
        checkbox.classList.add("task-checkbox");
        checkbox.addEventListener("change", saveTasks); // Save state when changed
        checkboxCell.appendChild(checkbox);
        newRow.appendChild(checkboxCell);

        // Note Column
        const noteCell = document.createElement("td");
        const noteInput = document.createElement("input");
        noteInput.type = "text";
        noteInput.placeholder = "Write a note";
        noteInput.value = noteText;
        noteInput.classList.add("task-note");
        noteInput.addEventListener("input", saveTasks); // Save when text changes
        noteCell.appendChild(noteInput);
        newRow.appendChild(noteCell);

        // Remove Button Column
        const removeCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-task");
        removeButton.addEventListener("click", function () {
            newRow.remove();
            saveTasks(); // Save after removing
        });
        removeCell.appendChild(removeButton);
        newRow.appendChild(removeCell);

        // Append row to table
        todoTable.appendChild(newRow);

        saveTasks(); // Save after adding new task
    }

    // Add new task on button click
    addButton.addEventListener("click", function () {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;

        addTaskToTable(taskText);
        todoInput.value = ""; // Clear input field
    });

    // Load tasks on page load
    loadTasks();
});
