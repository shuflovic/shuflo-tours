document.addEventListener("DOMContentLoaded", function () {
    const todoInput = document.getElementById("TDL");
    const addButton = document.getElementById("add-new-task");
    const todoTable = document.getElementById("guestDataTableBody1");
    
    // Initialize Supabase client - Assume this is already set up elsewhere in your code
    // const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');
    
    // Load tasks from Supabase
    async function loadTasks() {
        try {
            const { data, error } = await supabaseClient
                .from('to_do_list')
                .select('*')
                .order('checked', {ascending: true});
                
            if (error) throw error;
            
            // Clear existing table rows
            todoTable.innerHTML = '';
            
            // Add each task to the table
            data.forEach(task => {
                addTaskToTable(task.id, task.task, task.checked || false, task.note || "");
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }
    
    // Save a new task to Supabase
    async function saveNewTask(taskText, isChecked = false, noteText = "") {
        try {
            const { data, error } = await supabaseClient
                .from('to_do_list')
                .insert([{ 
                    task: taskText, 
                    checked: isChecked, 
                    note: noteText 
                }])
                .select(); // Return the inserted row with its ID
                
            if (error) throw error;
            
            // Add the new task to UI with its database ID
            if (data && data.length > 0) {
                addTaskToTable(data[0].id, taskText, isChecked, noteText);
            }
        } catch (error) {
            console.error('Error saving new task:', error);
        }
    }
    
    // Update a task in Supabase
    async function updateTask(taskId, isChecked, noteText) {
        try {
            const { error } = await supabaseClient
                .from('to_do_list')
                .update({ 
                    checked: isChecked, 
                    note: noteText 
                })
                .eq('id', taskId);
                
            if (error) throw error;
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }
    
    // Delete a task from Supabase
    async function deleteTask(taskId) {
        try {
            const { error } = await supabaseClient
                .from('to_do_list')
                .delete()
                .eq('id', taskId);
                
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
    
    // Function to add task to table
    function addTaskToTable(taskId, taskText, isChecked = false, noteText = "") {
        const newRow = document.createElement("tr");
        newRow.dataset.taskId = taskId; // Store the task ID in the row
        
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
        checkbox.addEventListener("change", function() {
            // Update task in database when checkbox changes
            updateTask(
                taskId, 
                checkbox.checked, 
                newRow.querySelector(".task-note").value
            );
        });
        checkboxCell.appendChild(checkbox);
        newRow.appendChild(checkboxCell);
        
        // Note Column
const noteCell = document.createElement("td");
const noteInput = document.createElement("input");
noteInput.type = "text";
noteInput.placeholder = "Write a note";
noteInput.value = noteText;
noteInput.classList.add("task-note");

// Use 'input' to save changes in real-time
noteInput.addEventListener("input", function() {
    console.log('Note updated:', noteInput.value); // Debug log
    updateTask(
        taskId,
        newRow.querySelector(".task-checkbox").checked,
        noteInput.value
    );
});
noteCell.appendChild(noteInput);
newRow.appendChild(noteCell);
        
        // Remove Button Column
        const removeCell = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-task");
        removeButton.addEventListener("click", function () {
            // Delete from database first, then remove from UI
            deleteTask(taskId).then(() => {
                newRow.remove();
            });
        });
        removeCell.appendChild(removeButton);
        newRow.appendChild(removeCell);
        
        // Append row to table
        todoTable.appendChild(newRow);
    }
    
    // Function to add a new task
function addNewTask() {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    // Save new task to database and then to UI
    saveNewTask(taskText);
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
document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
});
});
