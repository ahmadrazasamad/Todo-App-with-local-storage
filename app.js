const allTodosDiv = document.getElementById("all-todos"); //div
const todosList = document.getElementById("todos"); //ul
const addNewTodoDiv = document.getElementById("add-todo"); //div
const dltAllBtn = document.getElementById("dltAllBtn"); //btn

/* Reusable functions */
const hideElement = (element) => {
    element.setAttribute("style", "display: none !important");
}

const showElement = (element) => {
    element.removeAttribute("style");
}

const clearInputValues = () => {
    newTodoTitle.value = "";
    newTodoDescription.value = "";
    dueDateInput.value = "";
    if (dueDateInput.value === "") {
        hideElement(dueTimeInput);
    }
    dueTimeInput.value = "";
    newTodoList.selectedIndex = 0;
}
//

const allTodoCount = document.getElementById("all-todo-count");
const defaultTodoCount = document.getElementById("default-todo-count");
const personalTodoCount = document.getElementById("personal-todo-count");
const shoppingTodoCount = document.getElementById("shopping-todo-count");
const wishlistTodoCount = document.getElementById("wishlist-todo-count");
const workTodoCount = document.getElementById("work-todo-count");
const educationTodoCount = document.getElementById("education-todo-count");
const completedTodoCount = document.getElementById("completed-todo-count");

const getTodos = () => { // getting all todos from local storage    
    const addFirstTodoImg = document.getElementById("add-first-todo");
    const noTodoImg = document.getElementById("no-todo");

    // Modifying HTML of compkleted task counts according to task lists
    const completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
    completedTodos ? completedTodoCount.innerHTML = completedTodos.length : completedTodoCount.innerHTML = 0;

    const oldTodos = JSON.parse(localStorage.getItem("todos")); // all-todos

    const compareDueDates = (a, b) => { // function for sorting todo list according to due dates
        return new Date(a.dueDate) - new Date(b.dueDate);
    }
    todosList.innerHTML = "";
    if (oldTodos === null) {
        showElement(addFirstTodoImg);
    }
    else {
        if (oldTodos.length > 0) {
            showElement(dltAllBtn);
            hideElement(addFirstTodoImg);
            hideElement(noTodoImg);

            // Modifying HTML of Task counts according to task lists
            allTodoCount.innerHTML = oldTodos.length;
            const taskListCounts = {
                "default": defaultTodoCount,
                "Personal": personalTodoCount,
                "Shopping": shoppingTodoCount,
                "Wishlist": wishlistTodoCount,
                "Work": workTodoCount,
                "Education": educationTodoCount
            }
            for (let element in taskListCounts) {
                taskListCounts[element].innerHTML = "0";
            }
            oldTodos.forEach(thisTodo => {
                const taskList = thisTodo.taskList;
                let taskCount = Number(taskListCounts[taskList].innerHTML);
                taskListCounts[taskList].innerHTML = ++taskCount;
            });

            const groupedTodos = {};
            let currentCategory = null;
            oldTodos.sort(compareDueDates); // sort according to due dates

            /* Loop for categorising according to due dates */
            for (let i = 0; i < oldTodos.length; i++) {
                let dateInfo;
                if ((oldTodos[i].dueDate) && (new Date() > new Date(oldTodos[i].dueDate))) {
                    dateInfo = "Overdue";
                } else {
                    dateInfo = moment(oldTodos[i].dueDate).calendar(null, {
                        sameDay: '[Today]',
                        nextDay: '[Tomorrow]',
                        nextWeek: '[This Week]',
                        sameElse: function () {
                            if (this.isBefore(moment().endOf('week').add(1, 'week'))) {
                                return '[Next Week]';
                            }
                            else if (this.isBefore(moment().endOf('month'))) {
                                return '[This Month]';
                            } else if (this.isBefore(moment().endOf('month').add(1, 'month'))) {
                                return '[Next Month]';
                            } else {
                                return 'Later';
                            }
                        }
                    });
                }
                if (currentCategory !== dateInfo) {
                    currentCategory = dateInfo;
                    groupedTodos[dateInfo] = []; // here all todos will be saved of any particular state
                }
                groupedTodos[dateInfo].push(oldTodos[i]);
            }

            for (let category in groupedTodos) { // rendereing todos
                let newTodoItem;
                if (category === "Invalid date") {
                    newTodoItem = "";
                } else if (category === "Overdue") {
                    newTodoItem = `<p class="late-due"><b>${category}</b><p/>`;
                } else {
                    newTodoItem = `<p class="todo-item-head"><b>${category}</b><p/>`
                }
                groupedTodos[category].forEach(todo => {
                    newTodoItem += `<div class="todo-item d-flex">
                        <input type="checkbox" onchange="markTodoAsCompleted('${todo.id}')"/>
                        <div onclick="maintainTodo('${todo.id}')">
                            <h6 class="no-margin">${todo.title}</h6>`;
                    let dueDateTxt;
                    let dueDate = new Date(todo.dueDate);
                    if (dueDate.toDateString() !== "Thu Jan 01 1970") {
                        dueDateTxt = `${dueDate.toDateString()} ${(dueDate.toLocaleTimeString()).slice(0, 5)}${(dueDate.toLocaleTimeString()).slice(8)}`;
                    }
                    if (dueDateTxt) {
                        if (new Date() > new Date(dueDate)) {
                            newTodoItem += `<p class="no-margin late-due">${dueDateTxt}</p>`;
                        } else {
                            newTodoItem += `<p class="no-margin">${dueDateTxt}</p>`;
                        }
                    }
                    if (todo.taskList !== "default") {
                        newTodoItem += `<p class="no-margin">${todo.taskList}</p>`;
                    }
                    newTodoItem += `</div>
                    </div>`;
                });
                todosList.innerHTML += newTodoItem;

            }
        } else {
            hideElement(dltAllBtn);
            showElement(noTodoImg);
        }
    }
}

// Getting elements from HTML
const newTodoHeading = document.getElementById("new-todo-head"); //input
const newTodoTitle = document.getElementById("new-todo"); //input
const newTodoDescription = document.getElementById("todo-description");
const newTodoList = document.getElementById("task-list");
const dueDateInput = document.getElementById("due-date");
const dueTimeInput = document.getElementById("due-time");
const addTodoBtn = document.getElementById("add-todo-btn");
const saveTodoBtn = document.getElementById("save-todo");
const deleteTodoBtn = document.getElementById("delete-todo");
const taskCompletedDiv = document.getElementById("task-completed");

dueDateInput.addEventListener("change", () => {
    if (dueDateInput.value) {
        showElement(dueTimeInput); // show time input field when the the date input field has a value
    }
});

const goBack = () => { // the arrow button for going back from any state
    showElement(allTodosDiv);
    hideElement(addNewTodoDiv);
    hideElement(taskCompletedDiv);
    clearInputValues();
}

const addNewTodo = () => { // for the mini plus button so that it shows the hidden divs
    hideElement(allTodosDiv);
    showElement(addNewTodoDiv);
    showElement(addTodoBtn);
    hideElement(saveTodoBtn);
    hideElement(deleteTodoBtn);
    hideElement(taskCompletedDiv);
    clearInputValues();
    newTodoHeading.innerHTML = "New Task";
}

const addTodo = () => { // adding a todo
    const dueDate = new Date(`${dueDateInput.value} ${dueTimeInput.value}`); // the due date of that particular todo
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    if ((newTodoTitle.value).trim()) {

        // Generating a random id
        const constants = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let id = "";
        for (let i = 0; i < (constants.length / 2); i++) {
            id += constants.charAt(Math.floor(Math.random() * (constants.length)));
        }

        const newTodo = {
            id,
            title: newTodoTitle.value,
            description: newTodoDescription.value,
            dueDate,
            taskList: newTodoList.value
        }
        todos.push(newTodo);
        localStorage.setItem("todos", JSON.stringify(todos));
        getTodos();
        clearInputValues();
        hideElement(addNewTodoDiv);
        showElement(allTodosDiv);
    } else {
        newTodoTitle.className += " red-border";
        showElement(newTodoTitle.nextSibling.nextSibling);

        newTodoTitle.addEventListener("input", (e) => {
            if ((e.target.value).length > 0) {
                newTodoTitle.classList.remove("red-border");
                hideElement(newTodoTitle.nextSibling.nextSibling);
            }
        })
    }
}

const maintainTodo = (todoItemId) => {
    const allTodos = JSON.parse(localStorage.getItem("todos")); // getting all todos

    let todoItemIndex = allTodos.findIndex(todo => todo.id === todoItemId); // getting the todo/task index
    const todoToEdit = allTodos[todoItemIndex];

    hideElement(addTodoBtn);
    hideElement(allTodosDiv);
    showElement(saveTodoBtn);
    showElement(deleteTodoBtn);
    showElement(addNewTodoDiv);
    showElement(taskCompletedDiv);
    newTodoHeading.innerHTML = "Edit Task";
    
    const taskCompletedInput = taskCompletedDiv.childNodes[1]; // input checkbox

    // Setting the values of the todo in the input fields
    newTodoTitle.value = todoToEdit.title;
    newTodoDescription.value = todoToEdit.description;
    if (todoToEdit.dueDate) {
        dueDateInput.value = (todoToEdit.dueDate).slice(0, 10);
        if (dueDateInput.value) {
            showElement(dueTimeInput);
        }
        let todoDueDate = new Date(todoToEdit.dueDate);
        let dueTimeEdit;
        if (todoDueDate.getHours() < 10) {
            dueTimeEdit = `0${todoDueDate.getHours()}:`;
        } else {
            dueTimeEdit = `${todoDueDate.getHours()}:`;
        }
        if (todoDueDate.getMinutes() < 10) {
            dueTimeEdit += `0${todoDueDate.getMinutes()}`;
        } else {
            dueTimeEdit += `${todoDueDate.getMinutes()}`;
        }
        dueTimeInput.value = dueTimeEdit;
    }
    newTodoList.value = todoToEdit.taskList;

    saveTodoBtn.addEventListener("click", () => { // Edit Todo
        if (taskCompletedInput.checked) {
            markTodoAsCompleted(todoItemId);
        } else {
            const dueDate = new Date(`${dueDateInput.value} ${dueTimeInput.value}`);
            const editedTodo = {
                id: todoItemId,
                title: newTodoTitle.value,
                description: newTodoDescription.value,
                dueDate,
                taskList: newTodoList.value
            };
            allTodos.splice(todoItemIndex, 1, editedTodo);
            localStorage.setItem("todos", JSON.stringify(allTodos));
            getTodos();
        }
        clearInputValues();
        showElement(allTodosDiv);
        hideElement(addNewTodoDiv);
    });

    deleteTodoBtn.addEventListener("click", () => { // Delete todo
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete this task!'
        }).then((result) => {
            if (result.isConfirmed) {
                allTodos.splice(todoItemIndex, 1)
                localStorage.setItem("todos", JSON.stringify(allTodos));
                clearInputValues();
                showElement(allTodosDiv);
                hideElement(addNewTodoDiv);
                getTodos();
            }
        })
    })
}

// delete all todos
const deleteAll = () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete all!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem("todos", JSON.stringify([]));
            getTodos();
        }
    })
}

const markTodoAsCompleted = (todoItemId) => {
    // Getting all and completed tods from local storage
    const allTodos = JSON.parse(localStorage.getItem("todos"));
    const completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];

    const todoItemIndex = allTodos.findIndex(todo => todo.id === todoItemId);
    const todoAsCompleted = allTodos[todoItemIndex]; // completed todo

    // Add in the completed todo array
    completedTodos.push(todoAsCompleted);
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));

    // Remove from the all todos array
    allTodos.splice(todoItemIndex, 1);
    localStorage.setItem("todos", JSON.stringify(allTodos));

    getTodos();
}