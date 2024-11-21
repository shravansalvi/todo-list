document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById('date-picker');
    const taskList = document.getElementById('task-list');
    const completedList = document.getElementById('completed-list');
    const taskForm = document.getElementById('new-task-form');
    const taskFormContainer = document.getElementById('task-form-container');
    const addTaskButton = document.getElementById('add-task-btn');
    const selectedDate = document.getElementById('selected-date');

    let userId = getLoggedInUserId(); // Function to retrieve the logged-in user ID
    if (!userId) {
        alert("Please log in to manage tasks.");
        return;
    }

    let selectedDateValue = new Date().toISOString().split('T')[0]; // Default to today's date
    dateInput.value = selectedDateValue;

    function getTaskKey(date) {
        return '${userId}-${date}'; // Use userId and date to create a unique key for tasks
    }

    // Function to load tasks from Firebase Firestore
    function loadTasks(date) {
        selectedDate.textContent = date;
        taskList.innerHTML = '';
        completedList.innerHTML = '';

        const taskRef = db.collection('tasks').doc(userId).collection('dates').doc(date);

        taskRef.get().then((doc) => {
            if (doc.exists) {
                const tasks = doc.data() || { tasks: [], completed: [] };

                // Populate task list
                tasks.tasks.forEach((task, index) => {
                    const li = createTaskElement(task, index, false);
                    taskList.appendChild(li);
                });

                // Populate completed task list
                tasks.completed.forEach((task, index) => {
                    const li = createTaskElement(task, index, true);
                    completedList.appendChild(li);
                });
            }
        }).catch((error) => {
            console.error("Error loading tasks:", error);
        });
    }

    function createTaskElement(task, index, isCompleted) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${task} 
            <button class="delete-btn">Delete</button>
        `;
        li.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTask(index, isCompleted);
        });

        if (!isCompleted) {
            li.addEventListener('click', () => {
                completeTask(index);
            });
        }

        return li;
    }

    function completeTask(index) {
        const taskRef = db.collection('tasks').doc(userId).collection('dates').doc(selectedDateValue);
        
        taskRef.get().then((doc) => {
            const tasks = doc.exists ? doc.data() : { tasks: [], completed: [] };

            const completedTask = tasks.tasks.splice(index, 1)[0];
            tasks.completed.push(completedTask);

            taskRef.set(tasks).then(() => {
                loadTasks(selectedDateValue);
            }).catch((error) => {
                console.error("Error updating task:", error);
            });
        });
    }

    function deleteTask(index, isCompleted) {
        const taskRef = db.collection('tasks').doc(userId).collection('dates').doc(selectedDateValue);

        taskRef.get().then((doc) => {
            const tasks = doc.exists ? doc.data() : { tasks: [], completed: [] };

            if (isCompleted) {
                tasks.completed.splice(index, 1);
            } else {
                tasks.tasks.splice(index, 1);
            }

            taskRef.set(tasks).then(() => {
                loadTasks(selectedDateValue);
            }).catch((error) => {
                console.error("Error deleting task:", error);
            });
        });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskTitle = document.getElementById('task-title').value;
        if (taskTitle === '') return;

        const taskRef = db.collection('tasks').doc(userId).collection('dates').doc(selectedDateValue);

        taskRef.get().then((doc) => {
            const tasks = doc.exists ? doc.data() : { tasks: [], completed: [] };
            tasks.tasks.push(taskTitle);

            taskRef.set(tasks).then(() => {
                document.getElementById('task-title').value = '';
                taskFormContainer.style.display = 'none';
                loadTasks(selectedDateValue);
            }).catch((error) => {
                console.error("Error adding task:", error);
            });
        });
    });

    dateInput.addEventListener('change', (e) => {
        selectedDateValue = e.target.value;
        loadTasks(selectedDateValue);
    });

    addTaskButton.addEventListener('click', () => {
        taskFormContainer.style.display = 'block';
    });

    // Load tasks for the current date on page load
    loadTasks(selectedDateValue);
});

// Function to get the logged-in user ID (Replace with actual login logic)
function getLoggedInUserId() {
    // For demonstration, we'll assume userId is stored in Firebase Authentication
    const user = auth.currentUser;
    return user ? user.uid : null;
}

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader--hidden");

    loader.addEventListener("transitionend", () => {
        document.body.removeChild(loader);
    });
});