const allTodosDiv = document.getElementById("all-todos"); // div (containing elements like add/delete/images)
const todosList = document.getElementById("todos"); // div (All todos will render under this div)
const addFirstTodoImg = document.getElementById("add-first-todo"); // image
const noTodoImg = document.getElementById("no-todo"); // image
const addNewTodoDiv = document.getElementById("add-todo"); // div(when plus icon is clicked it's diplay changes from none to block)
const dltAllBtn = document.getElementById("dltAllBtn"); // btn

// Getting elements from HTML for adding a todo
const newTodoHeading = document.getElementById("new-todo-head"); // h3
const newTodoTitle = document.getElementById("new-todo"); // input
const newTodoDescription = document.getElementById("todo-description"); // input
const newTodoList = document.getElementById("task-list"); // dropdwn
const dueDateInput = document.getElementById("due-date"); // date-input
const dueTimeInput = document.getElementById("due-time"); // time-input

// Getting elements from HTML for adding / saving / Completing / deleting a todo
const addTodoBtn = document.getElementById("add-todo-btn"); // btn
const saveTodoBtn = document.getElementById("save-todo"); // btn
const deleteTodoBtn = document.getElementById("delete-todo"); // btn
const taskCompletedDiv = document.getElementById("task-completed"); // div (which contains the task finished checkbox)

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
        dueTimeInput.value = "";
        hideElement(dueTimeInput);
    }
    newTodoList.selectedIndex = 0;
}

// Offcanvas / Drawer elements
const allTodoCount = document.getElementById("all-todo-count");
const defaultTodoCount = document.getElementById("default-todo-count");
const personalTodoCount = document.getElementById("personal-todo-count");
const shoppingTodoCount = document.getElementById("shopping-todo-count");
const wishlistTodoCount = document.getElementById("wishlist-todo-count");
const workTodoCount = document.getElementById("work-todo-count");
const educationTodoCount = document.getElementById("education-todo-count");
const completedTodoCount = document.getElementById("completed-todo-count");

const getTodos = (taskCategory) => { // getting all todos from local storage
    const allTodos = JSON.parse(localStorage.getItem("todos")); // getting all-todos from localStorage

    let oldTodos = allTodos ? allTodos.filter(todo => !todo.isCompleted) : []; // filtering out the non-completed one
    let completedTodos = allTodos ? allTodos.filter(todo => todo.isCompleted) : []; // filtering out the completed one

    const compareDueDates = (a, b) => { // function for sorting todo list according to due dates
        return new Date(a.dueDate) - new Date(b.dueDate);
    }

    // Modifying HTML of Task counts according to task lists(Drawer/offcanvas)
    allTodoCount.innerHTML = oldTodos.length; // for all todos
    const taskListCounts = { // for other categories
        "Default": defaultTodoCount,
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
    completedTodos ? completedTodoCount.innerHTML = completedTodos.length : completedTodoCount.innerHTML = 0; // for completed todos

    todosList.innerHTML = ""; // emptying out the innerHTML so that it does not concatenate again as += is used further

    if (allTodos === null) {
        showElement(addFirstTodoImg);

        if (taskCategory !== "all") {
            todosList.innerHTML = `<h2 class="tasklist-heading">${taskCategory}</h2>
            <p class="task-empty">List <span>${taskCategory}</span> is empty</p>`;

            hideElement(addFirstTodoImg);
        }
    } else if (oldTodos.length > 0 || completedTodos.length > 0) {
        hideElement(addFirstTodoImg);
        hideElement(noTodoImg);
        showElement(dltAllBtn);

        // filtration of todos according to tasklist
        if (taskCategory !== "all" && taskCategory !== "Completed") {
            oldTodos = oldTodos.filter(todo => todo.taskList === taskCategory);
            todosList.innerHTML = `<h2 class="tasklist-heading">${taskCategory}</h2>`;
        } else if (taskCategory === "Completed") {
            oldTodos = completedTodos; // saving the completed todos in the oldTodos for the render process as in render process we have looped over oldTodos only
            todosList.innerHTML = `<h2 class="tasklist-heading">${taskCategory}</h2>`;
        }

        // Giving details if the task category is empty or not
        if (oldTodos.length < 1 && taskCategory !== "all") {
            todosList.innerHTML += `<p class="task-empty">List <span>${taskCategory}</span> is empty</p>`;
        } else if (oldTodos.length < 1 && taskCategory === "all") {
            showElement(noTodoImg);
            hideElement(dltAllBtn);
        }

        // Variables for categorising
        const groupedTodos = {};
        let currentCategory = null;

        // Sorting according to due dates
        oldTodos.sort(compareDueDates);
        completedTodos && completedTodos.sort(compareDueDates);

        /* Loop for categorising according to due dates */
        if (taskCategory !== "Completed") {
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
        } else {
            !groupedTodos["Completed"] ? groupedTodos["Completed"] = [] : null;
            groupedTodos["Completed"].push(...completedTodos); // here all todos will be saved of the completed state
        }

        for (let category in groupedTodos) { // rendereing todos
            let newTodoItem;
            if (category === "Invalid date" || category === "Completed") {
                newTodoItem = "";
            } else if (category === "Overdue") {
                newTodoItem = `<p class="late-due"><b>${category}</b><p/>`;
            } else {
                newTodoItem = `<p class="todo-item-head"><b>${category}</b><p/>`
            }
            groupedTodos[category].forEach(todo => {
                newTodoItem += `<div class="todo-item d-flex">
                    <input type="checkbox" onchange="markTodoAsCompleted('${todo.id}')" ${category === "Completed" ? "checked" : ""}/>
                    <div onclick="maintainTodo('${todo.id}')">
                        <h6 class="no-margin">${todo.title}</h6>`;
                let dueDateTxt;
                let dueDate = new Date(todo.dueDate);
                if (dueDate.toDateString() !== "Thu Jan 01 1970") {
                    dueDateTxt = `${dueDate.toDateString()} ${(dueDate.toLocaleTimeString()).slice(0, 5)}${(dueDate.toLocaleTimeString()).slice(8)}`;
                }
                if (dueDateTxt) {
                    if (new Date() > new Date(dueDate)) {
                        newTodoItem += `<p class="no-margin ${category !== "Completed" ? "late-due" : ""}">${dueDateTxt}</p>`;
                    } else {
                        newTodoItem += `<p class="no-margin">${dueDateTxt}</p>`;
                    }
                }
                if (todo.taskList !== "Default") {
                    newTodoItem += `<p class="no-margin">${todo.taskList}</p>`;
                }
                newTodoItem += `</div>
                </div>`;
            });
            todosList.innerHTML += newTodoItem;
        }
    } else {
        showElement(noTodoImg);
        hideElement(dltAllBtn);

        if (taskCategory !== "all") {
            todosList.innerHTML = `<h2 class="tasklist-heading">${taskCategory}</h2>
            <p class="task-empty">List <span>${taskCategory}</span> is empty</p>`;

            hideElement(noTodoImg);
            hideElement(dltAllBtn);
        }
    }
}

dueDateInput.addEventListener("change", () => {
    if (dueDateInput.value) {
        showElement(dueTimeInput); // show time input field when the the date input field has a value
    }
});

const goBack = () => { // the arrow button for going back from any state
    showElement(allTodosDiv);
    hideElement(addNewTodoDiv);
    clearInputValues();
}

const addNewTodo = () => { // for the mini plus button so that it shows the hidden div's
    showElement(addNewTodoDiv);
    showElement(addTodoBtn);
    hideElement(allTodosDiv);
    hideElement(taskCompletedDiv);
    hideElement(saveTodoBtn);
    hideElement(deleteTodoBtn);
    newTodoHeading.innerHTML = "New Task";
    clearInputValues();
}

const addTodo = () => { // adding a todo
    let todos = JSON.parse(localStorage.getItem("todos")) || []; // getting existing todos from localStorage or declaring an array for todos
    if ((newTodoTitle.value).trim()) {
        const newTodo = {
            id: crypto.randomUUID(),
            title: newTodoTitle.value,
            description: newTodoDescription.value,
            dueDate: new Date(`${dueDateInput.value} ${dueTimeInput.value}`),
            taskList: newTodoList.value,
            isCompleted: false
        }
        todos.push(newTodo);
        localStorage.setItem("todos", JSON.stringify(todos)); // setting todos again
        clearInputValues();
        getTodos("all");
        hideElement(addNewTodoDiv);
        showElement(allTodosDiv);
    } else {
        newTodoTitle.className += " red-border"; // Adding a red border showing error
        showElement(newTodoTitle.nextSibling.nextSibling);
    }
}

newTodoTitle && newTodoTitle.addEventListener("input", (e) => { // Removing red border showing error
    if ((e.target.value).length > 0) {
        newTodoTitle.classList.remove("red-border");
        hideElement(newTodoTitle.nextSibling.nextSibling);
    }
});

const maintainTodo = (todoItemId) => {
    const allTodos = JSON.parse(localStorage.getItem("todos")); // getting all todos

    let todoItemIndex = allTodos.findIndex(todo => todo.id === todoItemId);
    const todoToEdit = allTodos[todoItemIndex]; // todo to be edited

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
    todoToEdit.isCompleted ? (taskCompletedInput.checked = true) : null; // checking the task finished checkbox  
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

    let eventHandeled = false;

    // save todo / edit todo
    saveTodoBtn.addEventListener("click", () => { // Edit Todo
        if (!eventHandeled) { // to prevent the event listener to listen two times
            const dueDate = new Date(`${dueDateInput.value} ${dueTimeInput.value}`);
            const editedTodo = {
                id: todoItemId,
                title: newTodoTitle.value,
                description: newTodoDescription.value,
                dueDate: isNaN(dueDate.getTime()) ? null : dueDate,
                taskList: newTodoList.value,
                isCompleted: todoToEdit.isCompleted
            };
            let objChecker = () => {
                for (const key in editedTodo) {
                    if (editedTodo[key] !== todoToEdit[key]) {
                        return false;
                    }
                }
                return true;
            };
            objChecker = objChecker();

            if (!objChecker) {
                allTodos.splice(todoItemIndex, 1, editedTodo);
                localStorage.setItem("todos", JSON.stringify(allTodos));
            }
            if (!todoToEdit.isCompleted && taskCompletedInput.checked) {
                markTodoAsCompleted(todoItemId);
            }
            showElement(allTodosDiv);
            hideElement(addNewTodoDiv);
            getTodos("all");
            clearInputValues();
            eventHandeled = true;
        }
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
                getTodos("all");
            }
        })
    });
}

const deleteAll = () => { // delete all todos
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
            getTodos("all");
        }
    });
}

const markTodoAsCompleted = (todoItemId) => {
    const allTodos = JSON.parse(localStorage.getItem("todos")); // Getting all todos from localStorage

    const todoItemIndex = allTodos.findIndex(todo => todo.id === todoItemId);
    const todoAsCompleted = allTodos[todoItemIndex]; // todo to be completed

    todoAsCompleted.isCompleted = !todoAsCompleted.isCompleted;

    allTodos.splice(todoItemIndex, 1, todoAsCompleted); // replacing the todo with .isCompleted new assigned value 
    localStorage.setItem("todos", JSON.stringify(allTodos));

    getTodos("all");
}