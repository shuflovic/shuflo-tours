document.addEventListener("DOMContentLoaded", function () {
    const todoInput = document.getElementById("TDL");
    const addButton = document.getElementById("TDLButton");
    const todoTable = document.getElementById("guestDataTableBody1");
    
    // Initialize Supabase client - Assume this is already set up elsewhere in your code
    // const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');
    
    // Load tasks from Supabase
    async function loadTasks() {
        try {
            const { data, error } = await supabaseClient
                .from('to_to_list')
                .select('*');
                
            if (error) throw error;
            
            // Clear existing table rows
            todoTable.innerHTML = '';
            
            // Add each task to the table
            data.forEach(task => {
                addTaskToTable(task.task, task.checked || false, task.note || "");
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }
    
    // Save tasks to Supabase
    async function saveTasks() {
        try {
            // First, clear the table
            const { error: deleteError } = await supabaseClient
                .from('to_to_list')
                .delete()
                .neq('id', 0); // Delete all records
                
            if (deleteError) throw deleteError;
            
            // Get all tasks from the table
            const tasks = [];
            document.querySelectorAll("#guestDataTableBody1 tr").forEach(row => {
                tasks.push({
                    task: row.querySelector(".task-text").textContent,
                    checked: row.querySelector(".task-checkbox").checked,
                    note: row.querySelector(".task-note").value
                });
            });
            
            // Insert all tasks
            if (tasks.length > 0) {
                const { error: insertError } = await supabaseClient
                    .from('to_to_list')
                    .insert(tasks);
                    
                if (insertError) throw insertError;
            }
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
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
    
    // Function to add a new task (reused for both button click and Enter key)
    function addNewTask() {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;
        addTaskToTable(taskText);
        todoInput.value = ""; // Clear input field
    }
    
    // Add new task on button click
    addButton.addEventListener("click", addNewTask);
    
    // Add new task when Enter key is pressed in the input field
    todoInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission if within a form
            addNewTask();
        }
    });
    
    // Load tasks on page load
    loadTasks();
});
